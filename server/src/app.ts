import { Server } from "socket.io";
import express from "express";
import http from "http";
import cors from "cors";

const PORT = process.env.PORT || 8000;
const FRONTEND_URI = process.env.FRONTENT_URI;

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin:
      process.env.NODE_ENV === "production"
        ? FRONTEND_URI
        : "http://localhost:3000",
  },
});

app.use(cors());

// Game turn
let turn: "x" | "o" = "o";

interface Room {
  name: string;
  users: string[];
}
const rooms: Room[] = [];

io.on("connection", (socket) => {
  const id = socket.id;
  console.log(`${id} connected`);

  socket.on("new game", (name: string) => {
    socket.join(name);

    let found = false;
    rooms.forEach((room) => {
      if (room.name === name) {
        found = true;
        if (room.users.length >= 2) socket.emit("room full");
        else room.users.push(id);
      }
    });

    if (!found)
      rooms.push({
        name: name,
        users: [id],
      });

    console.log(rooms);
  });
});

app.get("/", (req, res) => {
  res.send("Hello world");
});

server.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});
