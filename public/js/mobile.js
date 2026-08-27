export class MobileControls {

    constructor(game) {

        this.game = game;

        this.enabled =
            this.isMobileDevice();

        this.lookActive = false;

        this.lookPointerId = null;

        this.lastLookX = 0;

        this.lastLookY = 0;

        this.lookSensitivity = 0.004;

        this.jumpPressed = false;

        this.sprintPressed = false;

        this.attackPressed = false;

    }


    // =================================================
    // INITIALIZE
    // =================================================

    async init() {

        this.createTouchControls();

        this.setupLookControl();

        this.setupKeyboardFallback();

    }


    // =================================================
    // DEVICE DETECTION
    // =================================================

    isMobileDevice() {

        return (
            window.matchMedia(
                "(pointer: coarse)"
            ).matches ||
            /Android|iPhone|iPad|iPod/i.test(
                navigator.userAgent
            )
        );

    }


    // =================================================
    // TOUCH INTERFACE
    // =================================================

    createTouchControls() {

        const container =
            document.createElement(
                "div"
            );


        container.id =
            "mobile-extra-controls";


        container.innerHTML = `

            <button
                id="mobile-jump"
                class="mobile-control-button"
            >
                ⬆️
                <span>JUMP</span>
            </button>


            <button
                id="mobile-sprint"
                class="mobile-control-button"
            >
                🏃
                <span>RUN</span>
            </button>

        `;


        document.body.appendChild(
            container
        );


        this.injectStyles();


        const jump =
            document.getElementById(
                "mobile-jump"
            );


        const sprint =
            document.getElementById(
                "mobile-sprint"
            );


        // Jump

        jump.addEventListener(
            "pointerdown",
            event => {

                event.preventDefault();

                this.jumpPressed =
                    true;

                this.jump();

            }
        );


        jump.addEventListener(
            "pointerup",
            event => {

                event.preventDefault();

                this.jumpPressed =
                    false;

            }
        );


        jump.addEventListener(
            "pointercancel",
            () => {

                this.jumpPressed =
                    false;

            }
        );


        // Sprint

        sprint.addEventListener(
            "pointerdown",
            event => {

                event.preventDefault();

                this.sprintPressed =
                    true;

            }
        );


        sprint.addEventListener(
            "pointerup",
            event => {

                event.preventDefault();

                this.sprintPressed =
                    false;

            }
        );


        sprint.addEventListener(
            "pointercancel",
            () => {

                this.sprintPressed =
                    false;

            }
        );

    }


    // =================================================
    // CAMERA LOOK
    // =================================================

    setupLookControl() {

        const canvas =
            document.querySelector(
                "canvas"
            );


        if (
            !canvas
        ) {

            return;

        }


        canvas.addEventListener(
            "pointerdown",
            event => {

                if (
                    event.pointerType ===
                    "mouse"
                ) {

                    return;

                }


                // Ignore left joystick area.

                if (
                    event.clientX <
                    window.innerWidth *
                    0.42
                ) {

                    return;

                }


                this.lookActive =
                    true;


                this.lookPointerId =
                    event.pointerId;


                this.lastLookX =
                    event.clientX;


                this.lastLookY =
                    event.clientY;


                canvas.setPointerCapture(
                    event.pointerId
                );

            }
        );


        canvas.addEventListener(
            "pointermove",
            event => {

                if (
                    !this.lookActive
                ) {

                    return;

                }


                if (
                    event.pointerId !==
                    this.lookPointerId
                ) {

                    return;

                }


                const deltaX =
                    event.clientX -
                    this.lastLookX;


                const deltaY =
                    event.clientY -
                    this.lastLookY;


                this.lastLookX =
                    event.clientX;


                this.lastLookY =
                    event.clientY;


                this.rotateCamera(
                    deltaX,
                    deltaY
                );

            }
        );


        const stopLook =
            event => {

                if (
                    event.pointerId !==
                    this.lookPointerId
                ) {

                    return;

                }


                this.lookActive =
                    false;


                this.lookPointerId =
                    null;

            };


        canvas.addEventListener(
            "pointerup",
            stopLook
        );


        canvas.addEventListener(
            "pointercancel",
            stopLook
        );

    }


    // =================================================
    // CAMERA ROTATION
    // =================================================

    rotateCamera(
        deltaX,
        deltaY
    ) {

        const camera =
            this.game.camera;


        if (
            !camera
        ) {

            return;

        }


        camera.rotation.y -=
            deltaX *
            this.lookSensitivity;


        camera.rotation.x -=
            deltaY *
            this.lookSensitivity;


        const minimum =
            -Math.PI / 2 +
            0.1;


        const maximum =
            Math.PI / 2 -
            0.1;


        camera.rotation.x =
            Math.max(
                minimum,
                Math.min(
                    maximum,
                    camera.rotation.x
                )
            );

    }


    // =================================================
    // JUMP
    // =================================================

    jump() {

        const player =
            this.game.player;


        if (
            !player
        ) {

            return;

        }


        if (
            typeof player.jump ===
            "function"
        ) {

            player.jump();

            return;

        }


        if (
            typeof player.velocity !==
            "undefined"
        ) {

            if (
                player.isGrounded !==
                false
            ) {

                player.velocity.y =
                    7;

            }

        }

    }


    // =================================================
    // KEYBOARD FALLBACK
    // =================================================

    setupKeyboardFallback() {

        window.addEventListener(
            "keydown",
            event => {

                if (
                    event.code ===
                    "Space"
                ) {

                    this.jump();

                }


                if (
                    event.code ===
                    "ShiftLeft" ||
                    event.code ===
                    "ShiftRight"
                ) {

                    this.sprintPressed =
                        true;

                }

            }
        );


        window.addEventListener(
            "keyup",
            event => {

                if (
                    event.code ===
                    "ShiftLeft" ||
                    event.code ===
                    "ShiftRight"
                ) {

                    this.sprintPressed =
                        false;

                }

            }
        );

    }


    // =================================================
    // UPDATE
    // =================================================

    update(
        delta
    ) {

        const player =
            this.game.player;


        if (
            !player
        ) {

            return;

        }


        // Mobile joystick movement.

        const moveX =
            Number(
                player.mobileMoveX || 0
            );


        const moveZ =
            Number(
                player.mobileMoveZ || 0
            );


        if (
            typeof player.setMobileInput ===
            "function"
        ) {

            player.setMobileInput(
                moveX,
                moveZ,
                this.sprintPressed
            );

        } else {

            player.mobileMoveX =
                moveX;

            player.mobileMoveZ =
                moveZ;

            player.mobileSprint =
                this.sprintPressed;

        }

    }


    // =================================================
    // DISABLE
    // =================================================

    disable() {

        this.enabled =
            false;

    }


    // =================================================
    // ENABLE
    // =================================================

    enable() {

        this.enabled =
            true;

    }


    // =================================================
    // CSS
    // =================================================

    injectStyles() {

        const style =
            document.createElement(
                "style"
            );


        style.textContent = `

            #mobile-extra-controls {

                position: fixed;

                inset: 0;

                z-index: 110;

                pointer-events: none;

            }


            .mobile-control-button {

                position: absolute;

                width: 65px;

                height: 65px;

                border-radius: 50%;

                border: 2px solid
                    rgba(
                        255,
                        255,
                        255,
                        0.18
                    );

                background:
                    rgba(
                        10,
                        15,
                        20,
                        0.65
                    );

                color: white;

                display: flex;

                flex-direction: column;

                align-items: center;

                justify-content: center;

                font-size: 21px;

                pointer-events: auto;

                touch-action: none;

                user-select: none;

                box-shadow:
                    0 5px 20px
                    rgba(
                        0,
                        0,
                        0,
                        0.35
                    );

            }


            .mobile-control-button span {

                font-size: 7px;

                margin-top: 2px;

                font-weight: 800;

                letter-spacing: 0.5px;

            }


            .mobile-control-button:active {

                transform:
                    scale(0.9);

                background:
                    rgba(
                        255,
                        255,
                        255,
                        0.18
                    );

            }


            #mobile-jump {

                right: 105px;

                bottom: 35px;

            }


            #mobile-sprint {

                right: 25px;

                bottom: 105px;

            }


            @media (
                min-width: 800px
            ) {

                #mobile-extra-controls {

                    display: none;

                }

            }


            @media (
                max-width: 600px
            ) {

                #mobile-jump {

                    right: 90px;

                    bottom: 25px;

                }


                #mobile-sprint {

                    right: 20px;

                    bottom: 100px;

                }


                .mobile-control-button {

                    width: 58px;

                    height: 58px;

                }

            }

        `;


        document.head.appendChild(
            style
        );

    }

}
