```js
import express from "express";
import http from "http";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = http.createServer(app);

// =====================================================
// CONFIGURATION
// =====================================================

const PORT = process.env.PORT || 10000;

const PUBLIC_DIR = path.join(
    __dirname,
    "public"
);

// =====================================================
// BASIC MIDDLEWARE
// =====================================================

app.disable("x-powered-by");

app.use(
    express.json({
        limit: "2mb"
    })
);

app.use(
    express.urlencoded({
        extended: true,
        limit: "2mb"
    })
);

// =====================================================
// HEALTH CHECK
// =====================================================

app.get(
    "/health",
    (req, res) => {

        res.status(200).json({
            success: true,
            game: "PET WORLD",
            status: "online",
            timestamp: new Date().toISOString()
        });

    }
);

// =====================================================
// GAME STATUS
// =====================================================

app.get(
    "/api/status",
    (req, res) => {

        res.status(200).json({

            success: true,

            game: "PET WORLD",

            server: "online",

            multiplayer: false,

            version: "1.0.0",

            time:
                new Date().toISOString()

        });

    }
);

// =====================================================
// STATIC GAME FILES
// =====================================================

app.use(
    express.static(
        PUBLIC_DIR,
        {
            extensions: [
                "html"
            ],

            maxAge:
                process.env.NODE_ENV === "production"
                    ? "1h"
                    : 0
        }
    )
);

// =====================================================
// INDEX ROUTE
// =====================================================

app.get(
    "/",
    (req, res) => {

        res.sendFile(
            path.join(
                PUBLIC_DIR,
                "index.html"
            )
        );

    }
);

// =====================================================
// SPA / GAME FALLBACK
//
// IMPORTANT:
// Do NOT use:
// app.get("*", ...)
//
// New Express versions reject that syntax.
// =====================================================

app.get(
    "/{*splat}",
    (req, res, next) => {

        // API requests that were not found
        // should return JSON instead of index.html.

        if (
            req.path.startsWith("/api/")
        ) {

            return res.status(404).json({

                success: false,

                error: "API endpoint not found",

                path: req.path

            });

        }

        // Browser/game routes
        // return the main game page.

        res.sendFile(
            path.join(
                PUBLIC_DIR,
                "index.html"
            ),
            error => {

                if (error) {

                    next(error);

                }

            }
        );

    }
);

// =====================================================
// 404 HANDLER
// =====================================================

app.use(
    (req, res) => {

        if (
            req.accepts("html")
        ) {

            return res.status(404).send(
                `
                <!DOCTYPE html>

                <html lang="en">

                <head>

                    <meta charset="UTF-8">

                    <meta
                        name="viewport"
                        content="width=device-width, initial-scale=1.0"
                    >

                    <title>PET WORLD - 404</title>

                    <style>

                        * {
                            box-sizing: border-box;
                        }

                        body {
                            margin: 0;
                            min-height: 100vh;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            background: #071016;
                            color: white;
                            font-family:
                                Arial,
                                Helvetica,
                                sans-serif;
                            text-align: center;
                        }

                        .box {
                            width: min(500px, 90vw);
                            padding: 40px;
                            border-radius: 20px;
                            background:
                                rgba(
                                    255,
                                    255,
                                    255,
                                    0.06
                                );
                            border:
                                1px solid
                                rgba(
                                    255,
                                    255,
                                    255,
                                    0.12
                                );
                        }

                        h1 {
                            margin-top: 0;
                        }

                        p {
                            opacity: 0.7;
                        }

                    </style>

                </head>

                <body>

                    <div class="box">

                        <h1>
                            🌍 PET WORLD
                        </h1>

                        <h2>
                            404
                        </h2>

                        <p>
                            The requested page
                            was not found.
                        </p>

                    </div>

                </body>

                </html>
                `
            );

        }

        res.status(404).json({

            success: false,

            error: "Not found",

            path: req.path

        });

    }
);

// =====================================================
// GLOBAL ERROR HANDLER
// =====================================================

app.use(
    (
        error,
        req,
        res,
        next
    ) => {

        console.error(
            "Server error:",
            error
        );

        if (
            res.headersSent
        ) {

            return next(error);

        }

        res.status(500).json({

            success: false,

            error:
                "Internal server error"

        });

    }
);

// =====================================================
// START SERVER
// =====================================================

server.listen(
    PORT,
    "0.0.0.0",
    () => {

        console.log(
            "========================================"
        );

        console.log(
            "        PET WORLD SERVER"
        );

        console.log(
            "========================================"
        );

        console.log(
            `Server running on port ${PORT}`
        );

        console.log(
            `Environment: ${
                process.env.NODE_ENV ||
                "development"
            }`
        );

        console.log(
            `Public directory: ${PUBLIC_DIR}`
        );

        console.log(
            "Health: /health"
        );

        console.log(
            "API Status: /api/status"
        );

        console.log(
            "========================================"
        );

    }
);

// =====================================================
// GRACEFUL SHUTDOWN
// =====================================================

function shutdown(
    signal
) {

    console.log(
        `${signal} received.`
    );

    server.close(
        error => {

            if (error) {

                console.error(
                    "Shutdown error:",
                    error
                );

                process.exit(1);

            }

            console.log(
                "PET WORLD server stopped."
            );

            process.exit(0);

        }
    );

}

process.on(
    "SIGTERM",
    () => {

        shutdown("SIGTERM");

    }
);

process.on(
    "SIGINT",
    () => {

        shutdown("SIGINT");

    }
);
```
