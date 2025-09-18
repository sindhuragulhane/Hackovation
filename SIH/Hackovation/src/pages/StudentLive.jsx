import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";

const SIGNALING_URL = "http://localhost:3000";
const ROOM_ID = "classroom1";

export default function StudentLive() {
  const socketRef = useRef(null);
  const pcRef = useRef(null); // single pc per student (teacher may create multiple)
  const audioRef = useRef(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    socketRef.current = io(SIGNALING_URL);

    socketRef.current.on("connect", () => {
      console.log("✅ Student connected to signaling server:", socketRef.current.id);
      socketRef.current.emit("role", "student");
      // join the classroom so teacher can see you
      socketRef.current.emit("join-room", ROOM_ID);
      setConnected(true);
    });

    // receive generic signals (offer from teacher, ice candidates)
    socketRef.current.on("signal", async ({ from, data }) => {
      if (!data) return;

      // If teacher sent an offer
      if (data.type === "offer") {
        console.log("Received offer from", from);
        // create local RTCPeerConnection
        pcRef.current = new RTCPeerConnection({
          iceServers: [
            { urls: "stun:stun.l.google.com:19302" },
            // add TURN if available
          ]
        });

        // When we get remote audio track, attach to audio element
        pcRef.current.ontrack = (evt) => {
          console.log("ontrack", evt.streams);
          if (audioRef.current) {
            audioRef.current.srcObject = evt.streams[0];
            audioRef.current.play().catch(()=>{});
          }
        };

        // send ICE candidates to teacher
        pcRef.current.onicecandidate = (e) => {
          if (e.candidate) {
            socketRef.current.emit("signal", { to: from, data: { type: "ice-candidate", candidate: e.candidate }});
          }
        };

        // set teacher's offer as remote description
        await pcRef.current.setRemoteDescription({ type: "offer", sdp: data.sdp });

        // create answer
        const answer = await pcRef.current.createAnswer();
        await pcRef.current.setLocalDescription(answer);

        // send answer back to teacher
        socketRef.current.emit("signal", { to: from, data: { type: "answer", sdp: answer.sdp }});
        console.log("Sent answer back to teacher", from);

      } else if (data.type === "ice-candidate") {
        // incoming ICE candidate (from teacher or other)
        try {
          if (pcRef.current) {
            await pcRef.current.addIceCandidate(data.candidate);
          } else {
            console.warn("No pc yet for incoming candidate");
          }
        } catch (e) {
          console.warn("addIceCandidate error (student)", e);
        }
      }
    });

    return () => {
      if (pcRef.current) pcRef.current.close();
      if (socketRef.current) socketRef.current.disconnect();
    };
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold">Student — Live Audio</h2>
      <p>Connection status: {connected ? "connected" : "disconnected"}</p>

      <div className="mt-4">
        <audio ref={audioRef} controls autoPlay style={{ width: "100%" }} />
      </div>
      <p className="mt-4 text-sm text-gray-600">When teacher starts the lecture, you will hear live audio here.</p>
    </div>
  );
}
