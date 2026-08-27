import express from "express";
import http from "http";
import { Server } from "socket.io";
import path from "path";
import { fileURLToPath } from "url";

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

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
    express.static(
        path.join(__dirname, "public")
    )
);

app.get("/health", (req, res) => {
    res.json({
        status: "ok",
        game: "PET WORLD",
        version: "1.0.0",
        players: io.engine.clientsCount
    });
});

app.get("*", (req, res) => {
    res.sendFile(
        path.join(
            __dirname,
            "public",
            "index.html"
        )
    );
});

const players = new Map();

io.on("connection", (socket) => {

    console.log(
        `Player connected: ${socket.id}`
    );

    const player = {
        id: socket.id,
        name: `Player-${socket.id.slice(0, 5)}`,
        x: 0,
        y: 0,
        z: 0,
        rotation: 0,
        level: 1,
        health: 100
    };

    players.set(
        socket.id,
        player
    );

    socket.emit(
        "world:init",
        {
            id: socket.id,
            players: Array.from(
                players.values()
            )
        }
    );

    socket.broadcast.emit(
        "player:joined",
        player
    );

    socket.on(
        "player:update",
        (data) => {

            const current =
                players.get(
                    socket.id
                );

            if (!current) {
                return;
            }

            if (
                data &&
                typeof data === "object"
            ) {

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
            }

            socket.broadcast.emit(
                "player:update",
                current
            );
        }
    );

    socket.on(
        "player:name",
        (name) => {

            const current =
                players.get(
                    socket.id
                );

            if (!current) {
                return;
            }

            const cleanName =
                String(name || "")
                    .trim()
                    .slice(0, 20);

            if (!cleanName) {
                return;
            }

            current.name =
                cleanName;

            io.emit(
                "player:name",
                {
                    id: socket.id,
                    name: cleanName
                }
            );
        }
    );

    socket.on(
        "disconnect",
        () => {

            players.delete(
                socket.id
            );

            socket.broadcast.emit(
                "player:left",
                {
                    id: socket.id
                }
            );

            console.log(
                `Player disconnected: ${socket.id}`
            );
        }
    );
});

server.listen(
    PORT,
    "0.0.0.0",
    () => {

        console.log(
            "================================"
        );

        console.log(
            "🐾 PET WORLD SERVER"
        );

        console.log(
            `🚀 Running on port ${PORT}`
        );

        console.log(
            "================================"
        );
    }
);
