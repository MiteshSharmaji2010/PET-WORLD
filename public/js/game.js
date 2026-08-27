import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js";

import { World } from "./world.js";
import { Player } from "./player.js";
import { CreatureManager } from "./creatures.js";
import { GameSystems } from "./systems.js";
import { GameUI } from "./ui.js";
import { MobileControls } from "./mobile.js";


export class Game {

    constructor() {

        this.scene = null;

        this.camera = null;

        this.renderer = null;

        this.clock =
            new THREE.Clock();

        this.elapsed = 0;

        this.running = false;

        this.sun = null;

        this.moon = null;

        this.world = null;

        this.player = null;

        this.creatures = null;

        this.systems = null;

        this.ui = null;

        this.mobile = null;

    }


    // =================================================
    // INITIALIZE
    // =================================================

    async init() {

        this.createScene();

        this.createCamera();

        this.createRenderer();

        this.createLights();

        this.createSystems();

        await this.world.init();

        await this.player.init();

        await this.creatures.init();

        await this.systems.init();

        this.ui = new GameUI(
            this
        );

        this.mobile =
            new MobileControls(
                this
            );

        this.mobile.init();

        this.setupResize();

        this.setupInteraction();

        this.running = true;

        this.animate();

    }


    // =================================================
    // SCENE
    // =================================================

    createScene() {

        this.scene =
            new THREE.Scene();

        this.scene.fog =
            new THREE.Fog(
                0x91a8ad,
                70,
                430
            );

    }


    // =================================================
    // CAMERA
    // =================================================

    createCamera() {

        this.camera =
            new THREE.PerspectiveCamera(

                65,

                window.innerWidth /
                window.innerHeight,

                0.1,

                1000

            );


        this.camera.position.set(
            0,
            5,
            10
        );

    }


    // =================================================
    // RENDERER
    // =================================================

    createRenderer() {

        this.renderer =
            new THREE.WebGLRenderer({

                antialias: true,

                powerPreference:
                    "high-performance"

            });


        this.renderer.setPixelRatio(
            Math.min(
                window.devicePixelRatio,
                1.5
            )
        );


        this.renderer.setSize(
            window.innerWidth,
            window.innerHeight
        );


        this.renderer.shadowMap.enabled =
            true;


        this.renderer.shadowMap.type =
            THREE.PCFSoftShadowMap;


        this.renderer.outputColorSpace =
            THREE.SRGBColorSpace;


        this.renderer.toneMapping =
            THREE.ACESFilmicToneMapping;


        this.renderer.toneMappingExposure =
            1.05;


        document.body.appendChild(
            this.renderer.domElement
        );

    }


    // =================================================
    // LIGHTS
    // =================================================

    createLights() {

        // -----------------------------
        // SUN
        // -----------------------------

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
            true;


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


        this.scene.add(
            this.sun
        );


        // -----------------------------
        // MOON
        // -----------------------------

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


        this.scene.add(
            this.moon
        );


        // -----------------------------
        // AMBIENT
        // -----------------------------

        const ambient =
            new THREE.HemisphereLight(

                0xb8d0d6,

                0x33402e,

                1.15

            );


        this.scene.add(
            ambient
        );

    }


    // =================================================
    // SYSTEMS
    // =================================================

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


    // =================================================
    // INTERACTION
    // =================================================

    setupInteraction() {

        window.addEventListener(
            "keydown",
            event => {

                // Capture with E

                if (
                    event.code ===
                    "KeyE"
                ) {

                    if (
                        this.systems
                    ) {

                        this.systems
                            .captureNearestCreature();

                    }

                }


                // Heal with F

                if (
                    event.code ===
                    "KeyF"
                ) {

                    if (
                        this.systems
                    ) {

                        this.systems
                            .useHealingFood();

                    }

                }


                // Attack with left mouse

                if (
                    event.code ===
                    "KeyQ"
                ) {

                    this.attack();

                }

            }
        );


        this.renderer.domElement
            .addEventListener(
                "mousedown",
                event => {

                    if (
                        event.button === 0 &&
                        document.pointerLockElement
                        ===
                        this.renderer.domElement
                    ) {

                        this.attack();

                    }

                }
            );

    }


    // =================================================
    // ATTACK
    // =================================================

    attack() {

        if (
            !this.creatures
        ) {

            return;

        }


        const creature =
            this.creatures
                .getNearestCreature(
                    4
                );


        if (
            !creature
        ) {

            return;

        }


        this.creatures
            .damageCreature(
                creature,
                20
            );


        if (
            this.ui
        ) {

            this.ui.notify(
                `Hit ${creature.name}!`
            );

        }

    }


    // =================================================
    // RESIZE
    // =================================================

    setupResize() {

        window.addEventListener(
            "resize",
            () => {

                this.resize();

            }
        );

    }


    resize() {

        if (
            !this.camera ||
            !this.renderer
        ) {

            return;

        }


        this.camera.aspect =
            window.innerWidth /
            window.innerHeight;


        this.camera.updateProjectionMatrix();


        this.renderer.setSize(
            window.innerWidth,
            window.innerHeight
        );


        this.renderer.setPixelRatio(
            Math.min(
                window.devicePixelRatio,
                1.5
            )
        );


        if (
            this.mobile
        ) {

            this.mobile.resize();

        }

    }


    // =================================================
    // UPDATE
    // =================================================

    update(
        delta
    ) {

        this.elapsed +=
            delta;


        if (
            this.world
        ) {

            this.world.update(
                delta,
                this.elapsed
            );

        }


        if (
            this.player
        ) {

            this.player.update(
                delta,
                this.elapsed
            );

        }


        if (
            this.creatures
        ) {

            this.creatures.update(
                delta,
                this.elapsed
            );

        }


        if (
            this.systems
        ) {

            this.systems.update(
                delta,
                this.elapsed
            );

        }


        if (
            this.mobile
        ) {

            this.mobile.update();

        }


        if (
            this.ui
        ) {

            this.ui.update(
                delta
            );

        }

    }


    // =================================================
    // GAME LOOP
    // =================================================

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
        // when browser tab is inactive.

        delta =
            Math.min(
                delta,
                0.05
            );


        this.update(
            delta
        );


        this.renderer.render(
            this.scene,
            this.camera
        );

    }


    // =================================================
    // STOP
    // =================================================

    stop() {

        this.running =
            false;

    }


    // =================================================
    // START
    // =================================================

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

}


// =====================================================
// START GAME
// =====================================================

window.addEventListener(
    "DOMContentLoaded",
    async () => {

        try {

            const game =
                new Game();


            window.petWorldGame =
                game;


            await game.init();


            console.log(
                "PET WORLD started successfully."
            );

        } catch (
            error
        ) {

            console.error(
                "Game initialization failed:",
                error
            );


            const message =
                document.createElement(
                    "div"
                );


            message.style.position =
                "fixed";

            message.style.left =
                "20px";

            message.style.right =
                "20px";

            message.style.top =
                "20px";

            message.style.padding =
                "20px";

            message.style.background =
                "rgba(120,0,0,0.9)";

            message.style.color =
                "white";

            message.style.zIndex =
                "99999";

            message.style.fontFamily =
                "Arial, sans-serif";


            message.textContent =
                "Game failed to start. Check the browser console for details.";


            document.body.appendChild(
                message
            );

        }

    }
);
