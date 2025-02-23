import express from "express";
import { createServer } from "http";
import { Server, Socket } from "socket.io";
import path from "path";
import { SCLogonHandler } from "./scripts/handler.logon";
import PlayerManager from "./scripts/playerManager";

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

const PORT = process.env.PORT || 3030;
http.listen(PORT, () => {
  console.log(`MUD Server running on port ${PORT}`);
});
