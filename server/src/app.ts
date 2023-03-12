import { isFull, getWinner, getRandomRoom } from "./utils";
import { Server } from "socket.io";
import express from "express";
import http from "http";
import cors from "cors";
import { getOptimalMove } from "./ai";

const PORT = process.env.PORT || 8000;

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

app.use(cors());

interface User {
  id: string; // Empty string means AI
  pawn: "x" | "o";
}

interface Room {
  name: string;
  hand?: "x" | "o";
  grid?: string[][];
  users: User[];
}
let rooms: Room[] = [];

io.on("connection", (socket) => {
  const id = socket.id;
  console.log(`${id} connected`);

  socket.on("join game", (name: string) => {
    const solo = name === "solo";
    if (solo) name = getRandomRoom();

    const index = rooms.findIndex((room) => room.name === name);
    let roomFull = false;
    let grid: string[][] = null;

    if (index < 0)
      rooms.push({
        name: name,
        users: [
          {
            id: id,
            pawn: "o",
          },
        ],
      });
    else {
      const room = rooms[index];
      if (room.users.length < 2) {
        const user: User = {
          id: id,
          pawn: "o",
        };
        if (room.users.length > 0)
          user.pawn = room.users[0].pawn === "o" ? "x" : "o";
        room.users.push(user);
        grid = room.grid;
      } else roomFull = true;
    }

    if (!roomFull) socket.join(name);

    socket.emit("join response", {
      room: name,
      success: !roomFull,
      grid: grid,
    });

    if (solo) {
      const room = rooms[rooms.length - 1];
      room.users.push({
        id: "",
        pawn: "x",
      });
    }

    console.log(rooms);
  });

  socket.on("quit game", () => {
    let index = -1;
    rooms.forEach((room, i) => {
      room.users = room.users.filter((user) => {
        if (user.id === id) {
          socket.leave(room.name);
          return false;
        }
        return true;
      });
      if (room.users.length === 0) index = i;
    });
    if (index >= 0) rooms = rooms.filter((room, i) => i !== index);
  });

  socket.on("rematch", () => {
    const room = rooms.find(
      (room) => room.users.findIndex((user) => user.id === id) >= 0
    );
    if (room) {
      if (isFull(room.grid) || getWinner(room.grid)) {
        room.grid = [
          ["", "", ""],
          ["", "", ""],
          ["", "", ""],
        ];
        room.hand = "o";
        io.to(room.name).emit("grid update", room.grid);
      }
    }
  });

  socket.on("place pawn", ([i, j]: number[]) => {
    for (let room of rooms) {
      const index = room.users.findIndex((user) => user.id === id);
      if (index >= 0) {
        if (!room.hand) room.hand = "o";
        if (!room.grid)
          room.grid = [
            ["", "", ""],
            ["", "", ""],
            ["", "", ""],
          ];

        const user = room.users[index];
        if (user.pawn === room.hand && !room.grid[i][j]) {
          if (!isFull(room.grid) && !getWinner(room.grid)) {
            room.grid[i][j] = room.hand;
            room.hand = room.hand === "x" ? "o" : "x";
            io.to(room.name).emit("grid update", room.grid);

            console.log(room);
          }
        }

        const opponent = room.users[(index + 1) % 2];
        if (!opponent.id) {
          // AI moves
          const coordinates = getOptimalMove(room.grid);
          if (coordinates[0] >= 0 && coordinates[1] >= 0) {
            room.grid[coordinates[0]][coordinates[1]] = "x";
            room.hand = room.hand === "x" ? "o" : "x";
            io.to(room.name).emit("grid update", room.grid);
          }
        }

        break;
      }
    }
  });
});

app.get("/", (req, res) => {
  res.send("Hello world");
});

server.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});
