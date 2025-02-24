import express from "express";
import { createServer } from "http";
import { Server, Socket } from "socket.io";
import path from "path";
import { SCLogonHandler } from "./scripts/handler.logon";
import PlayerManager from "./scripts/playerManager";
const { User, Character } = require("./scripts/charcter.document");

const mongoose = require("mongoose");
const mongoURI = "mongodb://localhost:27017/JES_MUD";

const app = express();
const http = createServer(app);
const io = new Server(http, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

app.use(express.static(path.join(__dirname, "../public")));

io.on("connection", (socket: Socket) => {
  console.log("Player connected:", socket.id);

  PlayerManager.setPlayer(socket.id, new SCLogonHandler(socket, io));
  PlayerManager.getPlayers()[socket.id].Enter();

  socket.on("command", (cmd: string) => {
    const command = cmd.toLowerCase().trim();
    PlayerManager.getPlayers()[socket.id].Handle(command);
  });
  socket.on("disconnect", () => {
    console.log("Player disconnected:", socket.id);
    PlayerManager.removePlayer(socket.id);
  });
});

// clean up orphaned characters, if the server crashed or something went wrong we need to reset them all on start up
const checkOrphanedCharacters = async () => {
  try {
    const result = await Character.updateMany(
      { loggedIn: true },
      { $set: { loggedIn: false } }
    );
    console.log(`Cleaned up ${result.modifiedCount} orphaned characters`);
  } catch (error) {
    console.error("Crash recovery failed:", error);
  }
};

mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

mongoose.connection.once("open", () => {
  checkOrphanedCharacters();
});

const PORT = process.env.PORT || 3030;
http.listen(PORT, () => {
  console.log(`MUD Server running on port ${PORT}`);
});

// Add to server.js
const cleanupAndExit = async () => {
  console.log("Starting cleanup...");

  try {
    // Mark all logged-in characters as offline
    await PlayerManager.logoutAll();

    console.log("All characters logged out");
    process.exit(0);
  } catch (error) {
    console.error("Cleanup failed:", error);
    process.exit(1);
  }
};

// Handle graceful shutdowns
process.on("SIGINT", cleanupAndExit);
process.on("SIGTERM", cleanupAndExit);
