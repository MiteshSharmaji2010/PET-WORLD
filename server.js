"use strict";

/*
=========================================================
PET WORLD
Render-ready Node.js + Express Server
File: server.js
=========================================================
*/

const express = require("express");
const path = require("path");
const compression = require("compression");

const app = express();

/*
=========================================================
CONFIGURATION
=========================================================
*/

const PORT = Number(process.env.PORT) || 10000;

const HOST =
    process.env.HOST ||
    "0.0.0.0";

const IS_PRODUCTION =
    process.env.NODE_ENV === "production";

const PUBLIC_DIR =
    path.join(
        __dirname,
        "public"
    );

/*
=========================================================
EXPRESS CONFIGURATION
=========================================================
*/

app.disable("x-powered-by");

app.set(
    "trust proxy",
    1
);

app.use(
    express.json({
        limit: "1mb"
    })
);

app.use(
    express.urlencoded({
        extended: true,
        limit: "1mb"
    })
);

/*
=========================================================
COMPRESSION
=========================================================
*/

app.use(
    compression({
        threshold: 1024
    })
);

/*
=========================================================
SECURITY HEADERS
=========================================================
*/

app.use(
    (req, res, next) => {

        res.setHeader(
            "X-Content-Type-Options",
            "nosniff"
        );

        res.setHeader(
            "X-Frame-Options",
            "SAMEORIGIN"
        );

        res.setHeader(
            "Referrer-Policy",
            "strict-origin-when-cross-origin"
        );

        res.setHeader(
            "Permissions-Policy",
            "camera=(), microphone=(), geolocation=()"
        );

        next();

    }
);

/*
=========================================================
REQUEST LOGGER
=========================================================
*/

app.use(
    (req, res, next) => {

        const start =
            Date.now();

        res.on(
            "finish",
            () => {

                const duration =
                    Date.now() -
                    start;

                console.log(
                    `${req.method} ${req.originalUrl} ${res.statusCode} ${duration}ms`
                );

            }
        );

        next();

    }
);

/*
=========================================================
HEALTH CHECK
=========================================================
*/

app.get(
    "/health",
    (req, res) => {

        res.status(200).json({

            success: true,

            status: "healthy",

            service: "PET WORLD",

            environment:
                IS_PRODUCTION
                    ? "production"
                    : "development",

            uptime:
                Math.floor(
                    process.uptime()
                ),

            timestamp:
                new Date().toISOString()

        });

    }
);

/*
=========================================================
API STATUS
=========================================================
*/

app.get(
    "/api",
    (req, res) => {

        res.status(200).json({

            success: true,

            game:
                "PET WORLD",

            message:
                "PET WORLD server is running.",

            version:
                "1.0.0"

        });

    }
);

/*
=========================================================
GAME CONFIG API
=========================================================
*/

app.get(
    "/api/config",
    (req, res) => {

        res.status(200).json({

            success: true,

            game: {

                name:
                    "PET WORLD",

                version:
                    "1.0.0",

                maxPlayers:
                    100,

                worldSize:
                    500,

                multiplayer:
                    false

            }

        });

    }
);

/*
=========================================================
STATIC FILES
=========================================================
*/

app.use(
    express.static(
        PUBLIC_DIR,
        {
            extensions: [
                "html"
            ],

            maxAge:
                IS_PRODUCTION
                    ? "1d"
                    : 0,

            index:
                "index.html",

            redirect:
                false
        }
    )
);

/*
=========================================================
FAVICON
=========================================================
*/

app.get(
    "/favicon.ico",
    (req, res) => {

        const favicon =
            path.join(
                PUBLIC_DIR,
                "favicon.ico"
            );

        res.sendFile(
            favicon,
            error => {

                if (error) {

                    res.status(
                        204
                    ).end();

                }

            }
        );

    }
);

/*
=========================================================
ROBOTS
=========================================================
*/

app.get(
    "/robots.txt",
    (req, res) => {

        res.type(
            "text/plain"
        );

        res.send(
            "User-agent: *\nAllow: /\n"
        );

    }
);

/*
=========================================================
SPA FALLBACK
=========================================================

If a browser opens a route that does not directly
exist, send index.html.

This is useful for client-side game/menu routes.
=========================================================
*/

app.get(
    "*",
    (req, res, next) => {

        /*
        Do not return index.html for API routes.
        */

        if (
            req.path.startsWith(
                "/api/"
            )
        ) {

            return next();

        }

        /*
        Do not return index.html for
        common missing asset requests.
        */

        const assetExtensions = [

            ".js",
            ".mjs",
            ".css",
            ".json",
            ".png",
            ".jpg",
            ".jpeg",
            ".webp",
            ".gif",
            ".svg",
            ".ico",
            ".mp3",
            ".wav",
            ".ogg",
            ".mp4",
            ".webm",
            ".glb",
            ".gltf",
            ".bin",
            ".woff",
            ".woff2",
            ".ttf"

        ];

        const hasAssetExtension =
            assetExtensions.some(
                extension =>
                    req.path
                        .toLowerCase()
                        .endsWith(
                            extension
                        )
            );

        if (
            hasAssetExtension
        ) {

            return next();

        }

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

/*
=========================================================
404 HANDLER
=========================================================
*/

app.use(
    (req, res) => {

        res.status(404).json({

            success: false,

            error:
                "Not Found",

            path:
                req.originalUrl

        });

    }
);

/*
=========================================================
ERROR HANDLER
=========================================================
*/

app.use(
    (
        error,
        req,
        res,
        next
    ) => {

        console.error(
            "SERVER ERROR:",
            error
        );

        if (
            res.headersSent
        ) {

            return next(
                error
            );

        }

        const statusCode =
            Number(
                error.status
            ) >= 400 &&
            Number(
                error.status
            ) < 600
                ? Number(
                    error.status
                )
                : 500;

        res.status(
            statusCode
        ).json({

            success: false,

            error:
                IS_PRODUCTION
                    ? "Internal server error"
                    : error.message

        });

    }
);

/*
=========================================================
START SERVER
=========================================================
*/

const server =
    app.listen(
        PORT,
        HOST,
        () => {

            console.log(
                "================================================="
            );

            console.log(
                "              PET WORLD SERVER"
            );

            console.log(
                "================================================="
            );

            console.log(
                `Environment : ${
                    IS_PRODUCTION
                        ? "production"
                        : "development"
                }`
            );

            console.log(
                `Host        : ${HOST}`
            );

            console.log(
                `Port        : ${PORT}`
            );

            console.log(
                `Public      : ${PUBLIC_DIR}`
            );

            console.log(
                "Status      : ONLINE"
            );

            console.log(
                "================================================="
            );

        }
    );

/*
=========================================================
SERVER ERROR
=========================================================
*/

server.on(
    "error",
    error => {

        if (
            error.code ===
            "EADDRINUSE"
        ) {

            console.error(
                `Port ${PORT} is already in use.`
            );

        } else {

            console.error(
                "HTTP server error:",
                error
            );

        }

        process.exit(
            1
        );

    }
);

/*
=========================================================
GRACEFUL SHUTDOWN
=========================================================
*/

function shutdown(
    signal
) {

    console.log(
        `${signal} received. Shutting down...`
    );

    server.close(
        error => {

            if (error) {

                console.error(
                    "Shutdown error:",
                    error
                );

                process.exit(
                    1
                );

            }

            console.log(
                "PET WORLD server stopped."
            );

            process.exit(
                0
            );

        }
    );

    /*
    Force shutdown after 10 seconds
    if something refuses to close.
    */

    setTimeout(
        () => {

            console.error(
                "Forced shutdown."
            );

            process.exit(
                1
            );

        },
        10000
    ).unref();

}

process.on(
    "SIGTERM",
    () => {

        shutdown(
            "SIGTERM"
        );

    }
);

process.on(
    "SIGINT",
    () => {

        shutdown(
            "SIGINT"
        );

    }
);

/*
=========================================================
UNHANDLED ERRORS
=========================================================
*/

process.on(
    "uncaughtException",
    error => {

        console.error(
            "UNCAUGHT EXCEPTION:",
            error
        );

    }
);

process.on(
    "unhandledRejection",
    reason => {

        console.error(
            "UNHANDLED REJECTION:",
            reason
        );

    }
);

/*
=========================================================
END SERVER
=========================================================
*/
