import nipplejs from "https://cdn.jsdelivr.net/npm/nipplejs@0.10.2/+esm";

export class MobileControls {

    constructor(game) {

        this.game = game;

        this.joystick = null;

        this.moveX = 0;
        this.moveY = 0;

        this.lookX = 0;
        this.lookY = 0;

        this.touchLookActive = false;

        this.createControls();

    }


    // =================================================
    // INITIALIZE
    // =================================================

    init() {

        if (
            !this.isMobile()
        ) {

            return;

        }

        this.setupJoystick();

        this.setupLook();

        this.setupButtons();

    }


    // =================================================
    // DEVICE CHECK
    // =================================================

    isMobile() {

        return (
            window.innerWidth <= 900 ||
            "ontouchstart" in window ||
            navigator.maxTouchPoints > 0
        );

    }


    // =================================================
    // CREATE MOBILE UI
    // =================================================

    createControls() {

        this.container =
            document.createElement("div");

        this.container.id =
            "mobile-controls";

        this.container.style.display =
            "none";

        document.body.appendChild(
            this.container
        );


        // -----------------------------
        // JOYSTICK AREA
        // -----------------------------

        this.joystickZone =
            document.createElement("div");

        this.joystickZone.id =
            "joystick-zone";

        this.container.appendChild(
            this.joystickZone
        );


        // -----------------------------
        // ACTION BUTTONS
        // -----------------------------

        this.actionContainer =
            document.createElement("div");

        this.actionContainer.id =
            "mobile-actions";

        this.container.appendChild(
            this.actionContainer
        );


        this.jumpButton =
            this.createActionButton(
                "⬆️",
                "mobile-jump"
            );


        this.sprintButton =
            this.createActionButton(
                "🏃",
                "mobile-sprint"
            );


        this.attackButton =
            this.createActionButton(
                "⚔️",
                "mobile-attack"
            );


        this.captureButton =
            this.createActionButton(
                "🔴",
                "mobile-capture"
            );


        this.actionContainer.appendChild(
            this.jumpButton
        );

        this.actionContainer.appendChild(
            this.sprintButton
        );

        this.actionContainer.appendChild(
            this.attackButton
        );

        this.actionContainer.appendChild(
            this.captureButton
        );

    }


    // =================================================
    // CREATE BUTTON
    // =================================================

    createActionButton(
        text,
        id
    ) {

        const button =
            document.createElement(
                "button"
            );

        button.textContent =
            text;

        button.id =
            id;

        button.className =
            "mobile-action";

        button.setAttribute(
            "aria-label",
            id
        );

        return button;

    }


    // =================================================
    // SHOW CONTROLS
    // =================================================

    show() {

        if (
            !this.isMobile()
        ) {

            return;

        }

        this.container.style.display =
            "block";

    }


    // =================================================
    // JOYSTICK
    // =================================================

    setupJoystick() {

        this.joystick =
            nipplejs.create({

                zone:
                    this.joystickZone,

                mode:
                    "static",

                position: {
                    left: "50%",
                    top: "50%"
                },

                color:
                    "white",

                size:
                    120,

                threshold:
                    0.1,

                fadeTime:
                    100

            });


        this.joystick.on(
            "move",
            (event, data) => {

                if (
                    !data ||
                    !data.vector
                ) {

                    return;

                }


                this.moveX =
                    data.vector.x;

                this.moveY =
                    data.vector.y;

            }
        );


        this.joystick.on(
            "end",
            () => {

                this.moveX = 0;

                this.moveY = 0;

            }
        );

    }


    // =================================================
    // TOUCH CAMERA
    // =================================================

    setupLook() {

        const screen =
            document.body;


        screen.addEventListener(
            "touchstart",
            event => {

                if (
                    !this.isMobile()
                ) {

                    return;

                }


                for (
                    const touch
                    of event.changedTouches
                ) {

                    const x =
                        touch.clientX;


                    // Left side is joystick.
                    // Right side controls camera.

                    if (
                        x >
                        window.innerWidth * 0.45
                    ) {

                        this.touchLookActive =
                            true;

                    }

                }

            },
            {
                passive: true
            }
        );


        screen.addEventListener(
            "touchmove",
            event => {

                if (
                    !this.touchLookActive
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


                if (
                    this.lastTouchX ===
                    undefined
                ) {

                    this.lastTouchX =
                        touch.clientX;

                    this.lastTouchY =
                        touch.clientY;

                    return;

                }


                const dx =
                    touch.clientX -
                    this.lastTouchX;


                const dy =
                    touch.clientY -
                    this.lastTouchY;


                this.lookX =
                    dx;

                this.lookY =
                    dy;


                this.lastTouchX =
                    touch.clientX;

                this.lastTouchY =
                    touch.clientY;

            },
            {
                passive: true
            }
        );


        screen.addEventListener(
            "touchend",
            () => {

                this.touchLookActive =
                    false;

                this.lastTouchX =
                    undefined;

                this.lastTouchY =
                    undefined;

                this.lookX = 0;

                this.lookY = 0;

            },
            {
                passive: true
            }
        );

    }


    // =================================================
    // ACTION BUTTONS
    // =================================================

    setupButtons() {

        // -----------------------------
        // JUMP
        // -----------------------------

        this.jumpButton.addEventListener(
            "touchstart",
            event => {

                event.preventDefault();

                if (
                    this.game.player
                ) {

                    this.game.player.jump();

                }

            },
            {
                passive: false
            }
        );


        // -----------------------------
        // SPRINT
        // -----------------------------

        this.sprintButton.addEventListener(
            "touchstart",
            event => {

                event.preventDefault();

                if (
                    this.game.player
                ) {

                    this.game.player.mobileSprint =
                        true;

                }

            },
            {
                passive: false
            }
        );


        this.sprintButton.addEventListener(
            "touchend",
            event => {

                event.preventDefault();

                if (
                    this.game.player
                ) {

                    this.game.player.mobileSprint =
                        false;

                }

            },
            {
                passive: false
            }
        );


        // -----------------------------
        // ATTACK
        // -----------------------------

        this.attackButton.addEventListener(
            "touchstart",
            event => {

                event.preventDefault();

                this.attack();

            },
            {
                passive: false
            }
        );


        // -----------------------------
        // CAPTURE
        // -----------------------------

        this.captureButton.addEventListener(
            "touchstart",
            event => {

                event.preventDefault();

                this.capture();

            },
            {
                passive: false
            }
        );

    }


    // =================================================
    // ATTACK
    // =================================================

    attack() {

        if (
            !this.game.creatures
        ) {

            return;

        }


        const creature =
            this.game.creatures
                .getNearestCreature(
                    4
                );


        if (
            !creature
        ) {

            if (
                this.game.ui
            ) {

                this.game.ui.notify(
                    "No creature nearby."
                );

            }

            return;

        }


        this.game.creatures
            .damageCreature(
                creature,
                20
            );

    }


    // =================================================
    // CAPTURE
    // =================================================

    capture() {

        if (
            !this.game.systems
        ) {

            return;

        }


        this.game.systems
            .captureNearestCreature();

    }


    // =================================================
    // GET MOVEMENT
    // =================================================

    getMovement() {

        return {

            x:
                this.moveX,

            z:
                -this.moveY

        };

    }


    // =================================================
    // GET LOOK
    // =================================================

    getLook() {

        const result = {

            x:
                this.lookX,

            y:
                this.lookY

        };


        this.lookX = 0;

        this.lookY = 0;


        return result;

    }


    // =================================================
    // UPDATE PLAYER INPUT
    // =================================================

    update() {

        if (
            !this.game.player
        ) {

            return;

        }


        const movement =
            this.getMovement();


        this.game.player.mobileMoveX =
            movement.x;

        this.game.player.mobileMoveZ =
            movement.z;


        const look =
            this.getLook();


        if (
            look.x !== 0 ||
            look.y !== 0
        ) {

            this.game.player.yaw -=
                look.x * 0.004;

            this.game.player.pitch -=
                look.y * 0.004;


            this.game.player.pitch =
                Math.max(
                    -1.1,
                    Math.min(
                        0.7,
                        this.game.player.pitch
                    )
                );

        }

    }


    // =================================================
    // RESIZE
    // =================================================

    resize() {

        if (
            this.isMobile()
        ) {

            this.show();

        } else {

            this.container.style.display =
                "none";

        }

    }

}
