const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const students = {};
const teachers = {};

const io = new Server(server, {
  cors: { origin: '*' } // allow all origins for development
});

// Simple test endpoint
app.get("/", (req, res) => {
  res.send("✅ Signaling server is running!");
});

io.on('connection', (socket) => {
  console.log('Socket connected:', socket.id);
  
  socket.on("offer", ({ offer, to }) => {
  if (teachers[to]) {
    teachers[to].emit("offer", { offer, from: socket.id });
  }
});

socket.on("answer", ({ answer, to }) => {
  if (students[to]) {
    students[to].emit("answer", { answer, from: socket.id });
  }
});


  // Exchange ICE candidates
  socket.on("ice-candidate", ({ candidate, to }) => {
  if (teachers[to]) teachers[to].emit("ice-candidate", { candidate, from: socket.id });
  if (students[to]) students[to].emit("ice-candidate", { candidate, from: socket.id });
});


  // Assign role
  socket.on('role', (role) => {
  socket.role = role;
  if(role === 'student') students[socket.id] = socket;
  if(role === 'teacher') teachers[socket.id] = socket;
});

  // Teacher starts lecture
  socket.on('start-lecture', ({ roomId }) => {
    console.log(`🎤 Teacher started lecture in room: ${roomId}`);

    // Send to all students
    io.sockets.sockets.forEach((s) => {
      if (s.role === 'student') {
        s.emit('lecture-started', { roomId });
      }
    });
  });

  socket.on('disconnect', () => {
    console.log('Socket disconnected:', socket.id);
  });
});


const PORT = 3000;
server.listen(PORT, () => console.log(`✅ Signaling server running on http://localhost:${PORT}`));
