import { Server } from "socket.io";

export const initSocketIO = (server) => {
  const io = new Server(server, {
    cors: {
      origin: process.env.CORS_ORIGIN || "*",
      methods: ["GET", "POST"],
      credentials: true,
    },
    path: "/socket.io",
  });

  io.on("connection", (socket) => {
    console.log(`🔌 Client connected: ${socket.id}`);

    // Join room
    socket.on("join-room", (roomId) => {
      socket.join(roomId);
      console.log(`📥 Socket ${socket.id} joined room ${roomId}`);
      io.to(roomId).emit("user-joined", { socketId: socket.id });
    });

    // Leave room
    socket.on("leave-room", (roomId) => {
      socket.leave(roomId);
      console.log(`📤 Socket ${socket.id} left room ${roomId}`);
      io.to(roomId).emit("user-left", { socketId: socket.id });
    });

    // Handle custom events
    socket.on("message", (data) => {
      console.log("📨 Message received:", data);
      socket.emit("message", { 
        from: socket.id, 
        data,
        timestamp: new Date().toISOString() 
      });
    });

    socket.on("disconnect", (reason) => {
      console.log(`🔌 Client disconnected: ${socket.id} (reason: ${reason})`);
    });
  });

  return io;
};

