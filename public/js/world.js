import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js";

export class World {

    constructor(game) {

        this.game = game;

        // =================================================
        // WORLD CONFIG
        // =================================================

        this.size = 500;

        this.segmentSize = 20;

        this.terrainSegments = 25;

        this.maxTerrainHeight = 8;

        this.waterLevel = -1;

        this.seed = Math.random() * 100000;

        this.time = 0;

        this.dayLength = 240;

        this.worldReady = false;

        // =================================================
        // OBJECT GROUPS
        // =================================================

        this.root = null;

        this.terrainGroup = null;

        this.waterGroup = null;

        this.environmentGroup = null;

        this.decorationsGroup = null;

        this.locationGroup = null;

        this.cloudGroup = null;

        // =================================================
        // TERRAIN DATA
        // =================================================

        this.heightCache = new Map();

        // =================================================
        // LOCATIONS
        // =================================================

        this.locations = [

            {
                id: "spawn",
                name: "Starting Meadow",
                x: 0,
                z: 0,
                radius: 25
            },

            {
                id: "forest",
                name: "Whispering Forest",
                x: -90,
                z: -70,
                radius: 35
            },

            {
                id: "lake",
                name: "Crystal Lake",
                x: 100,
                z: -60,
                radius: 40
            },

            {
                id: "mountain",
                name: "Ancient Mountain",
                x: 120,
                z: 110,
                radius: 45
            },

            {
                id: "ruins",
                name: "Forgotten Ruins",
                x: -130,
                z: 100,
                radius: 30
            }

        ];

    }


    // =================================================
    // INITIALIZE
    // =================================================

    async init() {

        this.createGroups();

        this.generateTerrain();

        this.createWater();

        this.createEnvironment();

        this.createLocations();

        this.createClouds();

        this.createSky();

        this.worldReady = true;

        return true;

    }


    // =================================================
    // GROUPS
    // =================================================

    createGroups() {

        this.root =
            new THREE.Group();

        this.root.name =
            "PET_WORLD";

        this.game.scene.add(
            this.root
        );


        this.terrainGroup =
            new THREE.Group();

        this.terrainGroup.name =
            "Terrain";

        this.root.add(
            this.terrainGroup
        );


        this.waterGroup =
            new THREE.Group();

        this.waterGroup.name =
            "Water";

        this.root.add(
            this.waterGroup
        );


        this.environmentGroup =
            new THREE.Group();

        this.environmentGroup.name =
            "Environment";

        this.root.add(
            this.environmentGroup
        );


        this.decorationsGroup =
            new THREE.Group();

        this.decorationsGroup.name =
            "Decorations";

        this.root.add(
            this.decorationsGroup
        );


        this.locationGroup =
            new THREE.Group();

        this.locationGroup.name =
            "Locations";

        this.root.add(
            this.locationGroup
        );


        this.cloudGroup =
            new THREE.Group();

        this.cloudGroup.name =
            "Clouds";

        this.root.add(
            this.cloudGroup
        );

    }


    // =================================================
    // TERRAIN
    // =================================================

    generateTerrain() {

        const total =
            this.terrainSegments;

        const segment =
            this.segmentSize;

        const offset =
            Math.floor(
                total / 2
            );


        for (
            let x = -offset;
            x <= offset;
            x++
        ) {

            for (
                let z = -offset;
                z <= offset;
                z++
            ) {

                this.createTerrainTile(
                    x * segment,
                    z * segment
                );

            }

        }

    }


    // =================================================
    // TERRAIN TILE
    // =================================================

    createTerrainTile(
        x,
        z
    ) {

        const geometry =
            new THREE.PlaneGeometry(
                this.segmentSize,
                this.segmentSize,
                8,
                8
            );


        const position =
            geometry.attributes.position;


        for (
            let i = 0;
            i < position.count;
            i++
        ) {

            const localX =
                position.getX(i);

            const localY =
                position.getY(i);


            const worldX =
                x +
                localX;

            const worldZ =
                z -
                localY;


            const height =
                this.getTerrainHeight(
                    worldX,
                    worldZ
                );


            position.setZ(
                i,
                height
            );

        }


        geometry.computeVertexNormals();


        const material =
            new THREE.MeshStandardMaterial({

                color:
                    this.getTerrainColor(
                        x,
                        z
                    ),

                roughness: 0.95,

                metalness: 0,

                flatShading: false

            });


        const mesh =
            new THREE.Mesh(
                geometry,
                material
            );


        mesh.rotation.x =
            -Math.PI / 2;


        mesh.position.set(
            x,
            0,
            z
        );


        mesh.receiveShadow =
            true;


        mesh.name =
            "TerrainTile";


        this.terrainGroup.add(
            mesh
        );

    }


    // =================================================
    // TERRAIN COLOR
    // =================================================

    getTerrainColor(
        x,
        z
    ) {

        const distance =
            Math.sqrt(
                x * x +
                z * z
            );


        if (
            distance > 180
        ) {

            return 0x526b43;

        }


        if (
            distance > 100
        ) {

            return 0x587748;

        }


        return 0x63834d;

    }


    // =================================================
    // TERRAIN HEIGHT
    // =================================================

    getTerrainHeight(
        x,
        z
    ) {

        const key =
            `${Math.round(x * 2)}:${Math.round(z * 2)}`;


        if (
            this.heightCache.has(
                key
            )
        ) {

            return this.heightCache.get(
                key
            );

        }


        const large =
            this.noise(
                x * 0.012,
                z * 0.012
            );


        const medium =
            this.noise(
                x * 0.035 + 200,
                z * 0.035 + 200
            );


        const small =
            this.noise(
                x * 0.09 + 500,
                z * 0.09 + 500
            );


        let height =
            large * 7 +
            medium * 2 +
            small * 0.5;


        // Keep spawn area relatively flat.

        const spawnDistance =
            Math.sqrt(
                x * x +
                z * z
            );


        if (
            spawnDistance < 25
        ) {

            height *=
                spawnDistance / 25;

        }


        // Create lower terrain around lake.

        const lakeDistance =
            Math.sqrt(
                Math.pow(
                    x - 100,
                    2
                ) +
                Math.pow(
                    z + 60,
                    2
                )
            );


        if (
            lakeDistance < 40
        ) {

            const lakeFactor =
                1 -
                lakeDistance / 40;


            height -=
                lakeFactor *
                5;

        }


        height =
            Math.max(
                this.waterLevel - 2,
                Math.min(
                    this.maxTerrainHeight,
                    height
                )
            );


        this.heightCache.set(
            key,
            height
        );


        return height;

    }


    // =================================================
    // NOISE
    // =================================================

    noise(
        x,
        z
    ) {

        const value =
            Math.sin(
                x * 12.9898 +
                z * 78.233 +
                this.seed
            ) *
            43758.5453;


        return (
            value -
            Math.floor(value)
        ) * 2 - 1;

    }


    // =================================================
    // WATER
    // =================================================

    createWater() {

        const geometry =
            new THREE.PlaneGeometry(
                this.size,
                this.size
            );


        const material =
            new THREE.MeshStandardMaterial({

                color:
                    0x397b91,

                transparent:
                    true,

                opacity:
                    0.68,

                roughness:
                    0.15,

                metalness:
                    0.05

            });


        const water =
            new THREE.Mesh(
                geometry,
                material
            );


        water.rotation.x =
            -Math.PI / 2;


        water.position.y =
            this.waterLevel;


        water.receiveShadow =
            true;


        water.name =
            "WorldWater";


        this.waterGroup.add(
            water
        );

        this.waterMesh =
            water;

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

        const count =
            170;


        const trunkGeometry =
            new THREE.CylinderGeometry(
                0.18,
                0.3,
                2.2,
                7
            );


        const trunkMaterial =
            new THREE.MeshStandardMaterial({
                color: 0x5b3924,
                roughness: 1
            });


        const leafGeometry =
            new THREE.ConeGeometry(
                1.4,
                3.2,
                8
            );


        const leafMaterial =
            new THREE.MeshStandardMaterial({
                color: 0x2f6336,
                roughness: 0.9
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


            const radius =
                35 +
                Math.random() *
                190;


            const x =
                Math.cos(angle) *
                radius;


            const z =
                Math.sin(angle) *
                radius;


            const distance =
                Math.sqrt(
                    x * x +
                    z * z
                );


            // Keep starting area open.

            if (
                distance < 32
            ) {

                continue;

            }


            const ground =
                this.getTerrainHeight(
                    x,
                    z
                );


            if (
                ground <=
                this.waterLevel + 0.5
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


            trunk.receiveShadow =
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


            const scale =
                0.7 +
                Math.random() *
                0.8;


            tree.scale.setScalar(
                scale
            );


            tree.position.set(
                x,
                ground,
                z
            );


            tree.rotation.y =
                Math.random() *
                Math.PI *
                2;


            tree.name =
                "Tree";


            this.environmentGroup.add(
                tree
            );

        }

    }


    // =================================================
    // ROCKS
    // =================================================

    createRocks() {

        const count =
            100;


        const geometry =
            new THREE.DodecahedronGeometry(
                0.7,
                0
            );


        const material =
            new THREE.MeshStandardMaterial({
                color: 0x777b73,
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


            const radius =
                25 +
                Math.random() *
                210;


            const x =
                Math.cos(angle) *
                radius;


            const z =
                Math.sin(angle) *
                radius;


            const ground =
                this.getTerrainHeight(
                    x,
                    z
                );


            if (
                ground <=
                this.waterLevel + 0.3
            ) {

                continue;

            }


            const rock =
                new THREE.Mesh(
                    geometry,
                    material
                );


            const scale =
                0.4 +
                Math.random() *
                1.3;


            rock.scale.set(
                scale,
                scale *
                    (0.6 +
                    Math.random() *
                    0.6),
                scale
            );


            rock.position.set(
                x,
                ground +
                0.25,
                z
            );


            rock.rotation.set(
                Math.random(),
                Math.random(),
                Math.random()
            );


            rock.castShadow =
                true;


            rock.receiveShadow =
                true;


            rock.name =
                "Rock";


            this.decorationsGroup.add(
                rock
            );

        }

    }


    // =================================================
    // GRASS
    // =================================================

    createGrass() {

        const geometry =
            new THREE.ConeGeometry(
                0.06,
                0.45,
                3
            );


        const material =
            new THREE.MeshStandardMaterial({
                color: 0x789b54,
                roughness: 1
            });


        for (
            let i = 0;
            i < 400;
            i++
        ) {

            const x =
                THREE.MathUtils.randFloatSpread(
                    this.size - 20
                );


            const z =
                THREE.MathUtils.randFloatSpread(
                    this.size - 20
                );


            const ground =
                this.getTerrainHeight(
                    x,
                    z
                );


            if (
                ground <=
                this.waterLevel
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
                ground,
                z
            );


            grass.rotation.y =
                Math.random() *
                Math.PI;


            const scale =
                0.6 +
                Math.random() *
                1.5;


            grass.scale.setScalar(
                scale
            );


            this.decorationsGroup.add(
                grass
            );

        }

    }


    // =================================================
    // LOCATIONS
    // =================================================

    createLocations() {

        this.locations.forEach(
            location => {

                const ground =
                    this.getTerrainHeight(
                        location.x,
                        location.z
                    );


                const marker =
                    new THREE.Group();


                marker.position.set(
                    location.x,
                    ground + 0.1,
                    location.z
                );


                marker.userData.location =
                    location;


                // Marker pole

                const pole =
                    new THREE.Mesh(

                        new THREE.CylinderGeometry(
                            0.04,
                            0.04,
                            2.5,
                            6
                        ),

                        new THREE.MeshStandardMaterial({
                            color: 0xc8a84e
                        })

                    );


                pole.position.y =
                    1.25;


                marker.add(
                    pole
                );


                // Marker top

                const orb =
                    new THREE.Mesh(

                        new THREE.SphereGeometry(
                            0.18,
                            10,
                            10
                        ),

                        new THREE.MeshStandardMaterial({

                            color:
                                0xffd85a,

                            emissive:
                                0x7a5b00,

                            emissiveIntensity:
                                1.5

                        })

                    );


                orb.position.y =
                    2.55;


                marker.add(
                    orb
                );


                marker.name =
                    `Location_${location.id}`;


                this.locationGroup.add(
                    marker
                );

            }
        );

    }


    // =================================================
    // CLOUDS
    // =================================================

    createClouds() {

        const cloudMaterial =
            new THREE.MeshStandardMaterial({

                color:
                    0xffffff,

                transparent:
                    true,

                opacity:
                    0.75,

                roughness:
                    1

            });


        for (
            let i = 0;
            i < 18;
            i++
        ) {

            const cloud =
                new THREE.Group();


            const pieces =
                3 +
                Math.floor(
                    Math.random() * 4
                );


            for (
                let j = 0;
                j < pieces;
                j++
            ) {

                const cloudPiece =
                    new THREE.Mesh(

                        new THREE.SphereGeometry(
                            4 +
                            Math.random() *
                            3,
                            8,
                            8
                        ),

                        cloudMaterial

                    );


                cloudPiece.position.set(

                    j * 4,

                    Math.random() * 2,

                    Math.random() * 3

                );


                cloudPiece.scale.y =
                    0.5;


                cloud.add(
                    cloudPiece
                );

            }


            cloud.position.set(

                THREE.MathUtils.randFloat(
                    -220,
                    220
                ),

                55 +
                Math.random() *
                20,

                THREE.MathUtils.randFloat(
                    -220,
                    220
                )

            );


            cloud.userData.speed =
                1 +
                Math.random() * 2;


            this.cloudGroup.add(
                cloud
            );

        }

    }


    // =================================================
    // SKY
    // =================================================

    createSky() {

        const skyGeometry =
            new THREE.SphereGeometry(
                800,
                32,
                16
            );


        const skyMaterial =
            new THREE.MeshBasicMaterial({

                color:
                    0x8fa9b0,

                side:
                    THREE.BackSide

            });


        const sky =
            new THREE.Mesh(
                skyGeometry,
                skyMaterial
            );


        sky.name =
            "Sky";

        this.root.add(
            sky
        );


        this.sky =
            sky;

    }


    // =================================================
    // UPDATE
    // =================================================

    update(
        delta,
        elapsed
    ) {

        this.time +=
            delta;


        this.updateWater(
            elapsed
        );


        this.updateClouds(
            delta
        );


        this.updateDayNight(
            elapsed
        );


        this.checkLocations();

    }


    // =================================================
    // WATER UPDATE
    // =================================================

    updateWater(
        elapsed
    ) {

        if (
            !this.waterMesh
        ) {

            return;

        }


        this.waterMesh.position.y =
            this.waterLevel +
            Math.sin(
                elapsed * 0.7
            ) *
            0.04;

    }


    // =================================================
    // CLOUD UPDATE
    // =================================================

    updateClouds(
        delta
    ) {

        if (
            !this.cloudGroup
        ) {

            return;

        }


        this.cloudGroup.children.forEach(
            cloud => {

                cloud.position.x +=
                    cloud.userData.speed *
                    delta;


                if (
                    cloud.position.x >
                    this.size / 2 +
                    100
                ) {

                    cloud.position.x =
                        -this.size / 2 -
                        100;

                }

            }
        );

    }


    // =================================================
    // DAY / NIGHT
    // =================================================

    updateDayNight(
        elapsed
    ) {

        const cycle =
            (
                elapsed %
                this.dayLength
            ) /
            this.dayLength;


        const angle =
            cycle *
            Math.PI *
            2;


        const sunX =
            Math.cos(angle) *
            180;


        const sunY =
            Math.sin(angle) *
            180;


        const sunZ =
            80;


        if (
            this.game.sun
        ) {

            this.game.sun.position.set(
                sunX,
                sunY,
                sunZ
            );


            if (
                sunY < 0
            ) {

                this.game.sun.intensity =
                    0.15;

            } else {

                this.game.sun.intensity =
                    2.0;

            }

        }


        if (
            this.game.moon
        ) {

            this.game.moon.position.set(
                -sunX,
                -sunY,
                -80
            );


            this.game.moon.intensity =
                sunY < 0
                    ? 0.65
                    : 0.12;

        }


        this.updateSkyColor(
            cycle
        );

    }


    // =================================================
    // SKY COLOR
    // =================================================

    updateSkyColor(
        cycle
    ) {

        if (
            !this.sky ||
            !this.game.scene
        ) {

            return;

        }


        let color;


        if (
            cycle < 0.20
        ) {

            color =
                new THREE.Color(
                    0x18243d
                );

        } else if (
            cycle < 0.30
        ) {

            color =
                new THREE.Color(
                    0xc17c68
                );

        } else if (
            cycle < 0.70
        ) {

            color =
                new THREE.Color(
                    0x8fa9b0
                );

        } else if (
            cycle < 0.80
        ) {

            color =
                new THREE.Color(
                    0xc17c68
                );

        } else {

            color =
                new THREE.Color(
                    0x18243d
                );

        }


        this.sky.material.color.copy(
            color
        );


        if (
            this.game.scene.fog
        ) {

            this.game.scene.fog.color.copy(
                color
            );

        }

    }


    // =================================================
    // LOCATION DETECTION
    // =================================================

    checkLocations() {

        if (
            !this.game.player ||
            !this.game.systems
        ) {

            return;

        }


        const position =
            this.game.player.getPosition();


        this.locations.forEach(
            location => {

                const dx =
                    position.x -
                    location.x;


                const dz =
                    position.z -
                    location.z;


                const distance =
                    Math.sqrt(
                        dx * dx +
                        dz * dz
                    );


                if (
                    distance <=
                    location.radius
                ) {

                    this.game.systems
                        .discoverLocation(
                            location.id
                        );

                }

            }
        );

    }


    // =================================================
    // GET LOCATION
    // =================================================

    getLocation(
        id
    ) {

        return this.locations.find(
            location =>
                location.id === id
        ) || null;

    }


    // =================================================
    // GET NEAREST LOCATION
    // =================================================

    getNearestLocation(
        x,
        z
    ) {

        let nearest =
            null;

        let nearestDistance =
            Infinity;


        this.locations.forEach(
            location => {

                const distance =
                    Math.hypot(
                        x -
                        location.x,

                        z -
                        location.z
                    );


                if (
                    distance <
                    nearestDistance
                ) {

                    nearestDistance =
                        distance;

                    nearest =
                        location;

                }

            }
        );


        return nearest;

    }


    // =================================================
    // WORLD POSITION VALIDATION
    // =================================================

    isInsideWorld(
        x,
        z
    ) {

        const limit =
            this.size / 2;


        return (
            x >= -limit &&
            x <= limit &&
            z >= -limit &&
            z <= limit
        );

    }


    // =================================================
    // WATER CHECK
    // =================================================

    isWater(
        x,
        z
    ) {

        return (
            this.getTerrainHeight(
                x,
                z
            ) <=
            this.waterLevel
        );

    }


    // =================================================
    // RANDOM SAFE POSITION
    // =================================================

    getRandomSafePosition() {

        for (
            let attempt = 0;
            attempt < 50;
            attempt++
        ) {

            const x =
                THREE.MathUtils.randFloatSpread(
                    this.size - 30
                );


            const z =
                THREE.MathUtils.randFloatSpread(
                    this.size - 30
                );


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


    // =================================================
    // GET SPAWN POSITION
    // =================================================

    getSpawnPosition() {

        return new THREE.Vector3(
            0,
            this.getTerrainHeight(
                0,
                0
            ),
            0
        );

    }


    // =================================================
    // CLEANUP
    // =================================================

    dispose() {

        if (
            !this.root
        ) {

            return;

        }


        this.root.traverse(
            object => {

                if (
                    object.geometry
                ) {

                    object.geometry.dispose();

                }


                if (
                    object.material
                ) {

                    if (
                        Array.isArray(
                            object.material
                        )
                    ) {

                        object.material.forEach(
                            material => {

                                material.dispose();

                            }
                        );

                    } else {

                        object.material.dispose();

                    }

                }

            }
        );


        if (
            this.game.scene
        ) {

            this.game.scene.remove(
                this.root
            );

        }


        this.heightCache.clear();

        this.root = null;

        this.worldReady = false;

    }

}
