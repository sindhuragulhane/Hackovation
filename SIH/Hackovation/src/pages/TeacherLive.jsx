import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";

const SIGNALING_URL = "http://localhost:3000";
const ROOM_ID = "classroom1"; // keep same on both sides

// helper to set opus bitrate (bits per second)
async function setOpusBitrate(pc, bitrate = 24000) {
  const sender = pc.getSenders().find(s => s.track?.kind === "audio");
  if (!sender) return;
  const params = sender.getParameters();
  params.encodings = params.encodings || [{}];
  params.encodings[0].maxBitrate = bitrate;
  try { await sender.setParameters(params); } catch (e) { console.warn("setParameters failed", e); }
}

export default function TeacherLive() {
  const socketRef = useRef(null);
  const localStreamRef = useRef(null);
  // peers: { [socketId]: RTCPeerConnection }
  const peersRef = useRef({});
  const [isStreaming, setIsStreaming] = useState(false);

  useEffect(() => {
    socketRef.current = io(SIGNALING_URL);

    // Listen for new peer notifications from server
    socketRef.current.on("peer-joined", ({ id }) => {
      console.log("peer-joined:", id);
      // create offer to new peer
      createOfferForPeer(id);
    });

    // Generic signal receiver (answers or ICE candidates from students)
    socketRef.current.on("signal", async ({ from, data }) => {
      if (!from || !data) return;
      const pc = peersRef.current[from];
      if (!pc) {
        console.warn("No pc for incoming signal from", from);
        return;
      }

      if (data.type === "answer") {
        // Student answered our offer
        await pc.setRemoteDescription({ type: "answer", sdp: data.sdp });
        console.log("Set remote answer for", from);
      } else if (data.type === "ice-candidate") {
        try {
          await pc.addIceCandidate(data.candidate);
        } catch (e) {
          console.warn("addIceCandidate error (teacher)", e);
        }
      }
    });

    return () => {
      socketRef.current.disconnect();
      // stop local tracks
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach(t => t.stop());
      }
      // close peer connections
      Object.values(peersRef.current).forEach(pc => pc.close());
    };
  }, []);

  // create RTCPeerConnection, add local audio, wire ICE to signaling
  function createPeerConnection(peerId) {
    const pc = new RTCPeerConnection({
      iceServers: [
        { urls: "stun:stun.l.google.com:19302" },
        // add TURN here if available: { urls: 'turn:TURN_IP:3478', username: 'user', credential: 'pass' }
      ]
    });

    // forward ICE candidates to the specific peer
    pc.onicecandidate = (event) => {
      if (event.candidate) {
        socketRef.current.emit("signal", { to: peerId, data: { type: "ice-candidate", candidate: event.candidate } });
      }
    };

    pc.onconnectionstatechange = () => {
      console.log("pc connectionState", peerId, pc.connectionState);
      if (pc.connectionState === "failed" || pc.connectionState === "closed") {
        pc.close();
        delete peersRef.current[peerId];
      }
    };

    // add local tracks (audio)
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach(track => pc.addTrack(track, localStreamRef.current));
    }

    peersRef.current[peerId] = pc;
    return pc;
  }

  // create offer for a specific peer and send via signaling
  async function createOfferForPeer(peerId) {
    if (!localStreamRef.current) {
      console.warn("Start streaming first");
      return;
    }
    const pc = createPeerConnection(peerId);
    const offer = await pc.createOffer();
    await pc.setLocalDescription(offer);

    // set Opus bitrate target after local description
    await setOpusBitrate(pc, 24000);

    socketRef.current.emit("signal", { to: peerId, data: { type: "offer", sdp: offer.sdp } });
    console.log("Sent offer to", peerId);
  }

  // start capturing mic and join the room so server can inform teacher of peers
  async function startLecture() {
    try {
      localStreamRef.current = await navigator.mediaDevices.getUserMedia({ audio: true });
      // optional: show local audio meter or playback (muted) if needed
      setIsStreaming(true);

      // tell server we are in the room (ensures peer-joined events will be sent)
      socketRef.current.emit("join-room", ROOM_ID);

      // also notify server we are ready (if your server listens for role)
      socketRef.current.emit("role", "teacher");

      console.log("Local audio ready, waiting for students...");
    } catch (e) {
      console.error("getUserMedia error", e);
      alert("Microphone access is required.");
    }
  }

  // stop lecture & close connections
  function stopLecture() {
    setIsStreaming(false);
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach(t => t.stop());
      localStreamRef.current = null;
    }
    // close all pcs
    Object.keys(peersRef.current).forEach(id => {
      try { peersRef.current[id].close(); } catch (e) {}
      delete peersRef.current[id];
    });
    socketRef.current.emit("role", "teacher-disconnect");
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold">Teacher — Live Audio</h2>

      <div className="mt-4">
        <button disabled={isStreaming} onClick={startLecture} className="mr-2 px-4 py-2 bg-green-600 text-white rounded">
          Start Lecture (Share Mic)
        </button>
        <button disabled={!isStreaming} onClick={stopLecture} className="px-4 py-2 bg-red-600 text-white rounded">
          Stop Lecture
        </button>
      </div>

      <div className="mt-6">
        <p>Students connected: {Object.keys(peersRef.current).length}</p>
        <ul>
          {Object.keys(peersRef.current).map(id => <li key={id}>{id}</li>)}
        </ul>
      </div>
    </div>
  );
}
