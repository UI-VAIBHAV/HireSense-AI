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
const port = process.env.PORT || 3000;

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: [
      "http://localhost:5173",
      "https://hire-sense-ai-git-main-vaibhav30.vercel.app"
    ],
    methods: ["GET", "POST"],
    credentials: true,
  },
});


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
connectdb();
app.use(cookieParser());
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://hire-sense-ai-git-main-vaibhav30.vercel.app"
    ],
    methods: ["GET", "POST"],
    credentials: true,
  })
);
app.use("/api", auth);
app.use("/api/ai", aiRoutes);
app.use("/api/resume", resumeRoutes);
app.use("/api/compiler", compilerRoutes);
io.on("connection", (socket) => {
  console.log(`User ${socket.id} connected`);

  socket.on("joinRoom", (room) => {
    socket.join(room);
    console.log(`User ${socket.id} joined room ${room}`);
  });

  socket.on("leaveRoom", (room) => {
    socket.leave(room);
    console.log(`User ${socket.id} left room ${room}`);
  });

  socket.on("message", ({ room, data }) => {
    io.to(room).emit("recieve-message", data);
  });

  socket.on("display-code", ({ room, data }) => {
    io.to(room).emit("recieve-code", data);
  });

  socket.on("input-change", ({ room, data }) => {
    io.to(room).emit("recieve-input", data);
  });

  socket.on("output-change", ({ room, data }) => {
    io.to(room).emit("recieve-output", data);
  });

  socket.on("change-language", ({ room, data }) => {
    io.to(room).emit("recieve-language", data);
  });

  socket.on("text-change", ({ room, data }) => {
    io.to(room).emit("recieve-text", data);
  });
});

app.get("/", (req, res) => {
  res.send("Hello World!");
});

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
