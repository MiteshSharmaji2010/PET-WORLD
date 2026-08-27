import express from "express";
import http from "http";
import path from "path";
import { fileURLToPath } from "url";
import { Server } from "socket.io";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

const PORT = process.env.PORT || 3000;

app.disable("x-powered-by");

app.use(
    express.json({
        limit: "1mb"
    })
);

app.use(
    express.static(
        path.join(__dirname, "public"),
        {
            extensions: ["html"]
        }
    )
);

/*
|--------------------------------------------------------------------------
| HEALTH CHECK
|--------------------------------------------------------------------------
*/

app.get("/health", (req, res) => {

    res.status(200).json({
        status: "ok",
        game: "PET WORLD",
        serverTime: new Date().toISOString(),
        players: io.engine.clientsCount
    });

});

/*
|--------------------------------------------------------------------------
| GAME INFO
|--------------------------------------------------------------------------
*/

app.get("/api/game", (req, res) => {

    res.json({
        name: "PET WORLD",
        version: "1.0.0",
        online: true,
        players: io.engine.clientsCount
    });

});

/*
|--------------------------------------------------------------------------
| SPA / INDEX FALLBACK
|--------------------------------------------------------------------------
*/

app.get("*", (req, res) => {

    res.sendFile(
        path.join(
            __dirname,
            "public",
            "index.html"
        )
    );

});

/*
|--------------------------------------------------------------------------
| MULTIPLAYER MEMORY
|--------------------------------------------------------------------------
*/

const players = new Map();

/*
|--------------------------------------------------------------------------
| SOCKET.IO
|--------------------------------------------------------------------------
*/

io.on("connection", (socket) => {

    console.log(
        `[CONNECT] ${socket.id}`
    );

    const player = {
        id: socket.id,
        x: 0,
        y: 0,
        z: 0,
        rotation: 0,
        name: `Player-${socket.id.slice(0, 5)}`,
        level: 1,
        health: 100
    };

    players.set(
        socket.id,
        player
    );

    /*
    |--------------------------------------------------------------------------
    | SEND CURRENT PLAYERS TO NEW PLAYER
    |--------------------------------------------------------------------------
    */

    socket.emit(
        "worldState",
        Array.from(players.values())
    );

    /*
    |--------------------------------------------------------------------------
    | INFORM OTHER PLAYERS
    |--------------------------------------------------------------------------
    */

    socket.broadcast.emit(
        "playerJoined",
        player
    );

    /*
    |--------------------------------------------------------------------------
    | PLAYER UPDATE
    |--------------------------------------------------------------------------
    */

    socket.on(
        "playerUpdate",
        (data) => {

            if (
                !data ||
                typeof data !== "object"
            ) {
                return;
            }

            const current =
                players.get(
                    socket.id
                );

            if (!current) {
                return;
            }

            if (
                Number.isFinite(
                    Number(data.x)
                )
            ) {
                current.x =
                    Number(data.x);
            }

            if (
                Number.isFinite(
                    Number(data.y)
                )
            ) {
                current.y =
                    Number(data.y);
            }

            if (
                Number.isFinite(
                    Number(data.z)
                )
            ) {
                current.z =
                    Number(data.z);
            }

            if (
                Number.isFinite(
                    Number(data.rotation)
                )
            ) {
                current.rotation =
                    Number(data.rotation);
            }

            if (
                typeof data.name ===
                "string"
            ) {

                current.name =
                    data.name
                        .trim()
                        .slice(0, 24) ||
                    current.name;

            }

            if (
                Number.isFinite(
                    Number(data.level)
                )
            ) {

                current.level =
                    Math.max(
                        1,
                        Math.floor(
                            Number(data.level)
                        )
                    );

            }

            if (
                Number.isFinite(
                    Number(data.health)
                )
            ) {

                current.health =
                    Math.max(
                        0,
                        Math.min(
                            100,
                            Number(data.health)
                        )
                    );

            }

            socket.broadcast.emit(
                "playerUpdate",
                current
            );

        }
    );

    /*
    |--------------------------------------------------------------------------
    | CHAT
    |--------------------------------------------------------------------------
    */

    socket.on(
        "chatMessage",
        (message) => {

            if (
                typeof message !==
                "string"
            ) {
                return;
            }

            const text =
                message
                    .trim()
                    .slice(0, 200);

            if (!text) {
                return;
            }

            io.emit(
                "chatMessage",
                {
                    id: socket.id,
                    name: player.name,
                    message: text,
                    time: Date.now()
                }
            );

        }
    );

    /*
    |--------------------------------------------------------------------------
    | PET EVENT
    |--------------------------------------------------------------------------
    */

    socket.on(
        "petUpdate",
        (data) => {

            socket.broadcast.emit(
                "petUpdate",
                {
                    playerId: socket.id,
                    data
                }
            );

        }
    );

    /*
    |--------------------------------------------------------------------------
    | DISCONNECT
    |--------------------------------------------------------------------------
    */

    socket.on(
        "disconnect",
        () => {

            console.log(
                `[DISCONNECT] ${socket.id}`
            );

            players.delete(
                socket.id
            );

            socket.broadcast.emit(
                "playerLeft",
                socket.id
            );

        }
    );

});

/*
|--------------------------------------------------------------------------
| SERVER ERROR
|--------------------------------------------------------------------------
*/

server.on(
    "error",
    (error) => {

        console.error(
            "SERVER ERROR:",
            error
        );

    }
);

/*
|--------------------------------------------------------------------------
| START
|--------------------------------------------------------------------------
*/

server.listen(
    PORT,
    "0.0.0.0",
    () => {

        console.log(
            "================================="
        );

        console.log(
            "       PET WORLD SERVER"
        );

        console.log(
            "================================="
        );

        console.log(
            `PORT: ${PORT}`
        );

        console.log(
            `Environment: ${
                process.env.NODE_ENV ||
                "development"
            }`
        );

        console.log(
            "Server started successfully."
        );

    }
);
