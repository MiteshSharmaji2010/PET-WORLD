const express = require("express");
const http = require("http");
const path = require("path");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const PORT = process.env.PORT || 3000;

// --------------------------------------------------
// BASIC SERVER SETTINGS
// --------------------------------------------------

app.use(express.json({ limit: "5mb" }));

app.use(
    express.static(
        path.join(__dirname, "public")
    )
);

// --------------------------------------------------
// HOME PAGE
// --------------------------------------------------

app.get("/", (req, res) => {
    res.sendFile(
        path.join(
            __dirname,
            "public",
            "index.html"
        )
    );
});

// --------------------------------------------------
// SERVER STATUS
// --------------------------------------------------

app.get("/health", (req, res) => {

    res.json({
        success: true,
        game: "PET WORLD",
        server: "online",
        players: io.engine.clientsCount,
        time: new Date().toISOString()
    });

});

// --------------------------------------------------
// PLAYER DATA
// --------------------------------------------------

const players = new Map();

function createPlayer(socketId) {

    return {

        id: socketId,

        name: "Player",

        position: {
            x: 0,
            y: 2,
            z: 0
        },

        rotation: {
            x: 0,
            y: 0,
            z: 0
        },

        health: 100,

        stamina: 100,

        level: 1,

        experience: 0,

        inventory: [],

        pets: [],

        connectedAt: Date.now()

    };

}

// --------------------------------------------------
// MULTIPLAYER CONNECTION
// --------------------------------------------------

io.on("connection", (socket) => {

    console.log(
        `Player connected: ${socket.id}`
    );

    const player =
        createPlayer(socket.id);

    players.set(
        socket.id,
        player
    );

    // ------------------------------------------------
    // SEND PLAYER INFORMATION
    // ------------------------------------------------

    socket.emit(
        "playerJoined",
        player
    );

    // ------------------------------------------------
    // SEND ALL OTHER PLAYERS
    // ------------------------------------------------

    const otherPlayers =
        Array.from(
            players.values()
        ).filter(
            p => p.id !== socket.id
        );

    socket.emit(
        "existingPlayers",
        otherPlayers
    );

    // ------------------------------------------------
    // INFORM OTHER PLAYERS
    // ------------------------------------------------

    socket.broadcast.emit(
        "playerConnected",
        player
    );

    // ------------------------------------------------
    // PLAYER MOVEMENT
    // ------------------------------------------------

    socket.on(
        "playerMovement",
        (data) => {

            const currentPlayer =
                players.get(socket.id);

            if (!currentPlayer) {
                return;
            }

            if (
                !data ||
                !data.position
            ) {
                return;
            }

            // Basic server-side validation

            const x =
                Number(data.position.x);

            const y =
                Number(data.position.y);

            const z =
                Number(data.position.z);

            if (
                !Number.isFinite(x) ||
                !Number.isFinite(y) ||
                !Number.isFinite(z)
            ) {
                return;
            }

            currentPlayer.position = {
                x,
                y,
                z
            };

            if (data.rotation) {

                currentPlayer.rotation = {

                    x:
                        Number(data.rotation.x) || 0,

                    y:
                        Number(data.rotation.y) || 0,

                    z:
                        Number(data.rotation.z) || 0

                };

            }

            socket.broadcast.emit(
                "playerMoved",
                {
                    id: socket.id,

                    position:
                        currentPlayer.position,

                    rotation:
                        currentPlayer.rotation
                }
            );

        }
    );

    // ------------------------------------------------
    // PLAYER NAME
    // ------------------------------------------------

    socket.on(
        "setPlayerName",
        (name) => {

            const currentPlayer =
                players.get(socket.id);

            if (!currentPlayer) {
                return;
            }

            if (
                typeof name !== "string"
            ) {
                return;
            }

            name =
                name
                    .trim()
                    .slice(0, 20);

            if (!name) {
                return;
            }

            currentPlayer.name =
                name;

            io.emit(
                "playerNameChanged",
                {
                    id: socket.id,
                    name
                }
            );

        }
    );

    // ------------------------------------------------
    // CHAT
    // ------------------------------------------------

    socket.on(
        "chatMessage",
        (message) => {

            if (
                typeof message !==
                "string"
            ) {
                return;
            }

            message =
                message
                    .trim()
                    .slice(0, 200);

            if (!message) {
                return;
            }

            const currentPlayer =
                players.get(socket.id);

            if (!currentPlayer) {
                return;
            }

            io.emit(
                "chatMessage",
                {
                    playerId:
                        socket.id,

                    playerName:
                        currentPlayer.name,

                    message,

                    time:
                        Date.now()
                }
            );

        }
    );

    // ------------------------------------------------
    // DISCONNECT
    // ------------------------------------------------

    socket.on(
        "disconnect",
        () => {

            console.log(
                `Player disconnected: ${socket.id}`
            );

            players.delete(
                socket.id
            );

            io.emit(
                "playerDisconnected",
                socket.id
            );

        }
    );

});

// --------------------------------------------------
// SERVER START
// --------------------------------------------------

server.listen(
    PORT,
    () => {

        console.log("");
        console.log(
            "===================================="
        );

        console.log(
            "          PET WORLD"
        );

        console.log(
            "      GAME SERVER ONLINE"
        );

        console.log(
            "===================================="
        );

        console.log(
            `Server: http://localhost:${PORT}`
        );

        console.log(
            "===================================="
        );

        console.log("");

    }
);
