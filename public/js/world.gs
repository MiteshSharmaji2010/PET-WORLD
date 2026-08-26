import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js";

export class World {

    constructor(game) {

        this.game = game;

        this.scene = game.scene;

        this.size = 500;

        this.waterLevel = -0.4;

        this.terrainResolution = 100;

        this.terrain = null;

        this.terrainData = [];

        this.trees = [];

        this.rocks = [];

        this.grass = [];

        this.timeOfDay = 9;

        this.dayLength = 600;

        this.worldGroup =
            new THREE.Group();

    }


    // =================================================
    // INITIALIZE
    // =================================================

    async init() {

        this.scene.add(
            this.worldGroup
        );

        this.createTerrain();

        this.createWater();

        this.createTrees();

        this.createRocks();

        this.createGrass();

        this.createLighting();

        this.createSky();

    }


    // =================================================
    // TERRAIN
    // =================================================

    createTerrain() {

        const segments =
            this.terrainResolution;


        const geometry =
            new THREE.PlaneGeometry(
                this.size,
                this.size,
                segments,
                segments
            );


        geometry.rotateX(
            -Math.PI / 2
        );


        const position =
            geometry.attributes.position;


        this.terrainData =
            new Array(
                segments + 1
            );


        for (
            let z = 0;
            z <= segments;
            z++
        ) {

            this.terrainData[z] =
                new Array(
                    segments + 1
                );


            for (
                let x = 0;
                x <= segments;
                x++
            ) {

                const worldX =
                    (
                        x / segments -
                        0.5
                    ) *
                    this.size;


                const worldZ =
                    (
                        z / segments -
                        0.5
                    ) *
                    this.size;


                const height =
                    this.generateHeight(
                        worldX,
                        worldZ
                    );


                const index =
                    z *
                    (segments + 1) +
                    x;


                position.setY(
                    index,
                    height
                );


                this.terrainData[z][x] =
                    height;

            }

        }


        geometry.computeVertexNormals();


        const material =
            new THREE.MeshStandardMaterial({

                color: 0x536b3b,

                roughness: 1,

                metalness: 0

            });


        this.terrain =
            new THREE.Mesh(
                geometry,
                material
            );


        this.terrain.receiveShadow =
            true;


        this.terrain.castShadow =
            false;


        this.terrain.name =
            "OpenWorldTerrain";


        this.worldGroup.add(
            this.terrain
        );

    }


    // =================================================
    // TERRAIN HEIGHT
    // =================================================

    generateHeight(
        x,
        z
    ) {

        const large =
            Math.sin(
                x * 0.018
            ) *
            Math.cos(
                z * 0.015
            ) *
            7;


        const medium =
            Math.sin(
                x * 0.055 +
                z * 0.031
            ) *
            2.5;


        const small =
            Math.sin(
                x * 0.14
            ) *
            Math.cos(
                z * 0.11
            ) *
            0.6;


        const distance =
            Math.sqrt(
                x * x +
                z * z
            );


        const valley =
            Math.max(
                0,
                distance - 120
            ) *
            0.018;


        return (
            large +
            medium +
            small -
            valley
        );

    }


    // =================================================
    // GET TERRAIN HEIGHT
    // =================================================

    getTerrainHeight(
        x,
        z
    ) {

        const half =
            this.size / 2;


        if (
            x < -half ||
            x > half ||
            z < -half ||
            z > half
        ) {

            return 0;

        }


        const segments =
            this.terrainResolution;


        const gridSize =
            this.size /
            segments;


        const gridX =
            Math.floor(
                (
                    x + half
                ) /
                gridSize
            );


        const gridZ =
            Math.floor(
                (
                    z + half
                ) /
                gridSize
            );


        const xIndex =
            Math.max(
                0,
                Math.min(
                    segments,
                    gridX
                )
            );


        const zIndex =
            Math.max(
                0,
                Math.min(
                    segments,
                    gridZ
                )
            );


        if (
            this.terrainData[zIndex] &&
            Number.isFinite(
                this.terrainData[zIndex][xIndex]
            )
        ) {

            return this.terrainData[zIndex][xIndex];

        }


        return this.generateHeight(
            x,
            z
        );

    }


    // =================================================
    // WATER
    // =================================================

    createWater() {

        const geometry =
            new THREE.PlaneGeometry(
                this.size,
                this.size,
                1,
                1
            );


        geometry.rotateX(
            -Math.PI / 2
        );


        const material =
            new THREE.MeshStandardMaterial({

                color: 0x2c6f86,

                transparent: true,

                opacity: 0.72,

                roughness: 0.15,

                metalness: 0.05

            });


        const water =
            new THREE.Mesh(
                geometry,
                material
            );


        water.position.y =
            this.waterLevel;


        water.receiveShadow =
            true;


        water.name =
            "WorldWater";


        this.worldGroup.add(
            water
        );

    }


    // =================================================
    // TREES
    // =================================================

    createTrees() {

        const count = 280;


        const trunkMaterial =
            new THREE.MeshStandardMaterial({

                color: 0x5a3d25,

                roughness: 1

            });


        const leafMaterial =
            new THREE.MeshStandardMaterial({

                color: 0x315d32,

                roughness: 1

            });


        const trunkGeometry =
            new THREE.CylinderGeometry(
                0.18,
                0.28,
                2.2,
                7
            );


        const leafGeometry =
            new THREE.ConeGeometry(
                1.25,
                3,
                8
            );


        for (
            let i = 0;
            i < count;
            i++
        ) {

            const x =
                (
                    Math.random() -
                    0.5
                ) *
                this.size;


            const z =
                (
                    Math.random() -
                    0.5
                ) *
                this.size;


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


            const tree =
                new THREE.Group();


            const trunk =
                new THREE.Mesh(
                    trunkGeometry,
                    trunkMaterial
                );


            trunk.position.y =
                1.1;


            trunk.castShadow =
                true;


            tree.add(
                trunk
            );


            const leaves =
                new THREE.Mesh(
                    leafGeometry,
                    leafMaterial
                );


            leaves.position.y =
                3;


            leaves.castShadow =
                true;


            tree.add(
                leaves
            );


            tree.position.set(
                x,
                y,
                z
            );


            const scale =
                0.75 +
                Math.random() *
                0.8;


            tree.scale.setScalar(
                scale
            );


            tree.rotation.y =
                Math.random() *
                Math.PI *
                2;


            this.worldGroup.add(
                tree
            );


            this.trees.push(
                tree
            );

        }

    }


    // =================================================
    // ROCKS
    // =================================================

    createRocks() {

        const count = 180;


        const material =
            new THREE.MeshStandardMaterial({

                color: 0x686963,

                roughness: 1

            });


        const geometry =
            new THREE.DodecahedronGeometry(
                0.7,
                0
            );


        for (
            let i = 0;
            i < count;
            i++
        ) {

            const x =
                (
                    Math.random() -
                    0.5
                ) *
                this.size;


            const z =
                (
                    Math.random() -
                    0.5
                ) *
                this.size;


            const y =
                this.getTerrainHeight(
                    x,
                    z
                );


            if (
                y <
                this.waterLevel
            ) {

                continue;

            }


            const rock =
                new THREE.Mesh(
                    geometry,
                    material
                );


            const scale =
                0.25 +
                Math.random() *
                1.2;


            rock.scale.set(
                scale,
                scale *
                    (
                        0.6 +
                        Math.random() *
                        0.7
                    ),
                scale
            );


            rock.position.set(
                x,
                y +
                scale *
                0.35,
                z
            );


            rock.rotation.set(
                Math.random(),
                Math.random() *
                    Math.PI *
                    2,
                Math.random()
            );


            rock.castShadow =
                true;


            rock.receiveShadow =
                true;


            this.worldGroup.add(
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

        const material =
            new THREE.MeshStandardMaterial({

                color: 0x557c3d,

                side:
                    THREE.DoubleSide,

                roughness: 1

            });


        const geometry =
            new THREE.PlaneGeometry(
                0.08,
                0.5
            );


        const count = 1000;


        for (
            let i = 0;
            i < count;
            i++
        ) {

            const x =
                (
                    Math.random() -
                    0.5
                ) *
                this.size;


            const z =
                (
                    Math.random() -
                    0.5
                ) *
                this.size;


            const y =
                this.getTerrainHeight(
                    x,
                    z
                );


            if (
                y <
                this.waterLevel + 0.1
            ) {

                continue;

            }


            const grass =
                new THREE.Mesh(
                    geometry,
                    material
                );


            grass.position.set(
                x,
                y + 0.25,
                z
            );


            grass.rotation.y =
                Math.random() *
                Math.PI;


            const scale =
                0.5 +
                Math.random();


            grass.scale.set(
                scale,
                scale,
                scale
            );


            this.worldGroup.add(
                grass
            );


            this.grass.push(
                grass
            );

        }

    }


    // =================================================
    // LIGHTING
    // =================================================

    createLighting() {

        const ambient =
            new THREE.HemisphereLight(
                0x9db7d0,
                0x26351f,
                1.3
            );


        ambient.name =
            "WorldAmbientLight";


        this.worldGroup.add(
            ambient
        );


        const sun =
            new THREE.DirectionalLight(
                0xffffff,
                2
            );


        sun.name =
            "WorldSun";


        sun.position.set(
            80,
            120,
            60
        );


        sun.castShadow =
            true;


        sun.shadow.mapSize.width =
            2048;


        sun.shadow.mapSize.height =
            2048;


        sun.shadow.camera.left =
            -180;


        sun.shadow.camera.right =
            180;


        sun.shadow.camera.top =
            180;


        sun.shadow.camera.bottom =
            -180;


        this.worldGroup.add(
            sun
        );


        this.sun =
            sun;


        this.ambient =
            ambient;

    }


    // =================================================
    // SKY
    // =================================================

    createSky() {

        const skyGeometry =
            new THREE.SphereGeometry(
                450,
                32,
                16
            );


        const skyMaterial =
            new THREE.MeshBasicMaterial({

                color: 0x87b6d9,

                side:
                    THREE.BackSide

            });


        const sky =
            new THREE.Mesh(
                skyGeometry,
                skyMaterial
            );


        sky.name =
            "WorldSky";


        this.worldGroup.add(
            sky
        );


        this.sky =
            sky;

    }


    // =================================================
    // DAY / NIGHT
    // =================================================

    update(
        delta
    ) {

        this.updateDayNight(
            delta
        );

    }


    updateDayNight(
        delta
    ) {

        this.timeOfDay +=
            (
                24 /
                this.dayLength
            ) *
            delta;


        if (
            this.timeOfDay >=
            24
        ) {

            this.timeOfDay -=
                24;

        }


        const angle =
            (
                this.timeOfDay -
                6
            ) /
            24 *
            Math.PI *
            2;


        const sunX =
            Math.cos(
                angle
            ) *
            120;


        const sunY =
            Math.sin(
                angle
            ) *
            120;


        const sunZ =
            50;


        if (
            this.sun
        ) {

            this.sun.position.set(
                sunX,
                Math.max(
                    10,
                    sunY
                ),
                sunZ
            );

        }


        const daylight =
            Math.max(
                0.12,
                Math.sin(
                    angle
                )
            );


        if (
            this.sun
        ) {

            this.sun.intensity =
                0.25 +
                daylight *
                1.8;

        }


        if (
            this.ambient
        ) {

            this.ambient.intensity =
                0.35 +
                daylight *
                1.0;

        }


        this.updateSky(
            daylight
        );

    }


    // =================================================
    // SKY COLOR
    // =================================================

    updateSky(
        daylight
    ) {

        if (
            !this.sky
        ) {

            return;

        }


        const color =
            new THREE.Color();


        if (
            daylight >
            0.65
        ) {

            color.set(
                0x87b6d9
            );

        } else if (
            daylight >
            0.25
        ) {

            color.set(
                0xc08069
            );

        } else {

            color.set(
                0x07101f
            );

        }


        this.sky.material.color.copy(
            color
        );

    }


    // =================================================
    // RANDOM WORLD POSITION
    // =================================================

    getRandomLandPosition() {

        for (
            let attempt = 0;
            attempt < 50;
            attempt++
        ) {

            const x =
                (
                    Math.random() -
                    0.5
                ) *
                this.size;


            const z =
                (
                    Math.random() -
                    0.5
                ) *
                this.size;


            const y =
                this.getTerrainHeight(
                    x,
                    z
                );


            if (
                y >
                this.waterLevel + 0.5
            ) {

                return new THREE.Vector3(
                    x,
                    y,
                    z
                );

            }

        }


        return new THREE.Vector3(
            0,
            this.getTerrainHeight(
                0,
                0
            ),
            0
        );

    }

}
