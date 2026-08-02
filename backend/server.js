import dotenv from "dotenv";
dotenv.config();
import express from "express";
import { Server } from "socket.io";
import { createServer } from "http";
import cors from "cors";
import connectdb from "./db/connectDb.js";
import cookieParser from "cookie-parser";
import auth from "./routes/auth.js";
import aiRoutes from "./routes/ai.js";
import resumeRoutes from "./routes/resume.js";
import compilerRoutes from "./routes/compiler.js";
import verifyToken from "./middleware/verifyToken.js";

const port = process.env.PORT || 3000;

const allowedOrigins = [
  "http://localhost:5173",
  "https://hire-sense-ai-drab.vercel.app",
];

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// --- middleware, in order, BEFORE any routes ---
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  cors({
    origin: allowedOrigins,
    methods: ["GET", "POST"],
    credentials: true,
  })
);
connectdb();

// --- routes, mounted ONCE ---
app.use("/api", auth); // login/signup/logout/me stay public
app.use("/api/ai", verifyToken, aiRoutes);
app.use("/api/resume", verifyToken, resumeRoutes);
app.use("/api/compiler", verifyToken, compilerRoutes);

// roomPeers now stores { peerId, socketId } so we can clean up on disconnect
const roomPeers = {};
// track which room each socket belongs to, for disconnect cleanup
const socketRooms = new Map();

io.on("connection", (socket) => {
  console.log(`User ${socket.id} connected`);

  socket.on("register-peer", ({ roomId, peerId }) => {
    if (!roomId || !peerId) return;
    roomPeers[roomId] = { peerId, socketId: socket.id };
    socketRooms.set(socket.id, roomId);
    console.log(`Host Peer registered: Room ${roomId} -> ${peerId}`);
    socket.to(roomId).emit("host-peer", peerId);
  });

  socket.on("request-peer", (roomId) => {
    const host = roomPeers[roomId];
    if (!host) {
      socket.emit("host-peer", null);
      console.log(`No host peer yet for room ${roomId}`);
      return;
    }
    socket.emit("host-peer", host.peerId);
    console.log(`Sent Host Peer ID ${host.peerId} to ${socket.id}`);
  });

  socket.on("joinRoom", (room) => {
    if (!room) return;
    socket.join(room);
    socketRooms.set(socket.id, room);
    console.log(`User ${socket.id} joined room ${room}`);
    socket.to(room).emit("user-joined", socket.id);
  });

  socket.on("leaveRoom", (room) => {
    if (!room) return;
    socket.leave(room);
    cleanupPeer(socket.id, room);
    console.log(`User ${socket.id} left room ${room}`);
    socket.to(room).emit("user-left", socket.id);
  });

  socket.on("message", ({ room, data }) => io.to(room).emit("recieve-message", data));
  socket.on("display-code", ({ room, data }) => io.to(room).emit("recieve-code", data));
  socket.on("input-change", ({ room, data }) => io.to(room).emit("recieve-input", data));
  socket.on("output-change", ({ room, data }) => io.to(room).emit("recieve-output", data));
  socket.on("change-language", ({ room, data }) => io.to(room).emit("recieve-language", data));
  socket.on("text-change", ({ room, data }) => io.to(room).emit("recieve-text", data));

  socket.on("disconnect", () => {
    const room = socketRooms.get(socket.id);
    console.log(`User ${socket.id} disconnected`);
    if (room) {
      cleanupPeer(socket.id, room);
      socket.to(room).emit("user-left", socket.id);
    }
  });
});

function cleanupPeer(socketId, room) {
  if (roomPeers[room]?.socketId === socketId) {
    delete roomPeers[room];
    console.log(`Cleared stale host peer for room ${room}`);
  }
  socketRooms.delete(socketId);
}

app.get("/", (req, res) => {
  res.send("Hello World!");
});

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});