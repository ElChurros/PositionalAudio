const express = require("express");
const http = require("http");
const app = express();
const server = http.createServer(app);
const socket = require("socket.io");
const io = socket(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"]
    }
});

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
        socket.emit("all users", users[roomId])
    })

    socket.on("sending signal", payload => {
        io.to(payload.userToSignal).emit('user joined', { signal: payload.signal, callerID: payload.callerID });
    })

    socket.on("returning signal", payload => {
        io.to(payload.callerID).emit('receiving returned signal', { signal: payload.signal, id: socket.id });
    });

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

server.listen(8000, () => {
    console.log(`server is running on port 8000`)
});