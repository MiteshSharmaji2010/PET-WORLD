// ============================================================
// PET WORLD
// mobile.js
// Complete Mobile Controls System
// ============================================================

export class MobileControls {

    constructor(game) {

        this.game = game;

        // ----------------------------------------------------
        // STATE
        // ----------------------------------------------------

        this.enabled = false;

        this.initialized = false;

        this.visible = false;

        this.destroyed = false;


        // ----------------------------------------------------
        // JOYSTICK
        // ----------------------------------------------------

        this.joystick = null;

        this.joystickBase = null;

        this.joystickStick = null;

        this.joystickTouchId = null;

        this.joystickCenter = {
            x: 0,
            y: 0
        };

        this.joystickRadius = 55;


        // ----------------------------------------------------
        // CAMERA TOUCH
        // ----------------------------------------------------

        this.cameraTouchId = null;

        this.lastCameraX = 0;

        this.lastCameraY = 0;

        this.cameraSensitivity = 0.005;


        // ----------------------------------------------------
        // BUTTONS
        // ----------------------------------------------------

        this.runButton = null;

        this.jumpButton = null;

        this.attackButton = null;

        this.captureButton = null;

        this.foodButton = null;


        // ----------------------------------------------------
        // RUN STATE
        // ----------------------------------------------------

        this.running = false;


        // ----------------------------------------------------
        // TOUCH TRACKING
        // ----------------------------------------------------

        this.touches = new Map();


        // ----------------------------------------------------
        // RESIZE
        // ----------------------------------------------------

        this.lastWidth =
            window.innerWidth;

        this.lastHeight =
            window.innerHeight;


        // ----------------------------------------------------
        // BOUND HANDLERS
        // ----------------------------------------------------

        this.handleResize =
            this.handleResize.bind(this);

        this.handleOrientation =
            this.handleOrientation.bind(this);

    }


    // ========================================================
    // INITIALIZE
    // ========================================================

    init() {

        if (
            this.initialized ||
            this.destroyed
        ) {

            return;

        }


        this.createStyles();

        this.createControls();

        this.bindEvents();

        this.detectDevice();

        this.resize();

        this.initialized = true;

    }


    // ========================================================
    // DEVICE DETECTION
    // ========================================================

    detectDevice() {

        const touchDevice =
            (
                "ontouchstart" in window
            ) ||
            (
                navigator.maxTouchPoints > 0
            );


        const smallScreen =
            window.innerWidth <= 900;


        this.enabled =
            touchDevice ||
            smallScreen;


        this.setVisible(
            this.enabled
        );

    }


    // ========================================================
    // CREATE CONTROLS
    // ========================================================

    createControls() {

        if (
            document.getElementById(
                "pet-world-mobile-controls"
            )
        ) {

            this.joystick =
                document.getElementById(
                    "mobile-joystick"
                );

            this.joystickBase =
                document.getElementById(
                    "mobile-joystick-base"
                );

            this.joystickStick =
                document.getElementById(
                    "mobile-joystick-stick"
                );

            this.runButton =
                document.getElementById(
                    "mobile-run-button"
                );

            this.jumpButton =
                document.getElementById(
                    "mobile-jump-button"
                );

            this.attackButton =
                document.getElementById(
                    "mobile-attack-button"
                );

            this.captureButton =
                document.getElementById(
                    "mobile-capture-button"
                );

            this.foodButton =
                document.getElementById(
                    "mobile-food-button"
                );

            return;

        }


        const container =
            document.createElement(
                "div"
            );


        container.id =
            "pet-world-mobile-controls";


        container.innerHTML = `

            <!-- =========================================
                 LEFT JOYSTICK
            ========================================== -->

            <div
                id="mobile-joystick"
                class="mobile-joystick"
            >

                <div
                    id="mobile-joystick-base"
                    class="mobile-joystick-base"
                >

                    <div
                        id="mobile-joystick-stick"
                        class="mobile-joystick-stick"
                    ></div>

                </div>

            </div>


            <!-- =========================================
                 RIGHT ACTION AREA
            ========================================== -->

            <div
                id="mobile-action-controls"
                class="mobile-action-controls"
            >

                <button
                    id="mobile-jump-button"
                    class="mobile-action-button jump-button"
                    type="button"
                    aria-label="Jump"
                >
                    🦘
                    <span>JUMP</span>
                </button>


                <button
                    id="mobile-attack-button"
                    class="mobile-action-button attack-button"
                    type="button"
                    aria-label="Attack"
                >
                    ⚔️
                    <span>ATTACK</span>
                </button>


                <button
                    id="mobile-capture-button"
                    class="mobile-action-button capture-button"
                    type="button"
                    aria-label="Capture"
                >
                    🔵
                    <span>PET</span>
                </button>


                <button
                    id="mobile-food-button"
                    class="mobile-action-button food-button"
                    type="button"
                    aria-label="Eat"
                >
                    🍖
                    <span>EAT</span>
                </button>


                <button
                    id="mobile-run-button"
                    class="mobile-action-button run-button"
                    type="button"
                    aria-label="Run"
                >
                    🏃
                    <span>RUN</span>
                </button>

            </div>


            <!-- =========================================
                 CAMERA HELP
            ========================================== -->

            <div
                id="mobile-camera-hint"
                class="mobile-camera-hint"
            >
                Drag screen to look around
            </div>

        `;


        document.body.appendChild(
            container
        );


        this.joystick =
            document.getElementById(
                "mobile-joystick"
            );


        this.joystickBase =
            document.getElementById(
                "mobile-joystick-base"
            );


        this.joystickStick =
            document.getElementById(
                "mobile-joystick-stick"
            );


        this.runButton =
            document.getElementById(
                "mobile-run-button"
            );


        this.jumpButton =
            document.getElementById(
                "mobile-jump-button"
            );


        this.attackButton =
            document.getElementById(
                "mobile-attack-button"
            );


        this.captureButton =
            document.getElementById(
                "mobile-capture-button"
            );


        this.foodButton =
            document.getElementById(
                "mobile-food-button"
            );

    }


    // ========================================================
    // STYLES
    // ========================================================

    createStyles() {

        if (
            document.getElementById(
                "pet-world-mobile-style"
            )
        ) {

            return;

        }


        const style =
            document.createElement(
                "style"
            );


        style.id =
            "pet-world-mobile-style";


        style.textContent = `

            #pet-world-mobile-controls {

                position: fixed;

                inset: 0;

                z-index: 1200;

                pointer-events: none;

                user-select: none;

                -webkit-user-select: none;

                -webkit-touch-callout: none;

                touch-action: none;

                font-family:
                    Arial,
                    Helvetica,
                    sans-serif;

            }


            /* =========================================
               JOYSTICK
            ========================================== */

            .mobile-joystick {

                position: absolute;

                left: 25px;

                bottom:
                    max(
                        35px,
                        env(
                            safe-area-inset-bottom
                        )
                    );

                width: 150px;

                height: 150px;

                pointer-events: auto;

                touch-action: none;

            }


            .mobile-joystick-base {

                position: absolute;

                left: 50%;

                top: 50%;

                width: 130px;

                height: 130px;

                transform:
                    translate(
                        -50%,
                        -50%
                    );

                border-radius: 50%;

                background:
                    rgba(
                        10,
                        18,
                        24,
                        0.42
                    );

                border:
                    2px solid
                    rgba(
                        255,
                        255,
                        255,
                        0.20
                    );

                box-shadow:
                    inset
                    0 0 25px
                    rgba(
                        0,
                        0,
                        0,
                        0.25
                    ),
                    0 8px 25px
                    rgba(
                        0,
                        0,
                        0,
                        0.25
                    );

                backdrop-filter:
                    blur(4px);

            }


            .mobile-joystick-base::before {

                content: "";

                position: absolute;

                left: 50%;

                top: 50%;

                width: 82px;

                height: 82px;

                transform:
                    translate(
                        -50%,
                        -50%
                    );

                border-radius: 50%;

                border:
                    1px solid
                    rgba(
                        255,
                        255,
                        255,
                        0.10
                    );

            }


            .mobile-joystick-stick {

                position: absolute;

                left: 50%;

                top: 50%;

                width: 58px;

                height: 58px;

                transform:
                    translate(
                        -50%,
                        -50%
                    );

                border-radius: 50%;

                background:
                    rgba(
                        255,
                        255,
                        255,
                        0.82
                    );

                border:
                    2px solid
                    rgba(
                        255,
                        255,
                        255,
                        0.90
                    );

                box-shadow:
                    0 5px 18px
                    rgba(
                        0,
                        0,
                        0,
                        0.35
                    );

                transition:
                    background 0.1s;

            }


            .mobile-joystick.active
            .mobile-joystick-stick {

                background:
                    rgba(
                        255,
                        255,
                        255,
                        0.95
                    );

            }


            /* =========================================
               ACTION BUTTONS
            ========================================== */

            .mobile-action-controls {

                position: absolute;

                right: 20px;

                bottom:
                    max(
                        30px,
                        env(
                            safe-area-inset-bottom
                        )
                    );

                width: 210px;

                height: 230px;

                pointer-events: none;

            }


            .mobile-action-button {

                position: absolute;

                width: 62px;

                height: 62px;

                padding: 0;

                border-radius: 50%;

                border:
                    2px solid
                    rgba(
                        255,
                        255,
                        255,
                        0.18
                    );

                background:
                    rgba(
                        8,
                        15,
                        20,
                        0.72
                    );

                color: white;

                display: flex;

                flex-direction: column;

                justify-content: center;

                align-items: center;

                gap: 1px;

                font-size: 23px;

                font-weight: 800;

                box-shadow:
                    0 7px 20px
                    rgba(
                        0,
                        0,
                        0,
                        0.30
                    );

                pointer-events: auto;

                touch-action: manipulation;

                -webkit-tap-highlight-color:
                    transparent;

                user-select: none;

            }


            .mobile-action-button span {

                font-size: 7px;

                letter-spacing:
                    0.5px;

                opacity: 0.85;

            }


            .mobile-action-button:active {

                transform:
                    scale(
                        0.90
                    );

                background:
                    rgba(
                        255,
                        255,
                        255,
                        0.25
                    );

            }


            /* ATTACK */

            .attack-button {

                right: 0;

                top: 80px;

                width: 78px;

                height: 78px;

                font-size: 29px;

            }


            /* JUMP */

            .jump-button {

                right: 88px;

                top: 20px;

            }


            /* CAPTURE */

            .capture-button {

                right: 95px;

                top: 115px;

            }


            /* FOOD */

            .food-button {

                right: 20px;

                top: 170px;

            }


            /* RUN */

            .run-button {

                right: 115px;

                top: 175px;

            }


            .run-button.running {

                background:
                    rgba(
                        70,
                        150,
                        90,
                        0.75
                    );

                border-color:
                    rgba(
                        130,
                        255,
                        150,
                        0.75
                    );

                transform:
                    scale(
                        1.05
                    );

            }


            /* =========================================
               CAMERA HINT
            ========================================== */

            .mobile-camera-hint {

                position: absolute;

                left: 50%;

                top: 78px;

                transform:
                    translateX(-50%);

                padding:
                    7px 13px;

                border-radius:
                    20px;

                background:
                    rgba(
                        0,
                        0,
                        0,
                        0.42
                    );

                color:
                    rgba(
                        255,
                        255,
                        255,
                        0.72
                    );

                font-size: 10px;

                pointer-events: none;

                opacity: 0;

                transition:
                    opacity 0.4s;

            }


            .mobile-camera-hint.show {

                opacity: 1;

            }


            /* =========================================
               HORIZONTAL PHONE
            ========================================== */

            @media (
                orientation: landscape
            ) and (
                max-height: 600px
            ) {

                .mobile-joystick {

                    left: 20px;

                    bottom: 15px;

                    width: 125px;

                    height: 125px;

                }


                .mobile-joystick-base {

                    width: 110px;

                    height: 110px;

                }


                .mobile-joystick-stick {

                    width: 50px;

                    height: 50px;

                }


                .mobile-action-controls {

                    right: 15px;

                    bottom: 12px;

                    transform:
                        scale(
                            0.85
                        );

                    transform-origin:
                        bottom right;

                }


                .mobile-camera-hint {

                    top: 15px;

                }

            }


            /* =========================================
               SMALL PHONES
            ========================================== */

            @media (
                max-width: 420px
            ) {

                .mobile-joystick {

                    left: 12px;

                    bottom: 20px;

                    transform:
                        scale(
                            0.88
                        );

                    transform-origin:
                        bottom left;

                }


                .mobile-action-controls {

                    right: 8px;

                    bottom: 15px;

                    transform:
                        scale(
                            0.88
                        );

                    transform-origin:
                        bottom right;

                }

            }


            /* =========================================
               TABLETS
            ========================================== */

            @media (
                min-width: 700px
            ) {

                .mobile-joystick {

                    left: 35px;

                    bottom: 35px;

                }


                .mobile-action-controls {

                    right: 35px;

                    bottom: 35px;

                }

            }


            /* =========================================
               DESKTOP
            ========================================== */

            @media (
                min-width: 901px
            ) {

                #pet-world-mobile-controls {

                    display: none !important;

                }

            }

        `;


        document.head.appendChild(
            style
        );

    }


    // ========================================================
    // EVENTS
    // ========================================================

    bindEvents() {

        if (
            !this.joystickBase
        ) {

            return;

        }


        // ----------------------------------------------------
        // JOYSTICK
        // ----------------------------------------------------

        this.joystickBase.addEventListener(
            "touchstart",
            event => {

                this.handleJoystickStart(
                    event
                );

            },
            {
                passive: false
            }
        );


        this.joystickBase.addEventListener(
            "touchmove",
            event => {

                this.handleJoystickMove(
                    event
                );

            },
            {
                passive: false
            }
        );


        this.joystickBase.addEventListener(
            "touchend",
            event => {

                this.handleJoystickEnd(
                    event
                );

            },
            {
                passive: false
            }
        );


        this.joystickBase.addEventListener(
            "touchcancel",
            event => {

                this.handleJoystickEnd(
                    event
                );

            },
            {
                passive: false
            }
        );


        // ----------------------------------------------------
        // ACTION BUTTONS
        // ----------------------------------------------------

        this.bindButton(
            this.jumpButton,
            () => {

                this.jump();

            }
        );


        this.bindButton(
            this.attackButton,
            () => {

                this.attack();

            }
        );


        this.bindButton(
            this.captureButton,
            () => {

                this.capture();

            }
        );


        this.bindButton(
            this.foodButton,
            () => {

                this.eat();

            }
        );


        // ----------------------------------------------------
        // RUN BUTTON
        // ----------------------------------------------------

        if (
            this.runButton
        ) {

            this.runButton.addEventListener(
                "touchstart",
                event => {

                    event.preventDefault();

                    this.setRun(
                        true
                    );

                },
                {
                    passive: false
                }
            );


            this.runButton.addEventListener(
                "touchend",
                event => {

                    event.preventDefault();

                    this.setRun(
                        false
                    );

                },
                {
                    passive: false
                }
            );


            this.runButton.addEventListener(
                "touchcancel",
                event => {

                    event.preventDefault();

                    this.setRun(
                        false
                    );

                },
                {
                    passive: false
                }
            );


            this.runButton.addEventListener(
                "mousedown",
                event => {

                    event.preventDefault();

                    this.setRun(
                        true
                    );

                }
            );


            this.runButton.addEventListener(
                "mouseup",
                event => {

                    event.preventDefault();

                    this.setRun(
                        false
                    );

                }
            );


            this.runButton.addEventListener(
                "mouseleave",
                () => {

                    if (
                        this.running
                    ) {

                        this.setRun(
                            false
                        );

                    }

                }
            );

        }


        // ----------------------------------------------------
        // CAMERA
        // ----------------------------------------------------

        window.addEventListener(
            "touchstart",
            event => {

                this.handleCameraStart(
                    event
                );

            },
            {
                passive: false
            }
        );


        window.addEventListener(
            "touchmove",
            event => {

                this.handleCameraMove(
                    event
                );

            },
            {
                passive: false
            }
        );


        window.addEventListener(
            "touchend",
            event => {

                this.handleCameraEnd(
                    event
                );

            },
            {
                passive: false
            }
        );


        window.addEventListener(
            "touchcancel",
            event => {

                this.handleCameraEnd(
                    event
                );

            },
            {
                passive: false
            }
        );


        // ----------------------------------------------------
        // RESIZE
        // ----------------------------------------------------

        window.addEventListener(
            "resize",
            this.handleResize
        );


        window.addEventListener(
            "orientationchange",
            this.handleOrientation
        );

    }


    // ========================================================
    // BUTTON BIND
    // ========================================================

    bindButton(
        button,
        callback
    ) {

        if (
            !button ||
            typeof callback !==
            "function"
        ) {

            return;

        }


        button.addEventListener(
            "touchstart",
            event => {

                event.preventDefault();

                callback();

            },
            {
                passive: false
            }
        );


        button.addEventListener(
            "click",
            event => {

                event.preventDefault();

                callback();

            }
        );

    }


    // ========================================================
    // JOYSTICK START
    // ========================================================

    handleJoystickStart(
        event
    ) {

        event.preventDefault();


        if (
            this.joystickTouchId !==
            null
        ) {

            return;

        }


        const touch =
            event.changedTouches[0];


        if (
            !touch
        ) {

            return;

        }


        this.joystickTouchId =
            touch.identifier;


        this.calculateJoystickCenter();


        this.joystick.classList.add(
            "active"
        );


        this.updateJoystick(
            touch.clientX,
            touch.clientY
        );

    }


    // ========================================================
    // JOYSTICK MOVE
    // ========================================================

    handleJoystickMove(
        event
    ) {

        event.preventDefault();


        if (
            this.joystickTouchId ===
            null
        ) {

            return;

        }


        for (
            const touch of
            event.changedTouches
        ) {

            if (
                touch.identifier !==
                this.joystickTouchId
            ) {

                continue;

            }


            this.updateJoystick(
                touch.clientX,
                touch.clientY
            );

            break;

        }

    }


    // ========================================================
    // JOYSTICK END
    // ========================================================

    handleJoystickEnd(
        event
    ) {

        event.preventDefault();


        if (
            this.joystickTouchId ===
            null
        ) {

            return;

        }


        for (
            const touch of
            event.changedTouches
        ) {

            if (
                touch.identifier !==
                this.joystickTouchId
            ) {

                continue;

            }


            this.joystickTouchId =
                null;


            this.resetJoystick();

            break;

        }

    }


    // ========================================================
    // CALCULATE JOYSTICK CENTER
    // ========================================================

    calculateJoystickCenter() {

        if (
            !this.joystickBase
        ) {

            return;

        }


        const rect =
            this.joystickBase
                .getBoundingClientRect();


        this.joystickCenter.x =
            rect.left +
            rect.width / 2;


        this.joystickCenter.y =
            rect.top +
            rect.height / 2;


        this.joystickRadius =
            Math.max(
                20,
                (
                    Math.min(
                        rect.width,
                        rect.height
                    ) / 2
                ) - 25
            );

    }


    // ========================================================
    // UPDATE JOYSTICK
    // ========================================================

    updateJoystick(
        clientX,
        clientY
    ) {

        if (
            !this.game ||
            !this.game.player
        ) {

            return;

        }


        const dx =
            clientX -
            this.joystickCenter.x;


        const dy =
            clientY -
            this.joystickCenter.y;


        const distance =
            Math.sqrt(
                dx * dx +
                dy * dy
            );


        let finalX =
            dx;


        let finalY =
            dy;


        if (
            distance >
            this.joystickRadius
        ) {

            const ratio =
                this.joystickRadius /
                distance;


            finalX *= ratio;

            finalY *= ratio;

        }


        const normalizedX =
            finalX /
            this.joystickRadius;


        const normalizedY =
            finalY /
            this.joystickRadius;


        const clampedX =
            Math.max(
                -1,
                Math.min(
                    1,
                    normalizedX
                )
            );


        const clampedY =
            Math.max(
                -1,
                Math.min(
                    1,
                    normalizedY
                )
            );


        this.game.player.setMoveInput(
            clampedX,
            -clampedY
        );


        if (
            this.joystickStick
        ) {

            this.joystickStick.style.transform =
                `
                    translate(
                        calc(-50% + ${finalX}px),
                        calc(-50% + ${finalY}px)
                    )
                `;

        }

    }


    // ========================================================
    // RESET JOYSTICK
    // ========================================================

    resetJoystick() {

        if (
            this.game &&
            this.game.player
        ) {

            this.game.player.setMoveInput(
                0,
                0
            );

        }


        if (
            this.joystickStick
        ) {

            this.joystickStick.style.transform =
                "translate(-50%, -50%)";

        }


        if (
            this.joystick
        ) {

            this.joystick.classList.remove(
                "active"
            );

        }

    }


    // ========================================================
    // CAMERA TOUCH START
    // ========================================================

    handleCameraStart(
        event
    ) {

        if (
            !this.enabled
        ) {

            return;

        }


        for (
            const touch of
            event.changedTouches
        ) {

            if (
                this.isControlElement(
                    touch.target
                )
            ) {

                continue;

            }


            if (
                this.cameraTouchId !==
                null
            ) {

                continue;

            }


            this.cameraTouchId =
                touch.identifier;


            this.lastCameraX =
                touch.clientX;


            this.lastCameraY =
                touch.clientY;


            this.showCameraHint(
                false
            );


            break;

        }

    }


    // ========================================================
    // CAMERA TOUCH MOVE
    // ========================================================

    handleCameraMove(
        event
    ) {

        if (
            !this.enabled ||
            this.cameraTouchId ===
            null
        ) {

            return;

        }


        for (
            const touch of
            event.changedTouches
        ) {

            if (
                touch.identifier !==
                this.cameraTouchId
            ) {

                continue;

            }


            const dx =
                touch.clientX -
                this.lastCameraX;


            const dy =
                touch.clientY -
                this.lastCameraY;


            this.lastCameraX =
                touch.clientX;


            this.lastCameraY =
                touch.clientY;


            this.rotateCamera(
                dx,
                dy
            );


            break;

        }

    }


    // ========================================================
    // CAMERA TOUCH END
    // ========================================================

    handleCameraEnd(
        event
    ) {

        if (
            this.cameraTouchId ===
            null
        ) {

            return;

        }


        for (
            const touch of
            event.changedTouches
        ) {

            if (
                touch.identifier !==
                this.cameraTouchId
            ) {

                continue;

            }


            this.cameraTouchId =
                null;

            break;

        }

    }


    // ========================================================
    // ROTATE CAMERA
    // ========================================================

    rotateCamera(
        dx,
        dy
    ) {

        if (
            !this.game ||
            !this.game.player
        ) {

            return;

        }


        const player =
            this.game.player;


        player.yaw -=
            dx *
            this.cameraSensitivity;


        player.pitch -=
            dy *
            this.cameraSensitivity;


        player.pitch =
            Math.max(
                -0.9,
                Math.min(
                    0.4,
                    player.pitch
                )
            );

    }


    // ========================================================
    // JUMP
    // ========================================================

    jump() {

        if (
            !this.game ||
            !this.game.player
        ) {

            return;

        }


        const success =
            this.game.player.jump();


        if (
            success &&
            this.game.ui
        ) {

            this.game.ui.notify(
                "🦘 Jump!"
            );

        }

    }


    // ========================================================
    // ATTACK
    // ========================================================

    attack() {

        if (
            !this.game ||
            typeof this.game.attack !==
            "function"
        ) {

            return;

        }


        this.game.attack();

    }


    // ========================================================
    // CAPTURE
    // ========================================================

    capture() {

        if (
            !this.game ||
            !this.game.systems
        ) {

            return;

        }


        if (
            typeof
            this.game.systems
                .captureNearestCreature ===
            "function"
        ) {

            this.game.systems
                .captureNearestCreature();

            return;

        }


        if (
            this.game.ui
        ) {

            this.game.ui.notify(
                "Capture system unavailable."
            );

        }

    }


    // ========================================================
    // EAT
    // ========================================================

    eat() {

        if (
            !this.game ||
            !this.game.player
        ) {

            return;

        }


        if (
            typeof this.game.player.eat ===
            "function"
        ) {

            this.game.player.eat();

            return;

        }


        if (
            this.game.systems &&
            typeof
            this.game.systems
                .useHealingFood ===
            "function"
        ) {

            this.game.systems
                .useHealingFood();

        }

    }


    // ========================================================
    // RUN
    // ========================================================

    setRun(
        state
    ) {

        this.running =
            Boolean(state);


        if (
            this.game &&
            this.game.player
        ) {

            if (
                typeof
                this.game.player
                    .setRunning ===
                "function"
            ) {

                this.game.player
                    .setRunning(
                        this.running
                    );

            } else {

                this.game.player.running =
                    this.running;

            }

        }


        if (
            this.runButton
        ) {

            this.runButton.classList.toggle(
                "running",
                this.running
            );

        }

    }


    // ========================================================
    // UPDATE
    // ========================================================

    update() {

        if (
            !this.initialized ||
            !this.enabled
        ) {

            return;

        }


        if (
            !this.game ||
            !this.game.player
        ) {

            return;

        }


        // ----------------------------------------------------
        // Safety: reset movement if player is dead.
        // ----------------------------------------------------

        if (
            this.game.player.dead
        ) {

            this.resetJoystick();

            this.setRun(
                false
            );

        }

    }


    // ========================================================
    // RESIZE
    // ========================================================

    resize() {

        if (
            !this.initialized
        ) {

            return;

        }


        this.lastWidth =
            window.innerWidth;


        this.lastHeight =
            window.innerHeight;


        this.detectDevice();


        if (
            this.joystickTouchId ===
            null
        ) {

            this.calculateJoystickCenter();

        }

    }


    // ========================================================
    // RESIZE EVENT
    // ========================================================

    handleResize() {

        this.resize();

    }


    // ========================================================
    // ORIENTATION
    // ========================================================

    handleOrientation() {

        setTimeout(
            () => {

                this.resize();

            },
            150
        );

    }


    // ========================================================
    // VISIBILITY
    // ========================================================

    setVisible(
        visible
    ) {

        this.visible =
            Boolean(visible);


        const container =
            document.getElementById(
                "pet-world-mobile-controls"
            );


        if (
            !container
        ) {

            return;

        }


        container.style.display =
            this.visible
                ? "block"
                : "none";

    }


    // ========================================================
    // CONTROL ELEMENT CHECK
    // ========================================================

    isControlElement(
        element
    ) {

        if (
            !element
        ) {

            return false;

        }


        if (
            element.closest
        ) {

            return Boolean(
                element.closest(
                    "#pet-world-mobile-controls"
                )
            );

        }


        return false;

    }


    // ========================================================
    // CAMERA HINT
    // ========================================================

    showCameraHint(
        show
    ) {

        const hint =
            document.getElementById(
                "mobile-camera-hint"
            );


        if (
            !hint
        ) {

            return;

        }


        hint.classList.toggle(
            "show",
            Boolean(show)
        );

    }


    // ========================================================
    // ENABLE
    // ========================================================

    enable() {

        this.enabled =
            true;

        this.setVisible(
            true
        );

    }


    // ========================================================
    // DISABLE
    // ========================================================

    disable() {

        this.enabled =
            false;


        this.resetJoystick();

        this.setRun(
            false
        );


        this.setVisible(
            false
        );

    }


    // ========================================================
    // DESTROY
    // ========================================================

    destroy() {

        if (
            this.destroyed
        ) {

            return;

        }


        this.resetJoystick();

        this.setRun(
            false
        );


        window.removeEventListener(
            "resize",
            this.handleResize
        );


        window.removeEventListener(
            "orientationchange",
            this.handleOrientation
        );


        const container =
            document.getElementById(
                "pet-world-mobile-controls"
            );


        if (
            container
        ) {

            container.remove();

        }


        const style =
            document.getElementById(
                "pet-world-mobile-style"
            );


        if (
            style
        ) {

            style.remove();

        }


        this.destroyed =
            true;

        this.initialized =
            false;

        this.enabled =
            false;

    }

}
