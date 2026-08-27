import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js";

export class Player {

    constructor(game) {

        this.game = game;

        this.object = null;

        this.speed = 6;

        this.runSpeed = 10;

        this.jumpPower = 8;

        this.gravity = 22;

        this.verticalVelocity = 0;

        this.grounded = true;

        this.health = 100;

        this.maxHealth = 100;

        this.stamina = 100;

        this.maxStamina = 100;

        this.hunger = 100;

        this.maxHunger = 100;

        this.dead = false;

        this.keys = {};

        this.yaw = 0;

        this.pitch = -0.25;

        this.cameraDistance = 7;

        this.cameraHeight = 3.2;

        this.moveInput = {
            x: 0,
            y: 0
        };

        this.running = false;

        this.bindKeyboard();

    }


    // =================================================
    // INITIALIZE
    // =================================================

    async init() {

        this.createPlayer();

        this.setupCamera();

        this.setupPointer();

    }


    // =================================================
    // CREATE PLAYER
    // =================================================

    createPlayer() {

        const group =
            new THREE.Group();


        group.name =
            "Player";


        // Body

        const bodyMaterial =
            new THREE.MeshStandardMaterial({
                color: 0x486a7a,
                roughness: 0.8
            });


        const skinMaterial =
            new THREE.MeshStandardMaterial({
                color: 0xc98f70,
                roughness: 0.9
            });


        const body =
            new THREE.Mesh(
                new THREE.CapsuleGeometry(
                    0.38,
                    1.0,
                    6,
                    10
                ),
                bodyMaterial
            );


        body.position.y = 1.05;

        body.castShadow = true;

        group.add(body);


        // Head

        const head =
            new THREE.Mesh(
                new THREE.SphereGeometry(
                    0.32,
                    12,
                    10
                ),
                skinMaterial
            );


        head.position.y = 1.95;

        head.castShadow = true;

        group.add(head);


        // Eyes

        const eyeMaterial =
            new THREE.MeshStandardMaterial({
                color: 0x111111
            });


        const eyeGeometry =
            new THREE.SphereGeometry(
                0.035,
                8,
                8
            );


        const leftEye =
            new THREE.Mesh(
                eyeGeometry,
                eyeMaterial
            );


        leftEye.position.set(
            -0.11,
            2.01,
            -0.28
        );


        const rightEye =
            leftEye.clone();


        rightEye.position.x = 0.11;


        group.add(leftEye);

        group.add(rightEye);


        // Position

        let spawnY = 0;


        if (this.game.world) {

            spawnY =
                this.game.world
                    .getTerrainHeight(
                        0,
                        0
                    );

        }


        group.position.set(
            0,
            spawnY,
            0
        );


        this.object = group;

        this.game.scene.add(group);

    }


    // =================================================
    // CAMERA
    // =================================================

    setupCamera() {

        if (!this.game.camera) {
            return;
        }


        this.updateCamera(
            1
        );

    }


    updateCamera(delta) {

        if (
            !this.object ||
            !this.game.camera
        ) {
            return;
        }


        const playerPosition =
            this.object.position;


        const horizontalDistance =
            this.cameraDistance *
            Math.cos(this.pitch);


        const cameraX =
            playerPosition.x -
            Math.sin(this.yaw) *
            horizontalDistance;


        const cameraZ =
            playerPosition.z -
            Math.cos(this.yaw) *
            horizontalDistance;


        const cameraY =
            playerPosition.y +
            this.cameraHeight -
            Math.sin(this.pitch) *
            this.cameraDistance;


        const target =
            new THREE.Vector3(
                cameraX,
                cameraY,
                cameraZ
            );


        this.game.camera.position.lerp(
            target,
            Math.min(
                1,
                delta * 8
            )
        );


        const lookAt =
            new THREE.Vector3(
                playerPosition.x,
                playerPosition.y + 1.2,
                playerPosition.z
            );


        this.game.camera.lookAt(
            lookAt
        );

    }


    // =================================================
    // KEYBOARD
    // =================================================

    bindKeyboard() {

        window.addEventListener(
            "keydown",
            event => {

                this.keys[
                    event.code
                ] = true;


                if (
                    event.code === "Space"
                ) {

                    event.preventDefault();

                    this.jump();

                }


                if (
                    event.code === "ShiftLeft" ||
                    event.code === "ShiftRight"
                ) {

                    this.running = true;

                }

            }
        );


        window.addEventListener(
            "keyup",
            event => {

                this.keys[
                    event.code
                ] = false;


                if (
                    event.code === "ShiftLeft" ||
                    event.code === "ShiftRight"
                ) {

                    this.running = false;

                }

            }
        );

    }


    // =================================================
    // UPDATE
    // =================================================

    update(delta) {

        if (
            !this.object ||
            this.dead
        ) {
            return;
        }


        this.updateKeyboardInput();

        this.updateMovement(
            delta
        );

        this.updateGravity(
            delta
        );

        this.updateHunger(
            delta
        );

        this.updateCamera(
            delta
        );

    }


    // =================================================
    // KEYBOARD INPUT
    // =================================================

    updateKeyboardInput() {

        let x = 0;

        let y = 0;


        if (
            this.keys["KeyA"] ||
            this.keys["ArrowLeft"]
        ) {
            x -= 1;
        }


        if (
            this.keys["KeyD"] ||
            this.keys["ArrowRight"]
        ) {
            x += 1;
        }


        if (
            this.keys["KeyW"] ||
            this.keys["ArrowUp"]
        ) {
            y += 1;
        }


        if (
            this.keys["KeyS"] ||
            this.keys["ArrowDown"]
        ) {
            y -= 1;
        }


        if (
            x !== 0 ||
            y !== 0
        ) {

            const length =
                Math.sqrt(
                    x * x +
                    y * y
                );


            x /= length;

            y /= length;

        }


        if (
            this.moveInput.x === 0 &&
            this.moveInput.y === 0
        ) {

            this.moveInput.x = x;

            this.moveInput.y = y;

        }

    }


    // =================================================
    // MOVEMENT
    // =================================================

    updateMovement(delta) {

        let x =
            this.moveInput.x;


        let y =
            this.moveInput.y;


        if (
            Math.abs(x) < 0.01 &&
            Math.abs(y) < 0.01
        ) {
            return;
        }


        const direction =
            new THREE.Vector3(
                x,
                0,
                -y
            );


        direction.applyAxisAngle(
            new THREE.Vector3(
                0,
                1,
                0
            ),
            this.yaw
        );


        if (
            direction.lengthSq() >
            0.001
        ) {

            direction.normalize();

        }


        let currentSpeed =
            this.speed;


        if (
            this.running &&
            this.stamina > 0
        ) {

            currentSpeed =
                this.runSpeed;


            this.stamina -=
                20 *
                delta;

        } else {

            this.stamina +=
                12 *
                delta;

        }


        this.stamina =
            Math.max(
                0,
                Math.min(
                    this.maxStamina,
                    this.stamina
                )
            );


        this.object.position.x +=
            direction.x *
            currentSpeed *
            delta;


        this.object.position.z +=
            direction.z *
            currentSpeed *
            delta;


        this.object.rotation.y =
            Math.atan2(
                direction.x,
                direction.z
            );


        this.keepInsideWorld();

    }


    // =================================================
    // GRAVITY
    // =================================================

    updateGravity(delta) {

        if (
            !this.game.world
        ) {
            return;
        }


        this.verticalVelocity -=
            this.gravity *
            delta;


        this.object.position.y +=
            this.verticalVelocity *
            delta;


        const groundY =
            this.game.world
                .getTerrainHeight(
                    this.object.position.x,
                    this.object.position.z
                );


        if (
            this.object.position.y <=
            groundY
        ) {

            this.object.position.y =
                groundY;

            this.verticalVelocity =
                0;

            this.grounded =
                true;

        } else {

            this.grounded =
                false;

        }

    }


    // =================================================
    // JUMP
    // =================================================

    jump() {

        if (
            !this.grounded ||
            this.dead
        ) {
            return false;
        }


        if (
            this.stamina < 10
        ) {
            return false;
        }


        this.verticalVelocity =
            this.jumpPower;


        this.grounded =
            false;


        this.stamina -=
            10;


        return true;

    }


    // =================================================
    // HUNGER
    // =================================================

    updateHunger(delta) {

        this.hunger -=
            0.7 *
            delta;


        this.hunger =
            Math.max(
                0,
                this.hunger
            );


        if (
            this.hunger <= 0
        ) {

            this.health -=
                1 *
                delta;

        }


        if (
            this.health <= 0
        ) {

            this.die();

        }

    }


    // =================================================
    // DAMAGE
    // =================================================

    damage(amount) {

        if (
            this.dead
        ) {
            return;
        }


        amount =
            Math.max(
                0,
                Number(amount) || 0
            );


        this.health -=
            amount;


        if (
            this.game.ui
        ) {

            this.game.ui.notify(
                `❤️ -${Math.round(amount)} HP`
            );

        }


        if (
            this.health <= 0
        ) {

            this.die();

        }

    }


    // =================================================
    // HEAL
    // =================================================

    heal(amount) {

        amount =
            Math.max(
                0,
                Number(amount) || 0
            );


        this.health =
            Math.min(
                this.maxHealth,
                this.health + amount
            );

    }


    // =================================================
    // EAT
    // =================================================

    eat(amount = 25) {

        if (
            !this.game.systems
        ) {
            return false;
        }


        if (
            !this.game.systems
                .removeItem(
                    "food",
                    1
                )
        ) {

            if (
                this.game.ui
            ) {

                this.game.ui.notify(
                    "No food!"
                );

            }

            return false;

        }


        this.hunger =
            Math.min(
                this.maxHunger,
                this.hunger + amount
            );


        this.heal(5);


        if (
            this.game.ui
        ) {

            this.game.ui.notify(
                "🍖 Food consumed"
            );

        }


        return true;

    }


    // =================================================
    // DEATH
    // =================================================

    die() {

        if (
            this.dead
        ) {
            return;
        }


        this.dead =
            true;


        this.health =
            0;


        if (
            this.game.ui
        ) {

            this.game.ui.notify(
                "💀 You died!"
            );

        }


        setTimeout(
            () => {

                this.respawn();

            },
            2500
        );

    }


    // =================================================
    // RESPAWN
    // =================================================

    respawn() {

        if (
            !this.object
        ) {
            return;
        }


        let y = 0;


        if (
            this.game.world
        ) {

            y =
                this.game.world
                    .getTerrainHeight(
                        0,
                        0
                    );

        }


        this.object.position.set(
            0,
            y,
            0
        );


        this.health =
            this.maxHealth;


        this.stamina =
            this.maxStamina;


        this.hunger =
            Math.max(
                50,
                this.hunger
            );


        this.verticalVelocity =
            0;


        this.grounded =
            true;


        this.dead =
            false;


        if (
            this.game.ui
        ) {

            this.game.ui.notify(
                "You respawned."
            );

        }

    }


    // =================================================
    // WORLD LIMIT
    // =================================================

    keepInsideWorld() {

        if (
            !this.game.world
        ) {
            return;
        }


        const limit =
            this.game.world.size /
            2 -
            5;


        this.object.position.x =
            Math.max(
                -limit,
                Math.min(
                    limit,
                    this.object.position.x
                )
            );


        this.object.position.z =
            Math.max(
                -limit,
                Math.min(
                    limit,
                    this.object.position.z
                )
            );

    }


    // =================================================
    // POINTER / MOUSE
    // =================================================

    setupPointer() {

        let dragging =
            false;


        let lastX = 0;

        let lastY = 0;


        window.addEventListener(
            "pointerdown",
            event => {

                if (
                    event.target.closest(
                        "button"
                    )
                ) {
                    return;
                }


                dragging = true;

                lastX =
                    event.clientX;

                lastY =
                    event.clientY;

            }
        );


        window.addEventListener(
            "pointermove",
            event => {

                if (
                    !dragging
                ) {
                    return;
                }


                const dx =
                    event.clientX -
                    lastX;


                const dy =
                    event.clientY -
                    lastY;


                lastX =
                    event.clientX;


                lastY =
                    event.clientY;


                this.yaw -=
                    dx *
                    0.006;


                this.pitch -=
                    dy *
                    0.004;


                this.pitch =
                    Math.max(
                        -0.9,
                        Math.min(
                            0.4,
                            this.pitch
                        )
                    );

            }
        );


        window.addEventListener(
            "pointerup",
            () => {

                dragging = false;

            }
        );


        window.addEventListener(
            "pointercancel",
            () => {

                dragging = false;

            }
        );

    }


    // =================================================
    // MOBILE MOVEMENT
    // =================================================

    setMoveInput(
        x,
        y
    ) {

        this.moveInput.x =
            Number(x) || 0;

        this.moveInput.y =
            Number(y) || 0;

    }


    // =================================================
    // RUN
    // =================================================

    setRunning(
        state
    ) {

        this.running =
            Boolean(state);

    }


    // =================================================
    // POSITION
    // =================================================

    getPosition() {

        if (
            !this.object
        ) {

            return new THREE.Vector3();

        }


        return this.object.position
            .clone();

    }

}
