import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js";

import { World } from "./world.js";
import { Player } from "./player.js";
import { CreatureManager } from "./creatures.js";
import { GameSystems } from "./systems.js";
import { GameUI } from "./ui.js";
import { MobileControls } from "./mobile.js";

// =====================================================
// PET WORLD
// MAIN GAME ENGINE
// =====================================================

class PetWorldGame {

    constructor() {

        this.scene = null;
        this.camera = null;
        this.renderer = null;

        this.clock = new THREE.Clock();

        this.world = null;
        this.player = null;
        this.creatures = null;
        this.systems = null;
        this.ui = null;
        this.mobile = null;

        this.running = false;

        this.loadingProgress = 0;

        this.init();

    }

    // =================================================
    // INITIALIZATION
    // =================================================

    async init() {

        try {

            this.updateLoading(
                10,
                "Initializing game..."
            );

            this.createScene();

            this.updateLoading(
                20,
                "Creating camera..."
            );

            this.createCamera();

            this.updateLoading(
                30,
                "Creating renderer..."
            );

            this.createRenderer();

            this.updateLoading(
                40,
                "Creating lighting..."
            );

            this.createLighting();

            this.updateLoading(
                50,
                "Loading world..."
            );

            this.world =
                new World(this);

            await this.world.init();

            this.updateLoading(
                65,
                "Creating player..."
            );

            this.player =
                new Player(this);

            await this.player.init();

            this.updateLoading(
                75,
                "Loading creatures..."
            );

            this.creatures =
                new CreatureManager(this);

            await this.creatures.init();

            this.updateLoading(
                85,
                "Starting game systems..."
            );

            this.systems =
                new GameSystems(this);

            await this.systems.init();

            this.updateLoading(
                92,
                "Creating interface..."
            );

            this.ui =
                new GameUI(this);

            await this.ui.init();

            this.updateLoading(
                96,
                "Preparing mobile controls..."
            );

            this.mobile =
                new MobileControls(this);

            await this.mobile.init();

            this.setupEvents();

            this.updateLoading(
                100,
                "World ready!"
            );

            setTimeout(() => {

                this.hideLoadingScreen();

                this.start();

            }, 500);

        } catch (error) {

            console.error(
                "PET WORLD ERROR:",
                error
            );

            this.showError(
                error.message ||
                "Unable to start game."
            );

        }

    }

    // =================================================
    // THREE.JS SCENE
    // =================================================

    createScene() {

        this.scene =
            new THREE.Scene();

        this.scene.background =
            new THREE.Color(
                0x87a8b5
            );

        this.scene.fog =
            new THREE.Fog(
                0x87a8b5,
                60,
                450
            );

    }

    // =================================================
    // CAMERA
    // =================================================

    createCamera() {

        const width =
            window.innerWidth;

        const height =
            window.innerHeight;

        this.camera =
            new THREE.PerspectiveCamera(
                65,
                width / height,
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
            2,
            0
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
            1.0;

        const container =
            document.getElementById(
                "gameContainer"
            );

        if (!container) {

            throw new Error(
                "Game container not found."
            );

        }

        container.appendChild(
            this.renderer.domElement
        );

    }

    // =================================================
    // LIGHTING
    // =================================================

    createLighting() {

        // Ambient light

        const ambient =
            new THREE.HemisphereLight(
                0xbfd8e5,
                0x304020,
                1.6
            );

        this.scene.add(
            ambient
        );


        // Sun

        this.sun =
            new THREE.DirectionalLight(
                0xffffff,
                2.5
            );

        this.sun.position.set(
            100,
            180,
            80
        );

        this.sun.castShadow =
            true;

        this.sun.shadow.mapSize.width =
            1024;

        this.sun.shadow.mapSize.height =
            1024;

        this.sun.shadow.camera.near =
            1;

        this.sun.shadow.camera.far =
            500;

        this.sun.shadow.camera.left =
            -150;

        this.sun.shadow.camera.right =
            150;

        this.sun.shadow.camera.top =
            150;

        this.sun.shadow.camera.bottom =
            -150;

        this.scene.add(
            this.sun
        );


        // Moon light

        this.moon =
            new THREE.DirectionalLight(
                0x7890b5,
                0.15
            );

        this.moon.position.set(
            -100,
            100,
            -80
        );

        this.scene.add(
            this.moon
        );

    }

    // =================================================
    // EVENTS
    // =================================================

    setupEvents() {

        window.addEventListener(
            "resize",
            () => {

                this.resize();

            }
        );

        window.addEventListener(
            "beforeunload",
            () => {

                this.saveGame();

            }
        );

    }

    // =================================================
    // RESIZE
    // =================================================

    resize() {

        if (
            !this.camera ||
            !this.renderer
        ) {
            return;
        }

        const width =
            window.innerWidth;

        const height =
            window.innerHeight;

        this.camera.aspect =
            width / height;

        this.camera.updateProjectionMatrix();

        this.renderer.setSize(
            width,
            height
        );

    }

    // =================================================
    // START GAME
    // =================================================

    start() {

        if (this.running) {
            return;
        }

        this.running = true;

        this.lastTime =
            performance.now();

        this.animate();

    }

    // =================================================
    // MAIN GAME LOOP
    // =================================================

    animate() {

        if (!this.running) {
            return;
        }

        requestAnimationFrame(
            () => this.animate()
        );

        const delta =
            Math.min(
                this.clock.getDelta(),
                0.05
            );

        const elapsed =
            this.clock.elapsedTime;


        // ---------------------------------------------
        // WORLD UPDATE
        // ---------------------------------------------

        if (this.world) {

            this.world.update(
                delta,
                elapsed
            );

        }


        // ---------------------------------------------
        // PLAYER UPDATE
        // ---------------------------------------------

        if (this.player) {

            this.player.update(
                delta,
                elapsed
            );

        }


        // ---------------------------------------------
        // CREATURE UPDATE
        // ---------------------------------------------

        if (this.creatures) {

            this.creatures.update(
                delta,
                elapsed
            );

        }


        // ---------------------------------------------
        // GAME SYSTEMS
        // ---------------------------------------------

        if (this.systems) {

            this.systems.update(
                delta,
                elapsed
            );

        }


        // ---------------------------------------------
        // UI
        // ---------------------------------------------

        if (this.ui) {

            this.ui.update(
                delta,
                elapsed
            );

        }


        // ---------------------------------------------
        // MOBILE
        // ---------------------------------------------

        if (this.mobile) {

            this.mobile.update(
                delta,
                elapsed
            );

        }


        // ---------------------------------------------
        // RENDER
        // ---------------------------------------------

        this.renderer.render(
            this.scene,
            this.camera
        );

    }

    // =================================================
    // LOADING
    // =================================================

    updateLoading(
        percent,
        text
    ) {

        this.loadingProgress =
            percent;

        const progress =
            document.getElementById(
                "loadingProgress"
            );

        const loadingText =
            document.getElementById(
                "loadingText"
            );

        const loadingPercent =
            document.getElementById(
                "loadingPercent"
            );

        if (progress) {

            progress.style.width =
                `${percent}%`;

        }

        if (loadingText) {

            loadingText.textContent =
                text;

        }

        if (loadingPercent) {

            loadingPercent.textContent =
                `${percent}%`;

        }

    }

    // =================================================
    // HIDE LOADING
    // =================================================

    hideLoadingScreen() {

        const loading =
            document.getElementById(
                "loadingScreen"
            );

        if (!loading) {
            return;
        }

        loading.style.opacity =
            "0";

        loading.style.transition =
            "opacity 0.5s ease";

        setTimeout(() => {

            loading.classList.add(
                "hidden"
            );

        }, 500);

    }

    // =================================================
    // ERROR
    // =================================================

    showError(message) {

        const loading =
            document.getElementById(
                "loadingScreen"
            );

        if (loading) {

            loading.classList.add(
                "hidden"
            );

        }

        const errorScreen =
            document.getElementById(
                "errorScreen"
            );

        const errorMessage =
            document.getElementById(
                "errorMessage"
            );

        if (errorMessage) {

            errorMessage.textContent =
                message;

        }

        if (errorScreen) {

            errorScreen.classList.remove(
                "hidden"
            );

        }

    }

    // =================================================
    // SAVE GAME
    // =================================================

    saveGame() {

        try {

            if (
                this.systems &&
                typeof this.systems.saveGame ===
                    "function"
            ) {

                this.systems.saveGame();

            }

        } catch (error) {

            console.error(
                "Save error:",
                error
            );

        }

    }

    // =================================================
    // STOP GAME
    // =================================================

    stop() {

        this.running = false;

    }

}


// =====================================================
// START GAME
// =====================================================

window.petWorld =
    new PetWorldGame();
