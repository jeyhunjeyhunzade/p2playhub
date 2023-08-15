import http from "http";
import express from "express";
import cors from "cors";
import { Server } from "colyseus";
import { monitor } from "@colyseus/monitor";
import TicTacToe from "./models/TicTacToe";

const port = Number(process.env.PORT || 8500);
const app = express();

app.use(cors());
app.use(express.json());

app.use("/", (req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-Requested-With,content-type"
  );
  next();
});

const server = http.createServer(app);
const gameServer = new Server({
  server,
});

gameServer.define("tic-tac-toe", TicTacToe);

app.use("/colyseus", monitor());

gameServer.listen(port);
console.log(`Listening on port:${port}`);
