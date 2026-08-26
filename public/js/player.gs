import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js";

export class Player {

    constructor(game) {

        this.game = game;
        this.scene = game.scene;
        this.camera = game.camera;

        // -----------------------------
        // PLAYER DATA
        // -----------------------------

        this.name = "Player";

        this.level = 1;

        this.maxHealth = 100;
        this.health = 100;

        this.maxStamina = 100;
        this.stamina = 100;

        this.maxHunger = 100;
        this.hunger = 100;

        this.speed = 5;
        this.sprintSpeed = 9;

        this.jumpPower = 8;

        this.gravity = 22;

        this.velocity =
            new THREE.Vector3();

        this.position =
            new THREE.Vector3(
                0,
                3,
                0
            );

        // -----------------------------
        // INPUT
        // -----------------------------

        this.keys = {};

        this.mouse = {
            x: 0,
            y: 0
        };

        this.mouseSensitivity =
            0.0025;

        this.isSprinting = false;
        this.isGrounded = false;

        this.yaw = 0;
        this.pitch = -0.15;

        // -----------------------------
        // PLAYER MODEL
        // -----------------------------

        this.object = null;

        this.cameraDistance = 7;
        this.cameraHeight = 3;

    }


    // =================================================
    // INITIALIZE
    // =================================================

    async init() {

        this.createPlayer();

        this.setupKeyboard();

        this.setupMouse();

        this.setupCamera();

        return true;

    }


    // =================================================
    // CREATE PLAYER
    // =================================================

    createPlayer() {

        this.object =
            new THREE.Group();


        // -----------------------------
        // BODY
        // -----------------------------

        const bodyGeometry =
            new THREE.CapsuleGeometry(
                0.45,
                1.2,
                6,
                12
            );

        const bodyMaterial =
            new THREE.MeshStandardMaterial({

                color: 0x536a7a,

                roughness: 0.85

            });


        const body =
            new THREE.Mesh(
                bodyGeometry,
                bodyMaterial
            );

        body.position.y =
            1.25;

        body.castShadow =
            true;

        body.receiveShadow =
            true;

        this.object.add(
            body
        );


        // -----------------------------
        // HEAD
        // -----------------------------

        const headGeometry =
            new THREE.SphereGeometry(
                0.38,
                16,
                12
            );

        const headMaterial =
            new THREE.MeshStandardMaterial({

                color: 0xb98263,

                roughness: 0.8

            });


        const head =
            new THREE.Mesh(
                headGeometry,
                headMaterial
            );

        head.position.y =
            2.35;

        head.castShadow =
            true;

        this.object.add(
            head
        );


        // -----------------------------
        // EYES
        // -----------------------------

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
            2.39,
            -0.34
        );


        const rightEye =
            new THREE.Mesh(
                eyeGeometry,
                eyeMaterial
            );

        rightEye.position.set(
            0.13,
            2.39,
            -0.34
        );


        this.object.add(
            leftEye,
            rightEye
        );


        // -----------------------------
        // ARMS
        // -----------------------------

        const armGeometry =
            new THREE.CapsuleGeometry(
                0.13,
                0.75,
                5,
                8
            );

        const armMaterial =
            new THREE.MeshStandardMaterial({

                color: 0x536a7a

            });


        const leftArm =
            new THREE.Mesh(
                armGeometry,
                armMaterial
            );

        leftArm.position.set(
            -0.58,
            1.35,
            0
        );

        leftArm.rotation.z =
            -0.12;


        const rightArm =
            new THREE.Mesh(
                armGeometry,
                armMaterial
            );

        rightArm.position.set(
            0.58,
            1.35,
            0
        );

        rightArm.rotation.z =
            0.12;


        this.object.add(
            leftArm,
            rightArm
        );


        // -----------------------------
        // LEGS
        // -----------------------------

        const legGeometry =
            new THREE.CapsuleGeometry(
                0.16,
                0.85,
                5,
                8
            );

        const legMaterial =
            new THREE.MeshStandardMaterial({

                color: 0x303941

            });


        const leftLeg =
            new THREE.Mesh(
                legGeometry,
                legMaterial
            );

        leftLeg.position.set(
            -0.23,
            0.55,
            0
        );


        const rightLeg =
            new THREE.Mesh(
                legGeometry,
                legMaterial
            );

        rightLeg.position.set(
            0.23,
            0.55,
            0
        );


        this.object.add(
            leftLeg,
            rightLeg
        );


        // -----------------------------
        // PLAYER POSITION
        // -----------------------------

        const ground =
            this.game.world
                ? this.game.world.getGroundHeight(
                    0,
                    0
                )
                : 0;


        this.position.set(
            0,
            ground,
            0
        );


        this.object.position.copy(
            this.position
        );


        this.scene.add(
            this.object
        );

    }


    // =================================================
    // KEYBOARD
    // =================================================

    setupKeyboard() {

        window.addEventListener(
            "keydown",
            (event) => {

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
            (event) => {

                this.keys[
                    event.code
                ] = false;

            }
        );

    }


    // =================================================
    // MOUSE
    // =================================================

    setupMouse() {

        window.addEventListener(
            "mousemove",
            (event) => {

                if (
                    document.pointerLockElement
                    !==
                    this.game.renderer.domElement
                ) {

                    return;

                }


                this.yaw -=
                    event.movementX *
                    this.mouseSensitivity;

                this.pitch -=
                    event.movementY *
                    this.mouseSensitivity;


                this.pitch =
                    THREE.MathUtils.clamp(
                        this.pitch,
                        -1.1,
                        0.7
                    );

            }
        );


        this.game.renderer.domElement
            .addEventListener(
                "click",
                () => {

                    if (
                        window.innerWidth >=
                        800
                    ) {

                        this.game.renderer
                            .domElement
                            .requestPointerLock();

                    }

                }
            );

    }


    // =================================================
    // CAMERA
    // =================================================

    setupCamera() {

        this.camera.position.set(
            0,
            5,
            10
        );

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


        if (
            this.stamina < 10
        ) {

            return;

        }


        this.velocity.y =
            this.jumpPower;

        this.isGrounded =
            false;

        this.stamina -=
            10;

    }


    // =================================================
    // MOVEMENT
    // =================================================

    getMovementInput() {

        let x = 0;
        let z = 0;


        if (
            this.keys["KeyW"] ||
            this.keys["ArrowUp"]
        ) {

            z -= 1;

        }


        if (
            this.keys["KeyS"] ||
            this.keys["ArrowDown"]
        ) {

            z += 1;

        }


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


        const length =
            Math.sqrt(
                x * x +
                z * z
            );


        if (
            length > 0
        ) {

            x /= length;
            z /= length;

        }


        return {
            x,
            z
        };

    }


    // =================================================
    // UPDATE MOVEMENT
    // =================================================

    updateMovement(
        delta
    ) {

        const input =
            this.getMovementInput();


        // -----------------------------
        // SPRINT
        // -----------------------------

        this.isSprinting =
            (
                this.keys["ShiftLeft"] ||
                this.keys["ShiftRight"]
            ) &&
            input.z !== 0 &&
            this.stamina > 0;


        let currentSpeed =
            this.speed;


        if (
            this.isSprinting
        ) {

            currentSpeed =
                this.sprintSpeed;

            this.stamina -=
                delta * 18;

        } else {

            this.stamina +=
                delta * 10;

        }


        this.stamina =
            THREE.MathUtils.clamp(
                this.stamina,
                0,
                this.maxStamina
            );


        // -----------------------------
        // CAMERA DIRECTION
        // -----------------------------

        const forward =
            new THREE.Vector3(
                -Math.sin(this.yaw),
                0,
                -Math.cos(this.yaw)
            );


        const right =
            new THREE.Vector3(
                Math.cos(this.yaw),
                0,
                -Math.sin(this.yaw)
            );


        const direction =
            new THREE.Vector3();


        direction.addScaledVector(
            forward,
            -input.z
        );


        direction.addScaledVector(
            right,
            input.x
        );


        if (
            direction.lengthSq() > 0
        ) {

            direction.normalize();

            this.object.rotation.y =
                Math.atan2(
                    direction.x,
                    direction.z
                );

        }


        this.position.x +=
            direction.x *
            currentSpeed *
            delta;

        this.position.z +=
            direction.z *
            currentSpeed *
            delta;

    }


    // =================================================
    // GRAVITY
    // =================================================

    updateGravity(
        delta
    ) {

        this.velocity.y -=
            this.gravity *
            delta;


        this.position.y +=
            this.velocity.y *
            delta;


        const ground =
            this.game.world
                .getGroundHeight(
                    this.position.x,
                    this.position.z
                );


        if (
            this.position.y <=
            ground
        ) {

            this.position.y =
                ground;

            this.velocity.y =
                0;

            this.isGrounded =
                true;

        } else {

            this.isGrounded =
                false;

        }

    }


    // =================================================
    // CAMERA FOLLOW
    // =================================================

    updateCamera(
        delta
    ) {

        const target =
            new THREE.Vector3(
                this.position.x,
                this.position.y +
                    this.cameraHeight,
                this.position.z
            );


        const horizontalDistance =
            this.cameraDistance *
            Math.cos(
                this.pitch
            );


        const verticalDistance =
            this.cameraDistance *
            Math.sin(
                this.pitch
            );


        const cameraPosition =
            new THREE.Vector3(

                target.x +
                Math.sin(this.yaw) *
                horizontalDistance,

                target.y +
                verticalDistance,

                target.z +
                Math.cos(this.yaw) *
                horizontalDistance

            );


        this.camera.position.lerp(
            cameraPosition,
            Math.min(
                1,
                delta * 8
            )
        );


        this.camera.lookAt(
            target
        );

    }


    // =================================================
    // HUNGER
    // =================================================

    updateHunger(
        delta
    ) {

        this.hunger -=
            delta * 0.25;


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
                delta * 1.5;

        }

    }


    // =================================================
    // DAMAGE
    // =================================================

    takeDamage(
        amount
    ) {

        this.health -=
            amount;


        this.health =
            THREE.MathUtils.clamp(
                this.health,
                0,
                this.maxHealth
            );


        if (
            this.health <= 0
        ) {

            this.die();

        }

    }


    // =================================================
    // HEAL
    // =================================================

    heal(
        amount
    ) {

        this.health +=
            amount;


        this.health =
            THREE.MathUtils.clamp(
                this.health,
                0,
                this.maxHealth
            );

    }


    // =================================================
    // DEATH
    // =================================================

    die() {

        console.log(
            "Player died."
        );

        this.health =
            this.maxHealth;

        this.hunger =
            this.maxHunger;

        this.stamina =
            this.maxStamina;


        const ground =
            this.game.world
                .getGroundHeight(
                    0,
                    0
                );


        this.position.set(
            0,
            ground,
            0
        );

    }


    // =================================================
    // UPDATE
    // =================================================

    update(
        delta,
        elapsed
    ) {

        if (
            !this.object
        ) {

            return;

        }


        this.updateMovement(
            delta
        );


        this.updateGravity(
            delta
        );


        this.updateHunger(
            delta
        );


        this.object.position.copy(
            this.position
        );


        this.updateCamera(
            delta
        );

    }

}
