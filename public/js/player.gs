import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js";

export class Player {

    constructor(game) {

        this.game = game;

        this.object = null;

        this.velocity = new THREE.Vector3();

        this.direction = new THREE.Vector3();

        this.health = 100;
        this.maxHealth = 100;

        this.stamina = 100;
        this.maxStamina = 100;

        this.hunger = 100;
        this.maxHunger = 100;

        this.speed = 5;
        this.sprintSpeed = 8;

        this.jumpPower = 8;

        this.gravity = 22;

        this.isGrounded = true;

        this.isSprinting = false;

        this.mobileMoveX = 0;
        this.mobileMoveZ = 0;

        this.mobileSprint = false;

        this.yaw = 0;
        this.pitch = -0.25;

        this.cameraDistance = 7;

        this.cameraHeight = 3.2;

        this.keys = {};

        this.setupKeyboard();

    }


    // =================================================
    // INITIALIZE
    // =================================================

    async init() {

        this.createPlayer();

        this.setupCamera();

    }


    // =================================================
    // PLAYER MODEL
    // =================================================

    createPlayer() {

        const group =
            new THREE.Group();


        // BODY

        const bodyGeometry =
            new THREE.CapsuleGeometry(
                0.42,
                1.0,
                6,
                10
            );


        const bodyMaterial =
            new THREE.MeshStandardMaterial({
                color: 0x3b6edc,
                roughness: 0.8
            });


        const body =
            new THREE.Mesh(
                bodyGeometry,
                bodyMaterial
            );


        body.position.y =
            1.05;


        body.castShadow = true;

        body.receiveShadow = true;


        group.add(body);


        // HEAD

        const headGeometry =
            new THREE.SphereGeometry(
                0.38,
                16,
                12
            );


        const headMaterial =
            new THREE.MeshStandardMaterial({
                color: 0xd49b76,
                roughness: 0.8
            });


        const head =
            new THREE.Mesh(
                headGeometry,
                headMaterial
            );


        head.position.y =
            1.95;


        head.castShadow = true;


        group.add(head);


        // EYES

        const eyeGeometry =
            new THREE.SphereGeometry(
                0.045,
                8,
                8
            );


        const eyeMaterial =
            new THREE.MeshBasicMaterial({
                color: 0x111111
            });


        const leftEye =
            new THREE.Mesh(
                eyeGeometry,
                eyeMaterial
            );


        leftEye.position.set(
            -0.13,
            2.0,
            -0.34
        );


        const rightEye =
            new THREE.Mesh(
                eyeGeometry,
                eyeMaterial
            );


        rightEye.position.set(
            0.13,
            2.0,
            -0.34
        );


        group.add(leftEye);
        group.add(rightEye);


        // SHADOW

        const shadowGeometry =
            new THREE.CircleGeometry(
                0.55,
                24
            );


        const shadowMaterial =
            new THREE.MeshBasicMaterial({

                color: 0x000000,

                transparent: true,

                opacity: 0.25

            });


        const shadow =
            new THREE.Mesh(
                shadowGeometry,
                shadowMaterial
            );


        shadow.rotation.x =
            -Math.PI / 2;


        shadow.position.y =
            0.02;


        group.add(shadow);


        // PLAYER POSITION

        group.position.set(
            0,
            0,
            0
        );


        this.object =
            group;


        this.game.scene.add(
            group
        );

    }


    // =================================================
    // CAMERA
    // =================================================

    setupCamera() {

        this.game.camera.position.set(
            0,
            4,
            7
        );

    }


    // =================================================
    // KEYBOARD
    // =================================================

    setupKeyboard() {

        window.addEventListener(
            "keydown",
            event => {

                this.keys[
                    event.code
                ] = true;


                if (
                    event.code ===
                    "Space"
                ) {

                    this.jump();

                }

            }
        );


        window.addEventListener(
            "keyup",
            event => {

                this.keys[
                    event.code
                ] = false;

            }
        );

    }


    // =================================================
    // MOVEMENT
    // =================================================

    update(delta) {

        if (
            !this.object
        ) {

            return;

        }


        this.handleMovement(
            delta
        );


        this.applyGravity(
            delta
        );


        this.updateNeeds(
            delta
        );


        this.updateCamera(
            delta
        );


        this.updateRotation();

    }


    // =================================================
    // HANDLE MOVEMENT
    // =================================================

    handleMovement(delta) {

        let x = 0;
        let z = 0;


        // KEYBOARD

        if (
            this.keys[
                "KeyW"
            ] ||
            this.keys[
                "ArrowUp"
            ]
        ) {

            z -= 1;

        }


        if (
            this.keys[
                "KeyS"
            ] ||
            this.keys[
                "ArrowDown"
            ]
        ) {

            z += 1;

        }


        if (
            this.keys[
                "KeyA"
            ] ||
            this.keys[
                "ArrowLeft"
            ]
        ) {

            x -= 1;

        }


        if (
            this.keys[
                "KeyD"
            ] ||
            this.keys[
                "ArrowRight"
            ]
        ) {

            x += 1;

        }


        // MOBILE

        if (
            Math.abs(
                this.mobileMoveX
            ) > 0.01 ||
            Math.abs(
                this.mobileMoveZ
            ) > 0.01
        ) {

            x =
                this.mobileMoveX;

            z =
                this.mobileMoveZ;

        }


        const length =
            Math.sqrt(
                x * x +
                z * z
            );


        if (
            length > 1
        ) {

            x /= length;
            z /= length;

        }


        // SPRINT

        const sprintPressed =
            this.keys[
                "ShiftLeft"
            ] ||
            this.keys[
                "ShiftRight"
            ] ||
            this.mobileSprint;


        this.isSprinting =
            sprintPressed &&
            length > 0 &&
            this.stamina > 1;


        let speed =
            this.isSprinting
                ? this.sprintSpeed
                : this.speed;


        if (
            this.isSprinting
        ) {

            this.stamina -=
                20 * delta;

        } else {

            this.stamina +=
                12 * delta;

        }


        this.stamina =
            THREE.MathUtils.clamp(
                this.stamina,
                0,
                this.maxStamina
            );


        // MOVEMENT RELATIVE TO CAMERA

        const forward =
            new THREE.Vector3();

        this.game.camera
            .getWorldDirection(
                forward
            );


        forward.y = 0;

        forward.normalize();


        const right =
            new THREE.Vector3()
                .crossVectors(
                    forward,
                    new THREE.Vector3(
                        0,
                        1,
                        0
                    )
                )
                .normalize();


        const movement =
            new THREE.Vector3();


        movement.addScaledVector(
            forward,
            -z
        );


        movement.addScaledVector(
            right,
            x
        );


        if (
            movement.lengthSq() > 0
        ) {

            movement.normalize();


            this.object.position.x +=
                movement.x *
                speed *
                delta;


            this.object.position.z +=
                movement.z *
                speed *
                delta;


            const targetRotation =
                Math.atan2(
                    movement.x,
                    movement.z
                );


            this.object.rotation.y =
                this.smoothRotation(
                    this.object.rotation.y,
                    targetRotation,
                    delta * 10
                );

        }

    }


    // =================================================
    // GRAVITY
    // =================================================

    applyGravity(delta) {

        if (
            !this.isGrounded
        ) {

            this.velocity.y -=
                this.gravity *
                delta;

        }


        this.object.position.y +=
            this.velocity.y *
            delta;


        if (
            this.object.position.y <= 0
        ) {

            this.object.position.y =
                0;

            this.velocity.y =
                0;

            this.isGrounded =
                true;

        }

    }


    // =================================================
    // JUMP
    // =================================================

    jump() {

        if (
            !this.isGrounded
        ) {

            return;

        }


        this.velocity.y =
            this.jumpPower;


        this.isGrounded =
            false;

    }


    // =================================================
    // NEEDS
    // =================================================

    updateNeeds(delta) {

        this.hunger -=
            0.7 *
            delta;


        this.hunger =
            THREE.MathUtils.clamp(
                this.hunger,
                0,
                this.maxHunger
            );


        if (
            this.hunger <= 0
        ) {

            this.health -=
                2 *
                delta;

        }


        if (
            this.health <= 0
        ) {

            this.health = 0;

            this.respawn();

        }

    }


    // =================================================
    // CAMERA
    // =================================================

    updateCamera(delta) {

        const target =
            this.object.position
                .clone();


        target.y +=
            this.cameraHeight;


        const rotation =
            new THREE.Euler(
                this.pitch,
                this.yaw,
                0,
                "YXZ"
            );


        const offset =
            new THREE.Vector3(
                0,
                0,
                this.cameraDistance
            );


        offset.applyEuler(
            rotation
        );


        const desiredPosition =
            target.clone()
                .add(offset);


        this.game.camera.position.lerp(
            desiredPosition,
            1 -
            Math.pow(
                0.001,
                delta
            )
        );


        this.game.camera.lookAt(
            target
        );

    }


    // =================================================
    // ROTATION
    // =================================================

    updateRotation() {

        if (
            !this.object
        ) {

            return;

        }

    }


    smoothRotation(
        current,
        target,
        amount
    ) {

        let difference =
            target -
            current;


        while (
            difference >
            Math.PI
        ) {

            difference -=
                Math.PI * 2;

        }


        while (
            difference <
            -Math.PI
        ) {

            difference +=
                Math.PI * 2;

        }


        return (
            current +
            difference *
            Math.min(
                amount,
                1
            )
        );

    }


    // =================================================
    // DAMAGE
    // =================================================

    damage(amount) {

        this.health -=
            Math.max(
                0,
                amount
            );


        this.health =
            THREE.MathUtils.clamp(
                this.health,
                0,
                this.maxHealth
            );


        if (
            this.health <= 0
        ) {

            this.respawn();

        }

    }


    // =================================================
    // HEAL
    // =================================================

    heal(amount) {

        this.health +=
            Math.max(
                0,
                amount
            );


        this.health =
            THREE.MathUtils.clamp(
                this.health,
                0,
                this.maxHealth
            );

    }


    // =================================================
    // FOOD
    // =================================================

    eat(amount = 25) {

        this.hunger +=
            amount;


        this.hunger =
            THREE.MathUtils.clamp(
                this.hunger,
                0,
                this.maxHunger
            );

    }


    // =================================================
    // RESPAWN
    // =================================================

    respawn() {

        this.health =
            this.maxHealth;

        this.hunger =
            70;

        this.stamina =
            this.maxStamina;


        this.velocity.set(
            0,
            0,
            0
        );


        this.object.position.set(
            0,
            0,
            0
        );


        if (
            this.game.ui
        ) {

            this.game.ui.notify(
                "You were defeated and returned to camp."
            );

        }

    }

}
