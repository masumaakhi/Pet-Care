// backend/services/SocketService.js
const { Server } = require("socket.io");

/**
 * Global Socket Service
 */
class SocketService {
  constructor() {
    this.io = null;
  }

  /**
   * Initialize Socket.IO
   */
  init(server) {
    this.io = new Server(server, {
      cors: {
        origin: ["http://localhost:3000", "https://pet-care-frontpage.netlify.app"],
        methods: ["GET", "POST", "PATCH"],
        credentials: true
      }
    });

    console.log("Socket.IO Initialized ✅");

    this.io.on("connection", (socket) => {
      console.log(`Socket Connected: ${socket.id}`);

      // Join personal room
      socket.on("join:user", (userId) => {
        socket.join(`user-${userId}`);
        console.log(`User ${userId} joined their room`);
      });

      // Join volunteer room
      socket.on("join:volunteer", (volunteerId) => {
        socket.join(`volunteer-${volunteerId}`);
        console.log(`Volunteer ${volunteerId} joined their room`);
      });

      // Join specific rescue room (Tracking)
      socket.on("join:rescue", (rescueId) => {
        socket.join(`rescue-${rescueId}`);
        console.log(`Joined tracking room for rescue: ${rescueId}`);
      });

      // Join admin room
      socket.on("join:admin", () => {
        socket.join("admin");
        console.log(`Admin joined global room`);
      });

      socket.on("disconnect", () => {
        console.log(`Socket Disconnected: ${socket.id}`);
      });
    });
  }

  /**
   * Emit to specific room
   */
  emitToRoom(room, event, data) {
    if (this.io) {
      this.io.to(room).emit(event, data);
    }
  }

  /**
   * Emit to user
   */
  emitToUser(userId, event, data) {
    this.emitToRoom(`user-${userId}`, event, data);
  }

  /**
   * Emit to admin
   */
  emitToAdmin(event, data) {
    this.emitToRoom("admin", event, data);
  }
}

module.exports = new SocketService();
