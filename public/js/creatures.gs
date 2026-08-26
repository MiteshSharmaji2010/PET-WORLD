import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js";

export class CreatureManager {

    constructor(game) {

        this.game = game;
        this.scene = game.scene;

        this.creatures = [];
        this.maxCreatures = 35;

        this.spawnDistance = 25;
        this.despawnDistance = 180;

        this.species = [

            {
                id: "leafling",
                name: "Leafling",
                level: 1,
                health: 60,
                speed: 2.2,
                color: 0x65a85d,
                size: 0.8
            },

            {
                id: "flameling",
                name: "Flameling",
                level: 3,
                health: 80,
                speed: 2.8,
                color: 0xc85b3d,
                size: 0.85
            },

            {
                id: "aquabit",
                name: "Aquabit",
                level: 2,
                health: 70,
                speed: 2.4,
                color: 0x4f8fc2,
                size: 0.85
            },

            {
                id: "rocko",
                name: "Rocko",
                level: 4,
                health: 110,
                speed: 1.5,
                color: 0x777b76,
                size: 1.05
            }

        ];

    }


    // =================================================
    // INITIALIZE
    // =================================================

    async init() {

        this.spawnInitialCreatures();

        return true;

    }


    // =================================================
    // SPAWN INITIAL CREATURES
    // =================================================

    spawnInitialCreatures() {

        for (
            let i = 0;
            i < this.maxCreatures;
            i++
        ) {

            this.spawnCreature();

        }

    }


    // =================================================
    // SPAWN CREATURE
    // =================================================

    spawnCreature() {

        const species =
            this.species[
                Math.floor(
                    Math.random() *
                    this.species.length
                )
            ];


        const angle =
            Math.random() *
            Math.PI *
            2;


        const distance =
            this.spawnDistance +
            Math.random() *
            130;


        const x =
            this.game.player.position.x +
            Math.cos(angle) *
            distance;


        const z =
            this.game.player.position.z +
            Math.sin(angle) *
            distance;


        const ground =
            this.game.world.getGroundHeight(
                x,
                z
            );


        if (
            ground <
            this.game.world.waterLevel + 0.5
        ) {

            return;

        }


        const creature =
            this.createCreature(
                species,
                x,
                ground,
                z
            );


        this.creatures.push(
            creature
        );

    }


    // =================================================
    // CREATE CREATURE
    // =================================================

    createCreature(
        species,
        x,
        y,
        z
    ) {

        const group =
            new THREE.Group();


        // -----------------------------
        // BODY
        // -----------------------------

        const bodyGeometry =
            new THREE.SphereGeometry(
                species.size,
                16,
                12
            );


        const bodyMaterial =
            new THREE.MeshStandardMaterial({

                color:
                    species.color,

                roughness:
                    0.8

            });


        const body =
            new THREE.Mesh(
                bodyGeometry,
                bodyMaterial
            );


        body.scale.set(
            1,
            0.85,
            1.15
        );


        body.position.y =
            species.size;


        body.castShadow =
            true;


        group.add(
            body
        );


        // -----------------------------
        // HEAD
        // -----------------------------

        const headGeometry =
            new THREE.SphereGeometry(
                species.size * 0.65,
                14,
                10
            );


        const head =
            new THREE.Mesh(
                headGeometry,
                bodyMaterial
            );


        head.position.set(
            0,
            species.size * 1.65,
            species.size * -0.35
        );


        head.castShadow =
            true;


        group.add(
            head
        );


        // -----------------------------
        // EYES
        // -----------------------------

        const eyeGeometry =
            new THREE.SphereGeometry(
                species.size * 0.09,
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


        const rightEye =
            new THREE.Mesh(
                eyeGeometry,
                eyeMaterial
            );


        leftEye.position.set(
            -species.size * 0.22,
            species.size * 1.72,
            -species.size * 0.88
        );


        rightEye.position.set(
            species.size * 0.22,
            species.size * 1.72,
            -species.size * 0.88
        );


        group.add(
            leftEye,
            rightEye
        );


        // -----------------------------
        // EARS
        // -----------------------------

        const earGeometry =
            new THREE.ConeGeometry(
                species.size * 0.22,
                species.size * 0.55,
                6
            );


        const leftEar =
            new THREE.Mesh(
                earGeometry,
                bodyMaterial
            );


        const rightEar =
            new THREE.Mesh(
                earGeometry,
                bodyMaterial
            );


        leftEar.position.set(
            -species.size * 0.42,
            species.size * 2.05,
            -species.size * 0.25
        );


        rightEar.position.set(
            species.size * 0.42,
            species.size * 2.05,
            -species.size * 0.25
        );


        group.add(
            leftEar,
            rightEar
        );


        // -----------------------------
        // POSITION
        // -----------------------------

        group.position.set(
            x,
            y,
            z
        );


        this.scene.add(
            group
        );


        // -----------------------------
        // CREATURE DATA
        // -----------------------------

        const creature = {

            id:
                crypto.randomUUID(),

            speciesId:
                species.id,

            name:
                species.name,

            level:
                species.level +
                Math.floor(
                    Math.random() * 4
                ),

            maxHealth:
                species.health,

            health:
                species.health,

            speed:
                species.speed,

            object:
                group,

            state:
                "idle",

            target:
                null,

            wanderTarget:
                new THREE.Vector3(),

            wanderTimer:
                0,

            attackCooldown:
                0,

            captureChance:
                0.2,

            captured:
                false,

            tame:
                false,

            alive:
                true

        };


        group.userData.creature =
            creature;


        return creature;

    }


    // =================================================
    // AI
    // =================================================

    updateCreature(
        creature,
        delta
    ) {

        if (
            !creature.alive
        ) {

            return;

        }


        creature.wanderTimer -=
            delta;


        creature.attackCooldown -=
            delta;


        const player =
            this.game.player;


        const distance =
            creature.object.position.distanceTo(
                player.position
            );


        // ---------------------------------------------
        // TOO FAR
        // ---------------------------------------------

        if (
            distance >
            this.despawnDistance
        ) {

            this.removeCreature(
                creature
            );

            return;

        }


        // ---------------------------------------------
        // PLAYER NEARBY
        // ---------------------------------------------

        if (
            distance < 12
        ) {

            creature.state =
                "alert";

        } else {

            creature.state =
                "wander";

        }


        // ---------------------------------------------
        // WANDER
        // ---------------------------------------------

        if (
            creature.state ===
            "wander"
        ) {

            if (
                creature.wanderTimer <=
                0
            ) {

                const angle =
                    Math.random() *
                    Math.PI *
                    2;


                const distance =
                    5 +
                    Math.random() * 12;


                creature.wanderTarget.set(

                    creature.object.position.x +
                    Math.cos(angle) *
                    distance,

                    0,

                    creature.object.position.z +
                    Math.sin(angle) *
                    distance

                );


                creature.wanderTimer =
                    2 +
                    Math.random() * 4;

            }


            this.moveTowards(
                creature,
                creature.wanderTarget,
                creature.speed,
                delta
            );

        }


        // ---------------------------------------------
        // ALERT
        // ---------------------------------------------

        if (
            creature.state ===
            "alert"
        ) {

            if (
                distance < 4
            ) {

                this.attackPlayer(
                    creature
                );

            } else {

                // Some creatures move away
                // from the player.

                const direction =
                    creature.object.position
                        .clone()
                        .sub(
                            player.position
                        )
                        .normalize();


                const target =
                    creature.object.position
                        .clone()
                        .add(
                            direction.multiplyScalar(
                                5
                            )
                        );


                this.moveTowards(
                    creature,
                    target,
                    creature.speed,
                    delta
                );

            }

        }


        // ---------------------------------------------
        // GROUND
        // ---------------------------------------------

        const ground =
            this.game.world.getGroundHeight(
                creature.object.position.x,
                creature.object.position.z
            );


        creature.object.position.y =
            ground;

    }


    // =================================================
    // MOVE CREATURE
    // =================================================

    moveTowards(
        creature,
        target,
        speed,
        delta
    ) {

        const direction =
            target.clone().sub(
                creature.object.position
            );


        direction.y = 0;


        if (
            direction.lengthSq() <
            0.5
        ) {

            return;

        }


        direction.normalize();


        creature.object.position.add(
            direction.multiplyScalar(
                speed * delta
            )
        );


        creature.object.rotation.y =
            Math.atan2(
                direction.x,
                direction.z
            );

    }


    // =================================================
    // ATTACK PLAYER
    // =================================================

    attackPlayer(
        creature
    ) {

        if (
            creature.attackCooldown >
            0
        ) {

            return;

        }


        creature.attackCooldown =
            2;


        this.game.player.takeDamage(
            5 +
            creature.level
        );


        if (
            this.game.ui &&
            typeof this.game.ui.notify ===
                "function"
        ) {

            this.game.ui.notify(
                `${creature.name} attacked you!`
            );

        }

    }


    // =================================================
    // DAMAGE CREATURE
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
            amount;


        if (
            creature.health <=
            0
        ) {

            creature.health =
                0;

            creature.alive =
                false;

            creature.state =
                "dead";


            this.onCreatureDefeated(
                creature
            );

        }

    }


    // =================================================
    // CREATURE DEFEATED
    // =================================================

    onCreatureDefeated(
        creature
    ) {

        if (
            this.game.ui &&
            typeof this.game.ui.notify ===
                "function"
        ) {

            this.game.ui.notify(
                `${creature.name} defeated!`
            );

        }


        setTimeout(
            () => {

                this.removeCreature(
                    creature
                );

            },
            2500
        );

    }


    // =================================================
    // CAPTURE
    // =================================================

    captureCreature(
        creature
    ) {

        if (
            !creature ||
            !creature.alive ||
            creature.captured
        ) {

            return false;

        }


        const healthRatio =
            creature.health /
            creature.maxHealth;


        // Lower health =
        // higher capture chance.

        let chance =
            0.15 +
            (
                1 -
                healthRatio
            ) *
            0.7;


        chance +=
            creature.level <= 3
                ? 0.1
                : 0;


        const success =
            Math.random() <
            chance;


        if (
            success
        ) {

            creature.captured =
                true;

            creature.tame =
                true;


            this.game.systems
                ?.addPet(
                    creature
                );


            if (
                this.game.ui &&
                typeof this.game.ui.notify ===
                    "function"
            ) {

                this.game.ui.notify(
                    `${creature.name} captured!`
                );

            }


            this.removeCreature(
                creature
            );


            return true;

        }


        if (
            this.game.ui &&
            typeof this.game.ui.notify ===
                "function"
        ) {

            this.game.ui.notify(
                `${creature.name} escaped!`
            );

        }


        return false;

    }


    // =================================================
    // GET NEAREST CREATURE
    // =================================================

    getNearestCreature(
        maxDistance = 10
    ) {

        const player =
            this.game.player;


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
                creature.object.position
                    .distanceTo(
                        player.position
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


    // =================================================
    // REMOVE CREATURE
    // =================================================

    removeCreature(
        creature
    ) {

        if (
            !creature
        ) {

            return;

        }


        this.scene.remove(
            creature.object
        );


        const index =
            this.creatures.indexOf(
                creature
            );


        if (
            index !== -1
        ) {

            this.creatures.splice(
                index,
                1
            );

        }

    }


    // =================================================
    // MAINTAIN CREATURE COUNT
    // =================================================

    maintainCreatureCount() {

        while (
            this.creatures.length <
            this.maxCreatures
        ) {

            this.spawnCreature();

        }

    }


    // =================================================
    // UPDATE
    // =================================================

    update(
        delta,
        elapsed
    ) {

        for (
            const creature
            of [
                ...this.creatures
            ]
        ) {

            this.updateCreature(
                creature,
                delta
            );

        }


        this.maintainCreatureCount();

    }

}
