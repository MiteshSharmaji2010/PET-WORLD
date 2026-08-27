import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js";

import { World } from "./world.js";
import { Player } from "./player.js";
import { Creatures } from "./creatures.js";
import { GameSystems } from "./systems.js";
import { MobileControls } from "./mobile.js";


class PetWorldGame {

    constructor() {

        // =============================================
        // CORE
        // =============================================

        this.scene = null;

        this.camera = null;

        this.renderer = null;

        this.clock =
            new THREE.Clock();

        this.elapsed = 0;

        this.running = false;


        // =============================================
        // GAME SYSTEMS
        // =============================================

        this.world = null;

        this.player = null;

        this.creatures = null;

        this.systems = null;

        this.mobile = null;


        // =============================================
        // UI
        // =============================================

        this.ui = {

            notify: message => {

                this.showNotification(
                    message
                );

            }

        };

    }


    // =================================================
    // START
    // =================================================

    async start() {

        try {

            this.createScene();

            this.createCamera();

            this.createRenderer();

            this.createLighting();

            this.setupResize();

            this.createGameSystems();

            await this.initializeSystems();

            this.createInitialUI();

            this.running = true;

            this.animate();

        } catch (
            error
        ) {

            console.error(
                "Game startup failed:",
                error
            );

            this.showFatalError(
                error
            );

        }

    }


    // =================================================
    // SCENE
    // =================================================

    createScene() {

        this.scene =
            new THREE.Scene();


        this.scene.background =
            new THREE.Color(
                0x87b6d9
            );


        this.scene.fog =
            new THREE.Fog(
                0x87b6d9,
                80,
                350
            );


        this.scene.name =
            "PET_WORLD_SCENE";

    }


    // =================================================
    // CAMERA
    // =================================================

    createCamera() {

        const aspect =
            window.innerWidth /
            Math.max(
                1,
                window.innerHeight
            );


        this.camera =
            new THREE.PerspectiveCamera(
                65,
                aspect,
                0.1,
                700
            );


        this.camera.position.set(
            0,
            5,
            8
        );

    }


    // =================================================
    // RENDERER
    // =================================================

    createRenderer() {

        this.renderer =
            new THREE.WebGLRenderer({

                antialias:
                    window.devicePixelRatio <
                    1.5,

                powerPreference:
                    "high-performance"

            });


        this.renderer.setPixelRatio(
            Math.min(
                window.devicePixelRatio || 1,
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
            1;


        this.renderer.domElement.id =
            "game-canvas";


        document.body.appendChild(
            this.renderer.domElement
        );

    }


    // =================================================
    // BASIC LIGHTING
    // =================================================

    createLighting() {

        const light =
            new THREE.HemisphereLight(
                0xbfdcff,
                0x26321e,
                0.8
            );


        this.scene.add(
            light
        );

    }


    // =================================================
    // CREATE SYSTEM OBJECTS
    // =================================================

    createGameSystems() {

        this.world =
            new World(
                this
            );


        this.player =
            new Player(
                this
            );


        this.creatures =
            new Creatures(
                this
            );


        this.systems =
            new GameSystems(
                this
            );


        this.mobile =
            new MobileControls(
                this
            );

    }


    // =================================================
    // INITIALIZE SYSTEMS
    // =================================================

    async initializeSystems() {

        await this.systems.init();

        await this.world.init();

        await this.player.init();

        await this.creatures.init();

        await this.mobile.init();

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
            Math.max(
                1,
                window.innerHeight
            );


        this.camera.updateProjectionMatrix();


        this.renderer.setSize(
            window.innerWidth,
            window.innerHeight
        );

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
            () => this.animate()
        );


        const rawDelta =
            this.clock.getDelta();


        const delta =
            Math.min(
                rawDelta,
                0.05
            );


        this.elapsed +=
            delta;


        this.update(
            delta
        );


        this.render();

    }


    // =================================================
    // UPDATE
    // =================================================

    update(
        delta
    ) {

        try {

            if (
                this.systems
            ) {

                this.systems.update(
                    delta
                );

            }


            if (
                this.world
            ) {

                this.world.update(
                    delta
                );

            }


            if (
                this.player
            ) {

                this.player.update(
                    delta
                );

            }


            if (
                this.creatures
            ) {

                this.creatures.update(
                    delta
                );

            }


            if (
                this.mobile
            ) {

                this.mobile.update(
                    delta
                );

            }


            this.updateHUD();

        } catch (
            error
        ) {

            console.error(
                "Game update error:",
                error
            );

        }

    }


    // =================================================
    // RENDER
    // =================================================

    render() {

        if (
            !this.renderer ||
            !this.scene ||
            !this.camera
        ) {

            return;

        }


        this.renderer.render(
            this.scene,
            this.camera
        );

    }


    // =================================================
    // INITIAL UI
    // =================================================

    createInitialUI() {

        let hud =
            document.getElementById(
                "game-hud"
            );


        if (
            hud
        ) {

            return;

        }


        hud =
            document.createElement(
                "div"
            );


        hud.id =
            "game-hud";


        hud.innerHTML = `

            <div class="hud-panel">

                <div class="hud-row">

                    <span>
                        ❤️
                    </span>

                    <div class="bar">

                        <div
                            id="health-bar"
                            class="bar-fill"
                        ></div>

                    </div>

                    <span
                        id="health-text"
                    >
                        100
                    </span>

                </div>


                <div class="hud-row">

                    <span>
                        ⚡
                    </span>

                    <div class="bar">

                        <div
                            id="stamina-bar"
                            class="bar-fill"
                        ></div>

                    </div>

                    <span
                        id="stamina-text"
                    >
                        100
                    </span>

                </div>


                <div class="hud-row">

                    <span>
                        🍖
                    </span>

                    <div class="bar">

                        <div
                            id="hunger-bar"
                            class="bar-fill"
                        ></div>

                    </div>

                    <span
                        id="hunger-text"
                    >
                        100
                    </span>

                </div>


                <div class="level-text">

                    LEVEL
                    <strong id="level-value">
                        1
                    </strong>

                </div>


                <div class="pet-text">

                    🐾 PETS:
                    <strong id="pet-count">
                        0
                    </strong>

                </div>

            </div>


            <div
                id="notification-container"
            ></div>

        `;


        document.body.appendChild(
            hud
        );


        this.injectHUDStyles();

    }


    // =================================================
    // HUD UPDATE
    // =================================================

    updateHUD() {

        if (
            !this.player ||
            !this.systems
        ) {

            return;

        }


        const healthBar =
            document.getElementById(
                "health-bar"
            );


        const staminaBar =
            document.getElementById(
                "stamina-bar"
            );


        const hungerBar =
            document.getElementById(
                "hunger-bar"
            );


        const healthText =
            document.getElementById(
                "health-text"
            );


        const staminaText =
            document.getElementById(
                "stamina-text"
            );


        const hungerText =
            document.getElementById(
                "hunger-text"
            );


        const levelValue =
            document.getElementById(
                "level-value"
            );


        const petCount =
            document.getElementById(
                "pet-count"
            );


        if (
            healthBar
        ) {

            healthBar.style.width =
                `${this.getPercent(
                    this.player.health,
                    this.player.maxHealth
                )}%`;

        }


        if (
            staminaBar
        ) {

            staminaBar.style.width =
                `${this.getPercent(
                    this.player.stamina,
                    this.player.maxStamina
                )}%`;

        }


        if (
            hungerBar
        ) {

            hungerBar.style.width =
                `${this.getPercent(
                    this.player.hunger,
                    this.player.maxHunger
                )}%`;

        }


        if (
            healthText
        ) {

            healthText.textContent =
                Math.round(
                    this.player.health
                );

        }


        if (
            staminaText
        ) {

            staminaText.textContent =
                Math.round(
                    this.player.stamina
                );

        }


        if (
            hungerText
        ) {

            hungerText.textContent =
                Math.round(
                    this.player.hunger
                );

        }


        if (
            levelValue
        ) {

            levelValue.textContent =
                this.systems.level;

        }


        if (
            petCount
        ) {

            petCount.textContent =
                this.systems.pets.length;

        }

    }


    // =================================================
    // PERCENT
    // =================================================

    getPercent(
        value,
        max
    ) {

        if (
            !Number.isFinite(value) ||
            !Number.isFinite(max) ||
            max <= 0
        ) {

            return 0;

        }


        return Math.max(
            0,
            Math.min(
                100,
                (
                    value /
                    max
                ) *
                100
            )
        );

    }


    // =================================================
    // NOTIFICATION
    // =================================================

    showNotification(
        message
    ) {

        let container =
            document.getElementById(
                "notification-container"
            );


        if (
            !container
        ) {

            container =
                document.createElement(
                    "div"
                );

            container.id =
                "notification-container";

            document.body.appendChild(
                container
            );

        }


        const notification =
            document.createElement(
                "div"
            );


        notification.className =
            "game-notification";


        notification.textContent =
            String(
                message
            );


        container.appendChild(
            notification
        );


        setTimeout(
            () => {

                notification.style.opacity =
                    "0";


                notification.style.transform =
                    "translateY(-10px)";


                setTimeout(
                    () => {

                        notification.remove();

                    },
                    250
                );

            },
            2200
        );

    }


    // =================================================
    // FATAL ERROR
    // =================================================

    showFatalError(
        error
    ) {

        const message =
            error &&
            error.message
                ? error.message
                : "Unknown error";


        const box =
            document.createElement(
                "div"
            );


        box.style.position =
            "fixed";


        box.style.inset =
            "20px";


        box.style.zIndex =
            "99999";


        box.style.background =
            "#111";


        box.style.color =
            "#fff";


        box.style.padding =
            "25px";


        box.style.fontFamily =
            "Arial, sans-serif";


        box.style.borderRadius =
            "15px";


        box.innerHTML = `

            <h2>
                PET WORLD ERROR
            </h2>

            <p>
                Game start nahi ho saka.
            </p>

            <p>
                ${this.escapeHTML(
                    message
                )}
            </p>

            <button
                id="reload-game-button"
            >
                Reload Game
            </button>

        `;


        document.body.appendChild(
            box
        );


        const button =
            document.getElementById(
                "reload-game-button"
            );


        if (
            button
        ) {

            button.addEventListener(
                "click",
                () => {

                    location.reload();

                }
            );

        }

    }


    // =================================================
    // ESCAPE HTML
    // =================================================

    escapeHTML(
        text
    ) {

        const div =
            document.createElement(
                "div"
            );


        div.textContent =
            String(text);


        return div.innerHTML;

    }


    // =================================================
    // HUD STYLES
    // =================================================

    injectHUDStyles() {

        if (
            document.getElementById(
                "pet-world-hud-style"
            )
        ) {

            return;

        }


        const style =
            document.createElement(
                "style"
            );


        style.id =
            "pet-world-hud-style";


        style.textContent = `

            #game-hud {

                position: fixed;

                inset: 0;

                z-index: 100;

                pointer-events: none;

                font-family:
                    Arial,
                    sans-serif;

                color: white;

            }


            .hud-panel {

                position: absolute;

                top: 15px;

                left: 15px;

                width: 210px;

                padding: 12px;

                border-radius: 14px;

                background:
                    rgba(
                        8,
                        12,
                        16,
                        0.68
                    );

                backdrop-filter:
                    blur(8px);

                box-shadow:
                    0 8px 30px
                    rgba(
                        0,
                        0,
                        0,
                        0.35
                    );

            }


            .hud-row {

                display: flex;

                align-items: center;

                gap: 7px;

                margin-bottom: 7px;

                font-size: 13px;

                font-weight: 700;

            }


            .bar {

                flex: 1;

                height: 9px;

                overflow: hidden;

                border-radius: 20px;

                background:
                    rgba(
                        255,
                        255,
                        255,
                        0.16
                    );

            }


            .bar-fill {

                width: 100%;

                height: 100%;

                border-radius: inherit;

                transition:
                    width 0.15s
                    linear;

            }


            #health-bar {

                background:
                    #d94a4a;

            }


            #stamina-bar {

                background:
                    #4ca96b;

            }


            #hunger-bar {

                background:
                    #d99a43;

            }


            .level-text {

                margin-top: 9px;

                font-size: 14px;

            }


            .pet-text {

                margin-top: 5px;

                font-size: 13px;

            }


            #notification-container {

                position: absolute;

                top: 25px;

                left: 50%;

                transform:
                    translateX(-50%);

                display: flex;

                flex-direction: column;

                align-items: center;

                gap: 7px;

            }


            .game-notification {

                padding:
                    9px 16px;

                border-radius: 20px;

                background:
                    rgba(
                        10,
                        15,
                        20,
                        0.82
                    );

                border:
                    1px solid
                    rgba(
                        255,
                        255,
                        255,
                        0.12
                    );

                font-size: 13px;

                font-weight: 700;

                white-space: nowrap;

                transition:
                    opacity 0.25s,
                    transform 0.25s;

            }


            @media (
                max-width: 600px
            ) {

                .hud-panel {

                    top: 8px;

                    left: 8px;

                    width: 165px;

                    padding: 9px;

                }


                .hud-row {

                    font-size: 11px;

                    margin-bottom: 5px;

                }


                .bar {

                    height: 7px;

                }


                .level-text {

                    font-size: 12px;

                }


                .pet-text {

                    font-size: 11px;

                }

            }

        `;


        document.head.appendChild(
            style
        );

    }

}


// =====================================================
// START GAME
// =====================================================

window.addEventListener(
    "DOMContentLoaded",
    () => {

        const game =
            new PetWorldGame();


        window.petWorldGame =
            game;


        game.start();

    }
);
