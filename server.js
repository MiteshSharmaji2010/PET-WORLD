import express from "express";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Render PORT
const PORT = process.env.PORT || 10000;

// --------------------------------------------------
// Middleware
// --------------------------------------------------

app.disable("x-powered-by");

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// --------------------------------------------------
// Static files
// --------------------------------------------------

app.use(
    express.static(
        path.join(__dirname, "public"),
        {
            extensions: ["html"],
            index: "index.html"
        }
    )
);

// --------------------------------------------------
// Health check
// --------------------------------------------------

app.get("/health", (req, res) => {

    res.status(200).json({
        status: "ok",
        game: "PET WORLD",
        server: "online",
        time: new Date().toISOString()
    });

});

// --------------------------------------------------
// Game API
// --------------------------------------------------

app.get("/api/status", (req, res) => {

    res.json({
        success: true,
        game: "PET WORLD",
        version: "1.0.0",
        multiplayer: false,
        serverTime: Date.now()
    });

});

// --------------------------------------------------
// Catch unknown API routes
// --------------------------------------------------

app.use("/api", (req, res) => {

    res.status(404).json({
        success: false,
        error: "API route not found"
    });

});

// --------------------------------------------------
// SPA / Game fallback
// --------------------------------------------------

// IMPORTANT:
// Express 5 / modern path-to-regexp does NOT accept "*"
// here. Therefore we use middleware instead.

app.use((req, res, next) => {

    if (req.method !== "GET") {
        return next();
    }

    // Don't return HTML for missing API requests
    if (req.path.startsWith("/api/")) {
        return res.status(404).json({
            success: false,
            error: "Not found"
        });
    }

    const indexPath =
        path.join(
            __dirname,
            "public",
            "index.html"
        );

    res.sendFile(indexPath, error => {

        if (error) {

            console.error(
                "Failed to send index.html:",
                error
            );

            if (!res.headersSent) {

                res.status(500).send(
                    "PET WORLD: index.html not found."
                );

            }

        }

    });

});

// --------------------------------------------------
// Error handler
// --------------------------------------------------

app.use((error, req, res, next) => {

    console.error(
        "Server error:",
        error
    );

    if (res.headersSent) {
        return next(error);
    }

    res.status(500).json({
        success: false,
        error: "Internal server error"
    });

});

// --------------------------------------------------
// Start server
// --------------------------------------------------

const server =
    app.listen(
        PORT,
        "0.0.0.0",
        () => {

            console.log(
                "========================================"
            );

            console.log(
                "        PET WORLD SERVER ONLINE"
            );

            console.log(
                "========================================"
            );

            console.log(
                `PORT: ${PORT}`
            );

            console.log(
                `Environment: ${process.env.NODE_ENV || "production"}`
            );

            console.log(
                `Node: ${process.version}`
            );

            console.log(
                "Game files: /public"
            );

            console.log(
                "========================================"
            );

        }
    );

// --------------------------------------------------
// Graceful shutdown
// --------------------------------------------------

const shutdown = signal => {

    console.log(
        `${signal} received. Shutting down...`
    );

    server.close(() => {

        console.log(
            "PET WORLD server stopped."
        );

        process.exit(0);

    });

    setTimeout(() => {

        console.error(
            "Forced shutdown."
        );

        process.exit(1);

    }, 10000);

};

process.on(
    "SIGTERM",
    () => shutdown("SIGTERM")
);

process.on(
    "SIGINT",
    () => shutdown("SIGINT")
);

process.on(
    "uncaughtException",
    error => {

        console.error(
            "Uncaught exception:",
            error
        );

    }
);

process.on(
    "unhandledRejection",
    error => {

        console.error(
            "Unhandled rejection:",
            error
        );

    }
);
