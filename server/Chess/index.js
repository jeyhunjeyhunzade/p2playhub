const app = require("express")();
const server = require("http").createServer(app);

const io = require("socket.io")(server, {
  cors: {
    origin: "*",
  },
});

// unique id
const crypto = require("crypto");
const randomId = () => crypto.randomBytes(8).toString("hex");

const users = {};
const game = {};
const USERNAME = {};

// middle ware
io.use((socket, next) => {
  let user = {
    username: socket.handshake.auth.username,
  };
  // check if the username is already present
  if (USERNAME.hasOwnProperty(user.username)) {
    console.log("user rejected");
    return next(new Error("username exist"));
  }
  users[socket.id] = user;
  USERNAME[user.username] = user.username;
  console.log(users);
  next();
});

io.on("connection", (socket) => {
  // when the user is connected to the socket
  console.log(socket.handshake.auth.username, "is connected!");
  // emit the list to all users
  socket.on("getList", (res) => {
    io.emit("list", users);
  });
  // when the user send an invite to another user for a match.
  socket.on("create", (res) => {
    const gameid = randomId();
    let data = {
      white: socket.id,
      whiteUsername: socket.handshake.auth.username,
    };
    game[gameid] = data;
    console.log(res);
    let id = socket.id;
    delete users[socket.id];
    delete USERNAME[socket.handshake.auth.username];
    let tempUserName = socket.handshake.auth.username;
    io.emit("list", users);
    io.to(res).emit("create", { gameid, id, username: tempUserName });
  });

  // when a opponent send invite for a game and
  // user accept and join the match
  socket.on("join", ({ gameid, id, myid }) => {
    let data = game[gameid];
    data["black"] = socket.id;
    data["blackUsername"] = socket.handshake.auth.username;
    game[gameid] = data;
    delete users[socket.id];
    delete USERNAME[socket.handshake.auth.username];
    io.emit("list", users);
    io.to(id).to(myid).emit("join", game[gameid]);
  });

  // when the user move the pieces
  socket.on("move", (res) => {
    io.to(res.otherid).emit("move", res);
    console.log(res);
  });

  // when the user disconnects from socket
  socket.on("disconnect", () => {
    delete users[socket.id];
    delete USERNAME[socket.handshake.auth.username];
    io.emit("list", users);
    console.log(socket.handshake.auth.username, "is disconnect");
  });
});

const PORT = process.env.PORT || 8000;

server.listen(PORT, () => {
  console.log("server is listening on port 8000");
});
