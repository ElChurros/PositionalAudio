const express = require("express");
const http = require("http");
const app = express();
const server = http.createServer(app);
const socket = require("socket.io");
const io = socket(server);

const users = {}

const socketToRoom = {}

io.on('connection', (socket) => {
    
    socket.on("join room", (roomId) => {
        if (users[roomId]) {
            users[roomId].push(socket.id)
        } else {
            users[roomId] = [socket.id]
        }
        socketToRoom[socket.id] = roomId;
    })

    socket.on("disconnect", () => {
        const roomId = socketToRoom[socket.id]
        if (!roomId) {
            return;
        }
        if (users[roomId].length === 1) {
            delete users[roomId]
        } else {
            users[roomId] = users[roomId].filter(id => id !== socket.id);
        }
        delete socketToRoom[socket.id]
    })
})

server.listen(8000, () =>  {
    console.log(`server is running on port 8000`)
});