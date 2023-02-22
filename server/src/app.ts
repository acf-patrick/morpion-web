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

io.on("connection", (socket) => {
  console.log(`${socket.id} connected`);
});

app.get("/", (req, res) => {
  res.send("Hello world");
});

server.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});
