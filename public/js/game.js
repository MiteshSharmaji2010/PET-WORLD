import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js";

import { World } from "./world.js";
import { Player } from "./player.js";
import { CreatureManager } from "./creatures.js";
import { GameSystems } from "./systems.js";
import { GameUI } from "./ui.js";
import { MobileControls } from "./mobile.js";


/*
=========================================================
                    PET WORLD
                  CORE GAME ENGINE
=========================================================

This file controls:

- Three.js scene
- Camera
- Renderer
- Lighting
- World
- Player
- Creatures
- Game systems
- UI
- Mobile controls
- Game loop
- Combat
- Capture
- Interaction
- Day/night
- Performance
- Resize
- Save/stop/start
=========================================================
*/


export class Game {

    constructor() {

        // =================================================
        // CORE THREE.JS OBJECTS
        // =================================================

        this.scene = null;

        this.camera = null;

        this.renderer = null;

        this.clock =
            new THREE.Clock();

        this.elapsed = 0;

        this.running = false;

        this.initialized = false;


        // =================================================
        // LIGHTING
        // =================================================

        this.sun = null;

        this.moon = null;

        this.ambientLight = null;

        this.hemiLight = null;


        // =================================================
        // GAME OBJECTS
        // =================================================

        this.world = null;

        this.player = null;

        this.creatures = null;

        this.systems = null;

        this.ui = null;

        this.mobile = null;


        // =================================================
        // GAME SETTINGS
        // =================================================

        this.settings = {

            shadows: true,

            antialias: true,

            pixelRatio: 1.5,

            fog: true,

            dayNight: true,

            sound: true

        };


        // =================================================
        // DAY / NIGHT
        // =================================================

        this.dayTime = 0.25;

        this.dayLength = 240;


        // =================================================
        // INPUT
        // =================================================

        this.keys = {};

        this.mouse = {

            left: false,

            right: false

        };


        // =================================================
        // COMBAT
        // =================================================

        this.attackCooldown = 0;

        this.attackDelay = 0.45;

        this.attackDamage = 20;


        // =================================================
        // INTERACTION
        // =================================================

        this.interactionCooldown = 0;

        this.interactionDelay = 0.25;


        // =================================================
        // PERFORMANCE
        // =================================================

        this.frameCount = 0;

        this.fpsTimer = 0;

        this.fps = 60;

        this.lastFrameTime = 0;


        // =================================================
        // EVENT HANDLERS
        // =================================================

        this.boundResize =
            this.resize.bind(this);

        this.boundKeyDown =
            this.handleKeyDown.bind(this);

        this.boundKeyUp =
            this.handleKeyUp.bind(this);

        this.boundMouseDown =
            this.handleMouseDown.bind(this);

        this.boundMouseUp =
            this.handleMouseUp.bind(this);


        // =================================================
        // BIND INPUT
        // =================================================

        this.setupKeyboard();

    }


    // =====================================================
    // INITIALIZE GAME
    // =====================================================

    async init() {

        if (
            this.initialized
        ) {

            return;

        }


        try {

            this.createScene();

            this.createCamera();

            this.createRenderer();

            this.createLights();

            this.createSystems();


            // ---------------------------------------------
            // WORLD
            // ---------------------------------------------

            if (
                this.world &&
                typeof this.world.init === "function"
            ) {

                await this.world.init();

            }


            // ---------------------------------------------
            // PLAYER
            // ---------------------------------------------

            if (
                this.player &&
                typeof this.player.init === "function"
            ) {

                await this.player.init();

            }


            // ---------------------------------------------
            // CREATURES
            // ---------------------------------------------

            if (
                this.creatures &&
                typeof this.creatures.init === "function"
            ) {

                await this.creatures.init();

            }


            // ---------------------------------------------
            // SYSTEMS
            // ---------------------------------------------

            if (
                this.systems &&
                typeof this.systems.init === "function"
            ) {

                await this.systems.init();

            }


            // ---------------------------------------------
            // UI
            // ---------------------------------------------

            this.ui =
                new GameUI(this);


            if (
                this.ui &&
                typeof this.ui.init === "function"
            ) {

                await this.ui.init();

            }


            // ---------------------------------------------
            // MOBILE
            // ---------------------------------------------

            this.mobile =
                new MobileControls(this);


            if (
                this.mobile &&
                typeof this.mobile.init === "function"
            ) {

                await this.mobile.init();

            }


            // ---------------------------------------------
            // EVENTS
            // ---------------------------------------------

            this.setupResize();

            this.setupInteraction();

            this.setupMouse();


            // ---------------------------------------------
            // INITIAL GAME STATE
            // ---------------------------------------------

            this.updateDayNight(0);

            this.updateUI();


            this.initialized =
                true;

            this.running =
                true;


            this.clock.start();

            this.animate();


            console.log(
                "🌎 PET WORLD initialized successfully."
            );


        } catch (
            error
        ) {

            console.error(
                "PET WORLD initialization failed:",
                error
            );


            this.showFatalError(
                error
            );

        }

    }


    // =====================================================
    // CREATE SCENE
    // =====================================================

    createScene() {

        this.scene =
            new THREE.Scene();


        // Sky color

        this.scene.background =
            new THREE.Color(
                0x91a8ad
            );


        // Fog

        if (
            this.settings.fog
        ) {

            this.scene.fog =
                new THREE.Fog(
                    0x91a8ad,
                    70,
                    430
                );

        }

    }


    // =====================================================
    // CAMERA
    // =====================================================

    createCamera() {

        this.camera =
            new THREE.PerspectiveCamera(

                65,

                window.innerWidth /
                Math.max(
                    1,
                    window.innerHeight
                ),

                0.1,

                1000

            );


        this.camera.position.set(
            0,
            5,
            10
        );


        this.camera.lookAt(
            0,
            1,
            0
        );

    }


    // =====================================================
    // RENDERER
    // =====================================================

    createRenderer() {

        this.renderer =
            new THREE.WebGLRenderer({

                antialias:
                    this.settings.antialias,

                powerPreference:
                    "high-performance",

                alpha: false

            });


        const ratio =
            Math.min(
                window.devicePixelRatio || 1,
                this.settings.pixelRatio
            );


        this.renderer.setPixelRatio(
            ratio
        );


        this.renderer.setSize(
            window.innerWidth,
            window.innerHeight,
            false
        );


        // ---------------------------------------------
        // SHADOWS
        // ---------------------------------------------

        this.renderer.shadowMap.enabled =
            Boolean(
                this.settings.shadows
            );


        this.renderer.shadowMap.type =
            THREE.PCFSoftShadowMap;


        // ---------------------------------------------
        // COLOR
        // ---------------------------------------------

        this.renderer.outputColorSpace =
            THREE.SRGBColorSpace;


        // ---------------------------------------------
        // TONE MAPPING
        // ---------------------------------------------

        this.renderer.toneMapping =
            THREE.ACESFilmicToneMapping;


        this.renderer.toneMappingExposure =
            1.05;


        // ---------------------------------------------
        // SORT
        // ---------------------------------------------

        this.renderer.sortObjects =
            true;


        // ---------------------------------------------
        // DOM
        // ---------------------------------------------

        const oldCanvas =
            document.querySelector(
                "canvas[data-pet-world-renderer]"
            );


        if (
            oldCanvas
        ) {

            oldCanvas.remove();

        }


        this.renderer.domElement.dataset.petWorldRenderer =
            "true";


        this.renderer.domElement.id =
            "pet-world-canvas";


        document.body.appendChild(
            this.renderer.domElement
        );

    }


    // =====================================================
    // LIGHTS
    // =====================================================

    createLights() {

        // =================================================
        // SUN
        // =================================================

        this.sun =
            new THREE.DirectionalLight(
                0xffffff,
                2.0
            );


        this.sun.position.set(
            100,
            150,
            80
        );


        this.sun.castShadow =
            this.settings.shadows;


        if (
            this.settings.shadows
        ) {

            this.sun.shadow.mapSize.width =
                1024;

            this.sun.shadow.mapSize.height =
                1024;


            this.sun.shadow.camera.near =
                10;

            this.sun.shadow.camera.far =
                400;


            this.sun.shadow.camera.left =
                -200;

            this.sun.shadow.camera.right =
                200;

            this.sun.shadow.camera.top =
                200;

            this.sun.shadow.camera.bottom =
                -200;


            this.sun.shadow.bias =
                -0.0002;

        }


        this.scene.add(
            this.sun
        );


        // =================================================
        // MOON
        // =================================================

        this.moon =
            new THREE.DirectionalLight(
                0x9bb8ff,
                0.25
            );


        this.moon.position.set(
            -100,
            100,
            -80
        );


        this.moon.castShadow =
            false;


        this.scene.add(
            this.moon
        );


        // =================================================
        // HEMISPHERE
        // =================================================

        this.hemiLight =
            new THREE.HemisphereLight(

                0xb8d0d6,

                0x33402e,

                1.15

            );


        this.scene.add(
            this.hemiLight
        );


        // =================================================
        // AMBIENT
        // =================================================

        this.ambientLight =
            new THREE.AmbientLight(
                0xffffff,
                0.18
            );


        this.scene.add(
            this.ambientLight
        );

    }


    // =====================================================
    // CREATE GAME SYSTEMS
    // =====================================================

    createSystems() {

        this.world =
            new World(
                this
            );


        this.player =
            new Player(
                this
            );


        this.creatures =
            new CreatureManager(
                this
            );


        this.systems =
            new GameSystems(
                this
            );

    }


    // =====================================================
    // KEYBOARD SETUP
    // =====================================================

    setupKeyboard() {

        window.addEventListener(
            "keydown",
            this.boundKeyDown
        );


        window.addEventListener(
            "keyup",
            this.boundKeyUp
        );

    }


    // =====================================================
    // KEY DOWN
    // =====================================================

    handleKeyDown(
        event
    ) {

        this.keys[
            event.code
        ] = true;


        // Prevent scrolling

        if (
            [
                "Space",
                "ArrowUp",
                "ArrowDown",
                "ArrowLeft",
                "ArrowRight"
            ].includes(
                event.code
            )
        ) {

            event.preventDefault();

        }


        // =================================================
        // CAPTURE
        // =================================================

        if (
            event.code === "KeyE"
        ) {

            this.captureCreature();

        }


        // =================================================
        // EAT
        // =================================================

        if (
            event.code === "KeyF"
        ) {

            this.eatFood();

        }


        // =================================================
        // ATTACK
        // =================================================

        if (
            event.code === "KeyQ"
        ) {

            this.attack();

        }


        // =================================================
        // INVENTORY
        // =================================================

        if (
            event.code === "KeyI"
        ) {

            if (
                this.ui
            ) {

                this.ui.toggleInventory();

            }

        }


        // =================================================
        // PETS
        // =================================================

        if (
            event.code === "KeyP"
        ) {

            if (
                this.ui
            ) {

                this.ui.togglePets();

            }

        }


        // =================================================
        // MAP
        // =================================================

        if (
            event.code === "KeyM"
        ) {

            if (
                this.ui
            ) {

                this.ui.toggleMap();

            }

        }


        // =================================================
        // SETTINGS
        // =================================================

        if (
            event.code === "Escape"
        ) {

            if (
                this.ui
            ) {

                this.ui.closeAll();

            }

        }

    }


    // =====================================================
    // KEY UP
    // =====================================================

    handleKeyUp(
        event
    ) {

        this.keys[
            event.code
        ] = false;

    }


    // =====================================================
    // MOUSE SETUP
    // =====================================================

    setupMouse() {

        if (
            !this.renderer ||
            !this.renderer.domElement
        ) {

            return;

        }


        this.renderer.domElement.addEventListener(
            "mousedown",
            this.boundMouseDown
        );


        window.addEventListener(
            "mouseup",
            this.boundMouseUp
        );

    }


    // =====================================================
    // MOUSE DOWN
    // =====================================================

    handleMouseDown(
        event
    ) {

        if (
            event.button === 0
        ) {

            this.mouse.left =
                true;


            if (
                document.pointerLockElement ===
                this.renderer.domElement
            ) {

                this.attack();

            }

        }


        if (
            event.button === 2
        ) {

            this.mouse.right =
                true;

        }

    }


    // =====================================================
    // MOUSE UP
    // =====================================================

    handleMouseUp(
        event
    ) {

        if (
            event.button === 0
        ) {

            this.mouse.left =
                false;

        }


        if (
            event.button === 2
        ) {

            this.mouse.right =
                false;

        }

    }


    // =====================================================
    // INTERACTION
    // =====================================================

    setupInteraction() {

        if (
            !this.renderer ||
            !this.renderer.domElement
        ) {

            return;

        }


        // Right click menu disable

        this.renderer.domElement.addEventListener(
            "contextmenu",
            event => {

                event.preventDefault();

            }
        );


        // Pointer lock

        this.renderer.domElement.addEventListener(
            "click",
            event => {

                if (
                    event.target.closest &&
                    event.target.closest(
                        "button"
                    )
                ) {

                    return;

                }


                // Desktop only

                if (
                    window.innerWidth > 800
                ) {

                    try {

                        if (
                            document.pointerLockElement !==
                            this.renderer.domElement
                        ) {

                            this.renderer.domElement.requestPointerLock();

                        }

                    } catch (
                        error
                    ) {

                        console.warn(
                            "Pointer lock unavailable:",
                            error
                        );

                    }

                }

            }
        );

    }


    // =====================================================
    // ATTACK
    // =====================================================

    attack() {

        if (
            !this.creatures ||
            !this.player ||
            this.player.dead
        ) {

            return false;

        }


        if (
            this.attackCooldown > 0
        ) {

            return false;

        }


        this.attackCooldown =
            this.attackDelay;


        let creature =
            null;


        try {

            creature =
                this.creatures.getNearestCreature(
                    4
                );

        } catch (
            error
        ) {

            console.warn(
                "Could not find creature:",
                error
            );

        }


        if (
            !creature
        ) {

            if (
                this.ui
            ) {

                this.ui.notify(
                    "⚔️ No creature nearby"
                );

            }

            return false;

        }


        let damage =
            this.attackDamage;


        // Level based damage

        if (
            this.systems
        ) {

            damage +=
                Math.floor(
                    this.systems.level *
                    2
                );

        }


        try {

            this.creatures.damageCreature(
                creature,
                damage
            );

        } catch (
            error
        ) {

            console.error(
                "Creature damage failed:",
                error
            );

            return false;

        }


        if (
            this.ui
        ) {

            this.ui.notify(
                `⚔️ Hit ${creature.name || "Creature"} -${damage} HP`
            );

        }


        // XP

        if (
            this.systems
        ) {

            this.systems.addXP(
                5
            );

        }


        return true;

    }


    // =====================================================
    // CAPTURE CREATURE
    // =====================================================

    captureCreature() {

        if (
            !this.systems ||
            !this.creatures
        ) {

            return false;

        }


        try {

            return this.systems
                .captureNearestCreature();

        } catch (
            error
        ) {

            console.error(
                "Capture failed:",
                error
            );


            if (
                this.ui
            ) {

                this.ui.notify(
                    "❌ Capture failed"
                );

            }


            return false;

        }

    }


    // =====================================================
    // EAT FOOD
    // =====================================================

    eatFood() {

        if (
            !this.player
        ) {

            return false;

        }


        try {

            return this.player.eat(
                25
            );

        } catch (
            error
        ) {

            console.error(
                "Eating failed:",
                error
            );


            return false;

        }

    }


    // =====================================================
    // UPDATE
    // =====================================================

    update(
        delta
    ) {

        if (
            !this.initialized &&
            !this.running
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


        this.elapsed +=
            delta;


        // =================================================
        // COOLDOWNS
        // =================================================

        this.attackCooldown =
            Math.max(
                0,
                this.attackCooldown -
                delta
            );


        this.interactionCooldown =
            Math.max(
                0,
                this.interactionCooldown -
                delta
            );


        // =================================================
        // WORLD
        // =================================================

        if (
            this.world &&
            typeof this.world.update ===
            "function"
        ) {

            try {

                this.world.update(
                    delta,
                    this.elapsed
                );

            } catch (
                error
            ) {

                console.error(
                    "World update error:",
                    error
                );

            }

        }


        // =================================================
        // PLAYER
        // =================================================

        if (
            this.player &&
            typeof this.player.update ===
            "function"
        ) {

            try {

                this.player.update(
                    delta,
                    this.elapsed
                );

            } catch (
                error
            ) {

                console.error(
                    "Player update error:",
                    error
                );

            }

        }


        // =================================================
        // CREATURES
        // =================================================

        if (
            this.creatures &&
            typeof this.creatures.update ===
            "function"
        ) {

            try {

                this.creatures.update(
                    delta,
                    this.elapsed
                );

            } catch (
                error
            ) {

                console.error(
                    "Creature update error:",
                    error
                );

            }

        }


        // =================================================
        // GAME SYSTEMS
        // =================================================

        if (
            this.systems &&
            typeof this.systems.update ===
            "function"
        ) {

            try {

                this.systems.update(
                    delta,
                    this.elapsed
                );

            } catch (
                error
            ) {

                console.error(
                    "Systems update error:",
                    error
                );

            }

        }


        // =================================================
        // MOBILE
        // =================================================

        if (
            this.mobile &&
            typeof this.mobile.update ===
            "function"
        ) {

            try {

                this.mobile.update();

            } catch (
                error
            ) {

                console.error(
                    "Mobile update error:",
                    error
                );

            }

        }


        // =================================================
        // DAY / NIGHT
        // =================================================

        if (
            this.settings.dayNight
        ) {

            this.updateDayNight(
                delta
            );

        }


        // =================================================
        // UI
        // =================================================

        if (
            this.ui &&
            typeof this.ui.update ===
            "function"
        ) {

            try {

                this.ui.update(
                    delta
                );

            } catch (
                error
            ) {

                console.error(
                    "UI update error:",
                    error
                );

            }

        }


        // =================================================
        // FPS
        // =================================================

        this.updateFPS(
            delta
        );

    }


    // =====================================================
    // DAY / NIGHT SYSTEM
    // =====================================================

    updateDayNight(
        delta
    ) {

        if (
            !this.settings.dayNight
        ) {

            return;

        }


        this.dayTime +=
            delta /
            Math.max(
                1,
                this.dayLength
            );


        if (
            this.dayTime >= 1
        ) {

            this.dayTime -= 1;

        }


        const angle =
            this.dayTime *
            Math.PI *
            2;


        // =================================================
        // SUN POSITION
        // =================================================

        const sunRadius =
            180;


        this.sun.position.set(

            Math.cos(angle) *
            sunRadius,

            Math.sin(angle) *
            sunRadius,

            80

        );


        // =================================================
        // MOON POSITION
        // =================================================

        this.moon.position.set(

            -Math.cos(angle) *
            180,

            -Math.sin(angle) *
            180,

            -80

        );


        // =================================================
        // DAY INTENSITY
        // =================================================

        const daylight =
            Math.max(
                0,
                Math.sin(angle)
            );


        const night =
            1 -
            daylight;


        if (
            this.sun
        ) {

            this.sun.intensity =
                0.25 +
                daylight *
                1.75;

        }


        if (
            this.moon
        ) {

            this.moon.intensity =
                0.05 +
                night *
                0.30;

        }


        if (
            this.hemiLight
        ) {

            this.hemiLight.intensity =
                0.45 +
                daylight *
                0.70;

        }


        if (
            this.ambientLight
        ) {

            this.ambientLight.intensity =
                0.08 +
                daylight *
                0.18;

        }


        // =================================================
        // SKY
        // =================================================

        if (
            this.scene &&
            this.scene.background
        ) {

            const dayColor =
                new THREE.Color(
                    0x91a8ad
                );


            const nightColor =
                new THREE.Color(
                    0x101827
                );


            const sky =
                nightColor.clone()
                    .lerp(
                        dayColor,
                        daylight
                    );


            this.scene.background =
                sky;


            if (
                this.scene.fog
            ) {

                this.scene.fog.color =
                    sky;

            }

        }

    }


    // =====================================================
    // FPS
    // =====================================================

    updateFPS(
        delta
    ) {

        this.frameCount++;

        this.fpsTimer +=
            delta;


        if (
            this.fpsTimer >= 1
        ) {

            this.fps =
                this.frameCount /
                this.fpsTimer;


            this.frameCount =
                0;

            this.fpsTimer =
                0;

        }

    }


    // =====================================================
    // UI UPDATE
    // =====================================================

    updateUI() {

        if (
            !this.ui
        ) {

            return;

        }


        try {

            if (
                typeof this.ui.updateXP ===
                "function"
            ) {

                this.ui.updateXP();

            }


            if (
                typeof this.ui.updateActivePet ===
                "function"
            ) {

                this.ui.updateActivePet();

            }


            if (
                typeof this.ui.updateInventory ===
                "function"
            ) {

                if (
                    this.ui.inventoryOpen
                ) {

                    this.ui.updateInventory();

                }

            }

        } catch (
            error
        ) {

            console.warn(
                "UI refresh failed:",
                error
            );

        }

    }


    // =====================================================
    // RESIZE SETUP
    // =====================================================

    setupResize() {

        window.removeEventListener(
            "resize",
            this.boundResize
        );


        window.addEventListener(
            "resize",
            this.boundResize
        );


        this.resize();

    }


    // =====================================================
    // RESIZE
    // =====================================================

    resize() {

        if (
            !this.camera ||
            !this.renderer
        ) {

            return;

        }


        const width =
            Math.max(
                1,
                window.innerWidth
            );


        const height =
            Math.max(
                1,
                window.innerHeight
            );


        this.camera.aspect =
            width /
            height;


        this.camera.updateProjectionMatrix();


        this.renderer.setSize(
            width,
            height,
            false
        );


        this.renderer.setPixelRatio(
            Math.min(
                window.devicePixelRatio || 1,
                this.settings.pixelRatio
            )
        );


        if (
            this.mobile &&
            typeof this.mobile.resize ===
            "function"
        ) {

            try {

                this.mobile.resize();

            } catch (
                error
            ) {

                console.warn(
                    "Mobile resize failed:",
                    error
                );

            }

        }

    }


    // =====================================================
    // GAME LOOP
    // =====================================================

    animate() {

        if (
            !this.running
        ) {

            return;

        }


        requestAnimationFrame(
            () => {

                this.animate();

            }
        );


        let delta =
            this.clock.getDelta();


        // Prevent huge physics jumps

        delta =
            Math.min(
                delta,
                0.05
            );


        // Very small values can be ignored

        if (
            delta < 0.0001
        ) {

            delta =
                0.0001;

        }


        this.update(
            delta
        );


        if (
            this.renderer &&
            this.scene &&
            this.camera
        ) {

            this.renderer.render(
                this.scene,
                this.camera
            );

        }

    }


    // =====================================================
    // STOP GAME
    // =====================================================

    stop() {

        this.running =
            false;


        if (
            this.clock
        ) {

            this.clock.stop();

        }

    }


    // =====================================================
    // START GAME
    // =====================================================

    start() {

        if (
            this.running
        ) {

            return;

        }


        this.running =
            true;


        this.clock.start();


        this.animate();

    }


    // =====================================================
    // SAVE
    // =====================================================

    save() {

        if (
            !this.systems
        ) {

            return false;

        }


        try {

            if (
                typeof this.systems.saveGame ===
                "function"
            ) {

                this.systems.saveGame();

                if (
                    this.ui
                ) {

                    this.ui.notify(
                        "💾 Game saved"
                    );

                }

                return true;

            }

        } catch (
            error
        ) {

            console.error(
                "Save failed:",
                error
            );

        }


        return false;

    }


    // =====================================================
    // DESTROY
    // =====================================================

    destroy() {

        this.stop();


        window.removeEventListener(
            "resize",
            this.boundResize
        );


        window.removeEventListener(
            "keydown",
            this.boundKeyDown
        );


        window.removeEventListener(
            "keyup",
            this.boundKeyUp
        );


        window.removeEventListener(
            "mouseup",
            this.boundMouseUp
        );


        if (
            this.renderer
        ) {

            this.renderer.domElement
                .removeEventListener(
                    "mousedown",
                    this.boundMouseDown
                );


            this.renderer.dispose();

        }


        if (
            this.scene
        ) {

            this.scene.traverse(
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

                            object.material
                                .forEach(
                                    material => {

                                        this.disposeMaterial(
                                            material
                                        );

                                    }
                                );

                        } else {

                            this.disposeMaterial(
                                object.material
                            );

                        }

                    }

                }
            );

        }


        this.scene =
            null;

        this.camera =
            null;

        this.renderer =
            null;

        this.world =
            null;

        this.player =
            null;

        this.creatures =
            null;

        this.systems =
            null;

        this.ui =
            null;

        this.mobile =
            null;

        this.initialized =
            false;

    }


    // =====================================================
    // MATERIAL CLEANUP
    // =====================================================

    disposeMaterial(
        material
    ) {

        if (
            !material
        ) {

            return;

        }


        const textureKeys = [

            "map",

            "lightMap",

            "bumpMap",

            "normalMap",

            "specularMap",

            "roughnessMap",

            "metalnessMap",

            "alphaMap",

            "emissiveMap",

            "aoMap",

            "displacementMap"

        ];


        textureKeys.forEach(
            key => {

                if (
                    material[key]
                ) {

                    material[key].dispose();

                }

            }
        );


        material.dispose();

    }


    // =====================================================
    // FATAL ERROR SCREEN
    // =====================================================

    showFatalError(
        error
    ) {

        const old =
            document.getElementById(
                "pet-world-fatal-error"
            );


        if (
            old
        ) {

            old.remove();

        }


        const box =
            document.createElement(
                "div"
            );


        box.id =
            "pet-world-fatal-error";


        box.style.position =
            "fixed";


        box.style.left =
            "20px";


        box.style.right =
            "20px";


        box.style.top =
            "20px";


        box.style.padding =
            "20px";


        box.style.borderRadius =
            "15px";


        box.style.background =
            "rgba(90,0,0,0.95)";


        box.style.color =
            "#ffffff";


        box.style.zIndex =
            "999999";


        box.style.fontFamily =
            "Arial, sans-serif";


        box.style.boxShadow =
            "0 20px 50px rgba(0,0,0,0.5)";


        box.innerHTML = `

            <div
                style="
                    font-size:20px;
                    font-weight:800;
                    margin-bottom:10px;
                "
            >
                ❌ PET WORLD failed to start
            </div>

            <div
                style="
                    font-size:13px;
                    opacity:0.85;
                    margin-bottom:12px;
                "
            >
                Game initialization error occurred.
            </div>

            <div
                style="
                    font-size:12px;
                    background:rgba(0,0,0,0.3);
                    padding:10px;
                    border-radius:8px;
                    overflow:auto;
                "
            >
                ${this.escapeHTML(
                    error?.message ||
                    String(error)
                )}
            </div>

            <button
                id="pet-world-reload"
                style="
                    margin-top:14px;
                    padding:10px 16px;
                    border:0;
                    border-radius:8px;
                    cursor:pointer;
                    font-weight:700;
                "
            >
                🔄 Reload Game
            </button>

        `;


        document.body.appendChild(
            box
        );


        const reload =
            document.getElementById(
                "pet-world-reload"
            );


        if (
            reload
        ) {

            reload.addEventListener(
                "click",
                () => {

                    location.reload();

                }
            );

        }

    }


    // =====================================================
    // HTML ESCAPE
    // =====================================================

    escapeHTML(
        value
    ) {

        const element =
            document.createElement(
                "div"
            );


        element.textContent =
            String(value);


        return element.innerHTML;

    }

}


