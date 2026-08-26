"use strict";

const express = require("express");
const path = require("path");
const http = require("http");

const app = express();

const server = http.createServer(app);

const PORT =
    process.env.PORT || 3000;


// =====================================================
// SECURITY / BASIC SETTINGS
// =====================================================

app.disable("x-powered-by");


// =====================================================
// STATIC FILES
// =====================================================

const publicPath =
    path.join(
        __dirname,
        "public"
    );


app.use(
    express.static(
        publicPath,
        {
            extensions: [
                "html"
            ],

            maxAge:
                process.env.NODE_ENV ===
                "production"
                    ? "1d"
                    : 0
        }
    )
);


// =====================================================
// HEALTH CHECK
// =====================================================

app.get(
    "/health",
    (req, res) => {

        res.status(200).json({

            status:
                "ok",

            game:
                "PET WORLD",

            server:
                "running",

            time:
                new Date().toISOString()

        });

    }
);


// =====================================================
// GAME ROUTE
// =====================================================

app.get(
    "/",
    (req, res) => {

        res.sendFile(
            path.join(
                publicPath,
                "index.html"
            )
        );

    }
);


// =====================================================
// 404 HANDLER
// =====================================================

app.use(
    (req, res) => {

        res.status(404).send(
            `
            <!DOCTYPE html>

            <html>

            <head>

                <meta charset="UTF-8">

                <meta
                    name="viewport"
                    content="width=device-width,initial-scale=1"
                >

                <title>PET WORLD - 404</title>

                <style>

                    body {
                        margin: 0;
                        min-height: 100vh;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        background: #10161a;
                        color: white;
                        font-family: Arial, sans-serif;
                        text-align: center;
                    }

                    .box {
                        padding: 30px;
                    }

                    h1 {
                        font-size: 48px;
                        margin-bottom: 10px;
                    }

                    a {
                        color: #75e08a;
                        text-decoration: none;
                    }

                </style>

            </head>

            <body>

                <div class="box">

                    <h1>404</h1>

                    <p>
                        This PET WORLD page does not exist.
                    </p>

                    <a href="/">
                        Return to Game
                    </a>

                </div>

            </body>

            </html>
            `
        );

    }
);


// =====================================================
// ERROR HANDLER
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

            return next(
                error
            );

        }


        res.status(500).json({

            error:
                "Internal server error",

            message:
                process.env.NODE_ENV ===
                "production"
                    ? "Something went wrong."
                    : error.message

        });

    }
);


// =====================================================
// START SERVER
// =====================================================

server.listen(
    PORT,
    () => {

        console.log("");
        console.log(
            "======================================"
        );

        console.log(
            "        PET WORLD SERVER"
        );

        console.log(
            "======================================"
        );

        console.log(
            `Game: http://localhost:${PORT}`
        );

        console.log(
            `Health: http://localhost:${PORT}/health`
        );

        console.log(
            `Environment: ${
                process.env.NODE_ENV ||
                "development"
            }`
        );

        console.log(
            "======================================"
        );

        console.log("");

    }
);


// =====================================================
// SERVER ERROR
// =====================================================

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

            console.error(
                "Close the other server or use another PORT."
            );

        } else {

            console.error(
                "Server startup error:",
                error
            );

        }


        process.exit(
            1
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
        `${signal} received. Shutting down...`
    );


    server.close(
        () => {

            console.log(
                "Server stopped."
            );

            process.exit(
                0
            );

        }
    );


    setTimeout(
        () => {

            process.exit(
                1
            );

        },
        5000
    );

}


process.on(
    "SIGINT",
    () => {

        shutdown(
            "SIGINT"
        );

    }
);


process.on(
    "SIGTERM",
    () => {

        shutdown(
            "SIGTERM"
        );

    }
);
