import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js";

export class World {

    constructor(game) {

        this.game = game;

        // =================================================
        // WORLD SETTINGS
        // =================================================

        this.size = 500;

        this.halfSize = this.size / 2;

        this.waterLevel = -1.5;

        this.terrainResolution = 100;

        this.tileSize =
            this.size /
            this.terrainResolution;

        // =================================================
        // WORLD OBJECTS
        // =================================================

        this.group = null;

        this.terrain = null;

        this.water = null;

        this.trees = [];

        this.rocks = [];

        this.grass = [];

        this.flowers = [];

        this.resources = [];

        this.decorations = [];

        // =================================================
        // TIME
        // =================================================

        this.timeOfDay = 8;

        this.dayLength = 600;

        this.sunIntensity = 2;

        // =================================================
        // RANDOM
        // =================================================

        this.seed = Math.floor(
            Math.random() * 999999
        );

        // =================================================
        // MATERIAL CACHE
        // =================================================

        this.materials = {};

        // =================================================
        // HEIGHT CACHE
        // =================================================

        this.heightCache =
            new Map();

        this.heightCacheLimit = 20000;

        // =================================================
        // FLAGS
        // =================================================

        this.initialized = false;

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

        this.group =
            new THREE.Group();

        this.group.name =
            "PET_WORLD";

        this.game.scene.add(
            this.group
        );

        this.createMaterials();

        this.createTerrain();

        this.createWater();

        this.createTrees();

        this.createRocks();

        this.createGrass();

        this.createFlowers();

        this.createWorldBoundary();

        this.createSpawnArea();

        this.initialized = true;

    }


    // =====================================================
    // MATERIALS
    // =====================================================

    createMaterials() {

        this.materials.grass =
            new THREE.MeshStandardMaterial({

                color: 0x4e8b4d,

                roughness: 1,

                metalness: 0

            });


        this.materials.grassDark =
            new THREE.MeshStandardMaterial({

                color: 0x315e38,

                roughness: 1,

                metalness: 0

            });


        this.materials.sand =
            new THREE.MeshStandardMaterial({

                color: 0xc7b66a,

                roughness: 1

            });


        this.materials.dirt =
            new THREE.MeshStandardMaterial({

                color: 0x76513a,

                roughness: 1

            });


        this.materials.stone =
            new THREE.MeshStandardMaterial({

                color: 0x70777a,

                roughness: 0.95

            });


        this.materials.wood =
            new THREE.MeshStandardMaterial({

                color: 0x70452b,

                roughness: 1

            });


        this.materials.leaves =
            new THREE.MeshStandardMaterial({

                color: 0x2f743c,

                roughness: 1

            });


        this.materials.leavesDark =
            new THREE.MeshStandardMaterial({

                color: 0x20522d,

                roughness: 1

            });


        this.materials.flowerRed =
            new THREE.MeshStandardMaterial({

                color: 0xd9534f,

                roughness: 0.8

            });


        this.materials.flowerYellow =
            new THREE.MeshStandardMaterial({

                color: 0xf0c84b,

                roughness: 0.8

            });


        this.materials.flowerPurple =
            new THREE.MeshStandardMaterial({

                color: 0x9b6bd6,

                roughness: 0.8

            });


        this.materials.water =
            new THREE.MeshStandardMaterial({

                color: 0x2e8ca6,

                transparent: true,

                opacity: 0.68,

                roughness: 0.15,

                metalness: 0.05

            });


        this.materials.boundary =
            new THREE.MeshBasicMaterial({

                color: 0x163b2c,

                transparent: true,

                opacity: 0.15,

                side: THREE.DoubleSide

            });

    }


    // =====================================================
    // TERRAIN
    // =====================================================

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

        for (
            let i = 0;
            i < position.count;
            i++
        ) {

            const x =
                position.getX(i);

            const z =
                position.getZ(i);

            const y =
                this.generateHeight(
                    x,
                    z
                );

            position.setY(
                i,
                y
            );

        }

        position.needsUpdate = true;

        geometry.computeVertexNormals();

        const material =
            this.materials.grass;

        this.terrain =
            new THREE.Mesh(
                geometry,
                material
            );

        this.terrain.name =
            "Terrain";

        this.terrain.receiveShadow =
            true;

        this.terrain.castShadow =
            false;

        this.group.add(
            this.terrain
        );

    }


    // =====================================================
    // HEIGHT GENERATION
    // =====================================================

    generateHeight(
        x,
        z
    ) {

        const key =
            `${Math.round(x)},${Math.round(z)}`;

        if (
            this.heightCache.has(
                key
            )
        ) {

            return this.heightCache.get(
                key
            );

        }

        const distance =
            Math.sqrt(
                x * x +
                z * z
            );

        // Large rolling hills

        let height =

            Math.sin(
                x * 0.018
            ) * 4

            +

            Math.cos(
                z * 0.021
            ) * 3

            +

            Math.sin(
                (x + z) * 0.011
            ) * 3

            +

            Math.cos(
                (x - z) * 0.008
            ) * 2;


        // Small terrain details

        height +=

            Math.sin(
                x * 0.075 +
                z * 0.031
            ) * 0.7;


        height +=

            Math.cos(
                z * 0.065 -
                x * 0.025
            ) * 0.5;


        // Flatten spawn area

        if (
            distance < 14
        ) {

            const factor =
                distance / 14;

            height *= factor;

        }


        // Flatten outer water areas

        if (
            distance > 215
        ) {

            const factor =
                Math.max(
                    0,
                    Math.min(
                        1,
                        (distance - 215) /
                        35
                    )
                );

            height =
                height * (1 - factor) +
                this.waterLevel * factor;

        }


        // Minimum terrain height

        height =
            Math.max(
                this.waterLevel - 0.8,
                height
            );


        if (
            this.heightCache.size <
            this.heightCacheLimit
        ) {

            this.heightCache.set(
                key,
                height
            );

        }

        return height;

    }


    // =====================================================
    // PUBLIC TERRAIN HEIGHT
    // =====================================================

    getTerrainHeight(
        x,
        z
    ) {

        return this.generateHeight(
            x,
            z
        );

    }


    // =====================================================
    // WATER
    // =====================================================

    createWater() {

        const geometry =
            new THREE.PlaneGeometry(
                this.size * 0.98,
                this.size * 0.98,
                1,
                1
            );

        geometry.rotateX(
            -Math.PI / 2
        );

        const material =
            this.materials.water;

        this.water =
            new THREE.Mesh(
                geometry,
                material
            );

        this.water.name =
            "Water";

        this.water.position.y =
            this.waterLevel;

        this.water.receiveShadow =
            true;

        this.group.add(
            this.water
        );

    }


    // =====================================================
    // TREES
    // =====================================================

    createTrees() {

        const count = 170;

        const trunkGeometry =
            new THREE.CylinderGeometry(
                0.18,
                0.28,
                2.3,
                7
            );

        const leafGeometry =
            new THREE.ConeGeometry(
                1.25,
                2.8,
                8
            );

        for (
            let i = 0;
            i < count;
            i++
        ) {

            const x =
                this.randomRange(
                    -this.halfSize + 12,
                    this.halfSize - 12
                );

            const z =
                this.randomRange(
                    -this.halfSize + 12,
                    this.halfSize - 12
                );

            const distance =
                Math.sqrt(
                    x * x +
                    z * z
                );

            if (
                distance < 18
            ) {

                continue;

            }

            const y =
                this.getTerrainHeight(
                    x,
                    z
                );

            if (
                y <=
                this.waterLevel + 0.4
            ) {

                continue;

            }

            const tree =
                new THREE.Group();

            tree.name =
                "Tree";

            const trunk =
                new THREE.Mesh(
                    trunkGeometry,
                    this.materials.wood
                );

            trunk.position.y =
                1.15;

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
                    Math.random() > 0.5
                        ? this.materials.leaves
                        : this.materials.leavesDark
                );

            leaves.position.y =
                3.0;

            leaves.castShadow =
                true;

            tree.add(
                leaves
            );


            const scale =
                this.randomRange(
                    0.75,
                    1.35
                );

            tree.scale.set(
                scale,
                scale,
                scale
            );

            tree.position.set(
                x,
                y,
                z
            );

            this.group.add(
                tree
            );

            this.trees.push(
                tree
            );


            this.resources.push({

                type: "wood",

                object: tree,

                amount: Math.floor(
                    this.randomRange(
                        3,
                        8
                    )
                ),

                collected: false

            });

        }

    }


    // =====================================================
    // ROCKS
    // =====================================================

    createRocks() {

        const count = 140;

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
                this.randomRange(
                    -this.halfSize + 8,
                    this.halfSize - 8
                );

            const z =
                this.randomRange(
                    -this.halfSize + 8,
                    this.halfSize - 8
                );

            const distance =
                Math.sqrt(
                    x * x +
                    z * z
                );

            if (
                distance < 12
            ) {

                continue;

            }

            const y =
                this.getTerrainHeight(
                    x,
                    z
                );

            if (
                y <=
                this.waterLevel + 0.25
            ) {

                continue;

            }

            const rock =
                new THREE.Mesh(
                    geometry,
                    this.materials.stone
                );

            const scale =
                this.randomRange(
                    0.45,
                    1.4
                );

            rock.scale.set(
                scale,
                scale *
                this.randomRange(
                    0.6,
                    1.1
                ),
                scale
            );

            rock.position.set(
                x,
                y + 0.25,
                z
            );

            rock.rotation.y =
                Math.random() *
                Math.PI;

            rock.castShadow =
                true;

            rock.receiveShadow =
                true;

            rock.name =
                "Rock";

            this.group.add(
                rock
            );

            this.rocks.push(
                rock
            );


            this.resources.push({

                type: "stone",

                object: rock,

                amount: Math.floor(
                    this.randomRange(
                        2,
                        6
                    )
                ),

                collected: false

            });

        }

    }


    // =====================================================
    // GRASS
    // =====================================================

    createGrass() {

        const count = 700;

        const bladeGeometry =
            new THREE.ConeGeometry(
                0.035,
                0.45,
                3
            );

        for (
            let i = 0;
            i < count;
            i++
        ) {

            const x =
                this.randomRange(
                    -this.halfSize + 5,
                    this.halfSize - 5
                );

            const z =
                this.randomRange(
                    -this.halfSize + 5,
                    this.halfSize - 5
                );

            const y =
                this.getTerrainHeight(
                    x,
                    z
                );

            if (
                y <=
                this.waterLevel + 0.3
            ) {

                continue;

            }

            const blade =
                new THREE.Mesh(
                    bladeGeometry,
                    this.materials.grassDark
                );

            blade.position.set(
                x,
                y + 0.22,
                z
            );

            blade.rotation.y =
                Math.random() *
                Math.PI;

            blade.scale.set(
                this.randomRange(
                    0.7,
                    1.5
                ),
                this.randomRange(
                    0.7,
                    1.5
                ),
                this.randomRange(
                    0.7,
                    1.5
                )
            );

            blade.name =
                "Grass";

            this.group.add(
                blade
            );

            this.grass.push(
                blade
            );

        }

    }


    // =====================================================
    // FLOWERS
    // =====================================================

    createFlowers() {

        const count = 180;

        const stemGeometry =
            new THREE.CylinderGeometry(
                0.015,
                0.02,
                0.35,
                5
            );

        const flowerGeometry =
            new THREE.SphereGeometry(
                0.09,
                6,
                5
            );

        const flowerMaterials = [

            this.materials.flowerRed,

            this.materials.flowerYellow,

            this.materials.flowerPurple

        ];

        for (
            let i = 0;
            i < count;
            i++
        ) {

            const x =
                this.randomRange(
                    -this.halfSize + 5,
                    this.halfSize - 5
                );

            const z =
                this.randomRange(
                    -this.halfSize + 5,
                    this.halfSize - 5
                );

            const y =
                this.getTerrainHeight(
                    x,
                    z
                );

            if (
                y <=
                this.waterLevel + 0.4
            ) {

                continue;

            }

            const flower =
                new THREE.Group();

            const stem =
                new THREE.Mesh(
                    stemGeometry,
                    this.materials.grassDark
                );

            stem.position.y =
                0.18;

            flower.add(
                stem
            );


            const head =
                new THREE.Mesh(
                    flowerGeometry,
                    flowerMaterials[
                        Math.floor(
                            Math.random() *
                            flowerMaterials.length
                        )
                    ]
                );

            head.position.y =
                0.42;

            flower.add(
                head
            );


            flower.position.set(
                x,
                y,
                z
            );

            flower.scale.setScalar(
                this.randomRange(
                    0.7,
                    1.25
                )
            );

            flower.name =
                "Flower";

            this.group.add(
                flower
            );

            this.flowers.push(
                flower
            );

        }

    }


    // =====================================================
    // WORLD BOUNDARY
    // =====================================================

    createWorldBoundary() {

        const thickness = 1;

        const height = 5;

        const material =
            this.materials.boundary;


        const northGeometry =
            new THREE.BoxGeometry(
                this.size,
                height,
                thickness
            );

        const southGeometry =
            northGeometry.clone();

        const eastGeometry =
            new THREE.BoxGeometry(
                thickness,
                height,
                this.size
            );

        const westGeometry =
            eastGeometry.clone();


        const north =
            new THREE.Mesh(
                northGeometry,
                material
            );

        north.position.set(
            0,
            height / 2,
            -this.halfSize
        );


        const south =
            new THREE.Mesh(
                southGeometry,
                material
            );

        south.position.set(
            0,
            height / 2,
            this.halfSize
        );


        const east =
            new THREE.Mesh(
                eastGeometry,
                material
            );

        east.position.set(
            this.halfSize,
            height / 2,
            0
        );


        const west =
            new THREE.Mesh(
                westGeometry,
                material
            );

        west.position.set(
            -this.halfSize,
            height / 2,
            0
        );


        this.group.add(
            north
        );

        this.group.add(
            south
        );

        this.group.add(
            east
        );

        this.group.add(
            west

        );

    }


    // =====================================================
    // SPAWN AREA
    // =====================================================

    createSpawnArea() {

        const geometry =
            new THREE.CircleGeometry(
                13,
                32
            );

        const material =
            new THREE.MeshStandardMaterial({

                color: 0x5f9651,

                roughness: 1

            });

        const area =
            new THREE.Mesh(
                geometry,
                material
            );

        area.rotation.x =
            -Math.PI / 2;

        area.position.y =
            0.04;

        area.name =
            "SpawnArea";

        this.group.add(
            area
        );

        // Small stones around spawn

        for (
            let i = 0;
            i < 18;
            i++
        ) {

            const angle =
                (i / 18) *
                Math.PI *
                2;

            const radius =
                11 +
                Math.random() *
                3;

            const x =
                Math.cos(angle) *
                radius;

            const z =
                Math.sin(angle) *
                radius;

            const y =
                this.getTerrainHeight(
                    x,
                    z
                );

            const stone =
                new THREE.Mesh(

                    new THREE.DodecahedronGeometry(
                        0.25,
                        0
                    ),

                    this.materials.stone

                );

            stone.position.set(
                x,
                y + 0.15,
                z
            );

            stone.castShadow =
                true;

            this.group.add(
                stone
            );

        }

    }


    // =====================================================
    // RANDOM RANGE
    // =====================================================

    randomRange(
        min,
        max
    ) {

        return (
            min +
            Math.random() *
            (max - min)
        );

    }


    // =====================================================
    // UPDATE
    // =====================================================

    update(
        delta,
        elapsed
    ) {

        if (
            !this.initialized
        ) {

            return;

        }

        this.updateWater(
            delta,
            elapsed
        );

        this.updateTime(
            delta
        );

        this.updateNature(
            elapsed
        );

    }


    // =====================================================
    // WATER ANIMATION
    // =====================================================

    updateWater(
        delta,
        elapsed
    ) {

        if (
            !this.water
        ) {

            return;

        }

        this.water.position.y =
            this.waterLevel +
            Math.sin(
                elapsed * 0.8
            ) *
            0.04;

        this.water.material.opacity =
            0.62 +
            Math.sin(
                elapsed * 0.7
            ) *
            0.04;

    }


    // =====================================================
    // DAY / NIGHT
    // =====================================================

    updateTime(
        delta
    ) {

        this.timeOfDay +=
            (delta / this.dayLength) *
            24;

        if (
            this.timeOfDay >= 24
        ) {

            this.timeOfDay -= 24;

        }

        this.updateSun();

    }


    // =====================================================
    // SUN POSITION
    // =====================================================

    updateSun() {

        if (
            !this.game.sun
        ) {

            return;

        }

        const hour =
            this.timeOfDay;

        const angle =
            (
                hour - 6
            ) /
            24 *
            Math.PI *
            2;


        const radius = 200;


        this.game.sun.position.x =
            Math.cos(angle) *
            radius;


        this.game.sun.position.y =
            Math.sin(angle) *
            radius;


        this.game.sun.position.z =
            80;


        let intensity = 0;


        if (
            hour >= 6 &&
            hour <= 18
        ) {

            const daylight =
                Math.sin(
                    (
                        hour - 6
                    ) /
                    12 *
                    Math.PI
                );

            intensity =
                Math.max(
                    0.15,
                    daylight
                );

        } else {

            intensity = 0.08;

        }


        this.game.sun.intensity =
            this.sunIntensity *
            intensity;


        if (
            this.game.moon
        ) {

            this.game.moon.intensity =
                hour < 6 ||
                hour > 18
                    ? 0.45
                    : 0.08;

        }


        if (
            this.game.scene
        ) {

            if (
                hour >= 6 &&
                hour <= 18
            ) {

                this.game.scene.fog.color.set(
                    0x91a8ad
                );

            } else {

                this.game.scene.fog.color.set(
                    0x182532
                );

            }

        }

    }


    // =====================================================
    // NATURE ANIMATION
    // =====================================================

    updateNature(
        elapsed
    ) {

        // Grass movement

        for (
            let i = 0;
            i < this.grass.length;
            i++
        ) {

            const grass =
                this.grass[i];

            if (
                !grass
            ) {

                continue;

            }

            const offset =
                i * 0.37;

            grass.rotation.z =
                Math.sin(
                    elapsed * 1.5 +
                    offset
                ) *
                0.08;

        }


        // Flowers gently move

        for (
            let i = 0;
            i < this.flowers.length;
            i++
        ) {

            const flower =
                this.flowers[i];

            if (
                !flower
            ) {

                continue;

            }

            const offset =
                i * 0.5;

            flower.rotation.z =
                Math.sin(
                    elapsed * 1.2 +
                    offset
                ) *
                0.04;

        }

    }


    // =====================================================
    // RESOURCE SEARCH
    // =====================================================

    getNearbyResource(
        position,
        radius = 3
    ) {

        let nearest = null;

        let nearestDistance =
            Infinity;


        for (
            const resource of
            this.resources
        ) {

            if (
                resource.collected
            ) {

                continue;

            }


            if (
                !resource.object
            ) {

                continue;

            }


            const distance =
                resource.object
                    .position
                    .distanceTo(
                        position
                    );


            if (
                distance <= radius &&
                distance <
                nearestDistance
            ) {

                nearest =
                    resource;

                nearestDistance =
                    distance;

            }

        }


        return nearest;

    }


    // =====================================================
    // COLLECT RESOURCE
    // =====================================================

    collectResource(
        resource
    ) {

        if (
            !resource ||
            resource.collected
        ) {

            return false;

        }


        resource.collected =
            true;


        if (
            resource.object
        ) {

            this.group.remove(
                resource.object
            );

        }


        if (
            this.game.systems
        ) {

            this.game.systems.addItem(
                resource.type,
                resource.amount
            );

        }


        return true;

    }


    // =====================================================
    // GET WORLD POSITION
    // =====================================================

    getRandomGroundPosition(
        minDistance = 20
    ) {

        for (
            let attempt = 0;
            attempt < 50;
            attempt++
        ) {

            const x =
                this.randomRange(
                    -this.halfSize + 10,
                    this.halfSize - 10
                );

            const z =
                this.randomRange(
                    -this.halfSize + 10,
                    this.halfSize - 10
                );


            const distance =
                Math.sqrt(
                    x * x +
                    z * z
                );


            if (
                distance <
                minDistance
            ) {

                continue;

            }


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
            25,
            this.getTerrainHeight(
                25,
                25
            ),
            25
        );

    }


    // =====================================================
    // CHECK WATER
    // =====================================================

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


    // =====================================================
    // CHECK INSIDE WORLD
    // =====================================================

    isInsideWorld(
        x,
        z,
        margin = 5
    ) {

        const limit =
            this.halfSize -
            margin;


        return (

            x >= -limit &&

            x <= limit &&

            z >= -limit &&

            z <= limit

        );

    }


    // =====================================================
    // GET WORLD SIZE
    // =====================================================

    getSize() {

        return this.size;

    }


    // =====================================================
    // GET RESOURCES
    // =====================================================

    getResources() {

        return this.resources;

    }


    // =====================================================
    // CLEANUP
    // =====================================================

    dispose() {

        if (
            !this.group
        ) {

            return;

        }


        this.group.traverse(
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
                this.group
            );

        }


        this.trees = [];

        this.rocks = [];

        this.grass = [];

        this.flowers = [];

        this.resources = [];

        this.decorations = [];

        this.heightCache.clear();

        this.group = null;

        this.terrain = null;

        this.water = null;

        this.initialized = false;

    }

}
