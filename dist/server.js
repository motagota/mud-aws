"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = require("http");
const socket_io_1 = require("socket.io");
const path_1 = __importDefault(require("path"));
const handler_logon_1 = require("./scripts/handler.logon");
const playerManager_1 = __importDefault(require("./scripts/playerManager"));
const { User, Character } = require("./scripts/charcter.document");
const mongoose = require("mongoose");
const mongoURI = "mongodb://localhost:27017/JES_MUD";
const app = (0, express_1.default)();
const http = (0, http_1.createServer)(app);
const io = new socket_io_1.Server(http, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
    },
});
app.use(express_1.default.static(path_1.default.join(__dirname, "../public")));
io.on("connection", (socket) => {
    console.log("Player connected:", socket.id);
    playerManager_1.default.setPlayer(socket.id, new handler_logon_1.SCLogonHandler(socket, io));
    playerManager_1.default.getPlayers()[socket.id].Enter();
    socket.on("command", (cmd) => {
        const command = cmd.toLowerCase().trim();
        playerManager_1.default.getPlayers()[socket.id].Handle(command);
    });
    socket.on("disconnect", () => {
        console.log("Player disconnected:", socket.id);
        playerManager_1.default.removePlayer(socket.id);
    });
});
// clean up orphaned characters, if the server crashed or something went wrong we need to reset them all on start up
const checkOrphanedCharacters = async () => {
    try {
        const result = await Character.updateMany({ loggedIn: true }, { $set: { loggedIn: false } });
        console.log(`Cleaned up ${result.modifiedCount} orphaned characters`);
    }
    catch (error) {
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
        await playerManager_1.default.logoutAll();
        console.log("All characters logged out");
        process.exit(0);
    }
    catch (error) {
        console.error("Cleanup failed:", error);
        process.exit(1);
    }
};
// Handle graceful shutdowns
process.on("SIGINT", cleanupAndExit);
process.on("SIGTERM", cleanupAndExit);
