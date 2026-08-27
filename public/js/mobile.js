export class MobileControls {

    constructor(game) {

        this.game = game;

        this.enabled = this.isMobile();

        this.joystick = null;

        this.joystickActive = false;

        this.joystickPointerId = null;

        this.joystickCenter = {
            x: 0,
            y: 0
        };

        this.maxJoystickDistance = 55;

        this.buttons = {};

        this.touchLook = {
            active: false,
            pointerId: null,
            lastX: 0,
            lastY: 0
        };

        this.lookSensitivity = 0.005;

    }


    // =================================================
    // INITIALIZE
    // =================================================

    async init() {

        this.createControls();

        this.bindEvents();

        this.updateVisibility();

    }


    // =================================================
    // MOBILE DETECTION
    // =================================================

    isMobile() {

        return (
            window.matchMedia(
                "(pointer: coarse)"
            ).matches
            ||
            "ontouchstart" in window
            ||
            navigator.maxTouchPoints > 0
        );

    }


    // =================================================
    // CREATE CONTROLS
    // =================================================

    createControls() {

        if (
            document.getElementById(
                "mobile-controls"
            )
        ) {

            return;

        }


        const container =
            document.createElement(
                "div"
            );


        container.id =
            "mobile-controls";


        container.innerHTML = `

            <div
                id="mobile-joystick"
                class="mobile-joystick"
            >

                <div
                    id="joystick-stick"
                    class="joystick-stick"
                ></div>

            </div>


            <div
                id="mobile-actions"
                class="mobile-actions"
            >

                <button
                    id="mobile-attack"
                    class="mobile-action attack"
                    type="button"
                >
                    ⚔️
                </button>


                <button
                    id="mobile-capture"
                    class="mobile-action capture"
                    type="button"
                >
                    🎯
                </button>


                <button
                    id="mobile-jump"
                    class="mobile-action jump"
                    type="button"
                >
                    ↑
                </button>


                <button
                    id="mobile-run"
                    class="mobile-action run"
                    type="button"
                >
                    🏃
                </button>

            </div>

        `;


        document.body.appendChild(
            container
        );


        this.injectStyles();


        this.joystick =
            document.getElementById(
                "mobile-joystick"
            );


        this.joystickStick =
            document.getElementById(
                "joystick-stick"
            );


        this.buttons.attack =
            document.getElementById(
                "mobile-attack"
            );


        this.buttons.capture =
            document.getElementById(
                "mobile-capture"
            );


        this.buttons.jump =
            document.getElementById(
                "mobile-jump"
            );


        this.buttons.run =
            document.getElementById(
                "mobile-run"
            );

    }


    // =================================================
    // EVENTS
    // =================================================

    bindEvents() {

        if (
            !this.joystick
        ) {

            return;

        }


        // ---------------------------------------------
        // JOYSTICK
        // ---------------------------------------------

        this.joystick.addEventListener(
            "pointerdown",
            event => {

                event.preventDefault();

                this.joystickActive =
                    true;

                this.joystickPointerId =
                    event.pointerId;

                this.joystickCenter =
                    this.getJoystickCenter();

                this.joystick.setPointerCapture(
                    event.pointerId
                );


                this.updateJoystick(
                    event
                );

            }
        );


        this.joystick.addEventListener(
            "pointermove",
            event => {

                if (
                    !this.joystickActive
                ) {

                    return;

                }


                if (
                    event.pointerId !==
                    this.joystickPointerId
                ) {

                    return;

                }


                event.preventDefault();

                this.updateJoystick(
                    event
                );

            }
        );


        this.joystick.addEventListener(
            "pointerup",
            event => {

                if (
                    event.pointerId !==
                    this.joystickPointerId
                ) {

                    return;

                }


                this.resetJoystick();

            }
        );


        this.joystick.addEventListener(
            "pointercancel",
            event => {

                if (
                    event.pointerId !==
                    this.joystickPointerId
                ) {

                    return;

                }


                this.resetJoystick();

            }
        );


        // ---------------------------------------------
        // JUMP
        // ---------------------------------------------

        this.bindButton(
            this.buttons.jump,
            () => {

                if (
                    this.game.player &&
                    typeof
                    this.game.player.jump ===
                    "function"
                ) {

                    this.game.player.jump();

                }

            }
        );


        // ---------------------------------------------
        // RUN
        // ---------------------------------------------

        this.buttons.run.addEventListener(
            "pointerdown",
            event => {

                event.preventDefault();

                this.setRunning(
                    true
                );

            }
        );


        this.buttons.run.addEventListener(
            "pointerup",
            event => {

                event.preventDefault();

                this.setRunning(
                    false
                );

            }
        );


        this.buttons.run.addEventListener(
            "pointercancel",
            () => {

                this.setRunning(
                    false
                );

            }
        );


        this.buttons.run.addEventListener(
            "pointerleave",
            () => {

                this.setRunning(
                    false
                );

            }
        );


        // ---------------------------------------------
        // ATTACK
        // ---------------------------------------------

        this.bindButton(
            this.buttons.attack,
            () => {

                this.attack();

            }
        );


        // ---------------------------------------------
        // CAPTURE
        // ---------------------------------------------

        this.bindButton(
            this.buttons.capture,
            () => {

                this.capture();

            }
        );


        // ---------------------------------------------
        // TOUCH CAMERA
        // ---------------------------------------------

        window.addEventListener(
            "pointerdown",
            event => {

                if (
                    event.target.closest(
                        "#mobile-controls"
                    )
                ) {

                    return;

                }


                if (
                    event.target.closest(
                        "#game-top-buttons"
                    )
                ) {

                    return;

                }


                this.touchLook.active =
                    true;

                this.touchLook.pointerId =
                    event.pointerId;

                this.touchLook.lastX =
                    event.clientX;

                this.touchLook.lastY =
                    event.clientY;

            }
        );


        window.addEventListener(
            "pointermove",
            event => {

                if (
                    !this.touchLook.active
                ) {

                    return;

                }


                if (
                    event.pointerId !==
                    this.touchLook.pointerId
                ) {

                    return;

                }


                const dx =
                    event.clientX -
                    this.touchLook.lastX;


                const dy =
                    event.clientY -
                    this.touchLook.lastY;


                this.touchLook.lastX =
                    event.clientX;


                this.touchLook.lastY =
                    event.clientY;


                this.rotateCamera(
                    dx,
                    dy
                );

            }
        );


        window.addEventListener(
            "pointerup",
            event => {

                if (
                    event.pointerId ===
                    this.touchLook.pointerId
                ) {

                    this.touchLook.active =
                        false;

                    this.touchLook.pointerId =
                        null;

                }

            }
        );


        window.addEventListener(
            "pointercancel",
            event => {

                if (
                    event.pointerId ===
                    this.touchLook.pointerId
                ) {

                    this.touchLook.active =
                        false;

                    this.touchLook.pointerId =
                        null;

                }

            }
        );


        // ---------------------------------------------
        // SCREEN ORIENTATION
        // ---------------------------------------------

        window.addEventListener(
            "resize",
            () => {

                this.updateVisibility();

            }
        );

    }


    // =================================================
    // BUTTON HELPER
    // =================================================

    bindButton(
        button,
        callback
    ) {

        if (
            !button
        ) {

            return;

        }


        button.addEventListener(
            "pointerdown",
            event => {

                event.preventDefault();

                callback();

            }
        );

    }


    // =================================================
    // JOYSTICK CENTER
    // =================================================

    getJoystickCenter() {

        const rect =
            this.joystick.getBoundingClientRect();


        return {

            x:
                rect.left +
                rect.width /
                2,

            y:
                rect.top +
                rect.height /
                2

        };

    }


    // =================================================
    // UPDATE JOYSTICK
    // =================================================

    updateJoystick(
        event
    ) {

        const dx =
            event.clientX -
            this.joystickCenter.x;


        const dy =
            event.clientY -
            this.joystickCenter.y;


        const distance =
            Math.sqrt(
                dx * dx +
                dy * dy
            );


        const max =
            this.maxJoystickDistance;


        let x = dx;

        let y = dy;


        if (
            distance >
            max
        ) {

            const ratio =
                max /
                distance;


            x *= ratio;

            y *= ratio;

        }


        const normalizedX =
            x /
            max;


        const normalizedY =
            y /
            max;


        if (
            this.joystickStick
        ) {

            this.joystickStick.style.transform =
                `translate(
                    ${x}px,
                    ${y}px
                )`;

        }


        if (
            this.game.player &&
            typeof
            this.game.player.setMoveInput ===
            "function"
        ) {

            this.game.player.setMoveInput(
                normalizedX,
                -normalizedY
            );

        }

    }


    // =================================================
    // RESET JOYSTICK
    // =================================================

    resetJoystick() {

        this.joystickActive =
            false;

        this.joystickPointerId =
            null;


        if (
            this.joystickStick
        ) {

            this.joystickStick.style.transform =
                "translate(0px, 0px)";

        }


        if (
            this.game.player &&
            typeof
            this.game.player.setMoveInput ===
            "function"
        ) {

            this.game.player.setMoveInput(
                0,
                0
            );

        }

    }


    // =================================================
    // CAMERA
    // =================================================

    rotateCamera(
        dx,
        dy
    ) {

        const player =
            this.game.player;


        if (
            !player
        ) {

            return;

        }


        player.yaw -=
            dx *
            this.lookSensitivity;


        player.pitch -=
            dy *
            this.lookSensitivity;


        player.pitch =
            Math.max(
                -0.9,
                Math.min(
                    0.4,
                    player.pitch
                )
            );

    }


    // =================================================
    // RUN
    // =================================================

    setRunning(
        state
    ) {

        if (
            this.game.player &&
            typeof
            this.game.player.setRunning ===
            "function"
        ) {

            this.game.player.setRunning(
                state
            );

        }


        if (
            this.buttons.run
        ) {

            this.buttons.run.classList.toggle(
                "active",
                Boolean(state)
            );

        }

    }


    // =================================================
    // ATTACK
    // =================================================

    attack() {

        if (
            this.game.player &&
            typeof
            this.game.player.attack ===
            "function"
        ) {

            this.game.player.attack();

            return;

        }


        if (
            this.game.creatures &&
            typeof
            this.game.creatures.playerAttack ===
            "function"
        ) {

            this.game.creatures.playerAttack();

            return;

        }


        if (
            this.game.ui
        ) {

            this.game.ui.notify(
                "⚔️ Attack system coming next"
            );

        }

    }


    // =================================================
    // CAPTURE
    // =================================================

    capture() {

        if (
            this.game.creatures &&
            typeof
            this.game.creatures.captureNearest ===
            "function"
        ) {

            this.game.creatures.captureNearest();

            return;

        }


        if (
            this.game.creatures &&
            typeof
            this.game.creatures.capture ===
            "function"
        ) {

            this.game.creatures.capture();

            return;

        }


        if (
            this.game.ui
        ) {

            this.game.ui.notify(
                "🎯 Capture system coming next"
            );

        }

    }


    // =================================================
    // VISIBILITY
    // =================================================

    updateVisibility() {

        const controls =
            document.getElementById(
                "mobile-controls"
            );


        if (
            !controls
        ) {

            return;

        }


        if (
            this.enabled
        ) {

            controls.style.display =
                "block";

        } else {

            controls.style.display =
                "none";

        }

    }


    // =================================================
    // UPDATE
    // =================================================

    update(
        delta
    ) {

        if (
            !this.enabled
        ) {

            return;

        }


        // Keep controls responsive.

        if (
            this.joystickActive
        ) {

            // Input is already updated
            // through pointer events.

        }

    }


    // =================================================
    // CSS
    // =================================================

    injectStyles() {

        if (
            document.getElementById(
                "mobile-controls-style"
            )
        ) {

            return;

        }


        const style =
            document.createElement(
                "style"
            );


        style.id =
            "mobile-controls-style";


        style.textContent = `

            #mobile-controls {

                position: fixed;

                inset: 0;

                z-index: 200;

                pointer-events: none;

                display: block;

                font-family:
                    Arial,
                    sans-serif;

            }


            .mobile-joystick {

                position: absolute;

                left: 28px;

                bottom: 30px;

                width: 140px;

                height: 140px;

                border-radius: 50%;

                background:
                    rgba(
                        20,
                        30,
                        35,
                        0.35
                    );

                border:
                    2px solid
                    rgba(
                        255,
                        255,
                        255,
                        0.22
                    );

                box-shadow:
                    inset 0 0 25px
                    rgba(
                        0,
                        0,
                        0,
                        0.2
                    );

                pointer-events: auto;

                touch-action: none;

            }


            .joystick-stick {

                position: absolute;

                left: 50%;

                top: 50%;

                width: 64px;

                height: 64px;

                margin-left: -32px;

                margin-top: -32px;

                border-radius: 50%;

                background:
                    rgba(
                        255,
                        255,
                        255,
                        0.65
                    );

                border:
                    2px solid
                    rgba(
                        255,
                        255,
                        255,
                        0.8
                    );

                box-shadow:
                    0 5px 20px
                    rgba(
                        0,
                        0,
                        0,
                        0.25
                    );

                pointer-events: none;

                transition:
                    transform 0.03s
                    linear;

            }


            .mobile-actions {

                position: absolute;

                right: 24px;

                bottom: 25px;

                width: 190px;

                height: 190px;

                pointer-events: none;

            }


            .mobile-action {

                position: absolute;

                width: 58px;

                height: 58px;

                border-radius: 50%;

                border:
                    2px solid
                    rgba(
                        255,
                        255,
                        255,
                        0.25
                    );

                background:
                    rgba(
                        10,
                        18,
                        23,
                        0.62
                    );

                color: white;

                font-size: 22px;

                font-weight: 800;

                display: flex;

                align-items: center;

                justify-content: center;

                pointer-events: auto;

                touch-action: manipulation;

                -webkit-tap-highlight-color:
                    transparent;

                box-shadow:
                    0 5px 18px
                    rgba(
                        0,
                        0,
                        0,
                        0.3
                    );

            }


            .mobile-action:active,
            .mobile-action.active {

                transform:
                    scale(0.9);

                background:
                    rgba(
                        255,
                        255,
                        255,
                        0.25
                    );

            }


            .attack {

                right: 0;

                bottom: 70px;

                width: 68px;

                height: 68px;

            }


            .capture {

                left: 10px;

                bottom: 10px;

            }


            .jump {

                right: 72px;

                bottom: 0;

            }


            .run {

                left: 0;

                bottom: 85px;

            }


            @media (
                max-width: 600px
            ) {

                .mobile-joystick {

                    left: 18px;

                    bottom: 18px;

                    width: 125px;

                    height: 125px;

                }


                .joystick-stick {

                    width: 58px;

                    height: 58px;

                    margin-left: -29px;

                    margin-top: -29px;

                }


                .mobile-actions {

                    right: 15px;

                    bottom: 15px;

                    transform:
                        scale(0.9);

                    transform-origin:
                        bottom right;

                }

            }


            @media (
                max-height: 500px
            ) {

                .mobile-joystick {

                    bottom: 12px;

                    transform:
                        scale(0.82);

                    transform-origin:
                        bottom left;

                }


                .mobile-actions {

                    bottom: 8px;

                    transform:
                        scale(0.78);

                    transform-origin:
                        bottom right;

                }

            }

        `;


        document.head.appendChild(
            style
        );

    }

}
