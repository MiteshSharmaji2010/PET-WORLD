// ============================================================
// PET WORLD
// main.js
// Main Application Bootstrap / Game Launcher
// ============================================================

import { Game } from "./game.js";

// ============================================================
// GLOBAL GAME STATE
// ============================================================

let game = null;

let bootStarted = false;

let pageVisible = true;

let lastError = null;


// ============================================================
// DOM READY
// ============================================================

document.addEventListener(
    "DOMContentLoaded",
    () => {

        startApplication();

    },
    {
        once: true
    }
);


// ============================================================
// START APPLICATION
// ============================================================

async function startApplication() {

    if (bootStarted) {

        return;

    }

    bootStarted = true;


    try {

        prepareDocument();

        disableBrowserBehaviors();

        setupVisibilityHandling();

        setupGlobalErrorHandling();

        setupGlobalShortcuts();

        showLoadingScreen(
            "Loading PET WORLD..."
        );


        await waitForBrowserReady();


        updateLoadingProgress(
            20,
            "Creating game..."
        );


        game =
            new Game();


        // Global access for debugging
        // and other modules.

        window.petWorldGame =
            game;


        updateLoadingProgress(
            40,
            "Initializing world..."
        );


        await game.init();


        updateLoadingProgress(
            100,
            "PET WORLD ready!"
        );


        await sleep(
            350
        );


        hideLoadingScreen();


        console.log(
            "========================================"
        );

        console.log(
            "PET WORLD started successfully."
        );

        console.log(
            "Game object:",
            game
        );

        console.log(
            "========================================"
        );


    } catch (error) {

        lastError =
            error;


        console.error(
            "PET WORLD initialization failed:",
            error
        );


        showFatalError(
            error
        );

    }

}


// ============================================================
// PREPARE DOCUMENT
// ============================================================

function prepareDocument() {

    document.documentElement
        .style
        .margin = "0";


    document.documentElement
        .style
        .padding = "0";


    document.body
        .style
        .margin = "0";


    document.body
        .style
        .padding = "0";


    document.body
        .style
        .overflow = "hidden";


    document.body
        .style
        .width = "100vw";


    document.body
        .style
        .height = "100vh";


    document.body
        .style
        .background = "#101820";


    document.body
        .style
        .touchAction = "none";


    document.body
        .style
        .userSelect = "none";

}


// ============================================================
// BROWSER BEHAVIOUR
// ============================================================

function disableBrowserBehaviors() {

    // Prevent context menu inside game.

    document.addEventListener(
        "contextmenu",
        event => {

            if (
                event.target.closest(
                    "canvas"
                )
            ) {

                event.preventDefault();

            }

        }
    );


    // Prevent accidental drag.

    document.addEventListener(
        "dragstart",
        event => {

            if (
                event.target.closest(
                    "canvas"
                )
            ) {

                event.preventDefault();

            }

        }
    );


    // Prevent browser zoom with Ctrl + mouse wheel.

    document.addEventListener(
        "wheel",
        event => {

            if (
                event.ctrlKey
            ) {

                event.preventDefault();

            }

        },
        {
            passive: false
        }
    );


    // Prevent Ctrl +/- browser zoom.

    document.addEventListener(
        "keydown",
        event => {

            if (
                event.ctrlKey &&
                (
                    event.code ===
                    "Equal" ||

                    event.code ===
                    "Minus" ||

                    event.code ===
                    "NumpadAdd" ||

                    event.code ===
                    "NumpadSubtract"
                )
            ) {

                event.preventDefault();

            }

        }
    );

}


// ============================================================
// VISIBILITY
// ============================================================

function setupVisibilityHandling() {

    document.addEventListener(
        "visibilitychange",
        () => {

            pageVisible =
                document.visibilityState ===
                "visible";


            if (
                !game
            ) {

                return;

            }


            if (
                !pageVisible
            ) {

                pauseGameForVisibility();

            } else {

                resumeGameForVisibility();

            }

        }
    );

}


// ============================================================
// PAUSE WHEN TAB HIDDEN
// ============================================================

function pauseGameForVisibility() {

    try {

        if (
            typeof game.stop ===
            "function"
        ) {

            game.stop();

        }


        console.log(
            "PET WORLD paused."
        );


    } catch (error) {

        console.warn(
            "Could not pause game:",
            error
        );

    }

}


// ============================================================
// RESUME WHEN TAB VISIBLE
// ============================================================

function resumeGameForVisibility() {

    try {

        if (
            typeof game.start ===
            "function"
        ) {

            game.start();

        }


        console.log(
            "PET WORLD resumed."
        );


    } catch (error) {

        console.warn(
            "Could not resume game:",
            error
        );

    }

}


// ============================================================
// GLOBAL ERROR HANDLING
// ============================================================

function setupGlobalErrorHandling() {

    window.addEventListener(
        "error",
        event => {

            console.error(
                "Global error:",
                event.error ||
                event.message
            );


            if (
                !game
            ) {

                return;

            }


            // Don't destroy the running game
            // because of one non-fatal error.

            if (
                game.ui &&
                typeof game.ui.notify ===
                "function"
            ) {

                game.ui.notify(
                    "⚠️ A game error occurred."
                );

            }

        }
    );


    window.addEventListener(
        "unhandledrejection",
        event => {

            console.error(
                "Unhandled promise rejection:",
                event.reason
            );


            if (
                game &&
                game.ui &&
                typeof game.ui.notify ===
                "function"
            ) {

                game.ui.notify(
                    "⚠️ Something went wrong."
                );

            }

        }
    );

}


// ============================================================
// GLOBAL SHORTCUTS
// ============================================================

function setupGlobalShortcuts() {

    window.addEventListener(
        "keydown",
        event => {

            // Ignore shortcuts while typing.

            const target =
                event.target;


            if (
                target &&
                (
                    target.tagName ===
                    "INPUT" ||

                    target.tagName ===
                    "TEXTAREA" ||

                    target.isContentEditable
                )
            ) {

                return;

            }


            // ------------------------------------------------
            // F11
            // ------------------------------------------------

            if (
                event.code ===
                "F11"
            ) {

                event.preventDefault();

                toggleFullscreen();

            }


            // ------------------------------------------------
            // ESC
            // ------------------------------------------------

            if (
                event.code ===
                "Escape"
            ) {

                handleEscape();

            }


            // ------------------------------------------------
            // I = INVENTORY
            // ------------------------------------------------

            if (
                event.code ===
                "KeyI"
            ) {

                if (
                    game &&
                    game.ui
                ) {

                    game.ui.toggleInventory();

                }

            }


            // ------------------------------------------------
            // P = PETS
            // ------------------------------------------------

            if (
                event.code ===
                "KeyP"
            ) {

                if (
                    game &&
                    game.ui
                ) {

                    game.ui.togglePets();

                }

            }


            // ------------------------------------------------
            // M = MAP
            // ------------------------------------------------

            if (
                event.code ===
                "KeyM"
            ) {

                if (
                    game &&
                    game.ui
                ) {

                    game.ui.toggleMap();

                }

            }


            // ------------------------------------------------
            // O = SETTINGS
            // ------------------------------------------------

            if (
                event.code ===
                "KeyO"
            ) {

                if (
                    game &&
                    game.ui
                ) {

                    game.ui.toggleSettings();

                }

            }


            // ------------------------------------------------
            // F = FOOD
            // ------------------------------------------------

            if (
                event.code ===
                "KeyF"
            ) {

                if (
                    game &&
                    game.systems &&
                    game.player
                ) {

                    game.systems
                        .useHealingFood();

                }

            }

        }
    );

}


// ============================================================
// ESCAPE HANDLER
// ============================================================

function handleEscape() {

    if (
        !game
    ) {

        return;

    }


    if (
        game.ui
    ) {

        game.ui.closeAll();

    }


    if (
        document.pointerLockElement
    ) {

        try {

            document.exitPointerLock();

        } catch (error) {

            console.warn(
                "Pointer lock exit failed:",
                error
            );

        }

    }

}


// ============================================================
// FULLSCREEN
// ============================================================

async function toggleFullscreen() {

    try {

        if (
            !document.fullscreenElement
        ) {

            await document.documentElement
                .requestFullscreen();

        } else {

            await document.exitFullscreen();

        }

    } catch (error) {

        console.warn(
            "Fullscreen unavailable:",
            error
        );

    }

}


// ============================================================
// BROWSER READY
// ============================================================

async function waitForBrowserReady() {

    if (
        document.readyState ===
        "complete"
    ) {

        return;

    }


    await new Promise(
        resolve => {

            window.addEventListener(
                "load",
                resolve,
                {
                    once: true
                }
            );

        }
    );

}


// ============================================================
// LOADING SCREEN
// ============================================================

function showLoadingScreen(
    message = "Loading..."
) {

    let loading =
        document.getElementById(
            "pet-world-loading"
        );


    if (
        loading
    ) {

        loading.classList.remove(
            "hidden"
        );

        return;

    }


    loading =
        document.createElement(
            "div"
        );


    loading.id =
        "pet-world-loading";


    loading.innerHTML = `

        <div class="pet-loading-box">

            <div class="pet-loading-logo">

                🐾

            </div>

            <div class="pet-loading-title">

                PET WORLD

            </div>

            <div
                id="pet-loading-message"
                class="pet-loading-message"
            >

                ${escapeHTML(message)}

            </div>

            <div class="pet-loading-progress">

                <div
                    id="pet-loading-progress-fill"
                ></div>

            </div>

            <div
                id="pet-loading-percent"
                class="pet-loading-percent"
            >

                0%

            </div>

        </div>

    `;


    document.body.appendChild(
        loading
    );


    injectLoadingStyles();

}


// ============================================================
// UPDATE LOADING
// ============================================================

function updateLoadingProgress(
    percent,
    message
) {

    const fill =
        document.getElementById(
            "pet-loading-progress-fill"
        );


    const percentText =
        document.getElementById(
            "pet-loading-percent"
        );


    const messageText =
        document.getElementById(
            "pet-loading-message"
        );


    const safePercent =
        Math.max(
            0,
            Math.min(
                100,
                Number(percent) || 0
            )
        );


    if (
        fill
    ) {

        fill.style.width =
            `${safePercent}%`;

    }


    if (
        percentText
    ) {

        percentText.textContent =
            `${Math.round(safePercent)}%`;

    }


    if (
        messageText &&
        message
    ) {

        messageText.textContent =
            message;

    }

}


// ============================================================
// HIDE LOADING
// ============================================================

function hideLoadingScreen() {

    const loading =
        document.getElementById(
            "pet-world-loading"
        );


    if (
        !loading
    ) {

        return;

    }


    loading.classList.add(
        "hidden"
    );


    setTimeout(
        () => {

            if (
                loading &&
                loading.parentNode
            ) {

                loading.remove();

            }

        },
        500
    );

}


// ============================================================
// FATAL ERROR
// ============================================================

function showFatalError(
    error
) {

    const old =
        document.getElementById(
            "pet-world-fatal-error"
        );


    if (
        old
    ) {

        old.remove();

    }


    const box =
        document.createElement(
            "div"
        );


    box.id =
        "pet-world-fatal-error";


    const errorMessage =
        error &&
        error.message
            ? error.message
            : String(error);


    box.innerHTML = `

        <div class="pet-fatal-card">

            <div class="pet-fatal-icon">

                ⚠️

            </div>

            <h1>

                PET WORLD

            </h1>

            <h2>

                Game failed to start

            </h2>

            <p>

                ${escapeHTML(
                    errorMessage
                )}

            </p>

            <div class="pet-fatal-actions">

                <button
                    id="pet-world-retry"
                >
                    🔄 RETRY
                </button>

                <button
                    id="pet-world-reload"
                >
                    ↻ RELOAD
                </button>

            </div>

            <details>

                <summary>
                    Technical information
                </summary>

                <pre>${escapeHTML(
                    error &&
                    error.stack
                        ? error.stack
                        : String(error)
                )}</pre>

            </details>

        </div>

    `;


    document.body.appendChild(
        box
    );


    const retry =
        document.getElementById(
            "pet-world-retry"
        );


    const reload =
        document.getElementById(
            "pet-world-reload"
        );


    if (
        retry
    ) {

        retry.addEventListener(
            "click",
            () => {

                box.remove();

                bootStarted =
                    false;

                startApplication();

            }
        );

    }


    if (
        reload
    ) {

        reload.addEventListener(
            "click",
            () => {

                window.location.reload();

            }
        );

    }


    injectFatalStyles();

}


// ============================================================
// LOADING CSS
// ============================================================

function injectLoadingStyles() {

    if (
        document.getElementById(
            "pet-world-loading-style"
        )
    ) {

        return;

    }


    const style =
        document.createElement(
            "style"
        );


    style.id =
        "pet-world-loading-style";


    style.textContent = `

        #pet-world-loading {

            position: fixed;

            inset: 0;

            z-index: 100000;

            display: flex;

            align-items: center;

            justify-content: center;

            background:
                radial-gradient(
                    circle at center,
                    #203b35 0%,
                    #101820 55%,
                    #070b0e 100%
                );

            color: white;

            font-family:
                Arial,
                Helvetica,
                sans-serif;

            opacity: 1;

            transition:
                opacity 0.45s ease;

        }


        #pet-world-loading.hidden {

            opacity: 0;

            pointer-events: none;

        }


        .pet-loading-box {

            width:
                min(
                    420px,
                    82vw
                );

            text-align: center;

        }


        .pet-loading-logo {

            width: 90px;

            height: 90px;

            margin: 0 auto 18px;

            display: flex;

            align-items: center;

            justify-content: center;

            border-radius: 25px;

            background:
                rgba(
                    255,
                    255,
                    255,
                    0.08
                );

            border:
                1px solid
                rgba(
                    255,
                    255,
                    255,
                    0.14
                );

            font-size: 48px;

            box-shadow:
                0 20px 60px
                rgba(
                    0,
                    0,
                    0,
                    0.35
                );

            animation:
                petLoadingPulse
                1.6s
                ease-in-out
                infinite;

        }


        .pet-loading-title {

            font-size: 30px;

            font-weight: 900;

            letter-spacing: 5px;

            margin-bottom: 10px;

        }


        .pet-loading-message {

            min-height: 20px;

            color:
                rgba(
                    255,
                    255,
                    255,
                    0.65
                );

            font-size: 13px;

            margin-bottom: 16px;

        }


        .pet-loading-progress {

            height: 8px;

            width: 100%;

            overflow: hidden;

            border-radius: 20px;

            background:
                rgba(
                    255,
                    255,
                    255,
                    0.1
                );

        }


        #pet-loading-progress-fill {

            width: 0%;

            height: 100%;

            border-radius: 20px;

            background:
                linear-gradient(
                    90deg,
                    #67d17c,
                    #b9f6c5
                );

            transition:
                width 0.25s ease;

        }


        .pet-loading-percent {

            margin-top: 9px;

            font-size: 11px;

            color:
                rgba(
                    255,
                    255,
                    255,
                    0.5
                );

        }


        @keyframes petLoadingPulse {

            0%,
            100% {

                transform:
                    scale(1);

            }

            50% {

                transform:
                    scale(1.06);

            }

        }


        @media (
            max-width: 600px
        ) {

            .pet-loading-title {

                font-size: 24px;

                letter-spacing: 3px;

            }


            .pet-loading-logo {

                width: 75px;

                height: 75px;

                font-size: 40px;

            }

        }

    `;


    document.head.appendChild(
        style
    );

}


// ============================================================
// FATAL CSS
// ============================================================

function injectFatalStyles() {

    if (
        document.getElementById(
            "pet-world-fatal-style"
        )
    ) {

        return;

    }


    const style =
        document.createElement(
            "style"
        );


    style.id =
        "pet-world-fatal-style";


    style.textContent = `

        #pet-world-fatal-error {

            position: fixed;

            inset: 0;

            z-index: 200000;

            display: flex;

            align-items: center;

            justify-content: center;

            padding: 20px;

            box-sizing: border-box;

            background:
                rgba(
                    4,
                    7,
                    9,
                    0.96
                );

            color: white;

            font-family:
                Arial,
                Helvetica,
                sans-serif;

        }


        .pet-fatal-card {

            width:
                min(
                    620px,
                    94vw
                );

            max-height:
                90vh;

            overflow-y: auto;

            padding: 28px;

            box-sizing: border-box;

            border-radius: 20px;

            background:
                #121b20;

            border:
                1px solid
                rgba(
                    255,
                    255,
                    255,
                    0.12
                );

            box-shadow:
                0 30px 100px
                rgba(
                    0,
                    0,
                    0,
                    0.7
                );

            text-align: center;

        }


        .pet-fatal-icon {

            font-size: 48px;

            margin-bottom: 10px;

        }


        .pet-fatal-card h1 {

            margin:
                0 0 5px;

            font-size: 28px;

            letter-spacing: 3px;

        }


        .pet-fatal-card h2 {

            margin:
                0 0 15px;

            font-size: 18px;

        }


        .pet-fatal-card p {

            margin:
                0 auto 20px;

            max-width: 520px;

            line-height: 1.5;

            color:
                rgba(
                    255,
                    255,
                    255,
                    0.7
                );

            word-break: break-word;

        }


        .pet-fatal-actions {

            display: flex;

            justify-content: center;

            gap: 10px;

            margin-bottom: 20px;

        }


        .pet-fatal-actions button {

            border: 0;

            border-radius: 10px;

            padding:
                12px 18px;

            cursor: pointer;

            font-weight: 800;

        }


        #pet-world-retry {

            background: white;

            color: #111;

        }


        #pet-world-reload {

            background:
                rgba(
                    255,
                    255,
                    255,
                    0.1
                );

            color: white;

        }


        .pet-fatal-card details {

            text-align: left;

            color:
                rgba(
                    255,
                    255,
                    255,
                    0.6
                );

        }


        .pet-fatal-card pre {

            margin-top: 10px;

            padding: 12px;

            overflow: auto;

            border-radius: 10px;

            background:
                rgba(
                    0,
                    0,
                    0,
                    0.35
                );

            font-size: 11px;

            white-space: pre-wrap;

            word-break: break-word;

        }


        @media (
            max-width: 600px
        ) {

            .pet-fatal-card {

                padding: 20px;

            }


            .pet-fatal-actions {

                flex-direction: column;

            }

        }

    `;


    document.head.appendChild(
        style
    );

}


// ============================================================
// UTILITY: SLEEP
// ============================================================

function sleep(
    milliseconds
) {

    return new Promise(
        resolve => {

            setTimeout(
                resolve,
                milliseconds
            );

        }
    );

}


// ============================================================
// UTILITY: HTML ESCAPE
// ============================================================

function escapeHTML(
    value
) {

    const element =
        document.createElement(
            "div"
        );


    element.textContent =
        String(value);


    return element.innerHTML;

}


// ============================================================
// DEBUG API
// ============================================================

window.PetWorld =
    {

        getGame() {

            return game;

        },


        getLastError() {

            return lastError;

        },


        restart() {

            window.location.reload();

        },


        isRunning() {

            return Boolean(
                game &&
                game.running
            );

        },


        isPageVisible() {

            return pageVisible;

        }

    };


// ============================================================
// END OF main.js
// ============================================================
