import express from "express";
import http from "http";
import { Server } from "socket.io";
import { runGameSocket } from "./controls";
const app = express();

const server = http.createServer(app);
const io = new Server(server);

io.on("connection", (client) => {
  runGameSocket(io, client);
});

// usually this is where we try to connect to our DB.
server.listen(process.env.PORT || 8000);
