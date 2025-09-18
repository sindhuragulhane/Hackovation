import { useEffect, useState } from "react";
import { io } from "socket.io-client";

const SIGNALING_URL = "http://localhost:3000";
const pc = new RTCPeerConnection();

// Play teacher's audio
pc.ontrack = (event) => {
  const audio = document.createElement("audio");
  audio.srcObject = event.streams[0];
  audio.autoplay = true;
  document.body.appendChild(audio);
};

export default function Student() {
  const [socket, setSocket] = useState(null);
  const [joined, setJoined] = useState(false);
  const [roomId, setRoomId] = useState("");
  const [lectureStarted, setLectureStarted] = useState(false);

  useEffect(() => {
    const s = io(SIGNALING_URL);

    s.on("connect", () => {
      console.log("✅ Student connected to signaling server:", s.id);
      s.emit("role", "student");
      setSocket(s);
    });

    // When teacher starts a lecture
    s.on("lecture-started", ({ roomId }) => {
      console.log(`🎤 Teacher started lecture in room: ${roomId}`);
      setRoomId(roomId);
      setLectureStarted(true);
    });

    return () => s.disconnect();
  }, []);

  useEffect(() => {
  if (!socket) return; // wait until socket is ready

  console.log("✅ Student signaling ready, socket ID:", socket.id);

  socket.on("offer", async ({ offer, from }) => {
    console.log("📡 Received offer from teacher:", from);
    await pc.setRemoteDescription(new RTCSessionDescription(offer));

    const answer = await pc.createAnswer();
    await pc.setLocalDescription(answer);

    socket.emit("answer", { answer, to: from });
    console.log("📡 Sent answer back to teacher");
  });

  socket.on("ice-candidate", async ({ candidate, from }) => {
    console.log("📡 Received ICE candidate from:", from);
    try {
      await pc.addIceCandidate(new RTCIceCandidate(candidate));
    } catch (err) {
      console.error("❌ Error adding ICE candidate", err);
    }
  });

  return () => {
    socket.off("offer");
    socket.off("ice-candidate");
  };
}, [socket]);


  const handleJoinLecture = () => {
    if (!socket || !lectureStarted) {
      console.log("❌ Lecture not started yet");
      return;
    }
    console.log("📡 Joining lecture room:", roomId);
    socket.emit("join-room", roomId);
    setJoined(true);
    alert(`✅ Joined lecture: ${roomId}`);
  };

  return (
    <div className="space-y-10">
      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center text-center py-12">
        <h1 className="text-5xl font-extrabold bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent">
          Student Dashboard 📚
        </h1>
        <p className="mt-4 text-lg text-gray-600 max-w-2xl">
          Access lessons, quizzes, and discussions anytime. Your personalized space
          to learn and grow with smart tools.
        </p>
        <button className="mt-6 px-8 py-3 bg-green-600 text-white rounded-xl shadow-lg hover:bg-green-700 transition">
          Start Learning
        </button>
        <button
      onClick={handleJoinLecture}
      disabled={!roomId || joined}
      className={`mt-6 px-6 py-3 rounded-xl font-semibold shadow-lg transition
        ${!roomId || joined 
          ? "bg-gray-300 text-gray-700 cursor-not-allowed" 
          : "bg-green-600 text-white hover:bg-green-700"}`}
    >
      {joined ? "✅ Joined Lecture" : "🎤 Join Lecture"}
    </button>

    {!joined && roomId && (
      <p className="mt-4 text-green-600 font-medium">
        ✅ Lecture available! Click Join Lecture
      </p>
    )}

    {joined && (
      <p className="mt-4 text-blue-600 font-bold">
        🎉 You have joined the lecture: {roomId}
      </p>
    )}
  


      </section>

      {/* Features Section */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white shadow-md rounded-xl p-6 hover:shadow-lg transition">
          <h3 className="text-xl font-bold text-green-600">📖 Lessons</h3>
          <p className="mt-2 text-gray-600">
            Explore interactive lessons curated by your teachers.
          </p>
        </div>
        <div className="bg-white shadow-md rounded-xl p-6 hover:shadow-lg transition">
          <h3 className="text-xl font-bold text-green-600">📝 Quizzes</h3>
          <p className="mt-2 text-gray-600">
            Attempt quizzes offline and sync results automatically when online.
          </p>
        </div>
        <div className="bg-white shadow-md rounded-xl p-6 hover:shadow-lg transition">
          <h3 className="text-xl font-bold text-green-600">💬 Discussions</h3>
          <p className="mt-2 text-gray-600">
            Join class discussions, ask questions, and collaborate with peers.
          </p>

        </div>
      </section>

      {/* Dashboard Preview */}
      <section className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-2xl font-bold text-green-700 mb-4">📊 Student Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-green-50 rounded-lg p-4 text-center">
            <h3 className="text-xl font-semibold text-green-700">Lessons</h3>
            <p className="text-gray-600 mt-2">8 Lessons Completed</p>
          </div>
          <div className="bg-teal-50 rounded-lg p-4 text-center">
            <h3 className="text-xl font-semibold text-teal-700">Quizzes</h3>
            <p className="text-gray-600 mt-2">2 Pending Quizzes</p>
          </div>
          <div className="bg-emerald-50 rounded-lg p-4 text-center">
            <h3 className="text-xl font-semibold text-emerald-700">Discussions</h3>
            <p className="text-gray-600 mt-2">5 Active Threads</p>
          </div>
        </div>
      </section>
    </div>
  );
}
