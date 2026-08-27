import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js";


export class CreatureManager {

    constructor(game) {

        this.game = game;

        this.creatures = [];

        this.initialized = false;

        this.nextCreatureId = 1;

        this.maxCreatures = 24;

        this.spawnTimer = 0;

        this.spawnInterval = 3;

        this.playerDetectionDistance = 18;

        this.attackDistance = 2.2;

        this.worldPadding = 8;

        this.respawnDelay = 8;

        this.random = Math.random;

        this.species = this.createSpecies();

    }


    // =========================================================
    // INITIALIZE
    // =========================================================

    async init() {

        this.removeExistingCreatures();

        this.spawnInitialCreatures();

        this.initialized = true;

    }


    // =========================================================
    // SPECIES
    // =========================================================

    createSpecies() {

        return {

            rabbit: {

                id: "rabbit",

                name: "Rabbit",

                rarity: "Common",

                health: 35,

                maxHealth: 35,

                damage: 3,

                speed: 2.4,

                scale: 0.85,

                xp: 12,

                coins: 3,

                color: 0xc9b7a4,

                secondaryColor: 0xf1dfd0,

                captureChance: 0.82,

                aggressive: false,

                size: 0.65

            },


            fox: {

                id: "fox",

                name: "Fox",

                rarity: "Uncommon",

                health: 55,

                maxHealth: 55,

                damage: 7,

                speed: 3.2,

                scale: 1,

                xp: 22,

                coins: 7,

                color: 0xd56a32,

                secondaryColor: 0xf0c18e,

                captureChance: 0.65,

                aggressive: false,

                size: 0.85

            },


            wolf: {

                id: "wolf",

                name: "Wolf",

                rarity: "Rare",

                health: 90,

                maxHealth: 90,

                damage: 12,

                speed: 3.8,

                scale: 1.1,

                xp: 38,

                coins: 12,

                color: 0x737b83,

                secondaryColor: 0xc7ccd1,

                captureChance: 0.45,

                aggressive: true,

                size: 1

            },


            bear: {

                id: "bear",

                name: "Bear",

                rarity: "Epic",

                health: 180,

                maxHealth: 180,

                damage: 20,

                speed: 2.2,

                scale: 1.55,

                xp: 70,

                coins: 25,

                color: 0x63462f,

                secondaryColor: 0x9a7655,

                captureChance: 0.28,

                aggressive: true,

                size: 1.35

            },


            deer: {

                id: "deer",

                name: "Deer",

                rarity: "Uncommon",

                health: 70,

                maxHealth: 70,

                damage: 5,

                speed: 3.4,

                scale: 1.15,

                xp: 28,

                coins: 8,

                color: 0x996b46,

                secondaryColor: 0xd7b28d,

                captureChance: 0.58,

                aggressive: false,

                size: 1.05

            }

        };

    }


    // =========================================================
    // REMOVE OLD CREATURES
    // =========================================================

    removeExistingCreatures() {

        for (
            const creature of this.creatures
        ) {

            if (
                creature.object &&
                this.game.scene
            ) {

                this.game.scene.remove(
                    creature.object
                );

            }

        }

        this.creatures.length = 0;

    }


    // =========================================================
    // INITIAL SPAWN
    // =========================================================

    spawnInitialCreatures() {

        const speciesIds = Object.keys(
            this.species
        );


        const spawnCount =
            Math.min(
                this.maxCreatures,
                18
            );


        for (
            let i = 0;
            i < spawnCount;
            i++
        ) {

            const speciesId =
                speciesIds[
                    Math.floor(
                        this.random() *
                        speciesIds.length
                    )
                ];


            this.spawnCreature(
                speciesId
            );

        }

    }


    // =========================================================
    // SPAWN CREATURE
    // =========================================================

    spawnCreature(
        speciesId,
        position = null
    ) {

        if (
            this.creatures.length >=
            this.maxCreatures
        ) {

            return null;

        }


        const data =
            this.species[
                speciesId
            ];


        if (
            !data
        ) {

            return null;

        }


        const object =
            this.createCreatureModel(
                data
            );


        if (
            !object
        ) {

            return null;

        }


        const spawnPosition =
            position ||
            this.getRandomSpawnPosition();


        object.position.copy(
            spawnPosition
        );


        this.game.scene.add(
            object
        );


        const creature = {

            id:
                `creature-${this.nextCreatureId++}`,

            speciesId:
                data.id,

            name:
                data.name,

            rarity:
                data.rarity,

            object:
                object,

            health:
                data.health,

            maxHealth:
                data.maxHealth,

            damage:
                data.damage,

            speed:
                data.speed,

            xp:
                data.xp,

            coins:
                data.coins,

            captureChance:
                data.captureChance,

            aggressive:
                data.aggressive,

            state:
                "wander",

            alive:
                true,

            dead:
                false,

            attackCooldown:
                0,

            wanderTimer:
                0,

            direction:
                new THREE.Vector3(),

            targetPosition:
                new THREE.Vector3(),

            rotationSpeed:
                3,

            hitFlash:
                0,

            originalMaterials:
                [],

            respawnTimer:
                0,

            bobTime:
                this.random() * Math.PI * 2,

            homePosition:
                spawnPosition.clone(),

            detectionDistance:
                this.playerDetectionDistance *
                (
                    data.aggressive
                        ? 1.15
                        : 0.75
                ),

            attackDistance:
                this.attackDistance

        };


        object.userData.creature =
            creature;


        object.traverse(
            child => {

                if (
                    child.isMesh &&
                    child.material
                ) {

                    creature
                        .originalMaterials
                        .push({
                            mesh:
                                child,
                            material:
                                child.material
                        });

                    child.castShadow =
                        true;

                    child.receiveShadow =
                        true;

                }

            }
        );


        this.creatures.push(
            creature
        );


        this.chooseWanderTarget(
            creature
        );


        return creature;

    }


    // =========================================================
    // RANDOM SPAWN POSITION
    // =========================================================

    getRandomSpawnPosition() {

        const world =
            this.game.world;


        const size =
            world &&
            Number.isFinite(
                world.size
            )
                ? world.size
                : 500;


        const limit =
            size / 2 -
            this.worldPadding;


        let x = 0;

        let z = 0;


        for (
            let attempts = 0;
            attempts < 20;
            attempts++
        ) {

            x =
                (
                    this.random() *
                    2 -
                    1
                ) *
                limit;


            z =
                (
                    this.random() *
                    2 -
                    1
                ) *
                limit;


            if (
                this.game.player &&
                this.game.player.object
            ) {

                const player =
                    this.game.player.object;


                const distance =
                    Math.hypot(
                        x -
                        player.position.x,
                        z -
                        player.position.z
                    );


                if (
                    distance > 20
                ) {

                    break;

                }

            }

        }


        let y = 0;


        if (
            world &&
            typeof world.getTerrainHeight ===
            "function"
        ) {

            y =
                world.getTerrainHeight(
                    x,
                    z
                );

        }


        return new THREE.Vector3(
            x,
            y,
            z
        );

    }


    // =========================================================
    // CREATE MODEL
    // =========================================================

    createCreatureModel(
        data
    ) {

        const group =
            new THREE.Group();


        group.name =
            `Creature_${data.id}`;


        const mainMaterial =
            new THREE.MeshStandardMaterial({

                color:
                    data.color,

                roughness:
                    0.85,

                metalness:
                    0

            });


        const secondaryMaterial =
            new THREE.MeshStandardMaterial({

                color:
                    data.secondaryColor,

                roughness:
                    0.9,

                metalness:
                    0

            });


        const eyeMaterial =
            new THREE.MeshStandardMaterial({

                color:
                    0x111111,

                roughness:
                    0.5

            });


        const noseMaterial =
            new THREE.MeshStandardMaterial({

                color:
                    0x201714

            });


        const scale =
            data.scale;


        // =====================================================
        // BODY
        // =====================================================

        const body =
            new THREE.Mesh(

                new THREE.SphereGeometry(
                    0.65 *
                    scale,
                    14,
                    10
                ),

                mainMaterial

            );


        body.scale.set(
            1.25,
            0.95,
            1.55
        );


        body.position.y =
            0.9 *
            scale;


        group.add(
            body
        );


        // =====================================================
        // HEAD
        // =====================================================

        const head =
            new THREE.Mesh(

                new THREE.SphereGeometry(
                    0.45 *
                    scale,
                    14,
                    10
                ),

                mainMaterial

            );


        head.position.set(
            0,
            1.25 *
            scale,
            -0.65 *
            scale
        );


        group.add(
            head
        );


        // =====================================================
        // EARS
        // =====================================================

        if (
            data.id === "rabbit"
        ) {

            this.createRabbitEars(
                group,
                mainMaterial,
                scale
            );

        } else if (
            data.id === "fox" ||
            data.id === "wolf"
        ) {

            this.createPointedEars(
                group,
                mainMaterial,
                scale
            );

        } else if (
            data.id === "bear"
        ) {

            this.createBearEars(
                group,
                mainMaterial,
                scale
            );

        } else if (
            data.id === "deer"
        ) {

            this.createDeerAntlers(
                group,
                mainMaterial,
                scale
            );

        }


        // =====================================================
        // EYES
        // =====================================================

        const eyeGeometry =
            new THREE.SphereGeometry(
                0.055 *
                scale,
                8,
                8
            );


        const leftEye =
            new THREE.Mesh(
                eyeGeometry,
                eyeMaterial
            );


        leftEye.position.set(
            -0.17 *
            scale,
            1.38 *
            scale,
            -1.02 *
            scale
        );


        const rightEye =
            leftEye.clone();


        rightEye.position.x =
            0.17 *
            scale;


        group.add(
            leftEye
        );


        group.add(
            rightEye
        );


        // =====================================================
        // NOSE
        // =====================================================

        const nose =
            new THREE.Mesh(

                new THREE.SphereGeometry(
                    0.075 *
                    scale,
                    8,
                    8
                ),

                noseMaterial

            );


        nose.position.set(
            0,
            1.22 *
            scale,
            -1.08 *
            scale
        );


        group.add(
            nose
        );


        // =====================================================
        // LEGS
        // =====================================================

        const legRadius =
            0.13 *
            scale;


        const legHeight =
            0.55 *
            scale;


        const legGeometry =
            new THREE.CylinderGeometry(
                legRadius,
                legRadius *
                1.15,
                legHeight,
                8
            );


        const legPositions = [

            [
                -0.4,
                0.42,
                -0.38
            ],

            [
                0.4,
                0.42,
                -0.38
            ],

            [
                -0.4,
                0.42,
                0.4
            ],

            [
                0.4,
                0.42,
                0.4
            ]

        ];


        for (
            const position of
            legPositions
        ) {

            const leg =
                new THREE.Mesh(
                    legGeometry,
                    secondaryMaterial
                );


            leg.position.set(

                position[0] *
                scale,

                position[1] *
                scale,

                position[2] *
                scale

            );


            group.add(
                leg
            );

        }


        // =====================================================
        // TAIL
        // =====================================================

        this.createTail(
            group,
            mainMaterial,
            data,
            scale
        );


        // =====================================================
        // DEER BODY DETAILS
        // =====================================================

        if (
            data.id === "deer"
        ) {

            this.createDeerDetails(
                group,
                secondaryMaterial,
                scale
            );

        }


        // =====================================================
        // BEAR MUZZLE
        // =====================================================

        if (
            data.id === "bear"
        ) {

            const muzzle =
                new THREE.Mesh(

                    new THREE.SphereGeometry(
                        0.25 *
                        scale,
                        10,
                        8
                    ),

                    secondaryMaterial

                );


            muzzle.scale.set(
                1.15,
                0.75,
                0.7
            );


            muzzle.position.set(
                0,
                1.18 *
                scale,
                -1.02 *
                scale
            );


            group.add(
                muzzle
            );

        }


        // =====================================================
        // SHADOW / SCALE
        // =====================================================

        group.scale.set(
            1,
            1,
            1
        );


        return group;

    }


    // =========================================================
    // RABBIT EARS
    // =========================================================

    createRabbitEars(
        group,
        material,
        scale
    ) {

        const earGeometry =
            new THREE.CapsuleGeometry(
                0.12 *
                scale,
                0.55 *
                scale,
                5,
                8
            );


        const leftEar =
            new THREE.Mesh(
                earGeometry,
                material
            );


        leftEar.position.set(
            -0.18 *
            scale,
            1.95 *
            scale,
            -0.62 *
            scale
        );


        leftEar.rotation.z =
            -0.12;


        const rightEar =
            leftEar.clone();


        rightEar.position.x =
            0.18 *
            scale;


        rightEar.rotation.z =
            0.12;


        group.add(
            leftEar
        );


        group.add(
            rightEar
        );

    }


    // =========================================================
    // POINTED EARS
    // =========================================================

    createPointedEars(
        group,
        material,
        scale
    ) {

        const geometry =
            new THREE.ConeGeometry(
                0.2 *
                scale,
                0.55 *
                scale,
                4
            );


        const left =
            new THREE.Mesh(
                geometry,
                material
            );


        left.position.set(
            -0.28 *
            scale,
            1.75 *
            scale,
            -0.62 *
            scale
        );


        left.rotation.z =
            -0.15;


        const right =
            left.clone();


        right.position.x =
            0.28 *
            scale;


        right.rotation.z =
            0.15;


        group.add(
            left
        );


        group.add(
            right
        );

    }


    // =========================================================
    // BEAR EARS
    // =========================================================

    createBearEars(
        group,
        material,
        scale
    ) {

        const geometry =
            new THREE.SphereGeometry(
                0.18 *
                scale,
                10,
                8
            );


        const left =
            new THREE.Mesh(
                geometry,
                material
            );


        left.position.set(
            -0.32 *
            scale,
            1.62 *
            scale,
            -0.52 *
            scale
        );


        const right =
            left.clone();


        right.position.x =
            0.32 *
            scale;


        group.add(
            left
        );


        group.add(
            right
        );

    }


    // =========================================================
    // DEER ANTLERS
    // =========================================================

    createDeerAntlers(
        group,
        material,
        scale
    ) {

        const antlerMaterial =
            new THREE.MeshStandardMaterial({

                color:
                    0x6b4930,

                roughness:
                    0.9

            });


        const stemGeometry =
            new THREE.CylinderGeometry(
                0.045 *
                scale,
                0.065 *
                scale,
                0.7 *
                scale,
                6
            );


        const leftStem =
            new THREE.Mesh(
                stemGeometry,
                antlerMaterial
            );


        leftStem.position.set(
            -0.25 *
            scale,
            1.85 *
            scale,
            -0.58 *
            scale
        );


        leftStem.rotation.z =
            -0.18;


        const rightStem =
            leftStem.clone();


        rightStem.position.x =
            0.25 *
            scale;


        rightStem.rotation.z =
            0.18;


        group.add(
            leftStem
        );


        group.add(
            rightStem
        );


        const branchGeometry =
            new THREE.CylinderGeometry(
                0.035 *
                scale,
                0.045 *
                scale,
                0.35 *
                scale,
                6
            );


        const leftBranch =
            new THREE.Mesh(
                branchGeometry,
                antlerMaterial
            );


        leftBranch.position.set(
            -0.38 *
            scale,
            2.03 *
            scale,
            -0.58 *
            scale
        );


        leftBranch.rotation.z =
            -0.7;


        const rightBranch =
            leftBranch.clone();


        rightBranch.position.x =
            0.38 *
            scale;


        rightBranch.rotation.z =
            0.7;


        group.add(
            leftBranch
        );


        group.add(
            rightBranch
        );

    }


    // =========================================================
    // DEER DETAILS
    // =========================================================

    createDeerDetails(
        group,
        material,
        scale
    ) {

        const spotMaterial =
            new THREE.MeshStandardMaterial({

                color:
                    0xe4c6a4,

                roughness:
                    1

            });


        const positions = [

            [-0.3, 1.15, 0.05],

            [0.3, 1.2, 0.08],

            [-0.25, 1.0, 0.3],

            [0.25, 1.05, 0.3]

        ];


        for (
            const position of positions
        ) {

            const spot =
                new THREE.Mesh(

                    new THREE.SphereGeometry(
                        0.07 *
                        scale,
                        6,
                        6
                    ),

                    spotMaterial

                );


            spot.position.set(

                position[0] *
                scale,

                position[1] *
                scale,

                position[2] *
                scale

            );


            group.add(
                spot
            );

        }

    }


    // =========================================================
    // TAIL
    // =========================================================

    createTail(
        group,
        material,
        data,
        scale
    ) {

        let tailLength =
            0.55;


        let tailRadius =
            0.16;


        if (
            data.id === "bear"
        ) {

            tailLength =
                0.25;

            tailRadius =
                0.2;

        }


        const geometry =
            new THREE.CapsuleGeometry(
                tailRadius *
                scale,
                tailLength *
                scale,
                5,
                8
            );


        const tail =
            new THREE.Mesh(
                geometry,
                material
            );


        tail.position.set(
            0,
            1.0 *
            scale,
            0.9 *
            scale
        );


        tail.rotation.x =
            -0.9;


        if (
            data.id === "rabbit"
        ) {

            tail.scale.set(
                1.3,
                1.3,
                1.3
            );

        }


        group.add(
            tail
        );

    }


    // =========================================================
    // UPDATE
    // =========================================================

    update(
        delta
    ) {

        if (
            !this.initialized
        ) {

            return;

        }


        delta =
            Math.min(
                0.05,
                Math.max(
                    0,
                    Number(delta) || 0
                )
            );


        this.spawnTimer +=
            delta;


        this.updateCreatures(
            delta
        );


        if (
            this.spawnTimer >=
            this.spawnInterval
        ) {

            this.spawnTimer = 0;

            this.trySpawnCreature();

        }

    }


    // =========================================================
    // UPDATE ALL CREATURES
    // =========================================================

    updateCreatures(
        delta
    ) {

        for (
            const creature of
            this.creatures
        ) {

            if (
                !creature ||
                !creature.object
            ) {

                continue;

            }


            if (
                creature.dead
            ) {

                this.updateDeadCreature(
                    creature,
                    delta
                );

                continue;

            }


            if (
                !creature.alive
            ) {

                continue;

            }


            this.updateCreatureAI(
                creature,
                delta
            );


            this.updateCreatureAnimation(
                creature,
                delta
            );


            this.updateHitFlash(
                creature,
                delta
            );


            this.keepCreatureInsideWorld(
                creature
            );

        }

    }


    // =========================================================
    // AI
    // =========================================================

    updateCreatureAI(
        creature,
        delta
    ) {

        if (
            !this.game.player ||
            !this.game.player.object
        ) {

            this.wander(
                creature,
                delta
            );

            return;

        }


        const player =
            this.game.player.object;


        const creaturePosition =
            creature.object.position;


        const distance =
            creaturePosition.distanceTo(
                player.position
            );


        if (
            creature.attackCooldown >
            0
        ) {

            creature.attackCooldown -=
                delta;

        }


        if (
            creature.aggressive &&
            !this.game.player.dead &&
            distance <=
            creature.detectionDistance
        ) {

            if (
                distance <=
                creature.attackDistance
            ) {

                creature.state =
                    "attack";


                this.attackPlayer(
                    creature
                );

            } else {

                creature.state =
                    "chase";


                this.chasePlayer(
                    creature,
                    delta
                );

            }


            return;

        }


        if (
            !creature.aggressive &&
            distance <=
            7 &&
            !this.game.player.dead
        ) {

            creature.state =
                "flee";


            this.fleeFromPlayer(
                creature,
                delta
            );


            return;

        }


        creature.state =
            "wander";


        this.wander(
            creature,
            delta
        );

    }


    // =========================================================
    // WANDER
    // =========================================================

    wander(
        creature,
        delta
    ) {

        creature.wanderTimer -=
            delta;


        if (
            creature.wanderTimer <=
            0
        ) {

            this.chooseWanderTarget(
                creature
            );

        }


        const direction =
            new THREE.Vector3()
                .subVectors(
                    creature.targetPosition,
                    creature.object.position
                );


        direction.y = 0;


        const distance =
            direction.length();


        if (
            distance < 0.8
        ) {

            creature.wanderTimer =
                0;

            return;

        }


        direction.normalize();


        creature.direction.lerp(
            direction,
            Math.min(
                1,
                delta * 3
            )
        );


        creature.object.position.x +=
            creature.direction.x *
            creature.speed *
            0.35 *
            delta;


        creature.object.position.z +=
            creature.direction.z *
            creature.speed *
            0.35 *
            delta;


        this.rotateCreature(
            creature,
            creature.direction,
            delta
        );


        this.updateGroundHeight(
            creature
        );

    }


    // =========================================================
    // CHOOSE WANDER TARGET
    // =========================================================

    chooseWanderTarget(
        creature
    ) {

        const angle =
            this.random() *
            Math.PI *
            2;


        const distance =
            5 +
            this.random() *
            15;


        creature.targetPosition.set(

            creature.homePosition.x +
            Math.cos(angle) *
            distance,

            creature.object.position.y,

            creature.homePosition.z +
            Math.sin(angle) *
            distance

        );


        creature.wanderTimer =
            2 +
            this.random() *
            5;

    }


    // =========================================================
    // CHASE PLAYER
    // =========================================================

    chasePlayer(
        creature,
        delta
    ) {

        const player =
            this.game.player.object;


        const direction =
            new THREE.Vector3()
                .subVectors(
                    player.position,
                    creature.object.position
                );


        direction.y = 0;


        if (
            direction.lengthSq() <
            0.001
        ) {

            return;

        }


        direction.normalize();


        creature.direction.lerp(
            direction,
            Math.min(
                1,
                delta * 5
            )
        );


        creature.object.position.x +=
            creature.direction.x *
            creature.speed *
            delta;


        creature.object.position.z +=
            creature.direction.z *
            creature.speed *
            delta;


        this.rotateCreature(
            creature,
            creature.direction,
            delta
        );


        this.updateGroundHeight(
            creature
        );

    }


    // =========================================================
    // FLEE
    // =========================================================

    fleeFromPlayer(
        creature,
        delta
    ) {

        const player =
            this.game.player.object;


        const direction =
            new THREE.Vector3()
                .subVectors(
                    creature.object.position,
                    player.position
                );


        direction.y = 0;


        if (
            direction.lengthSq() <
            0.001
        ) {

            direction.set(
                1,
                0,
                0
            );

        }


        direction.normalize();


        creature.direction.lerp(
            direction,
            Math.min(
                1,
                delta * 5
            )
        );


        creature.object.position.x +=
            creature.direction.x *
            creature.speed *
            1.25 *
            delta;


        creature.object.position.z +=
            creature.direction.z *
            creature.speed *
            1.25 *
            delta;


        this.rotateCreature(
            creature,
            creature.direction,
            delta
        );


        this.updateGroundHeight(
            creature
        );

    }


    // =========================================================
    // ATTACK PLAYER
    // =========================================================

    attackPlayer(
        creature
    ) {

        if (
            creature.attackCooldown >
            0
        ) {

            return;

        }


        if (
            !this.game.player ||
            this.game.player.dead
        ) {

            return;

        }


        const player =
            this.game.player;


        const distance =
            creature.object.position.distanceTo(
                player.object.position
            );


        if (
            distance >
            creature.attackDistance +
            0.5
        ) {

            return;

        }


        creature.attackCooldown =
            1.25;


        player.damage(
            creature.damage
        );


        if (
            this.game.ui
        ) {

            this.game.ui.notify(
                `🐾 ${creature.name} attacked you!`
            );

        }

    }


    // =========================================================
    // DAMAGE CREATURE
    // =========================================================

    damageCreature(
        creature,
        amount
    ) {

        if (
            !creature ||
            creature.dead ||
            !creature.alive
        ) {

            return false;

        }


        amount =
            Math.max(
                0,
                Number(amount) || 0
            );


        if (
            amount <= 0
        ) {

            return false;

        }


        creature.health -=
            amount;


        creature.hitFlash =
            0.15;


        if (
            creature.health <=
            0
        ) {

            creature.health =
                0;


            this.killCreature(
                creature
            );

        }


        return true;

    }


    // =========================================================
    // KILL CREATURE
    // =========================================================

    killCreature(
        creature
    ) {

        if (
            !creature ||
            creature.dead
        ) {

            return;

        }


        creature.dead =
            true;


        creature.alive =
            false;


        creature.state =
            "dead";


        creature.respawnTimer =
            this.respawnDelay;


        if (
            creature.object
        ) {

            creature.object.rotation.z =
                -0.8;

        }


        if (
            this.game.systems
        ) {

            if (
                typeof this.game.systems.addXP ===
                "function"
            ) {

                this.game.systems.addXP(
                    creature.xp
                );

            }


            if (
                typeof this.game.systems.addCoins ===
                "function"
            ) {

                this.game.systems.addCoins(
                    creature.coins
                );

            }

        }


        if (
            this.game.ui
        ) {

            this.game.ui.notify(
                `💀 ${creature.name} defeated! +${creature.xp} XP`
            );

        }


        this.dropLoot(
            creature
        );

    }


    // =========================================================
    // LOOT
    // =========================================================

    dropLoot(
        creature
    ) {

        if (
            !this.game.systems
        ) {

            return;

        }


        const roll =
            this.random();


        if (
            roll < 0.35
        ) {

            this.game.systems.addItem(
                "food",
                1
            );

        }


        if (
            roll < 0.18
        ) {

            this.game.systems.addItem(
                "fiber",
                1 +
                Math.floor(
                    this.random() * 3
                )
            );

        }


        if (
            creature.rarity ===
            "Rare" ||
            creature.rarity ===
            "Epic"
        ) {

            if (
                this.random() <
                0.25
            ) {

                this.game.systems.addItem(
                    "potion",
                    1
                );

            }

        }

    }


    // =========================================================
    // DEAD UPDATE
    // =========================================================

    updateDeadCreature(
        creature,
        delta
    ) {

        creature.respawnTimer -=
            delta;


        if (
            creature.object
        ) {

            creature.object.position.y -=
                0.4 *
                delta;


            creature.object.scale.lerp(
                new THREE.Vector3(
                    0.1,
                    0.1,
                    0.1
                ),
                Math.min(
                    1,
                    delta * 3
                )
            );

        }


        if (
            creature.respawnTimer <=
            0
        ) {

            this.respawnCreature(
                creature
            );

        }

    }


    // =========================================================
    // RESPAWN
    // =========================================================

    respawnCreature(
        creature
    ) {

        const position =
            this.getRandomSpawnPosition();


        creature.object.position.copy(
            position
        );


        creature.object.rotation.set(
            0,
            0,
            0
        );


        creature.object.scale.set(
            1,
            1,
            1
        );


        const data =
            this.species[
                creature.speciesId
            ];


        creature.health =
            data.maxHealth;


        creature.maxHealth =
            data.maxHealth;


        creature.damage =
            data.damage;


        creature.speed =
            data.speed;


        creature.alive =
            true;


        creature.dead =
            false;


        creature.state =
            "wander";


        creature.attackCooldown =
            0;


        creature.hitFlash =
            0;


        creature.homePosition =
            position.clone();


        this.chooseWanderTarget(
            creature
        );

    }


    // =========================================================
    // CAPTURE NEAREST
    // =========================================================

    captureNearestCreature(
        maxDistance = 4
    ) {

        if (
            !this.game.player ||
            !this.game.player.object
        ) {

            return false;

        }


        if (
            !this.game.systems
        ) {

            return false;

        }


        const creature =
            this.getNearestCreature(
                maxDistance
            );


        if (
            !creature
        ) {

            if (
                this.game.ui
            ) {

                this.game.ui.notify(
                    "🐾 No creature nearby!"
                );

            }

            return false;

        }


        if (
            creature.dead ||
            !creature.alive
        ) {

            return false;

        }


        if (
            !this.game.systems.hasItem(
                "captureOrb",
                1
            )
        ) {

            if (
                this.game.ui
            ) {

                this.game.ui.notify(
                    "🔵 No Capture Orb!"
                );

            }

            return false;

        }


        this.game.systems.removeItem(
            "captureOrb",
            1
        );


        const chance =
            creature.captureChance;


        const success =
            this.random() <
            chance;


        if (
            success
        ) {

            const pet =
                {

                    id:
                        `pet-${Date.now()}-${Math.floor(
                            this.random() * 10000
                        )}`,

                    speciesId:
                        creature.speciesId,

                    name:
                        creature.name,

                    rarity:
                        creature.rarity,

                    level:
                        1,

                    health:
                        creature.maxHealth,

                    maxHealth:
                        creature.maxHealth,

                    damage:
                        creature.damage,

                    speed:
                        creature.speed,

                    experience:
                        0

                };


            const added =
                this.game.systems.addPet(
                    pet
                );


            if (
                added
            ) {

                if (
                    this.game.ui
                ) {

                    this.game.ui.notify(
                        `🔵 ${creature.name} captured!`
                    );

                }


                this.removeCreature(
                    creature
                );


                return true;

            }


            if (
                this.game.ui
            ) {

                this.game.ui.notify(
                    "⚠️ Pet could not be added."
                );

            }


            return false;

        }


        if (
            this.game.ui
        ) {

            this.game.ui.notify(
                `❌ ${creature.name} escaped!`
            );

        }


        creature.state =
            "flee";


        return false;

    }


    // =========================================================
    // GET NEAREST CREATURE
    // =========================================================

    getNearestCreature(
        maxDistance = Infinity
    ) {

        if (
            !this.game.player ||
            !this.game.player.object
        ) {

            return null;

        }


        const playerPosition =
            this.game.player.object.position;


        let nearest =
            null;


        let nearestDistance =
            maxDistance;


        for (
            const creature of
            this.creatures
        ) {

            if (
                !creature ||
                creature.dead ||
                !creature.alive ||
                !creature.object
            ) {

                continue;

            }


            const distance =
                creature.object.position
                    .distanceTo(
                        playerPosition
                    );


            if (
                distance <
                nearestDistance
            ) {

                nearest =
                    creature;

                nearestDistance =
                    distance;

            }

        }


        return nearest;

    }


    // =========================================================
    // REMOVE CREATURE
    // =========================================================

    removeCreature(
        creature
    ) {

        const index =
            this.creatures.indexOf(
                creature
            );


        if (
            index === -1
        ) {

            return false;

        }


        if (
            creature.object
        ) {

            this.game.scene.remove(
                creature.object
            );

        }


        this.creatures.splice(
            index,
            1
        );


        return true;

    }


    // =========================================================
    // TRY SPAWN
    // =========================================================

    trySpawnCreature() {

        if (
            this.creatures.length >=
            this.maxCreatures
        ) {

            return;

        }


        const speciesIds =
            Object.keys(
                this.species
            );


        if (
            speciesIds.length ===
            0
        ) {

            return;

        }


        const speciesId =
            speciesIds[
                Math.floor(
                    this.random() *
                    speciesIds.length
                )
            ];


        this.spawnCreature(
            speciesId
        );

    }


    // =========================================================
    // ROTATION
    // =========================================================

    rotateCreature(
        creature,
        direction,
        delta
    ) {

        if (
            direction.lengthSq() <
            0.001
        ) {

            return;

        }


        const targetRotation =
            Math.atan2(
                direction.x,
                direction.z
            );


        let current =
            creature.object.rotation.y;


        let difference =
            targetRotation -
            current;


        while (
            difference >
            Math.PI
        ) {

            difference -=
                Math.PI *
                2;

        }


        while (
            difference <
            -Math.PI
        ) {

            difference +=
                Math.PI *
                2;

        }


        current +=
            difference *
            Math.min(
                1,
                delta *
                creature.rotationSpeed
            );


        creature.object.rotation.y =
            current;

    }


    // =========================================================
    // GROUND HEIGHT
    // =========================================================

    updateGroundHeight(
        creature
    ) {

        if (
            !this.game.world ||
            !creature.object
        ) {

            return;

        }


        if (
            typeof this.game.world
                .getTerrainHeight !==
            "function"
        ) {

            return;

        }


        const ground =
            this.game.world
                .getTerrainHeight(
                    creature.object.position.x,
                    creature.object.position.z
                );


        creature.object.position.y =
            ground;

    }


    // =========================================================
    // WORLD BOUNDARY
    // =========================================================

    keepCreatureInsideWorld(
        creature
    ) {

        if (
            !this.game.world ||
            !creature.object
        ) {

            return;

        }


        const worldSize =
            Number.isFinite(
                this.game.world.size
            )
                ? this.game.world.size
                : 500;


        const limit =
            worldSize / 2 -
            this.worldPadding;


        creature.object.position.x =
            Math.max(
                -limit,
                Math.min(
                    limit,
                    creature.object.position.x
                )
            );


        creature.object.position.z =
            Math.max(
                -limit,
                Math.min(
                    limit,
                    creature.object.position.z
                )
            );


        this.updateGroundHeight(
            creature
        );

    }


    // =========================================================
    // ANIMATION
    // =========================================================

    updateCreatureAnimation(
        creature,
        delta
    ) {

        creature.bobTime +=
            delta *
            5;


        const moving =
            creature.state ===
            "wander" ||
            creature.state ===
            "chase" ||
            creature.state ===
            "flee";


        if (
            moving &&
            creature.object
        ) {

            const bob =
                Math.sin(
                    creature.bobTime
                ) *
                0.025;


            creature.object.position.y +=
                bob *
                delta *
                10;

        }

    }


    // =========================================================
    // HIT FLASH
    // =========================================================

    updateHitFlash(
        creature,
        delta
    ) {

        if (
            creature.hitFlash <=
            0
        ) {

            return;

        }


        creature.hitFlash -=
            delta;


        const intensity =
            Math.max(
                0,
                creature.hitFlash /
                0.15
            );


        creature.object.traverse(
            child => {

                if (
                    !child.isMesh ||
                    !child.material
                ) {

                    return;

                }


                if (
                    !child.material
                        .emissive
                ) {

                    return;

                }


                child.material
                    .emissive
                    .setHex(
                        0xff2222
                    );


                child.material
                    .emissiveIntensity =
                    intensity * 0.8;

            }
        );

    }


    // =========================================================
    // FIND BY ID
    // =========================================================

    getCreatureById(
        id
    ) {

        return this.creatures.find(
            creature =>
                creature.id ===
                id
        ) || null;

    }


    // =========================================================
    // GET ALL ALIVE
    // =========================================================

    getAliveCreatures() {

        return this.creatures.filter(
            creature =>
                creature &&
                creature.alive &&
                !creature.dead
        );

    }


    // =========================================================
    // GET COUNT
    // =========================================================

    getCreatureCount() {

        return this.getAliveCreatures()
            .length;

    }


    // =========================================================
    // DAMAGE RANDOM CREATURE
    // =========================================================

    damageNearestCreature(
        amount,
        maxDistance = 4
    ) {

        const creature =
            this.getNearestCreature(
                maxDistance
            );


        if (
            !creature
        ) {

            return false;

        }


        return this.damageCreature(
            creature,
            amount
        );

    }


    // =========================================================
    // CLEAR ALL
    // =========================================================

    clearAll() {

        for (
            const creature of
            this.creatures
        ) {

            if (
                creature.object &&
                this.game.scene
            ) {

                this.game.scene.remove(
                    creature.object
                );

            }

        }


        this.creatures.length = 0;

    }


    // =========================================================
    // DEBUG
    // =========================================================

    getDebugInfo() {

        return {

            total:
                this.creatures.length,

            alive:
                this.getAliveCreatures()
                    .length,

            max:
                this.maxCreatures,

            species:
                Object.keys(
                    this.species
                )

        };

    }

}
