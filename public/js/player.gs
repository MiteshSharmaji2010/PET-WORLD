import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js";

export class Player {

    constructor(game) {

        this.game = game;

        // =============================================
        // PLAYER OBJECT
        // =============================================

        this.object = null;

        this.body = null;

        this.head = null;


        // =============================================
        // PLAYER STATS
        // =============================================

        this.maxHealth = 100;

        this.health = 100;

        this.maxStamina = 100;

        this.stamina = 100;

        this.maxHunger = 100;

        this.hunger = 100;


        // =============================================
        // MOVEMENT
        // =============================================

        this.walkSpeed = 4;

        this.sprintSpeed = 7;

        this.jumpPower = 7;

        this.gravity = 20;

        this.velocity = new THREE.Vector3();

        this.isGrounded = true;

        this.isSprinting = false;


        // =============================================
        // INPUT
        // =============================================

        this.keys = {

            forward: false,

            backward: false,

            left: false,

            right: false,

            jump: false,

            sprint: false

        };


        // Mobile

        this.mobileMoveX = 0;

        this.mobileMoveZ = 0;

        this.mobileSprint = false;


        // =============================================
        // CAMERA
        // =============================================

        this.cameraDistance = 5;

        this.cameraHeight = 2.2;

        this.cameraSmoothness = 8;


        // =============================================
        // STATE
        // =============================================

        this.spawnPosition =
            new THREE.Vector3(
                0,
                2,
                0
            );


        this.damageCooldown = 0;

        this.hungerTimer = 0;

    }


    // =================================================
    // INITIALIZE
    // =================================================

    async init() {

        this.createModel();

        this.setupKeyboard();

        this.spawn();

    }


    // =================================================
    // CREATE PLAYER MODEL
    // =================================================

    createModel() {

        const group =
            new THREE.Group();


        // =============================================
        // MATERIALS
        // =============================================

        const skinMaterial =
            new THREE.MeshStandardMaterial({

                color: 0xd29b78,

                roughness: 0.8

            });


        const shirtMaterial =
            new THREE.MeshStandardMaterial({

                color: 0x334b67,

                roughness: 0.85

            });


        const pantsMaterial =
            new THREE.MeshStandardMaterial({

                color: 0x252a30,

                roughness: 0.9

            });


        const shoeMaterial =
            new THREE.MeshStandardMaterial({

                color: 0x111111,

                roughness: 0.95

            });


        // =============================================
        // BODY
        // =============================================

        const bodyGeometry =
            new THREE.CapsuleGeometry(
                0.38,
                0.75,
                6,
                10
            );


        this.body =
            new THREE.Mesh(
                bodyGeometry,
                shirtMaterial
            );


        this.body.position.y =
            1.15;


        this.body.castShadow =
            true;


        group.add(
            this.body
        );


        // =============================================
        // HEAD
        // =============================================

        const headGeometry =
            new THREE.SphereGeometry(
                0.32,
                16,
                12
            );


        this.head =
            new THREE.Mesh(
                headGeometry,
                skinMaterial
            );


        this.head.position.y =
            1.95;


        this.head.castShadow =
            true;


        group.add(
            this.head
        );


        // =============================================
        // HAIR
        // =============================================

        const hairGeometry =
            new THREE.SphereGeometry(
                0.34,
                16,
                8,
                0,
                Math.PI * 2,
                0,
                Math.PI * 0.55
            );


        const hairMaterial =
            new THREE.MeshStandardMaterial({

                color: 0x151515,

                roughness: 0.9

            });


        const hair =
            new THREE.Mesh(
                hairGeometry,
                hairMaterial
            );


        hair.position.y =
            2.04;


        hair.castShadow =
            true;


        group.add(
            hair
        );


        // =============================================
        // EYES
        // =============================================

        const eyeMaterial =
            new THREE.MeshBasicMaterial({
                color: 0x111111
            });


        const eyeGeometry =
            new THREE.SphereGeometry(
                0.045,
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
            1.98,
            -0.29
        );


        const rightEye =
            leftEye.clone();


        rightEye.position.x =
            0.11;


        group.add(
            leftEye
        );

        group.add(
            rightEye
        );


        // =============================================
        // LEGS
        // =============================================

        const legGeometry =
            new THREE.CapsuleGeometry(
                0.15,
                0.65,
                5,
                8
            );


        const leftLeg =
            new THREE.Mesh(
                legGeometry,
                pantsMaterial
            );


        leftLeg.position.set(
            -0.18,
            0.43,
            0
        );


        const rightLeg =
            leftLeg.clone();


        rightLeg.position.x =
            0.18;


        leftLeg.castShadow =
            true;


        rightLeg.castShadow =
            true;


        group.add(
            leftLeg
        );

        group.add(
            rightLeg
        );


        // =============================================
        // SHOES
        // =============================================

        const shoeGeometry =
            new THREE.BoxGeometry(
                0.28,
                0.16,
                0.48
            );


        const leftShoe =
            new THREE.Mesh(
                shoeGeometry,
                shoeMaterial
            );


        leftShoe.position.set(
            -0.18,
            0.08,
            -0.05
        );


        const rightShoe =
            leftShoe.clone();


        rightShoe.position.x =
            0.18;


        leftShoe.castShadow =
            true;


        rightShoe.castShadow =
            true;


        group.add(
            leftShoe
        );

        group.add(
            rightShoe
        );


        // =============================================
        // COLLISION SIZE
        // =============================================

        group.userData.radius =
            0.45;


        group.userData.height =
            2.25;


        this.object =
            group;


        this.game.scene.add(
            group
        );

    }


    // =================================================
    // SPAWN
    // =================================================

    spawn() {

        if (
            !this.object
        ) {

            return;

        }


        this.object.position.copy(
            this.spawnPosition
        );


        this.velocity.set(
            0,
            0,
            0
        );


        this.health =
            this.maxHealth;

        this.stamina =
            this.maxStamina;

        this.hunger =
            this.maxHunger;

    }


    // =================================================
    // KEYBOARD
    // =================================================

    setupKeyboard() {

        window.addEventListener(
            "keydown",
            event => {

                switch (
                    event.code
                ) {

                    case "KeyW":
                    case "ArrowUp":

                        this.keys.forward =
                            true;

                        break;


                    case "KeyS":
                    case "ArrowDown":

                        this.keys.backward =
                            true;

                        break;


                    case "KeyA":
                    case "ArrowLeft":

                        this.keys.left =
                            true;

                        break;


                    case "KeyD":
                    case "ArrowRight":

                        this.keys.right =
                            true;

                        break;


                    case "Space":

                        this.keys.jump =
                            true;

                        break;


                    case "ShiftLeft":
                    case "ShiftRight":

                        this.keys.sprint =
                            true;

                        break;

                }

            }
        );


        window.addEventListener(
            "keyup",
            event => {

                switch (
                    event.code
                ) {

                    case "KeyW":
                    case "ArrowUp":

                        this.keys.forward =
                            false;

                        break;


                    case "KeyS":
                    case "ArrowDown":

                        this.keys.backward =
                            false;

                        break;


                    case "KeyA":
                    case "ArrowLeft":

                        this.keys.left =
                            false;

                        break;


                    case "KeyD":
                    case "ArrowRight":

                        this.keys.right =
                            false;

                        break;


                    case "Space":

                        this.keys.jump =
                            false;

                        break;


                    case "ShiftLeft":
                    case "ShiftRight":

                        this.keys.sprint =
                            false;

                        break;

                }

            }
        );

    }


    // =================================================
    // MOBILE INPUT
    // =================================================

    setMobileInput(
        x,
        z,
        sprint = false
    ) {

        this.mobileMoveX =
            Math.max(
                -1,
                Math.min(
                    1,
                    Number(x) || 0
                )
            );


        this.mobileMoveZ =
            Math.max(
                -1,
                Math.min(
                    1,
                    Number(z) || 0
                )
            );


        this.mobileSprint =
            Boolean(
                sprint
            );

    }


    // =================================================
    // JUMP
    // =================================================

    jump() {

        if (
            !this.isGrounded
        ) {

            return false;

        }


        if (
            this.stamina < 8
        ) {

            return false;

        }


        this.velocity.y =
            this.jumpPower;


        this.isGrounded =
            false;


        this.stamina -=
            8;


        return true;

    }


    // =================================================
    // DAMAGE
    // =================================================

    damage(
        amount
    ) {

        if (
            this.damageCooldown >
            0
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


        this.damageCooldown =
            0.35;


        if (
            this.game.ui
        ) {

            this.game.ui.notify(
                `-${Math.round(amount)} HP`
            );

        }


        if (
            this.health <=
            0
        ) {

            this.health =
                0;

            this.die();

        }

    }


    // =================================================
    // HEAL
    // =================================================

    heal(
        amount
    ) {

        amount =
            Math.max(
                0,
                Number(amount) || 0
            );


        this.health =
            Math.min(
                this.maxHealth,
                this.health +
                amount
            );

    }


    // =================================================
    // MOVEMENT
    // =================================================

    update(
        delta
    ) {

        if (
            !this.object
        ) {

            return;

        }


        this.damageCooldown =
            Math.max(
                0,
                this.damageCooldown -
                delta
            );


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


        this.updateAnimation(
            delta
        );

    }


    // =================================================
    // MOVEMENT INPUT
    // =================================================

    updateMovement(
        delta
    ) {

        const keyboardX =
            (
                this.keys.right
                    ? 1
                    : 0
            ) -
            (
                this.keys.left
                    ? 1
                    : 0
            );


        const keyboardZ =
            (
                this.keys.backward
                    ? 1
                    : 0
            ) -
            (
                this.keys.forward
                    ? 1
                    : 0
            );


        let moveX =
            keyboardX;


        let moveZ =
            keyboardZ;


        // Mobile takes priority.

        if (
            Math.abs(
                this.mobileMoveX
            ) >
            0.05 ||
            Math.abs(
                this.mobileMoveZ
            ) >
            0.05
        ) {

            moveX =
                this.mobileMoveX;

            moveZ =
                this.mobileMoveZ;

        }


        const inputLength =
            Math.sqrt(
                moveX * moveX +
                moveZ * moveZ
            );


        if (
            inputLength >
            1
        ) {

            moveX /=
                inputLength;

            moveZ /=
                inputLength;

        }


        this.isSprinting =
            (
                this.keys.sprint ||
                this.mobileSprint
            ) &&
            inputLength >
            0.1 &&
            this.stamina >
            1;


        const speed =
            this.isSprinting
                ? this.sprintSpeed
                : this.walkSpeed;


        if (
            inputLength >
            0.05
        ) {

            const camera =
                this.game.camera;


            const forward =
                new THREE.Vector3(
                    0,
                    0,
                    -1
                );


            forward.applyQuaternion(
                camera.quaternion
            );


            forward.y =
                0;


            forward.normalize();


            const right =
                new THREE.Vector3(
                    1,
                    0,
                    0
                );


            right.applyQuaternion(
                camera.quaternion
            );


            right.y =
                0;


            right.normalize();


            const direction =
                new THREE.Vector3();


            direction.addScaledVector(
                right,
                moveX
            );


            direction.addScaledVector(
                forward,
                -moveZ
            );


            direction.normalize();


            this.velocity.x =
                direction.x *
                speed;


            this.velocity.z =
                direction.z *
                speed;


            // Face movement direction.

            const targetRotation =
                Math.atan2(
                    direction.x,
                    direction.z
                );


            this.object.rotation.y =
                this.smoothRotation(
                    this.object.rotation.y,
                    targetRotation,
                    delta * 10
                );


            // Sprint consumes stamina.

            if (
                this.isSprinting
            ) {

                this.stamina -=
                    20 *
                    delta;

            } else {

                this.stamina +=
                    12 *
                    delta;

            }

        } else {

            this.velocity.x =
                THREE.MathUtils.damp(
                    this.velocity.x,
                    0,
                    8,
                    delta
                );


            this.velocity.z =
                THREE.MathUtils.damp(
                    this.velocity.z,
                    0,
                    8,
                    delta
                );


            this.stamina +=
                16 *
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


        if (
            this.keys.jump
        ) {

            this.jump();

        }

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


        this.object.position.y +=
            this.velocity.y *
            delta;


        const ground =
            this.getGroundHeight();


        if (
            this.object.position.y <=
            ground
        ) {

            this.object.position.y =
                ground;


            this.velocity.y =
                0;


            this.isGrounded =
                true;

        } else {

            this.isGrounded =
                false;

        }


        this.object.position.x +=
            this.velocity.x *
            delta;


        this.object.position.z +=
            this.velocity.z *
            delta;


        this.limitWorldBounds();

    }


    // =================================================
    // GROUND
    // =================================================

    getGroundHeight() {

        if (
            this.game.world &&
            typeof this.game.world
                .getTerrainHeight ===
                "function"
        ) {

            return this.game.world
                .getTerrainHeight(
                    this.object.position.x,
                    this.object.position.z
                );

        }


        return 0;

    }


    // =================================================
    // WORLD BOUNDS
    // =================================================

    limitWorldBounds() {

        const limit =
            250;


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
    // HUNGER
    // =================================================

    updateHunger(
        delta
    ) {

        this.hungerTimer +=
            delta;


        if (
            this.hungerTimer <
            10
        ) {

            return;

        }


        this.hungerTimer =
            0;


        this.hunger =
            Math.max(
                0,
                this.hunger -
                0.5
            );


        if (
            this.hunger <=
            0
        ) {

            this.health =
                Math.max(
                    1,
                    this.health -
                    1
                );

        }

    }


    // =================================================
    // CAMERA
    // =================================================

    updateCamera(
        delta
    ) {

        const camera =
            this.game.camera;


        if (
            !camera
        ) {

            return;

        }


        const target =
            this.object.position
                .clone();


        target.y +=
            this.cameraHeight;


        const cameraOffset =
            new THREE.Vector3(
                0,
                1.2,
                this.cameraDistance
            );


        cameraOffset.applyQuaternion(
            camera.quaternion
        );


        const desired =
            target.clone()
                .add(
                    cameraOffset
                );


        const smoothing =
            1 -
            Math.exp(
                -this.cameraSmoothness *
                delta
            );


        camera.position.lerp(
            desired,
            smoothing
        );

    }


    // =================================================
    // ANIMATION
    // =================================================

    updateAnimation(
        delta
    ) {

        if (
            !this.body
        ) {

            return;

        }


        const horizontalSpeed =
            Math.sqrt(
                this.velocity.x *
                    this.velocity.x +
                this.velocity.z *
                    this.velocity.z
            );


        if (
            horizontalSpeed >
            0.2
        ) {

            const time =
                this.game.elapsed ||
                0;


            this.body.rotation.z =
                Math.sin(
                    time * 10
                ) *
                0.03;


            this.head.rotation.z =
                Math.sin(
                    time * 10
                ) *
                0.015;

        } else {

            this.body.rotation.z =
                THREE.MathUtils.damp(
                    this.body.rotation.z,
                    0,
                    8,
                    delta
                );


            this.head.rotation.z =
                THREE.MathUtils.damp(
                    this.head.rotation.z,
                    0,
                    8,
                    delta
                );

        }

    }


    // =================================================
    // DEATH
    // =================================================

    die() {

        this.health =
            this.maxHealth;


        this.stamina =
            this.maxStamina;


        this.hunger =
            this.maxHunger;


        this.velocity.set(
            0,
            0,
            0
        );


        this.object.position.copy(
            this.spawnPosition
        );


        if (
            this.game.ui
        ) {

            this.game.ui.notify(
                "You died! Respawning..."
            );

        }

    }


    // =================================================
    // ROTATION
    // =================================================

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
                1,
                amount
            )
        );

    }

}
