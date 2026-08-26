import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js";

export class World {

    constructor(game) {

        this.game = game;

        this.group =
            new THREE.Group();

        this.worldSize = 500;

        this.waterLevel = -0.8;

        this.time = 8;

        this.dayLength = 600;

        this.terrain = null;

        this.water = null;

        this.sun = null;

        this.moon = null;

        this.decorations = [];

    }


    // =================================================
    // INITIALIZE
    // =================================================

    async init() {

        this.game.scene.add(
            this.group
        );

        this.createTerrain();

        this.createWater();

        this.createMountains();

        this.createTrees();

        this.createRocks();

        this.createLighting();

        this.createSky();

    }


    // =================================================
    // TERRAIN
    // =================================================

    createTerrain() {

        const segments = 150;

        const geometry =
            new THREE.PlaneGeometry(
                this.worldSize,
                this.worldSize,
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

                color: 0x496b3c,

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


        this.group.add(
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

        const large =
            Math.sin(x * 0.018) *
            Math.cos(z * 0.015) *
            9;


        const medium =
            Math.sin(x * 0.055 + 2) *
            Math.cos(z * 0.045) *
            3;


        const small =
            Math.sin(x * 0.15) *
            Math.cos(z * 0.13) *
            0.6;


        const mountain =
            Math.max(
                0,
                1 -
                Math.sqrt(
                    x * x +
                    z * z
                ) / 230
            );


        return (
            large +
            medium +
            small +
            mountain * 4
        ) - 2;

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

                color: 0x247c91,

                transparent: true,

                opacity: 0.72,

                roughness: 0.15,

                metalness: 0.25

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


        this.group.add(
            this.water
        );

    }


    // =================================================
    // MOUNTAINS
    // =================================================

    createMountains() {

        const material =
            new THREE.MeshStandardMaterial({

                color: 0x3f5047,

                roughness: 1

            });


        for (
            let i = 0;
            i < 22;
            i++
        ) {

            const angle =
                (i / 22) *
                Math.PI *
                2;


            const radius =
                210 +
                Math.random() *
                35;


            const height =
                30 +
                Math.random() *
                55;


            const radiusX =
                20 +
                Math.random() *
                25;


            const geometry =
                new THREE.ConeGeometry(
                    radiusX,
                    height,
                    8
                );


            const mountain =
                new THREE.Mesh(
                    geometry,
                    material
                );


            mountain.position.set(

                Math.cos(angle) *
                    radius,

                height / 2 - 2,

                Math.sin(angle) *
                    radius

            );


            mountain.rotation.y =
                Math.random() *
                Math.PI;


            mountain.castShadow =
                true;


            mountain.receiveShadow =
                true;


            this.group.add(
                mountain
            );

        }

    }


    // =================================================
    // TREES
    // =================================================

    createTrees() {

        const treeCount = 220;


        for (
            let i = 0;
            i < treeCount;
            i++
        ) {

            const x =
                (Math.random() - 0.5) *
                450;


            const z =
                (Math.random() - 0.5) *
                450;


            const distance =
                Math.sqrt(
                    x * x +
                    z * z
                );


            if (
                distance < 25
            ) {

                continue;

            }


            const y =
                this.getTerrainHeight(
                    x,
                    z
                );


            if (
                y < this.waterLevel + 0.5
            ) {

                continue;

            }


            this.createTree(
                x,
                y,
                z
            );

        }

    }


    // =================================================
    // TREE
    // =================================================

    createTree(
        x,
        y,
        z
    ) {

        const tree =
            new THREE.Group();


        const trunkGeometry =
            new THREE.CylinderGeometry(
                0.28,
                0.4,
                3,
                8
            );


        const trunkMaterial =
            new THREE.MeshStandardMaterial({

                color: 0x60452d,

                roughness: 1

            });


        const trunk =
            new THREE.Mesh(
                trunkGeometry,
                trunkMaterial
            );


        trunk.position.y =
            1.5;


        trunk.castShadow =
            true;


        trunk.receiveShadow =
            true;


        tree.add(
            trunk
        );


        const leafGeometry =
            new THREE.ConeGeometry(
                1.8,
                4,
                8
            );


        const leafMaterial =
            new THREE.MeshStandardMaterial({

                color: 0x315b35,

                roughness: 1

            });


        const leaves =
            new THREE.Mesh(
                leafGeometry,
                leafMaterial
            );


        leaves.position.y =
            4;


        leaves.castShadow =
            true;


        leaves.receiveShadow =
            true;


        tree.add(
            leaves
        );


        const scale =
            0.75 +
            Math.random() *
            0.8;


        tree.scale.setScalar(
            scale
        );


        tree.position.set(
            x,
            y,
            z
        );


        tree.rotation.y =
            Math.random() *
            Math.PI *
            2;


        this.group.add(
            tree
        );


        this.decorations.push(
            tree
        );

    }


    // =================================================
    // ROCKS
    // =================================================

    createRocks() {

        const rockCount = 140;


        const material =
            new THREE.MeshStandardMaterial({

                color: 0x777873,

                roughness: 1

            });


        for (
            let i = 0;
            i < rockCount;
            i++
        ) {

            const x =
                (Math.random() - 0.5) *
                450;


            const z =
                (Math.random() - 0.5) *
                450;


            const y =
                this.getTerrainHeight(
                    x,
                    z
                );


            if (
                y < this.waterLevel
            ) {

                continue;

            }


            const size =
                0.3 +
                Math.random() *
                1.5;


            const geometry =
                new THREE.DodecahedronGeometry(
                    size,
                    0
                );


            const rock =
                new THREE.Mesh(
                    geometry,
                    material
                );


            rock.position.set(
                x,
                y + size * 0.35,
                z
            );


            rock.scale.y =
                0.6 +
                Math.random() *
                0.6;


            rock.rotation.set(

                Math.random(),

                Math.random(),

                Math.random()

            );


            rock.castShadow =
                true;


            rock.receiveShadow =
                true;


            this.group.add(
                rock
            );

        }

    }


    // =================================================
    // SKY
    // =================================================

    createSky() {

        const skyGeometry =
            new THREE.SphereGeometry(
                480,
                32,
                16
            );


        const skyMaterial =
            new THREE.MeshBasicMaterial({

                color: 0x83a9c0,

                side:
                    THREE.BackSide

            });


        const sky =
            new THREE.Mesh(
                skyGeometry,
                skyMaterial
            );


        this.group.add(
            sky
        );

        this.sky =
            sky;

    }


    // =================================================
    // LIGHTING
    // =================================================

    createLighting() {

        this.sun =
            new THREE.DirectionalLight(
                0xffffff,
                2
            );


        this.sun.castShadow =
            true;


        this.sun.shadow.mapSize.set(
            1024,
            1024
        );


        this.game.scene.add(
            this.sun
        );


        this.moon =
            new THREE.DirectionalLight(
                0x8299d8,
                0.15
            );


        this.game.scene.add(
            this.moon
        );

    }


    // =================================================
    // DAY / NIGHT
    // =================================================

    update(
        delta
    ) {

        this.time +=
            (delta / this.dayLength) *
            24;


        if (
            this.time >= 24
        ) {

            this.time -= 24;

        }


        const angle =
            (
                this.time / 24
            ) *
            Math.PI *
            2;


        const sunRadius =
            150;


        this.sun.position.set(

            Math.cos(angle) *
                sunRadius,

            Math.sin(angle) *
                sunRadius,

            70

        );


        this.moon.position.set(

            -Math.cos(angle) *
                sunRadius,

            -Math.sin(angle) *
                sunRadius,

            -70

        );


        const daylight =
            Math.max(
                0,
                Math.sin(angle)
            );


        this.sun.intensity =
            0.25 +
            daylight * 1.8;


        this.moon.intensity =
            0.08 +
            (1 - daylight) * 0.3;


        if (
            this.sky
        ) {

            const skyColor =
                new THREE.Color();


            skyColor.setHSL(

                0.56,

                0.28,

                0.18 +
                daylight * 0.28

            );


            this.sky.material.color.copy(
                skyColor
            );

        }


        // Fog changes with time.

        if (
            this.game.scene.fog
        ) {

            this.game.scene.fog.color.setHSL(

                0.56,

                0.18,

                0.18 +
                daylight * 0.25

            );

        }


        // Small water movement.

        if (
            this.water
        ) {

            this.water.position.y =
                this.waterLevel +
                Math.sin(
                    this.game.elapsed *
                    0.8
                ) *
                0.025;

        }

    }

}
