import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js";

export class World {

    constructor(game) {

        this.game = game;

        this.scene = game.scene;

        this.time = 8;

        this.dayLength = 900;

        this.worldSize = 500;

        this.waterLevel = 0;

        this.objects = [];

        this.trees = [];

        this.rocks = [];

        this.grass = [];

        this.clouds = [];

        this.isNight = false;

    }


    // =================================================
    // INITIALIZE WORLD
    // =================================================

    async init() {

        this.createSky();

        this.createTerrain();

        this.createWater();

        this.createEnvironment();

        this.createClouds();

        this.createSpawnArea();

        return true;

    }


    // =================================================
    // SKY
    // =================================================

    createSky() {

        this.sky = new THREE.Mesh(

            new THREE.SphereGeometry(
                600,
                32,
                16
            ),

            new THREE.MeshBasicMaterial({

                color: 0x87a8b5,

                side:
                    THREE.BackSide

            })

        );

        this.scene.add(
            this.sky
        );

    }


    // =================================================
    // TERRAIN
    // =================================================

    createTerrain() {

        const size =
            this.worldSize;

        const segments = 120;

        const geometry =
            new THREE.PlaneGeometry(
                size,
                size,
                segments,
                segments
            );

        const position =
            geometry.attributes.position;

        for (
            let i = 0;
            i < position.count;
            i++
        ) {

            const x =
                position.getX(i);

            const y =
                position.getY(i);

            const height =
                this.getTerrainHeight(
                    x,
                    y
                );

            position.setZ(
                i,
                height
            );

        }

        geometry.computeVertexNormals();

        const material =
            new THREE.MeshStandardMaterial({

                color: 0x526f48,

                roughness: 1,

                metalness: 0

            });

        this.terrain =
            new THREE.Mesh(
                geometry,
                material
            );

        this.terrain.rotation.x =
            -Math.PI / 2;

        this.terrain.receiveShadow =
            true;

        this.scene.add(
            this.terrain
        );

        this.objects.push(
            this.terrain
        );

    }


    // =================================================
    // TERRAIN HEIGHT
    // =================================================

    getTerrainHeight(
        x,
        z
    ) {

        const largeWave =
            Math.sin(x * 0.018) *
            4;

        const secondWave =
            Math.cos(z * 0.025) *
            3;

        const smallWave =
            Math.sin(
                x * 0.07 +
                z * 0.04
            ) * 1.2;

        const mountain =
            Math.sin(x * 0.009) *
            Math.cos(z * 0.011) *
            10;

        const distance =
            Math.sqrt(
                x * x +
                z * z
            );

        let height =
            largeWave +
            secondWave +
            smallWave +
            mountain;

        // Keep spawn area relatively flat

        if (
            distance < 35
        ) {

            const factor =
                distance / 35;

            height *= factor;

        }

        return height;

    }


    // =================================================
    // WATER
    // =================================================

    createWater() {

        const geometry =
            new THREE.PlaneGeometry(
                this.worldSize,
                this.worldSize
            );

        const material =
            new THREE.MeshStandardMaterial({

                color: 0x397b8c,

                transparent: true,

                opacity: 0.72,

                roughness: 0.15,

                metalness: 0.05

            });

        this.water =
            new THREE.Mesh(
                geometry,
                material
            );

        this.water.rotation.x =
            -Math.PI / 2;

        this.water.position.y =
            this.waterLevel;

        this.water.receiveShadow =
            true;

        this.scene.add(
            this.water
        );

    }


    // =================================================
    // ENVIRONMENT
    // =================================================

    createEnvironment() {

        this.createTrees();

        this.createRocks();

        this.createGrass();

    }


    // =================================================
    // TREES
    // =================================================

    createTrees() {

        const count = 150;

        const trunkGeometry =
            new THREE.CylinderGeometry(
                0.35,
                0.55,
                4,
                7
            );

        const trunkMaterial =
            new THREE.MeshStandardMaterial({

                color: 0x60452d,

                roughness: 1

            });

        const leafGeometry =
            new THREE.ConeGeometry(
                2.5,
                5,
                8
            );

        const leafMaterial =
            new THREE.MeshStandardMaterial({

                color: 0x355b37,

                roughness: 1

            });


        for (
            let i = 0;
            i < count;
            i++
        ) {

            const angle =
                Math.random() *
                Math.PI *
                2;

            const distance =
                45 +
                Math.random() *
                190;

            const x =
                Math.cos(angle) *
                distance;

            const z =
                Math.sin(angle) *
                distance;

            const y =
                this.getTerrainHeight(
                    x,
                    z
                );


            // Avoid water

            if (
                y < this.waterLevel + 1
            ) {

                continue;

            }


            const group =
                new THREE.Group();


            const trunk =
                new THREE.Mesh(
                    trunkGeometry,
                    trunkMaterial
                );

            trunk.position.y =
                2;

            trunk.castShadow =
                true;

            trunk.receiveShadow =
                true;


            const leaves =
                new THREE.Mesh(
                    leafGeometry,
                    leafMaterial
                );

            leaves.position.y =
                5;

            leaves.castShadow =
                true;


            group.add(
                trunk
            );

            group.add(
                leaves
            );


            const scale =
                0.75 +
                Math.random() *
                0.8;

            group.scale.setScalar(
                scale
            );


            group.position.set(
                x,
                y,
                z
            );


            this.scene.add(
                group
            );

            this.trees.push(
                group
            );

        }

    }


    // =================================================
    // ROCKS
    // =================================================

    createRocks() {

        const count = 110;

        const geometry =
            new THREE.DodecahedronGeometry(
                1,
                0
            );

        const material =
            new THREE.MeshStandardMaterial({

                color: 0x666963,

                roughness: 1

            });


        for (
            let i = 0;
            i < count;
            i++
        ) {

            const angle =
                Math.random() *
                Math.PI *
                2;

            const distance =
                20 +
                Math.random() *
                220;

            const x =
                Math.cos(angle) *
                distance;

            const z =
                Math.sin(angle) *
                distance;

            const y =
                this.getTerrainHeight(
                    x,
                    z
                );


            if (
                y <
                this.waterLevel - 0.5
            ) {

                continue;

            }


            const rock =
                new THREE.Mesh(
                    geometry,
                    material
                );


            const scale =
                0.5 +
                Math.random() *
                1.7;

            rock.scale.set(
                scale,
                scale *
                    (0.6 +
                    Math.random() *
                    0.5),
                scale
            );


            rock.position.set(
                x,
                y +
                    scale *
                    0.25,
                z
            );


            rock.rotation.y =
                Math.random() *
                Math.PI;


            rock.castShadow =
                true;

            rock.receiveShadow =
                true;


            this.scene.add(
                rock
            );

            this.rocks.push(
                rock
            );

        }

    }


    // =================================================
    // GRASS
    // =================================================

    createGrass() {

        const count = 450;

        const geometry =
            new THREE.BufferGeometry();

        const positions = [];

        for (
            let i = 0;
            i < count;
            i++
        ) {

            const x =
                (Math.random() -
                    0.5) *
                this.worldSize;

            const z =
                (Math.random() -
                    0.5) *
                this.worldSize;

            const y =
                this.getTerrainHeight(
                    x,
                    z
                );

            if (
                y <
                this.waterLevel + 0.4
            ) {

                continue;

            }

            positions.push(
                x,
                y,
                z
            );

        }

        geometry.setAttribute(

            "position",

            new THREE.Float32BufferAttribute(
                positions,
                3
            )

        );


        const material =
            new THREE.PointsMaterial({

                color: 0x73935f,

                size: 0.35,

                sizeAttenuation: true

            });


        const grass =
            new THREE.Points(
                geometry,
                material
            );


        this.scene.add(
            grass
        );

        this.grass.push(
            grass
        );

    }


    // =================================================
    // CLOUDS
    // =================================================

    createClouds() {

        const cloudMaterial =
            new THREE.MeshBasicMaterial({

                color: 0xffffff,

                transparent: true,

                opacity: 0.45

            });


        for (
            let i = 0;
            i < 18;
            i++
        ) {

            const cloud =
                new THREE.Group();


            for (
                let j = 0;
                j < 5;
                j++
            ) {

                const geometry =
                    new THREE.SphereGeometry(
                        5 +
                        Math.random() * 4,
                        8,
                        8
                    );


                const part =
                    new THREE.Mesh(
                        geometry,
                        cloudMaterial
                    );


                part.position.set(

                    j * 5,

                    Math.random() * 2,

                    Math.random() * 4

                );


                cloud.add(
                    part
                );

            }


            cloud.position.set(

                -250 +
                Math.random() *
                500,

                80 +
                Math.random() *
                35,

                -250 +
                Math.random() *
                500

            );


            const scale =
                0.7 +
                Math.random() *
                0.8;

            cloud.scale.setScalar(
                scale
            );


            this.scene.add(
                cloud
            );

            this.clouds.push(
                cloud
            );

        }

    }


    // =================================================
    // PLAYER SPAWN AREA
    // =================================================

    createSpawnArea() {

        const geometry =
            new THREE.CircleGeometry(
                32,
                48
            );

        const material =
            new THREE.MeshStandardMaterial({

                color: 0x66875a,

                transparent: true,

                opacity: 0.15

            });


        const area =
            new THREE.Mesh(
                geometry,
                material
            );


        area.rotation.x =
            -Math.PI / 2;

        area.position.y =
            this.getTerrainHeight(
                0,
                0
            ) + 0.05;


        this.scene.add(
            area
        );

    }


    // =================================================
    // BIOME
    // =================================================

    getBiome(
        x,
        z
    ) {

        const distance =
            Math.sqrt(
                x * x +
                z * z
            );

        if (
            distance < 100
        ) {

            return "FOREST";

        }

        if (
            x > 100
        ) {

            return "DESERT";

        }

        if (
            z < -120
        ) {

            return "SNOW";

        }

        if (
            z > 130
        ) {

            return "SWAMP";

        }

        return "PLAINS";

    }


    // =================================================
    // DAY / NIGHT
    // =================================================

    updateTime(delta) {

        this.time +=
            delta /
            this.dayLength *
            24;

        if (
            this.time >= 24
        ) {

            this.time -= 24;

        }


        const sunAngle =
            (
                this.time - 6
            ) /
            24 *
            Math.PI *
            2;


        const sunDistance = 180;


        if (
            this.game.sun
        ) {

            this.game.sun.position.set(

                Math.cos(
                    sunAngle
                ) *
                sunDistance,

                Math.sin(
                    sunAngle
                ) *
                sunDistance,

                80

            );

        }


        const daylight =
            Math.max(
                0.08,
                Math.sin(
                    sunAngle
                )
            );


        if (
            this.game.sun
        ) {

            this.game.sun.intensity =
                0.35 +
                daylight *
                2.3;

        }


        if (
            this.game.moon
        ) {

            this.game.moon.intensity =
                0.1 +
                (1 - daylight) *
                0.35;

        }


        this.isNight =
            this.time < 6 ||
            this.time > 19;

    }


    // =================================================
    // UPDATE
    // =================================================

    update(
        delta,
        elapsed
    ) {

        this.updateTime(
            delta
        );


        // Move clouds

        for (
            const cloud
            of this.clouds
        ) {

            cloud.position.x +=
                delta * 0.7;

            if (
                cloud.position.x >
                300
            ) {

                cloud.position.x =
                    -300;

            }

        }


        // Gentle water movement

        if (
            this.water
        ) {

            this.water.position.y =
                this.waterLevel +
                Math.sin(
                    elapsed *
                    0.7
                ) *
                0.025;

        }

    }


    // =================================================
    // GET GROUND HEIGHT
    // =================================================

    getGroundHeight(
        x,
        z
    ) {

        return this.getTerrainHeight(
            x,
            z
        );

    }


    // =================================================
    // CLEANUP
    // =================================================

    dispose() {

        for (
            const object
            of this.objects
        ) {

            if (
                object.geometry
            ) {

                object.geometry.dispose();

            }

            if (
                object.material
            ) {

                object.material.dispose();

            }

        }

    }

}
