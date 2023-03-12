import { Server } from "socket.io";
import express from "express";
import http from "http";
import cors from "cors";

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
  id: string;
  pawn: "x" | "o";
}

interface Room {
  name: string;
  hand?: "x" | "o";
  grid?: string[][];
  users: User[];
}
let rooms: Room[] = [];

function isFull(grid: string[][]) {
  for (let row of grid) for (let col of row) if (!col) return false;
  return true;
}

function getWinner(grid: string[][]) {
  // Checking rows
  for (let row of grid) {
    if (row[0] === row[1] && row[1] === row[2]) return row[0];
  }

  // Checking columns
  for (let i = 0; i < 3; ++i) {
    if (grid[0][i] === grid[1][i] && grid[1][i] === grid[2][i])
      return grid[0][i];
  }

  // Checking diagonals
  if (grid[0][0] === grid[1][1] && grid[1][1] === grid[2][2]) return grid[1][1];
  if (grid[2][0] === grid[1][1] && grid[1][1] === grid[0][2]) return grid[1][1];

  return "";
}

io.on("connection", (socket) => {
  const id = socket.id;
  console.log(`${id} connected`);

  socket.on("join game", (name: string) => {
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
