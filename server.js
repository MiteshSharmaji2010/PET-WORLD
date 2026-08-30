// server.js
const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http, {
    cors: { origin: "*" }
});

app.use(express.static('public'));

const players = {};

io.on('connection', (socket) => {
    console.log(`Player Connected: ${socket.id}`);

    // Spawn new player state
    players[socket.id] = {
        id: socket.id,
        position: { x: 0, y: 0.5, z: 0 },
        rotation: { y: 0 },
        activePet: null
    };

    // Send existing player list to new user
    socket.emit('currentPlayers', players);

    // Broadcast new player to all clients
    socket.broadcast.emit('playerJoined', players[socket.id]);

    // Synchronize movement data
    socket.on('playerMove', (movementData) => {
        if (players[socket.id]) {
            players[socket.id].position = movementData.position;
            players[socket.id].rotation = movementData.rotation;
            socket.broadcast.emit('playerMoved', players[socket.id]);
        }
    });

    // Handle disconnection
    socket.on('disconnect', () => {
        console.log(`Player Disconnected: ${socket.id}`);
        delete players[socket.id];
        io.emit('playerLeft', socket.id);
    });
});

const PORT = process.env.PORT || 3000;
http.listen(PORT, () => console.log(`Pet World Server active on port ${PORT}`));
