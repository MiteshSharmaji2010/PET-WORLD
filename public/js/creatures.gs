import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js";

export class Creatures {

    constructor(game) {

        this.game = game;

        this.list = [];

        this.nextId = 1;

        this.spawnTimer = 0;

        this.maxCreatures = 30;

        this.spawnDistance = 120;

        this.species = [

            {
                id: "leafy",
                name: "Leafy",
                rarity: "Common",
                health: 60,
                damage: 8,
                speed: 1.8,
                color: 0x6fa85a,
                size: 0.8
            },

            {
                id: "flameling",
                name: "Flameling",
                rarity: "Uncommon",
                health: 75,
                damage: 12,
                speed: 2.2,
                color: 0xd96a3a,
                size: 0.9
            },

            {
                id: "aquabun",
                name: "Aquabun",
                rarity: "Common",
                health: 55,
                damage: 7,
                speed: 2.5,
                color: 0x5d9ed1,
                size: 0.75
            },

            {
                id: "rockhorn",
                name: "Rockhorn",
                rarity: "Rare",
                health: 130,
                damage: 18,
                speed: 1.2,
                color: 0x77736a,
                size: 1.25
            },

            {
                id: "shadowfang",
                name: "Shadowfang",
                rarity: "Epic",
                health: 180,
                damage: 25,
                speed: 3.1,
                color: 0x3b3151,
                size: 1.05
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

            this.spawnRandomCreature();

        }

    }


    // =================================================
    // UPDATE
    // =================================================

    update(delta) {

        this.spawnTimer += delta;

        if (
            this.spawnTimer >= 5
        ) {

            this.spawnTimer = 0;

            if (
                this.list.length <
                this.maxCreatures
            ) {

                this.spawnRandomCreature();

            }

        }


        for (
            const creature of this.list
        ) {

            if (
                creature.dead
            ) {

                continue;

            }

            this.updateCreature(
                creature,
                delta
            );

        }

        this.removeDeadCreatures();

    }


    // =================================================
    // SPAWN
    // =================================================

    spawnRandomCreature() {

        if (
            !this.game.world
        ) {

            return null;

        }

        const species =
            this.getRandomSpecies();


        const position =
            this.game.world
                .getRandomLandPosition();


        const creature =
            this.createCreature(
                species,
                position
            );


        this.list.push(
            creature
        );


        return creature;

    }


    // =================================================
    // RANDOM SPECIES
    // =================================================

    getRandomSpecies() {

        const random =
            Math.random();


        if (
            random < 0.48
        ) {

            return this.species[0];

        }

        if (
            random < 0.70
        ) {

            return this.species[2];

        }

        if (
            random < 0.86
        ) {

            return this.species[1];

        }

        if (
            random < 0.96
        ) {

            return this.species[3];

        }

        return this.species[4];

    }


    // =================================================
    // CREATE CREATURE
    // =================================================

    createCreature(
        species,
        position
    ) {

        const group =
            new THREE.Group();


        group.name =
            species.name;


        const bodyMaterial =
            new THREE.MeshStandardMaterial({

                color:
                    species.color,

                roughness: 0.8

            });


        const eyeMaterial =
            new THREE.MeshStandardMaterial({

                color: 0x111111,

                roughness: 0.3

            });


        // =============================================
        // BODY
        // =============================================

        const bodyGeometry =
            new THREE.SphereGeometry(
                0.65,
                12,
                8
            );


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
            0.7;


        body.castShadow =
            true;


        group.add(
            body
        );


        // =============================================
        // HEAD
        // =============================================

        const headGeometry =
            new THREE.SphereGeometry(
                0.48,
                12,
                8
            );


        const head =
            new THREE.Mesh(
                headGeometry,
                bodyMaterial
            );


        head.position.set(
            0,
            1.05,
            -0.52
        );


        head.castShadow =
            true;


        group.add(
            head
        );


        // =============================================
        // EYES
        // =============================================

        const eyeGeometry =
            new THREE.SphereGeometry(
                0.065,
                8,
                8
            );


        const leftEye =
            new THREE.Mesh(
                eyeGeometry,
                eyeMaterial
            );


        leftEye.position.set(
            -0.16,
            1.12,
            -0.91
        );


        const rightEye =
            leftEye.clone();


        rightEye.position.x =
            0.16;


        group.add(
            leftEye
        );

        group.add(
            rightEye
        );


        // =============================================
        // EARS
        // =============================================

        const earGeometry =
            new THREE.ConeGeometry(
                0.18,
                0.45,
                6
            );


        const leftEar =
            new THREE.Mesh(
                earGeometry,
                bodyMaterial
            );


        leftEar.position.set(
            -0.27,
            1.48,
            -0.5
        );


        const rightEar =
            leftEar.clone();


        rightEar.position.x =
            0.27;


        group.add(
            leftEar
        );

        group.add(
            rightEar
        );


        // =============================================
        // SCALE
        // =============================================

        group.scale.setScalar(
            species.size
        );


        // =============================================
        // POSITION
        // =============================================

        group.position.copy(
            position
        );


        // =============================================
        // DATA
        // =============================================

        const level =
            1 +
            Math.floor(
                Math.random() * 10
            );


        const maxHealth =
            species.health +
            level * 6;


        group.userData =
            {

                id:
                    this.nextId++,

                speciesId:
                    species.id,

                name:
                    species.name,

                rarity:
                    species.rarity,

                level:
                    level,

                health:
                    maxHealth,

                maxHealth:
                    maxHealth,

                damage:
                    species.damage +
                    level,

                speed:
                    species.speed,

                wild:
                    true,

                captured:
                    false,

                dead:
                    false,

                target:
                    null,

                direction:
                    new THREE.Vector3(),

                wanderTimer:
                    0,

                attackTimer:
                    0,

                detectionRange:
                    12,

                attackRange:
                    2.1

            };


        this.game.scene.add(
            group
        );


        return group;

    }


    // =================================================
    // CREATURE AI
    // =================================================

    updateCreature(
        creature,
        delta
    ) {

        const data =
            creature.userData;


        data.wanderTimer -=
            delta;


        data.attackTimer -=
            delta;


        const player =
            this.game.player;


        if (
            !player ||
            !player.object
        ) {

            return;

        }


        const playerPosition =
            player.object.position;


        const distance =
            creature.position.distanceTo(
                playerPosition
            );


        // =============================================
        // PLAYER DETECTION
        // =============================================

        if (
            distance <
            data.detectionRange
        ) {

            data.target =
                playerPosition;

        } else {

            data.target =
                null;

        }


        // =============================================
        // ATTACK
        // =============================================

        if (
            distance <=
            data.attackRange
        ) {

            creature.lookAt(
                playerPosition.x,
                creature.position.y,
                playerPosition.z
            );


            if (
                data.attackTimer <=
                0
            ) {

                data.attackTimer =
                    1.5;


                if (
                    typeof player.damage ===
                    "function"
                ) {

                    player.damage(
                        data.damage
                    );

                }

            }


            return;

        }


        // =============================================
        // CHASE
        // =============================================

        if (
            data.target
        ) {

            const direction =
                new THREE.Vector3()
                    .subVectors(
                        playerPosition,
                        creature.position
                    );


            direction.y =
                0;


            if (
                direction.lengthSq() >
                0.001
            ) {

                direction.normalize();

                this.moveCreature(
                    creature,
                    direction,
                    data.speed,
                    delta
                );

            }


            return;

        }


        // =============================================
        // WANDER
        // =============================================

        if (
            data.wanderTimer <=
            0
        ) {

            data.wanderTimer =
                2 +
                Math.random() * 4;


            data.direction.set(
                Math.random() - 0.5,
                0,
                Math.random() - 0.5
            );


            if (
                data.direction.lengthSq() >
                0
            ) {

                data.direction.normalize();

            }

        }


        this.moveCreature(
            creature,
            data.direction,
            data.speed * 0.45,
            delta
        );

    }


    // =================================================
    // MOVE CREATURE
    // =================================================

    moveCreature(
        creature,
        direction,
        speed,
        delta
    ) {

        if (
            !direction
        ) {

            return;

        }


        creature.position.x +=
            direction.x *
            speed *
            delta;


        creature.position.z +=
            direction.z *
            speed *
            delta;


        if (
            direction.lengthSq() >
            0.001
        ) {

            const targetRotation =
                Math.atan2(
                    direction.x,
                    direction.z
                );


            creature.rotation.y =
                this.smoothRotation(
                    creature.rotation.y,
                    targetRotation,
                    delta * 5
                );

        }


        if (
            this.game.world
        ) {

            const terrainY =
                this.game.world
                    .getTerrainHeight(
                        creature.position.x,
                        creature.position.z
                    );


            creature.position.y =
                terrainY;

        }

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
                1,
                amount
            )
        );

    }


    // =================================================
    // NEAREST CREATURE
    // =================================================

    getNearestCreature(
        maxDistance = 10
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
            const creature of this.list
        ) {

            if (
                creature.userData.dead
            ) {

                continue;

            }


            const distance =
                creature.position.distanceTo(
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


    // =================================================
    // DAMAGE CREATURE
    // =================================================

    damageCreature(
        creature,
        amount
    ) {

        if (
            !creature ||
            !creature.userData
        ) {

            return false;

        }


        const data =
            creature.userData;


        if (
            data.dead
        ) {

            return false;

        }


        amount =
            Math.max(
                0,
                Number(amount) || 0
            );


        data.health -=
            amount;


        if (
            this.game.ui
        ) {

            this.game.ui.notify(
                `${data.name}: ${Math.max(
                    0,
                    Math.round(
                        data.health
                    )
                )} HP`
            );

        }


        if (
            data.health <=
            0
        ) {

            this.killCreature(
                creature
            );

        }


        return true;

    }


    // =================================================
    // KILL
    // =================================================

    killCreature(
        creature
    ) {

        const data =
            creature.userData;


        if (
            data.dead
        ) {

            return;

        }


        data.dead =
            true;


        if (
            this.game.systems &&
            typeof this.game.systems.addXP ===
            "function"
        ) {

            this.game.systems.addXP(
                10 +
                data.level * 3
            );

        }


        if (
            this.game.ui
        ) {

            this.game.ui.notify(
                `${data.name} defeated!`
            );

        }


        setTimeout(
            () => {

                if (
                    creature.parent
                ) {

                    creature.parent.remove(
                        creature
                    );

                }

            },
            500
        );

    }


    // =================================================
    // CAPTURE
    // =================================================

    captureNearestCreature() {

        const creature =
            this.getNearestCreature(
                6
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

            return false;

        }


        const data =
            creature.userData;


        if (
            data.health <=
            0 ||
            data.dead
        ) {

            return false;

        }


        if (
            !data.wild
        ) {

            return false;

        }


        // Capture chance becomes better
        // when the creature has low HP.

        const healthPercent =
            data.health /
            data.maxHealth;


        let chance =
            0.25 +
            (
                1 -
                healthPercent
            ) *
            0.55;


        if (
            data.rarity ===
            "Rare"
        ) {

            chance -=
                0.08;

        }


        if (
            data.rarity ===
            "Epic"
        ) {

            chance -=
                0.15;

        }


        const success =
            Math.random() <
            chance;


        if (
            success
        ) {

            this.captureCreature(
                creature
            );

        } else {

            if (
                this.game.ui
            ) {

                this.game.ui.notify(
                    `${data.name} escaped!`
                );

            }

        }


        return success;

    }


    // =================================================
    // CAPTURE CREATURE
    // =================================================

    captureCreature(
        creature
    ) {

        const data =
            creature.userData;


        data.wild =
            false;


        data.captured =
            true;


        if (
            this.game.systems &&
            typeof this.game.systems.addPet ===
            "function"
        ) {

            this.game.systems.addPet({

                id:
                    data.id,

                speciesId:
                    data.speciesId,

                name:
                    data.name,

                rarity:
                    data.rarity,

                level:
                    data.level,

                health:
                    data.health,

                maxHealth:
                    data.maxHealth,

                damage:
                    data.damage,

                speed:
                    data.speed

            });

        }


        if (
            this.game.ui
        ) {

            this.game.ui.notify(
                `🎉 ${data.name} captured!`
            );

        }


        if (
            creature.parent
        ) {

            creature.parent.remove(
                creature
            );

        }


        const index =
            this.list.indexOf(
                creature
            );


        if (
            index !==
            -1
        ) {

            this.list.splice(
                index,
                1
            );

        }

    }


    // =================================================
    // REMOVE DEAD
    // =================================================

    removeDeadCreatures() {

        for (
            let i =
                this.list.length - 1;
            i >= 0;
            i--
        ) {

            const creature =
                this.list[i];


            if (
                creature.userData.dead
            ) {

                this.list.splice(
                    i,
                    1
                );

            }

        }

    }

}
