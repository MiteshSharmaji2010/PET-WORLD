import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js";

export class CreatureManager {

    constructor(game) {

        this.game = game;

        this.creatures = [];

        this.nextId = 1;

        this.spawnTimer = 0;

        this.maxCreatures = 35;

        this.spawnDistance = 70;

        this.types = [

            {
                name: "Lunacat",
                color: 0x8c7cff,
                health: 70,
                damage: 8,
                speed: 2.8,
                size: 1.0,
                rarity: "Common"
            },

            {
                name: "Flameling",
                color: 0xe86b35,
                health: 60,
                damage: 10,
                speed: 3.2,
                size: 0.85,
                rarity: "Common"
            },

            {
                name: "Leafhorn",
                color: 0x4fa85b,
                health: 110,
                damage: 14,
                speed: 2.1,
                size: 1.25,
                rarity: "Uncommon"
            },

            {
                name: "Aquafin",
                color: 0x3b9fd6,
                health: 85,
                damage: 9,
                speed: 3.0,
                size: 0.95,
                rarity: "Uncommon"
            },

            {
                name: "Stoneback",
                color: 0x77736c,
                health: 180,
                damage: 18,
                speed: 1.3,
                size: 1.5,
                rarity: "Rare"
            },

            {
                name: "Nightfang",
                color: 0x302b46,
                health: 130,
                damage: 20,
                speed: 3.8,
                size: 1.1,
                rarity: "Rare"
            }

        ];

    }


    // =================================================
    // INITIALIZE
    // =================================================

    async init() {

        this.spawnInitialCreatures();

    }


    // =================================================
    // INITIAL SPAWN
    // =================================================

    spawnInitialCreatures() {

        for (
            let i = 0;
            i < 18;
            i++
        ) {

            this.spawnCreature();

        }

    }


    // =================================================
    // SPAWN
    // =================================================

    spawnCreature() {

        if (
            this.creatures.length >=
            this.maxCreatures
        ) {

            return null;

        }


        const type =
            this.getRandomType();


        const player =
            this.game.player;


        let x;
        let z;


        if (
            player &&
            player.object
        ) {

            const angle =
                Math.random() *
                Math.PI *
                2;


            const distance =
                15 +
                Math.random() *
                55;


            x =
                player.object.position.x +
                Math.cos(angle) *
                distance;


            z =
                player.object.position.z +
                Math.sin(angle) *
                distance;

        } else {

            x =
                (Math.random() - 0.5) *
                120;

            z =
                (Math.random() - 0.5) *
                120;

        }


        const y =
            this.getGroundHeight(
                x,
                z
            );


        const creature = {

            id:
                this.nextId++,

            type:
                type.name,

            name:
                type.name,

            color:
                type.color,

            rarity:
                type.rarity,

            maxHealth:
                type.health,

            health:
                type.health,

            damage:
                type.damage,

            speed:
                type.speed,

            size:
                type.size,

            level:
                1 +
                Math.floor(
                    Math.random() * 5
                ),

            position:
                new THREE.Vector3(
                    x,
                    y,
                    z
                ),

            velocity:
                new THREE.Vector3(),

            direction:
                new THREE.Vector3(),

            target:
                null,

            state:
                "wander",

            stateTimer:
                1 +
                Math.random() * 4,

            attackCooldown:
                0,

            fleeTimer:
                0,

            object:
                null,

            alive:
                true

        };


        creature.object =
            this.createCreatureModel(
                creature
            );


        creature.object.position.copy(
            creature.position
        );


        this.game.scene.add(
            creature.object
        );


        this.creatures.push(
            creature
        );


        return creature;

    }


    // =================================================
    // CREATE CREATURE MODEL
    // =================================================

    createCreatureModel(
        creature
    ) {

        const group =
            new THREE.Group();


        const material =
            new THREE.MeshStandardMaterial({

                color:
                    creature.color,

                roughness:
                    0.8,

                metalness:
                    0.02

            });


        // BODY

        const bodyGeometry =
            new THREE.SphereGeometry(
                0.65 *
                creature.size,
                12,
                8
            );


        const body =
            new THREE.Mesh(
                bodyGeometry,
                material
            );


        body.scale.set(
            1.15,
            0.85,
            1.35
        );


        body.position.y =
            0.75 *
            creature.size;


        body.castShadow =
            true;


        body.receiveShadow =
            true;


        group.add(
            body
        );


        // HEAD

        const headGeometry =
            new THREE.SphereGeometry(
                0.42 *
                creature.size,
                12,
                8
            );


        const head =
            new THREE.Mesh(
                headGeometry,
                material
            );


        head.position.set(
            0,
            1.05 *
                creature.size,
            -0.55 *
                creature.size
        );


        head.castShadow =
            true;


        group.add(
            head
        );


        // EARS

        const earGeometry =
            new THREE.ConeGeometry(
                0.18 *
                    creature.size,
                0.45 *
                    creature.size,
                6
            );


        const leftEar =
            new THREE.Mesh(
                earGeometry,
                material
            );


        leftEar.position.set(
            -0.25 *
                creature.size,
            1.4 *
                creature.size,
            -0.55 *
                creature.size
        );


        const rightEar =
            leftEar.clone();


        rightEar.position.x =
            0.25 *
            creature.size;


        group.add(
            leftEar
        );

        group.add(
            rightEar
        );


        // EYES

        const eyeMaterial =
            new THREE.MeshBasicMaterial({
                color: 0x111111
            });


        const eyeGeometry =
            new THREE.SphereGeometry(
                0.055 *
                    creature.size,
                8,
                8
            );


        const leftEye =
            new THREE.Mesh(
                eyeGeometry,
                eyeMaterial
            );


        leftEye.position.set(
            -0.15 *
                creature.size,
            1.12 *
                creature.size,
            -0.91 *
                creature.size
        );


        const rightEye =
            leftEye.clone();


        rightEye.position.x =
            0.15 *
            creature.size;


        group.add(
            leftEye
        );

        group.add(
            rightEye
        );


        // TAIL

        const tailGeometry =
            new THREE.CapsuleGeometry(
                0.12 *
                    creature.size,
                0.55 *
                    creature.size,
                4,
                6
            );


        const tail =
            new THREE.Mesh(
                tailGeometry,
                material
            );


        tail.position.set(
            0,
            0.75 *
                creature.size,
            0.85 *
                creature.size
        );


        tail.rotation.x =
            -0.7;


        tail.castShadow =
            true;


        group.add(
            tail
        );


        return group;

    }


    // =================================================
    // UPDATE
    // =================================================

    update(
        delta
    ) {

        this.spawnTimer +=
            delta;


        if (
            this.spawnTimer >= 5
        ) {

            this.spawnTimer = 0;

            this.spawnCreature();

        }


        for (
            let i =
                this.creatures.length -
                1;

            i >= 0;

            i--
        ) {

            const creature =
                this.creatures[i];


            if (
                !creature.alive
            ) {

                this.removeCreature(
                    creature,
                    i
                );

                continue;

            }


            this.updateCreature(
                creature,
                delta
            );

        }

    }


    // =================================================
    // CREATURE AI
    // =================================================

    updateCreature(
        creature,
        delta
    ) {

        if (
            !creature.object
        ) {

            return;

        }


        creature.stateTimer -=
            delta;


        creature.attackCooldown -=
            delta;


        const player =
            this.game.player;


        if (
            !player ||
            !player.object
        ) {

            return;

        }


        const distance =
            creature.position.distanceTo(
                player.object.position
            );


        // ---------------------------------------------
        // PLAYER TOO CLOSE
        // ---------------------------------------------

        if (
            distance < 4
        ) {

            if (
                creature.rarity ===
                "Rare"
            ) {

                creature.state =
                    "attack";

            } else {

                creature.state =
                    "flee";

                creature.fleeTimer =
                    2;

            }

        }


        // ---------------------------------------------
        // FLEE
        // ---------------------------------------------

        if (
            creature.state ===
            "flee"
        ) {

            this.fleeFromPlayer(
                creature,
                delta
            );

        }


        // ---------------------------------------------
        // ATTACK
        // ---------------------------------------------

        else if (
            creature.state ===
            "attack"
        ) {

            this.attackPlayer(
                creature,
                delta
            );

        }


        // ---------------------------------------------
        // WANDER
        // ---------------------------------------------

        else {

            this.wander(
                creature,
                delta
            );

        }


        this.keepCreatureOnGround(
            creature
        );


        creature.object.position.copy(
            creature.position
        );


        // Rotate toward movement

        if (
            creature.velocity.lengthSq()
            >
            0.01
        ) {

            const angle =
                Math.atan2(
                    creature.velocity.x,
                    creature.velocity.z
                );


            creature.object.rotation.y =
                this.smoothRotation(
                    creature.object.rotation.y,
                    angle,
                    delta * 5
                );

        }


        // Small idle animation

        creature.object.position.y +=
            Math.sin(
                this.game.elapsed * 4 +
                creature.id
            ) *
            0.025;

    }


    // =================================================
    // WANDER
    // =================================================

    wander(
        creature,
        delta
    ) {

        if (
            creature.stateTimer <= 0
        ) {

            creature.stateTimer =
                2 +
                Math.random() * 5;


            const angle =
                Math.random() *
                Math.PI *
                2;


            creature.direction.set(
                Math.sin(angle),
                0,
                Math.cos(angle)
            );


            creature.direction.multiplyScalar(
                0.5 +
                Math.random() *
                0.5
            );

        }


        creature.velocity.lerp(
            creature.direction
                .clone()
                .multiplyScalar(
                    creature.speed *
                    0.45
                ),
            delta * 2
        );


        creature.position.add(
            creature.velocity
                .clone()
                .multiplyScalar(
                    delta
                )
        );

    }


    // =================================================
    // FLEE
    // =================================================

    fleeFromPlayer(
        creature,
        delta
    ) {

        const player =
            this.game.player;


        const direction =
            creature.position
                .clone()
                .sub(
                    player.object.position
                );


        direction.y = 0;


        if (
            direction.lengthSq() >
            0
        ) {

            direction.normalize();

        }


        creature.velocity.lerp(
            direction.multiplyScalar(
                creature.speed *
                1.5
            ),
            delta * 5
        );


        creature.position.add(
            creature.velocity
                .clone()
                .multiplyScalar(
                    delta
                )
        );


        creature.fleeTimer -=
            delta;


        if (
            creature.fleeTimer <= 0
        ) {

            creature.state =
                "wander";

            creature.stateTimer =
                2;

        }

    }


    // =================================================
    // ATTACK PLAYER
    // =================================================

    attackPlayer(
        creature,
        delta
    ) {

        const player =
            this.game.player;


        const direction =
            player.object.position
                .clone()
                .sub(
                    creature.position
                );


        direction.y = 0;


        const distance =
            direction.length();


        if (
            distance > 2.2
        ) {

            direction.normalize();


            creature.velocity.lerp(
                direction.multiplyScalar(
                    creature.speed
                ),
                delta * 3
            );


            creature.position.add(
                creature.velocity
                    .clone()
                    .multiplyScalar(
                        delta
                    )
            );

        } else {

            creature.velocity.set(
                0,
                0,
                0
            );


            if (
                creature.attackCooldown <=
                0
            ) {

                creature.attackCooldown =
                    2;


                player.damage(
                    creature.damage
                );


                if (
                    this.game.ui
                ) {

                    this.game.ui.notify(
                        `${creature.name} attacked you!`
                    );

                }

            }

        }

    }


    // =================================================
    // DAMAGE
    // =================================================

    damageCreature(
        creature,
        amount
    ) {

        if (
            !creature ||
            !creature.alive
        ) {

            return;

        }


        creature.health -=
            Math.max(
                0,
                amount
            );


        // Damaged creature runs away.

        creature.state =
            "flee";


        creature.fleeTimer =
            2;


        if (
            creature.health <= 0
        ) {

            creature.health =
                0;

            this.defeatCreature(
                creature
            );

        }

    }


    // =================================================
    // DEFEAT
    // =================================================

    defeatCreature(
        creature
    ) {

        creature.alive =
            false;


        if (
            this.game.systems
        ) {

            this.game.systems
                .addXP(
                    20 +
                    creature.level * 5
                );

        }


        if (
            this.game.ui
        ) {

            this.game.ui.notify(
                `${creature.name} defeated!`
            );

        }

    }


    // =================================================
    // NEAREST CREATURE
    // =================================================

    getNearestCreature(
        maxDistance = 5
    ) {

        const player =
            this.game.player;


        if (
            !player ||
            !player.object
        ) {

            return null;

        }


        let nearest =
            null;


        let nearestDistance =
            maxDistance;


        for (
            const creature
            of this.creatures
        ) {

            if (
                !creature.alive
            ) {

                continue;

            }


            const distance =
                creature.position.distanceTo(
                    player.object.position
                );


            if (
                distance <
                nearestDistance
            ) {

                nearestDistance =
                    distance;

                nearest =
                    creature;

            }

        }


        return nearest;

    }


    // =================================================
    // REMOVE
    // =================================================

    removeCreature(
        creature,
        index
    ) {

        if (
            creature.object
        ) {

            this.game.scene.remove(
                creature.object
            );


            creature.object.traverse(
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
                                material =>
                                    material.dispose()
                            );

                        } else {

                            child.material.dispose();

                        }

                    }

                }
            );

        }


        this.creatures.splice(
            index,
            1
        );

    }


    // =================================================
    // GROUND
    // =================================================

    getGroundHeight(
        x,
        z
    ) {

        if (
            this.game.world &&
            this.game.world.getTerrainHeight
        ) {

            return this.game.world
                .getTerrainHeight(
                    x,
                    z
                );

        }


        return 0;

    }


    keepCreatureOnGround(
        creature
    ) {

        creature.position.y =
            this.getGroundHeight(
                creature.position.x,
                creature.position.z
            );

    }


    // =================================================
    // RANDOM TYPE
    // =================================================

    getRandomType() {

        const random =
            Math.random();


        // Rare creatures have lower chance.

        if (
            random < 0.08
        ) {

            const rare =
                this.types.filter(
                    type =>
                        type.rarity ===
                        "Rare"
                );


            return rare[
                Math.floor(
                    Math.random() *
                    rare.length
                )
            ];

        }


        if (
            random < 0.30
        ) {

            const uncommon =
                this.types.filter(
                    type =>
                        type.rarity ===
                        "Uncommon"
                );


            return uncommon[
                Math.floor(
                    Math.random() *
                    uncommon.length
                )
            ];

        }


        const common =
            this.types.filter(
                type =>
                    type.rarity ===
                    "Common"
            );


        return common[
            Math.floor(
                Math.random() *
                common.length
            )
        ];

    }


    // =================================================
    // SMOOTH ROTATION
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
                amount,
                1
            )
        );

    }

}
