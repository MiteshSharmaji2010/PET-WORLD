import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js";


/*
=========================================================
                    PET WORLD
                    PLAYER SYSTEM
=========================================================

Features:

- 3D player
- WASD movement
- Arrow-key movement
- Sprint
- Stamina
- Jump
- Gravity
- Terrain collision
- World boundary
- Third-person camera
- Mouse camera control
- Touch camera control
- Mobile joystick support
- Health
- Hunger
- Damage
- Healing
- Food
- Death
- Respawn
- Player rotation
- Animation state
- Camera smoothing
- Camera collision
- Safe spawn
- Player state helpers
=========================================================
*/


export class Player {

    constructor(game) {

        this.game = game;


        // =================================================
        // PLAYER OBJECT
        // =================================================

        this.object = null;

        this.body = null;

        this.head = null;

        this.leftArm = null;

        this.rightArm = null;

        this.leftLeg = null;

        this.rightLeg = null;


        // =================================================
        // MOVEMENT
        // =================================================

        this.speed = 6;

        this.runSpeed = 10;

        this.jumpPower = 8;

        this.gravity = 22;


        this.verticalVelocity = 0;


        this.grounded = true;


        this.running = false;


        this.dead = false;


        // =================================================
        // PLAYER STATS
        // =================================================

        this.health = 100;

        this.maxHealth = 100;


        this.stamina = 100;

        this.maxStamina = 100;


        this.hunger = 100;

        this.maxHunger = 100;


        // =================================================
        // MOVEMENT INPUT
        // =================================================

        this.keys = {};


        this.moveInput = {

            x: 0,

            y: 0

        };


        this.keyboardInput = {

            x: 0,

            y: 0

        };


        // =================================================
        // CAMERA
        // =================================================

        this.yaw = 0;

        this.pitch = -0.25;


        this.cameraDistance = 7;

        this.cameraHeight = 3.2;


        this.cameraMinDistance = 3;

        this.cameraMaxDistance = 12;


        this.cameraTarget =
            new THREE.Vector3();


        this.cameraPosition =
            new THREE.Vector3();


        this.cameraLookTarget =
            new THREE.Vector3();


        this.cameraCollision =
            new THREE.Vector3();


        // =================================================
        // CAMERA SETTINGS
        // =================================================

        this.cameraSensitivity = 0.006;

        this.touchSensitivity = 0.004;


        this.cameraSmoothness = 8;


        this.cameraEnabled = true;


        // =================================================
        // POINTER
        // =================================================

        this.dragging = false;


        this.lastPointerX = 0;

        this.lastPointerY = 0;


        this.pointerStartedOnUI = false;


        // =================================================
        // MOBILE
        // =================================================

        this.mobileInput = {

            x: 0,

            y: 0

        };


        // =================================================
        // ANIMATION
        // =================================================

        this.walkTime = 0;

        this.animationSpeed = 8;


        this.isMoving = false;


        // =================================================
        // DEATH
        // =================================================

        this.respawnTimer = null;


        // =================================================
        // INITIALIZATION
        // =================================================

        this.initialized = false;


        // =================================================
        // BIND INPUT
        // =================================================

        this.bindKeyboard();

    }


    // =====================================================
    // INITIALIZE
    // =====================================================

    async init() {

        if (
            this.initialized
        ) {

            return;

        }


        this.createPlayer();


        this.setupCamera();


        this.setupPointer();


        this.findSafeSpawn();


        this.initialized =
            true;

    }


    // =====================================================
    // CREATE PLAYER
    // =====================================================

    createPlayer() {

        const group =
            new THREE.Group();


        group.name =
            "Player";


        // =================================================
        // MATERIALS
        // =================================================

        const bodyMaterial =
            new THREE.MeshStandardMaterial({

                color: 0x486a7a,

                roughness: 0.8,

                metalness: 0.05

            });


        const skinMaterial =
            new THREE.MeshStandardMaterial({

                color: 0xc98f70,

                roughness: 0.9,

                metalness: 0

            });


        const darkMaterial =
            new THREE.MeshStandardMaterial({

                color: 0x17232b,

                roughness: 0.9

            });


        const shoeMaterial =
            new THREE.MeshStandardMaterial({

                color: 0x202020,

                roughness: 0.95

            });


        // =================================================
        // BODY
        // =================================================

        this.body =
            new THREE.Mesh(

                new THREE.CapsuleGeometry(

                    0.38,

                    0.85,

                    6,

                    10

                ),

                bodyMaterial

            );


        this.body.position.y =
            1.05;


        this.body.castShadow =
            true;


        this.body.receiveShadow =
            true;


        group.add(
            this.body
        );


        // =================================================
        // HEAD
        // =================================================

        this.head =
            new THREE.Mesh(

                new THREE.SphereGeometry(

                    0.32,

                    14,

                    12

                ),

                skinMaterial

            );


        this.head.position.y =
            1.92;


        this.head.castShadow =
            true;


        group.add(
            this.head
        );


        // =================================================
        // HAIR
        // =================================================

        const hair =
            new THREE.Mesh(

                new THREE.SphereGeometry(

                    0.335,

                    14,

                    8,

                    0,

                    Math.PI * 2,

                    0,

                    Math.PI * 0.55

                ),

                darkMaterial

            );


        hair.position.y =
            2.03;


        hair.castShadow =
            true;


        group.add(
            hair
        );


        // =================================================
        // EYES
        // =================================================

        const eyeMaterial =
            new THREE.MeshStandardMaterial({

                color: 0x111111,

                roughness: 0.5

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

            1.98,

            -0.285

        );


        const rightEye =
            new THREE.Mesh(

                eyeGeometry,

                eyeMaterial

            );


        rightEye.position.set(

            0.11,

            1.98,

            -0.285

        );


        group.add(
            leftEye
        );


        group.add(
            rightEye
        );


        // =================================================
        // LEFT ARM
        // =================================================

        this.leftArm =
            new THREE.Mesh(

                new THREE.CapsuleGeometry(

                    0.10,

                    0.55,

                    5,

                    8

                ),

                bodyMaterial

            );


        this.leftArm.position.set(

            -0.48,

            1.08,

            0

        );


        this.leftArm.rotation.z =
            -0.08;


        this.leftArm.castShadow =
            true;


        group.add(
            this.leftArm
        );


        // =================================================
        // RIGHT ARM
        // =================================================

        this.rightArm =
            new THREE.Mesh(

                new THREE.CapsuleGeometry(

                    0.10,

                    0.55,

                    5,

                    8

                ),

                bodyMaterial

            );


        this.rightArm.position.set(

            0.48,

            1.08,

            0

        );


        this.rightArm.rotation.z =
            0.08;


        this.rightArm.castShadow =
            true;


        group.add(
            this.rightArm
        );


        // =================================================
        // LEFT LEG
        // =================================================

        this.leftLeg =
            new THREE.Mesh(

                new THREE.CapsuleGeometry(

                    0.12,

                    0.55,

                    5,

                    8

                ),

                darkMaterial

            );


        this.leftLeg.position.set(

            -0.19,

            0.48,

            0

        );


        this.leftLeg.castShadow =
            true;


        group.add(
            this.leftLeg
        );


        // =================================================
        // RIGHT LEG
        // =================================================

        this.rightLeg =
            new THREE.Mesh(

                new THREE.CapsuleGeometry(

                    0.12,

                    0.55,

                    5,

                    8

                ),

                darkMaterial

            );


        this.rightLeg.position.set(

            0.19,

            0.48,

            0

        );


        this.rightLeg.castShadow =
            true;


        group.add(
            this.rightLeg
        );


        // =================================================
        // SHOES
        // =================================================

        const leftShoe =
            new THREE.Mesh(

                new THREE.BoxGeometry(

                    0.28,

                    0.15,

                    0.42

                ),

                shoeMaterial

            );


        leftShoe.position.set(

            -0.19,

            0.12,

            -0.05

        );


        leftShoe.castShadow =
            true;


        group.add(
            leftShoe
        );


        const rightShoe =
            new THREE.Mesh(

                new THREE.BoxGeometry(

                    0.28,

                    0.15,

                    0.42

                ),

                shoeMaterial

            );


        rightShoe.position.set(

            0.19,

            0.12,

            -0.05

        );


        rightShoe.castShadow =
            true;


        group.add(
            rightShoe
        );


        // =================================================
        // SPAWN
        // =================================================

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


    // =====================================================
    // FIND SAFE SPAWN
    // =====================================================

    findSafeSpawn() {

        if (
            !this.object
        ) {

            return;

        }


        let x = 0;

        let z = 0;

        let y = 0;


        if (
            this.game.world &&
            typeof this.game.world.getTerrainHeight ===
            "function"
        ) {

            try {

                y =
                    this.game.world
                        .getTerrainHeight(
                            x,
                            z
                        );

            } catch (
                error
            ) {

                console.warn(
                    "Could not get spawn terrain height:",
                    error
                );

            }

        }


        this.object.position.set(

            x,

            y,

            z

        );


        this.verticalVelocity =
            0;


        this.grounded =
            true;

    }


    // =====================================================
    // CAMERA SETUP
    // =====================================================

    setupCamera() {

        if (
            !this.game.camera
        ) {

            return;

        }


        this.updateCamera(
            1
        );

    }


    // =====================================================
    // CAMERA UPDATE
    // =====================================================

    updateCamera(
        delta
    ) {

        if (
            !this.object ||
            !this.game.camera ||
            !this.cameraEnabled
        ) {

            return;

        }


        const playerPosition =
            this.object.position;


        // =================================================
        // CAMERA DISTANCE
        // =================================================

        const horizontalDistance =
            this.cameraDistance *
            Math.cos(
                this.pitch
            );


        // =================================================
        // CAMERA POSITION
        // =================================================

        const cameraX =
            playerPosition.x -

            Math.sin(
                this.yaw
            ) *

            horizontalDistance;


        const cameraZ =
            playerPosition.z -

            Math.cos(
                this.yaw
            ) *

            horizontalDistance;


        const cameraY =
            playerPosition.y +

            this.cameraHeight -

            Math.sin(
                this.pitch
            ) *

            this.cameraDistance;


        this.cameraTarget.set(

            cameraX,

            cameraY,

            cameraZ

        );


        // =================================================
        // CAMERA COLLISION
        // =================================================

        this.cameraCollision.copy(
            this.cameraTarget
        );


        this.applyCameraCollision();


        // =================================================
        // SMOOTH CAMERA
        // =================================================

        const smooth =
            Math.min(

                1,

                Math.max(
                    0,
                    delta
                ) *
                this.cameraSmoothness

            );


        this.game.camera.position.lerp(

            this.cameraCollision,

            smooth

        );


        // =================================================
        // LOOK TARGET
        // =================================================

        this.cameraLookTarget.set(

            playerPosition.x,

            playerPosition.y + 1.15,

            playerPosition.z

        );


        this.game.camera.lookAt(
            this.cameraLookTarget
        );

    }


    // =====================================================
    // CAMERA COLLISION
    // =====================================================

    applyCameraCollision() {

        if (
            !this.game.world
        ) {

            return;

        }


        // Terrain-based minimum height

        if (
            typeof this.game.world.getTerrainHeight ===
            "function"
        ) {

            try {

                const ground =
                    this.game.world
                        .getTerrainHeight(

                            this.cameraCollision.x,

                            this.cameraCollision.z

                        );


                const minimumCameraHeight =
                    ground + 1.0;


                if (
                    this.cameraCollision.y <
                    minimumCameraHeight
                ) {

                    this.cameraCollision.y =
                        minimumCameraHeight;

                }

            } catch (
                error
            ) {

                // Ignore terrain collision errors.

            }

        }

    }


    // =====================================================
    // KEYBOARD
    // =====================================================

    bindKeyboard() {

        window.addEventListener(

            "keydown",

            event => {

                this.keys[
                    event.code
                ] = true;


                // Jump

                if (
                    event.code ===
                    "Space"
                ) {

                    event.preventDefault();

                    this.jump();

                }


                // Sprint

                if (

                    event.code ===
                    "ShiftLeft" ||

                    event.code ===
                    "ShiftRight"

                ) {

                    this.running =
                        true;

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

                    event.code ===
                    "ShiftLeft" ||

                    event.code ===
                    "ShiftRight"

                ) {

                    this.running =
                        false;

                }

            }

        );

    }


    // =====================================================
    // UPDATE
    // =====================================================

    update(
        delta
    ) {

        if (
            !this.object ||
            this.dead
        ) {

            return;

        }


        delta =
            Math.min(

                Math.max(
                    Number(delta) || 0,
                    0
                ),

                0.05

            );


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


        this.updateAnimation(
            delta
        );


        this.updateCamera(
            delta
        );

    }


    // =====================================================
    // KEYBOARD INPUT
    // =====================================================

    updateKeyboardInput() {

        let x = 0;

        let y = 0;


        // A

        if (

            this.keys["KeyA"] ||

            this.keys["ArrowLeft"]

        ) {

            x -= 1;

        }


        // D

        if (

            this.keys["KeyD"] ||

            this.keys["ArrowRight"]

        ) {

            x += 1;

        }


        // W

        if (

            this.keys["KeyW"] ||

            this.keys["ArrowUp"]

        ) {

            y += 1;

        }


        // S

        if (

            this.keys["KeyS"] ||

            this.keys["ArrowDown"]

        ) {

            y -= 1;

        }


        // Normalize keyboard

        if (
            x !== 0 ||
            y !== 0
        ) {

            const length =
                Math.sqrt(

                    x * x +

                    y * y

                );


            x /=
                length;


            y /=
                length;

        }


        this.keyboardInput.x =
            x;


        this.keyboardInput.y =
            y;


        // =================================================
        // MOBILE + KEYBOARD
        // =================================================

        const mobileX =
            Number(
                this.mobileInput.x
            ) || 0;


        const mobileY =
            Number(
                this.mobileInput.y
            ) || 0;


        if (

            Math.abs(
                mobileX
            ) > 0.01 ||

            Math.abs(
                mobileY
            ) > 0.01

        ) {

            this.moveInput.x =
                mobileX;


            this.moveInput.y =
                mobileY;

        } else {

            this.moveInput.x =
                x;


            this.moveInput.y =
                y;

        }

    }


    // =====================================================
    // MOVEMENT
    // =====================================================

    updateMovement(
        delta
    ) {

        let x =
            this.moveInput.x;


        let y =
            this.moveInput.y;


        const inputStrength =
            Math.sqrt(

                x * x +

                y * y

            );


        this.isMoving =
            inputStrength >
            0.05;


        if (
            !this.isMoving
        ) {

            this.restoreStamina(
                delta
            );


            return;

        }


        // Normalize

        if (
            inputStrength > 1
        ) {

            x /=
                inputStrength;


            y /=
                inputStrength;

        }


        // =================================================
        // MOVEMENT DIRECTION
        // =================================================

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


        // =================================================
        // SPEED
        // =================================================

        let currentSpeed =
            this.speed;


        const wantsRun =
            this.running &&
            inputStrength > 0.05;


        if (

            wantsRun &&

            this.stamina > 0

        ) {

            currentSpeed =
                this.runSpeed;


            this.stamina -=

                20 *
                delta;

        } else {

            this.restoreStamina(
                delta
            );

        }


        // =================================================
        // LOW STAMINA
        // =================================================

        if (
            this.stamina <= 0
        ) {

            this.running =
                false;

        }


        // =================================================
        // MOVE
        // =================================================

        this.object.position.x +=

            direction.x *

            currentSpeed *

            delta;


        this.object.position.z +=

            direction.z *

            currentSpeed *

            delta;


        // =================================================
        // ROTATE PLAYER
        // =================================================

        if (
            direction.lengthSq() >
            0.001
        ) {

            const targetRotation =
                Math.atan2(

                    direction.x,

                    direction.z

                );


            this.object.rotation.y =
                this.lerpAngle(

                    this.object.rotation.y,

                    targetRotation,

                    Math.min(
                        1,
                        delta * 12
                    )

                );

        }


        // =================================================
        // WORLD LIMIT
        // =================================================

        this.keepInsideWorld();

    }


    // =====================================================
    // STAMINA
    // =====================================================

    restoreStamina(
        delta
    ) {

        this.stamina +=

            12 *
            delta;


        this.stamina =
            Math.max(

                0,

                Math.min(

                    this.maxStamina,

                    this.stamina

                )

            );

    }


    // =====================================================
    // GRAVITY
    // =====================================================

    updateGravity(
        delta
    ) {

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


        let groundY = 0;


        if (
            typeof this.game.world.getTerrainHeight ===
            "function"
        ) {

            try {

                groundY =
                    this.game.world
                        .getTerrainHeight(

                            this.object.position.x,

                            this.object.position.z

                        );

            } catch (
                error
            ) {

                groundY = 0;

            }

        }


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


    // =====================================================
    // JUMP
    // =====================================================

    jump() {

        if (
            this.dead
        ) {

            return false;

        }


        if (
            !this.grounded
        ) {

            return false;

        }


        if (
            this.stamina < 10
        ) {

            if (
                this.game.ui
            ) {

                this.game.ui.notify(
                    "⚡ Not enough stamina"
                );

            }


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


    // =====================================================
    // HUNGER
    // =====================================================

    updateHunger(
        delta
    ) {

        this.hunger -=

            0.7 *

            delta;


        this.hunger =
            Math.max(

                0,

                this.hunger

            );


        // =================================================
        // STARVATION
        // =================================================

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


    // =====================================================
    // DAMAGE
    // =====================================================

    damage(
        amount
    ) {

        if (
            this.dead
        ) {

            return;

        }


        amount =
            Math.max(

                0,

                Number(
                    amount
                ) || 0

            );


        if (
            amount <= 0
        ) {

            return;

        }


        this.health -=
            amount;


        this.health =
            Math.max(

                0,

                this.health

            );


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


    // =====================================================
    // HEAL
    // =====================================================

    heal(
        amount
    ) {

        amount =
            Math.max(

                0,

                Number(
                    amount
                ) || 0

            );


        if (
            amount <= 0
        ) {

            return false;

        }


        const oldHealth =
            this.health;


        this.health =
            Math.min(

                this.maxHealth,

                this.health +
                amount

            );


        return (
            this.health >
            oldHealth
        );

    }


    // =====================================================
    // EAT FOOD
    // =====================================================

    eat(
        hungerAmount = 25
    ) {

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
                    "🍖 No food!"
                );

            }


            return false;

        }


        hungerAmount =
            Math.max(

                0,

                Number(
                    hungerAmount
                ) || 0

            );


        this.hunger =
            Math.min(

                this.maxHunger,

                this.hunger +
                hungerAmount

            );


        // Small healing bonus

        this.heal(
            5
        );


        if (
            this.game.ui
        ) {

            this.game.ui.notify(
                "🍖 Food consumed"
            );

        }


        return true;

    }


    // =====================================================
    // USE HEALING ITEM
    // =====================================================

    usePotion() {

        if (
            !this.game.systems
        ) {

            return false;

        }


        if (
            this.health >=
            this.maxHealth
        ) {

            if (
                this.game.ui
            ) {

                this.game.ui.notify(
                    "❤️ Health is already full"
                );

            }


            return false;

        }


        if (
            !this.game.systems
                .removeItem(
                    "potion",
                    1
                )
        ) {

            if (
                this.game.ui
            ) {

                this.game.ui.notify(
                    "🧪 No potion!"
                );

            }


            return false;

        }


        this.heal(
            35
        );


        if (
            this.game.ui
        ) {

            this.game.ui.notify(
                "🧪 Potion used"
            );

        }


        return true;

    }


    // =====================================================
    // DEATH
    // =====================================================

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


        this.running =
            false;


        this.verticalVelocity =
            0;


        // Stop movement

        this.moveInput.x =
            0;


        this.moveInput.y =
            0;


        // Visual death

        if (
            this.object
        ) {

            this.object.rotation.z =
                Math.PI / 2;

        }


        if (
            this.game.ui
        ) {

            this.game.ui.notify(
                "💀 You died!"
            );

        }


        // =================================================
        // RESPAWN
        // =================================================

        if (
            this.respawnTimer
        ) {

            clearTimeout(
                this.respawnTimer
            );

        }


        this.respawnTimer =
            setTimeout(

                () => {

                    this.respawn();

                },

                2500

            );

    }


    // =====================================================
    // RESPAWN
    // =====================================================

    respawn() {

        if (
            !this.object
        ) {

            return;

        }


        let x = 0;

        let z = 0;

        let y = 0;


        // =================================================
        // SPAWN POSITION
        // =================================================

        if (
            this.game.world &&
            typeof this.game.world.getTerrainHeight ===
            "function"
        ) {

            try {

                y =
                    this.game.world
                        .getTerrainHeight(
                            x,
                            z
                        );

            } catch (
                error
            ) {

                y = 0;

            }

        }


        this.object.position.set(

            x,

            y,

            z

        );


        this.object.rotation.set(

            0,

            this.yaw,

            0

        );


        // =================================================
        // RESTORE STATS
        // =================================================

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


        this.running =
            false;


        this.moveInput.x =
            0;


        this.moveInput.y =
            0;


        if (
            this.game.ui
        ) {

            this.game.ui.notify(
                "🔄 You respawned"
            );

        }

    }


    // =====================================================
    // WORLD LIMIT
    // =====================================================

    keepInsideWorld() {

        if (
            !this.game.world
        ) {

            return;

        }


        const worldSize =
            Number(
                this.game.world.size
            ) || 500;


        const limit =
            Math.max(

                10,

                worldSize / 2 - 5

            );


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


    // =====================================================
    // POINTER / CAMERA
    // =====================================================

    setupPointer() {

        window.addEventListener(

            "pointerdown",

            event => {

                // Do not rotate camera when clicking UI

                if (
                    event.target &&
                    typeof event.target.closest ===
                    "function"
                ) {

                    if (
                        event.target.closest(
                            "button"
                        ) ||

                        event.target.closest(
                            ".game-panel"
                        ) ||

                        event.target.closest(
                            "input"
                        )

                    ) {

                        this.pointerStartedOnUI =
                            true;

                        return;

                    }

                }


                this.pointerStartedOnUI =
                    false;


                this.dragging =
                    true;


                this.lastPointerX =
                    event.clientX;


                this.lastPointerY =
                    event.clientY;

            }

        );


        window.addEventListener(

            "pointermove",

            event => {

                if (
                    !this.dragging
                ) {

                    return;

                }


                if (
                    this.pointerStartedOnUI
                ) {

                    return;

                }


                const dx =
                    event.clientX -
                    this.lastPointerX;


                const dy =
                    event.clientY -
                    this.lastPointerY;


                this.lastPointerX =
                    event.clientX;


                this.lastPointerY =
                    event.clientY;


                // =================================================
                // CAMERA ROTATION
                // =================================================

                this.yaw -=

                    dx *

                    this.cameraSensitivity;


                this.pitch -=

                    dy *

                    this.touchSensitivity;


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

                this.dragging =
                    false;

            }

        );


        window.addEventListener(

            "pointercancel",

            () => {

                this.dragging =
                    false;

            }

        );

    }


    // =====================================================
    // MOBILE MOVEMENT
    // =====================================================

    setMoveInput(
        x,
        y
    ) {

        x =
            Number(x) || 0;


        y =
            Number(y) || 0;


        // Clamp

        const length =
            Math.sqrt(

                x * x +

                y * y

            );


        if (
            length > 1
        ) {

            x /=
                length;


            y /=
                length;

        }


        this.mobileInput.x =
            x;


        this.mobileInput.y =
            y;


        this.moveInput.x =
            x;


        this.moveInput.y =
            y;

    }


    // =====================================================
    // CLEAR MOBILE INPUT
    // =====================================================

    clearMoveInput() {

        this.mobileInput.x =
            0;


        this.mobileInput.y =
            0;

    }


    // =====================================================
    // RUN
    // =====================================================

    setRunning(
        state
    ) {

        this.running =
            Boolean(
                state
            );

    }


    // =====================================================
    // GET POSITION
    // =====================================================

    getPosition() {

        if (
            !this.object
        ) {

            return new THREE.Vector3();

        }


        return this.object.position.clone();

    }


    // =====================================================
    // GET FORWARD DIRECTION
    // =====================================================

    getForwardDirection() {

        const direction =
            new THREE.Vector3(

                0,

                0,

                -1

            );


        direction.applyAxisAngle(

            new THREE.Vector3(
                0,
                1,
                0
            ),

            this.yaw

        );


        return direction.normalize();

    }


    // =====================================================
    // GET PLAYER STATE
    // =====================================================

    getState() {

        return {

            health:
                this.health,

            maxHealth:
                this.maxHealth,

            stamina:
                this.stamina,

            maxStamina:
                this.maxStamina,

            hunger:
                this.hunger,

            maxHunger:
                this.maxHunger,

            grounded:
                this.grounded,

            running:
                this.running,

            moving:
                this.isMoving,

            dead:
                this.dead,

            position:
                this.getPosition()

        };

    }


    // =====================================================
    // ANIMATION
    // =====================================================

    updateAnimation(
        delta
    ) {

        if (
            !this.object
        ) {

            return;

        }


        if (
            !this.isMoving
        ) {

            // Smoothly return limbs

            if (
                this.leftArm
            ) {

                this.leftArm.rotation.x *=
                    0.85;

            }


            if (
                this.rightArm
            ) {

                this.rightArm.rotation.x *=
                    0.85;

            }


            if (
                this.leftLeg
            ) {

                this.leftLeg.rotation.x *=
                    0.85;

            }


            if (
                this.rightLeg
            ) {

                this.rightLeg.rotation.x *=
                    0.85;

            }


            return;

        }


        this.walkTime +=

            delta *

            this.animationSpeed *


            (
                this.running
                    ? 1.35
                    : 1
            );


        const swing =
            Math.sin(
                this.walkTime
            ) *
            (
                this.running
                    ? 0.75
                    : 0.5
            );


        if (
            this.leftArm
        ) {

            this.leftArm.rotation.x =
                swing;

        }


        if (
            this.rightArm
        ) {

            this.rightArm.rotation.x =
                -swing;

        }


        if (
            this.leftLeg
        ) {

            this.leftLeg.rotation.x =
                -swing;

        }


        if (
            this.rightLeg
        ) {

            this.rightLeg.rotation.x =
                swing;

        }


        // Small body movement

        if (
            this.body
        ) {

            this.body.position.y =

                1.05 +

                Math.abs(
                    Math.sin(
                        this.walkTime * 2
                    )
                ) *

                (
                    this.running
                        ? 0.035
                        : 0.02
                );

        }

    }


    // =====================================================
    // LERP ANGLE
    // =====================================================

    lerpAngle(
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

            amount

        );

    }


    // =====================================================
    // SET POSITION
    // =====================================================

    setPosition(
        x,
        y,
        z
    ) {

        if (
            !this.object
        ) {

            return;

        }


        this.object.position.set(

            Number(x) || 0,

            Number(y) || 0,

            Number(z) || 0

        );


        this.verticalVelocity =
            0;


        this.grounded =
            false;

    }


    // =====================================================
    // SET HEALTH
    // =====================================================

    setHealth(
        value
    ) {

        value =
            Number(value);


        if (
            !Number.isFinite(
                value
            )
        ) {

            return;

        }


        this.health =
            Math.max(

                0,

                Math.min(

                    this.maxHealth,

                    value

                )

            );


        if (
            this.health <= 0
        ) {

            this.die();

        }

    }


    // =====================================================
    // SET HUNGER
    // =====================================================

    setHunger(
        value
    ) {

        value =
            Number(value);


        if (
            !Number.isFinite(
                value
            )
        ) {

            return;

        }


        this.hunger =
            Math.max(

                0,

                Math.min(

                    this.maxHunger,

                    value

                )

            );

    }


    // =====================================================
    // SET STAMINA
    // =====================================================

    setStamina(
        value
    ) {

        value =
            Number(value);


        if (
            !Number.isFinite(
                value
            )
        ) {

            return;

        }


        this.stamina =
            Math.max(

                0,

                Math.min(

                    this.maxStamina,

                    value

                )

            );

    }


    // =====================================================
    // INCREASE MAX HEALTH
    // =====================================================

    increaseMaxHealth(
        amount
    ) {

        amount =
            Math.max(

                0,

                Number(amount) || 0

            );


        this.maxHealth +=
            amount;


        this.health =
            this.maxHealth;

    }


    // =====================================================
    // INCREASE MAX STAMINA
    // =====================================================

    increaseMaxStamina(
        amount
    ) {

        amount =
            Math.max(

                0,

                Number(amount) || 0

            );


        this.maxStamina +=
            amount;


        this.stamina =
            this.maxStamina;

    }


    // =====================================================
    // CLEANUP
    // =====================================================

    destroy() {

        if (
            this.respawnTimer
        ) {

            clearTimeout(
                this.respawnTimer
            );


            this.respawnTimer =
                null;

        }


        if (
            this.object
        ) {

            this.object.traverse(

                child => {

                    if (
                        child.geometry
                    ) {

                        child.geometry.dispose();

                    }


                    if (
                        child.material
                    ) {

                        if (
                            Array.isArray(
                                child.material
                            )
                        ) {

                            child.material.forEach(

                                material => {

                                    material.dispose();

                                }

                            );

                        } else {

                            child.material.dispose();

                        }

                    }

                }

            );


            if (
                this.game.scene
            ) {

                this.game.scene.remove(
                    this.object
                );

            }

        }


        this.object =
            null;


        this.body =
            null;


        this.head =
            null;


        this.leftArm =
            null;


        this.rightArm =
            null;


        this.leftLeg =
            null;


        this.rightLeg =
            null;


        this.initialized =
            false;

    }

}
