const http = require("http");
const express = require("express");
const socketIo = require("socket.io");
const cors = require("cors");
const { Socket } = require("dgram");
const { disconnect } = require("process");
const port = process.env.PORT || 3000;
const app = express();
const server = http.createServer(app);
const io = socketIo(server);
const users = [{}];
app.use(cors());

io.on("connection", (socket) => {
  console.log("new Connection");
  socket.on("joined", ({ name }) => {
    users[socket.id] = name;
    console.log(`${name} is joined`);
    socket.broadcast.emit("userJoined", {
      user: "Admin",
      message: `${users[socket.id]} has to joined`,
    });
    socket.emit("welcome", {
      user: "Admin",
      message: `welcome to the chat ${users[socket.id]}`,
    });
    socket.on("message", ({ message, id }) => {
      io.emit("sendMessage", { user: users[id], message, id });
    });
    socket.on("diconnect", () => {
      socket.broadcast.emit("leave", {
        user: "Admin",
        message: "user has left",
      });
      console.log("user left");
    });
  });
});

server.listen(port, () => {
  console.log(`server is working on ${port}`);
});
