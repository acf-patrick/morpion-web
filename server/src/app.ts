import { Server } from "socket.io";
import express from "express";
import http from "http";
import cors from "cors";

const port = process.env.PORT || 8000;

const app = express();
const server = http.createServer(app);
const io = new Server( server );

app.use(cors());

io.on("connection", socket => {
  console.log(socket.id);
});

app.get('/', (req, res) => {
  res.send("Hello world");
});

server.listen(port, () => {
  console.log(`listening on port ${port}`);
});