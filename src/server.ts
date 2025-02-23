import express from "express";
import { createServer } from "http";
import { Server, Socket } from "socket.io";
import path from "path";

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
});

const PORT = process.env.PORT || 3030;
http.listen(PORT, () => {
  console.log(`Chat Server running on port ${PORT}`);
});