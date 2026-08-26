export class GameUI {

    constructor(game) {

        this.game = game;

        this.root = null;

        this.notificationBox = null;

        this.healthFill = null;

        this.staminaFill = null;

        this.hungerFill = null;

        this.levelText = null;

        this.xpText = null;

        this.petText = null;

        this.inventoryPanel = null;

        this.petPanel = null;

        this.pausePanel = null;

        this.isInventoryOpen = false;

        this.isPetPanelOpen = false;

        this.isPaused = false;

    }


    // =================================================
    // INITIALIZE
    // =================================================

    async init() {

        this.createInterface();

        this.updateStats(
            this.game.systems
        );

    }


    // =================================================
    // MAIN INTERFACE
    // =================================================

    createInterface() {

        this.root =
            document.createElement(
                "div"
            );


        this.root.id =
            "game-ui";


        document.body.appendChild(
            this.root
        );


        this.createTopHUD();

        this.createCrosshair();

        this.createActionButtons();

        this.createMobileControls();

        this.createNotificationBox();

        this.createInventoryPanel();

        this.createPetPanel();

        this.createPausePanel();

        this.injectStyles();

    }


    // =================================================
    // TOP HUD
    // =================================================

    createTopHUD() {

        const hud =
            document.createElement(
                "div"
            );


        hud.className =
            "top-hud";


        // Player stats

        const playerStats =
            document.createElement(
                "div"
            );


        playerStats.className =
            "player-stats";


        // Health

        playerStats.innerHTML = `

            <div class="stat-row">

                <span class="stat-icon">
                    ❤️
                </span>

                <div class="stat-bar">

                    <div
                        id="health-fill"
                        class="stat-fill health-fill"
                    ></div>

                </div>

            </div>


            <div class="stat-row">

                <span class="stat-icon">
                    ⚡
                </span>

                <div class="stat-bar">

                    <div
                        id="stamina-fill"
                        class="stat-fill stamina-fill"
                    ></div>

                </div>

            </div>


            <div class="stat-row">

                <span class="stat-icon">
                    🍖
                </span>

                <div class="stat-bar">

                    <div
                        id="hunger-fill"
                        class="stat-fill hunger-fill"
                    ></div>

                </div>

            </div>

        `;


        hud.appendChild(
            playerStats
        );


        // Level

        const levelBox =
            document.createElement(
                "div"
            );


        levelBox.className =
            "level-box";


        levelBox.innerHTML = `

            <div id="level-text">
                LV 1
            </div>

            <div id="xp-text">
                XP 0 / 100
            </div>

        `;


        hud.appendChild(
            levelBox
        );


        // Pet

        const petBox =
            document.createElement(
                "div"
            );


        petBox.className =
            "active-pet-box";


        petBox.innerHTML = `

            <div class="pet-title">
                🐾 ACTIVE PET
            </div>

            <div id="pet-text">
                No Pet
            </div>

        `;


        hud.appendChild(
            petBox
        );


        this.root.appendChild(
            hud
        );


        this.healthFill =
            document.getElementById(
                "health-fill"
            );


        this.staminaFill =
            document.getElementById(
                "stamina-fill"
            );


        this.hungerFill =
            document.getElementById(
                "hunger-fill"
            );


        this.levelText =
            document.getElementById(
                "level-text"
            );


        this.xpText =
            document.getElementById(
                "xp-text"
            );


        this.petText =
            document.getElementById(
                "pet-text"
            );

    }


    // =================================================
    // CROSSHAIR
    // =================================================

    createCrosshair() {

        const crosshair =
            document.createElement(
                "div"
            );


        crosshair.id =
            "crosshair";


        crosshair.innerHTML =
            "+";


        this.root.appendChild(
            crosshair
        );

    }


    // =================================================
    // ACTION BUTTONS
    // =================================================

    createActionButtons() {

        const container =
            document.createElement(
                "div"
            );


        container.className =
            "action-buttons";


        // Capture

        const capture =
            this.createButton(
                "🎯",
                "CAPTURE",
                () => {

                    if (
                        this.game.systems
                    ) {

                        this.game.systems
                            .captureNearestCreature();

                    }

                }
            );


        capture.id =
            "capture-button";


        // Attack

        const attack =
            this.createButton(
                "⚔️",
                "ATTACK",
                () => {

                    this.playerAttack();

                }
            );


        attack.id =
            "attack-button";


        // Pet

        const pet =
            this.createButton(
                "🐾",
                "PETS",
                () => {

                    this.togglePetPanel();

                }
            );


        // Inventory

        const inventory =
            this.createButton(
                "🎒",
                "BAG",
                () => {

                    this.toggleInventory();

                }
            );


        // Map

        const map =
            this.createButton(
                "🗺️",
                "MAP",
                () => {

                    this.notify(
                        "Map system coming soon."
                    );

                }
            );


        // Pause

        const pause =
            this.createButton(
                "⏸️",
                "PAUSE",
                () => {

                    this.togglePause();

                }
            );


        container.appendChild(
            capture
        );

        container.appendChild(
            attack
        );

        container.appendChild(
            pet
        );

        container.appendChild(
            inventory
        );

        container.appendChild(
            map
        );

        container.appendChild(
            pause
        );


        this.root.appendChild(
            container
        );

    }


    // =================================================
    // BUTTON
    // =================================================

    createButton(
        icon,
        text,
        callback
    ) {

        const button =
            document.createElement(
                "button"
            );


        button.className =
            "game-button";


        button.innerHTML = `

            <span class="button-icon">
                ${icon}
            </span>

            <span class="button-text">
                ${text}
            </span>

        `;


        button.addEventListener(
            "pointerdown",
            event => {

                event.preventDefault();

                callback();

            }
        );


        return button;

    }


    // =================================================
    // ATTACK
    // =================================================

    playerAttack() {

        const creatures =
            this.game.creatures;


        if (
            !creatures
        ) {

            return;

        }


        const creature =
            creatures.getNearestCreature(
                4
            );


        if (
            !creature
        ) {

            this.notify(
                "No creature in attack range."
            );

            return;

        }


        creatures.damageCreature(
            creature,
            25
        );


        this.notify(
            `You attacked ${creature.name}!`
        );

    }


    // =================================================
    // MOBILE CONTROLS
    // =================================================

    createMobileControls() {

        const joystick =
            document.createElement(
                "div"
            );


        joystick.id =
            "mobile-joystick";


        joystick.innerHTML = `

            <div id="joystick-base">

                <div id="joystick-stick">
                </div>

            </div>

        `;


        this.root.appendChild(
            joystick
        );


        this.setupJoystick();

    }


    // =================================================
    // JOYSTICK
    // =================================================

    setupJoystick() {

        const base =
            document.getElementById(
                "joystick-base"
            );


        const stick =
            document.getElementById(
                "joystick-stick"
            );


        let active =
            false;


        let pointerId =
            null;


        const radius =
            48;


        const updateJoystick =
            event => {

                if (
                    !active ||
                    event.pointerId !==
                    pointerId
                ) {

                    return;

                }


                const rect =
                    base.getBoundingClientRect();


                const centerX =
                    rect.left +
                    rect.width / 2;


                const centerY =
                    rect.top +
                    rect.height / 2;


                let x =
                    event.clientX -
                    centerX;


                let y =
                    event.clientY -
                    centerY;


                const distance =
                    Math.sqrt(
                        x * x +
                        y * y
                    );


                if (
                    distance >
                    radius
                ) {

                    x =
                        x /
                        distance *
                        radius;

                    y =
                        y /
                        distance *
                        radius;

                }


                stick.style.transform =
                    `translate(${x}px, ${y}px)`;


                if (
                    this.game.player
                ) {

                    this.game.player
                        .mobileMoveX =
                        x / radius;


                    this.game.player
                        .mobileMoveZ =
                        y / radius;

                }

            };


        const stopJoystick =
            event => {

                if (
                    event.pointerId !==
                    pointerId
                ) {

                    return;

                }


                active =
                    false;


                pointerId =
                    null;


                stick.style.transform =
                    "translate(0px, 0px)";


                if (
                    this.game.player
                ) {

                    this.game.player
                        .mobileMoveX =
                        0;


                    this.game.player
                        .mobileMoveZ =
                        0;

                }

            };


        base.addEventListener(
            "pointerdown",
            event => {

                event.preventDefault();


                active =
                    true;


                pointerId =
                    event.pointerId;


                base.setPointerCapture(
                    event.pointerId
                );


                updateJoystick(
                    event
                );

            }
        );


        base.addEventListener(
            "pointermove",
            updateJoystick
        );


        base.addEventListener(
            "pointerup",
            stopJoystick
        );


        base.addEventListener(
            "pointercancel",
            stopJoystick
        );

    }


    // =================================================
    // NOTIFICATIONS
    // =================================================

    createNotificationBox() {

        this.notificationBox =
            document.createElement(
                "div"
            );


        this.notificationBox.id =
            "notification-box";


        this.root.appendChild(
            this.notificationBox
        );

    }


    notify(
        message,
        duration = 2500
    ) {

        if (
            !this.notificationBox
        ) {

            return;

        }


        const notification =
            document.createElement(
                "div"
            );


        notification.className =
            "notification";


        notification.textContent =
            message;


        this.notificationBox.appendChild(
            notification
        );


        setTimeout(
            () => {

                notification.classList.add(
                    "hide"
                );


                setTimeout(
                    () => {

                        notification.remove();

                    },
                    300
                );

            },
            duration
        );

    }


    // =================================================
    // INVENTORY PANEL
    // =================================================

    createInventoryPanel() {

        this.inventoryPanel =
            document.createElement(
                "div"
            );


        this.inventoryPanel.id =
            "inventory-panel";


        this.inventoryPanel.className =
            "game-panel hidden";


        this.inventoryPanel.innerHTML = `

            <div class="panel-header">

                <h2>
                    🎒 INVENTORY
                </h2>

                <button
                    id="inventory-close"
                    class="close-button"
                >
                    ✕
                </button>

            </div>

            <div
                id="inventory-content"
                class="panel-content"
            ></div>

        `;


        this.root.appendChild(
            this.inventoryPanel
        );


        document
            .getElementById(
                "inventory-close"
            )
            .addEventListener(
                "click",
                () => {

                    this.toggleInventory(
                        false
                    );

                }
            );

    }


    // =================================================
    // UPDATE INVENTORY
    // =================================================

    updateInventory() {

        const content =
            document.getElementById(
                "inventory-content"
            );


        if (
            !content ||
            !this.game.systems
        ) {

            return;

        }


        const inventory =
            this.game.systems.inventory;


        content.innerHTML =
            "";


        for (
            const [
                item,
                amount
            ]
            of Object.entries(
                inventory
            )
        ) {

            const row =
                document.createElement(
                    "div"
                );


            row.className =
                "inventory-item";


            row.innerHTML = `

                <span>
                    ${this.getItemIcon(item)}
                    ${this.formatItemName(item)}
                </span>

                <strong>
                    ${amount}
                </strong>

            `;


            content.appendChild(
                row
            );

        }

    }


    // =================================================
    // ITEM ICON
    // =================================================

    getItemIcon(
        item
    ) {

        const icons = {

            captureOrb:
                "🎯",

            food:
                "🍖",

            wood:
                "🪵",

            stone:
                "🪨",

            fiber:
                "🌿",

            crystal:
                "💎"

        };


        return (
            icons[item] ||
            "📦"
        );

    }


    // =================================================
    // FORMAT ITEM
    // =================================================

    formatItemName(
        item
    ) {

        return item
            .replace(
                /([A-Z])/g,
                " $1"
            )
            .replace(
                /^./,
                character =>
                    character.toUpperCase()
            );

    }


    // =================================================
    // PET PANEL
    // =================================================

    createPetPanel() {

        this.petPanel =
            document.createElement(
                "div"
            );


        this.petPanel.id =
            "pet-panel";


        this.petPanel.className =
            "game-panel hidden";


        this.petPanel.innerHTML = `

            <div class="panel-header">

                <h2>
                    🐾 MY PETS
                </h2>

                <button
                    id="pet-close"
                    class="close-button"
                >
                    ✕
                </button>

            </div>

            <div
                id="pet-content"
                class="panel-content"
            ></div>

        `;


        this.root.appendChild(
            this.petPanel
        );


        document
            .getElementById(
                "pet-close"
            )
            .addEventListener(
                "click",
                () => {

                    this.togglePetPanel(
                        false
                    );

                }
            );

    }


    // =================================================
    // UPDATE PET PANEL
    // =================================================

    updatePetPanel() {

        const content =
            document.getElementById(
                "pet-content"
            );


        if (
            !content ||
            !this.game.systems
        ) {

            return;

        }


        content.innerHTML =
            "";


        const pets =
            this.game.systems.pets;


        if (
            pets.length === 0
        ) {

            content.innerHTML = `

                <div class="empty-message">

                    No pets captured yet.

                    <br><br>

                    Find a wild creature
                    and use CAPTURE.

                </div>

            `;


            return;

        }


        for (
            const pet
            of pets
        ) {

            const card =
                document.createElement(
                    "div"
                );


            card.className =
                "pet-card";


            const active =
                pet.id ===
                this.game.systems.activePetId;


            card.innerHTML = `

                <div class="pet-card-icon">
                    🐾
                </div>

                <div class="pet-card-info">

                    <strong>
                        ${pet.name}
                    </strong>

                    <span>
                        Lv ${pet.level}
                        • ${pet.rarity}
                    </span>

                    <span>
                        ❤️ ${Math.round(pet.health)}
                        /
                        ${pet.maxHealth}
                    </span>

                </div>

                <button
                    class="pet-select-button"
                >
                    ${
                        active
                            ? "ACTIVE"
                            : "USE"
                    }
                </button>

            `;


            const selectButton =
                card.querySelector(
                    ".pet-select-button"
                );


            if (
                active
            ) {

                selectButton.disabled =
                    true;

            } else {

                selectButton.addEventListener(
                    "click",
                    () => {

                        this.game.systems
                            .setActivePet(
                                pet.id
                            );


                        this.updatePetPanel();

                    }
                );

            }


            content.appendChild(
                card
            );

        }

    }


    // =================================================
    // PAUSE PANEL
    // =================================================

    createPausePanel() {

        this.pausePanel =
            document.createElement(
                "div"
            );


        this.pausePanel.id =
            "pause-panel";


        this.pausePanel.className =
            "game-panel hidden";


        this.pausePanel.innerHTML = `

            <div class="pause-content">

                <h1>
                    PET WORLD
                </h1>

                <p>
                    GAME PAUSED
                </p>

                <button
                    id="resume-button"
                    class="large-button"
                >
                    ▶ RESUME
                </button>

                <button
                    id="save-button"
                    class="large-button"
                >
                    💾 SAVE GAME
                </button>

            </div>

        `;


        this.root.appendChild(
            this.pausePanel
        );


        document
            .getElementById(
                "resume-button"
            )
            .addEventListener(
                "click",
                () => {

                    this.togglePause(
                        false
                    );

                }
            );


        document
            .getElementById(
                "save-button"
            )
            .addEventListener(
                "click",
                () => {

                    if (
                        this.game.systems
                    ) {

                        this.game.systems
                            .saveGame();

                    }


                    this.notify(
                        "Game saved."
                    );

                }
            );

    }


    // =================================================
    // TOGGLE INVENTORY
    // =================================================

    toggleInventory(
        force
    ) {

        if (
            typeof force ===
            "boolean"
        ) {

            this.isInventoryOpen =
                force;

        } else {

            this.isInventoryOpen =
                !this.isInventoryOpen;

        }


        if (
            this.isInventoryOpen
        ) {

            this.isPetPanelOpen =
                false;

            this.updateInventory();

        }


        this.inventoryPanel
            .classList.toggle(
                "hidden",
                !this.isInventoryOpen
            );


        this.petPanel
            .classList.add(
                "hidden"
            );

    }


    // =================================================
    // TOGGLE PET
    // =================================================

    togglePetPanel(
        force
    ) {

        if (
            typeof force ===
            "boolean"
        ) {

            this.isPetPanelOpen =
                force;

        } else {

            this.isPetPanelOpen =
                !this.isPetPanelOpen;

        }


        if (
            this.isPetPanelOpen
        ) {

            this.isInventoryOpen =
                false;

            this.updatePetPanel();

        }


        this.petPanel
            .classList.toggle(
                "hidden",
                !this.isPetPanelOpen
            );


        this.inventoryPanel
            .classList.add(
                "hidden"
            );

    }


    // =================================================
    // PAUSE
    // =================================================

    togglePause(
        force
    ) {

        if (
            typeof force ===
            "boolean"
        ) {

            this.isPaused =
                force;

        } else {

            this.isPaused =
                !this.isPaused;

        }


        this.pausePanel
            .classList.toggle(
                "hidden",
                !this.isPaused
            );


        if (
            this.game.systems
        ) {

            if (
                this.isPaused
            ) {

                this.game.systems
                    .pause();

            } else {

                this.game.systems
                    .resume();

            }

        }

    }


    // =================================================
    // UPDATE STATS
    // =================================================

    updateStats(
        systems
    ) {

        if (
            !systems
        ) {

            return;

        }


        const player =
            this.game.player;


        if (
            player
        ) {

            this.setBar(
                this.healthFill,
                player.health,
                player.maxHealth
            );


            this.setBar(
                this.staminaFill,
                player.stamina,
                player.maxStamina
            );


            this.setBar(
                this.hungerFill,
                player.hunger,
                player.maxHunger
            );

        }


        if (
            this.levelText
        ) {

            this.levelText.textContent =
                `LV ${systems.level}`;

        }


        if (
            this.xpText
        ) {

            this.xpText.textContent =
                `XP ${Math.floor(
                    systems.xp
                )} / ${systems.xpToNextLevel}`;

        }


        const activePet =
            systems.getActivePet();


        if (
            this.petText
        ) {

            if (
                activePet
            ) {

                this.petText.textContent =
                    `${activePet.name} • LV ${activePet.level}`;

            } else {

                this.petText.textContent =
                    "No Pet";

            }

        }

    }


    // =================================================
    // BAR
    // =================================================

    setBar(
        element,
        value,
        max
    ) {

        if (
            !element
        ) {

            return;

        }


        if (
            !Number.isFinite(
                value
            ) ||
            !Number.isFinite(
                max
            ) ||
            max <= 0
        ) {

            element.style.width =
                "0%";


            return;

        }


        const percent =
            Math.max(
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


        element.style.width =
            `${percent}%`;

    }


    // =================================================
    // UPDATE
    // =================================================

    update(
        delta
    ) {

        if (
            this.game.systems
        ) {

            this.updateStats(
                this.game.systems
            );

        }

    }


    // =================================================
    // CSS
    // =================================================

    injectStyles() {

        const style =
            document.createElement(
                "style"
            );


        style.textContent = `

            * {
                box-sizing: border-box;
                -webkit-tap-highlight-color: transparent;
            }


            #game-ui {

                position: fixed;

                inset: 0;

                z-index: 100;

                pointer-events: none;

                font-family:
                    Arial,
                    Helvetica,
                    sans-serif;

                color: white;

                user-select: none;

            }


            button {

                font-family:
                    inherit;

            }


            .top-hud {

                position: absolute;

                top: 15px;

                left: 15px;

                right: 15px;

                display: flex;

                justify-content:
                    space-between;

                align-items: flex-start;

                gap: 10px;

            }


            .player-stats {

                width:
                    min(190px, 34vw);

                padding: 10px;

                border-radius: 14px;

                background:
                    rgba(
                        0,
                        0,
                        0,
                        0.42
                    );

                backdrop-filter:
                    blur(8px);

            }


            .stat-row {

                display: flex;

                align-items: center;

                gap: 6px;

                margin-bottom: 6px;

            }


            .stat-row:last-child {

                margin-bottom: 0;

            }


            .stat-icon {

                width: 18px;

                font-size: 13px;

                text-align: center;

            }


            .stat-bar {

                flex: 1;

                height: 7px;

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


            .stat-fill {

                width: 100%;

                height: 100%;

                transition:
                    width 0.2s linear;

            }


            .health-fill {

                background:
                    #e84c4c;

            }


            .stamina-fill {

                background:
                    #e8c84c;

            }


            .hunger-fill {

                background:
                    #e8934c;

            }


            .level-box {

                padding: 10px 14px;

                border-radius: 14px;

                text-align: center;

                background:
                    rgba(
                        0,
                        0,
                        0,
                        0.42
                    );

                backdrop-filter:
                    blur(8px);

            }


            #level-text {

                font-weight: 900;

                font-size: 17px;

            }


            #xp-text {

                margin-top: 3px;

                font-size: 10px;

                opacity: 0.7;

            }


            .active-pet-box {

                min-width:
                    125px;

                padding: 9px 12px;

                border-radius: 14px;

                text-align: center;

                background:
                    rgba(
                        0,
                        0,
                        0,
                        0.42
                    );

                backdrop-filter:
                    blur(8px);

            }


            .pet-title {

                font-size: 9px;

                opacity: 0.65;

                letter-spacing: 1px;

            }


            #pet-text {

                margin-top: 3px;

                font-size: 12px;

                font-weight: 700;

            }


            #crosshair {

                position: absolute;

                left: 50%;

                top: 50%;

                transform:
                    translate(
                        -50%,
                        -50%
                    );

                font-size: 22px;

                font-weight: 300;

                opacity: 0.8;

                text-shadow:
                    0 1px 4px
                    black;

            }


            .action-buttons {

                position: absolute;

                right: 18px;

                bottom: 25px;

                display: flex;

                flex-direction: column;

                gap: 9px;

                pointer-events: auto;

            }


            .game-button {

                width: 66px;

                height: 58px;

                border: 1px solid
                    rgba(
                        255,
                        255,
                        255,
                        0.15
                    );

                border-radius: 17px;

                background:
                    rgba(
                        12,
                        18,
                        22,
                        0.72
                    );

                color: white;

                box-shadow:
                    0 5px 18px
                    rgba(
                        0,
                        0,
                        0,
                        0.3
                    );

                display: flex;

                flex-direction: column;

                justify-content:
                    center;

                align-items: center;

                cursor: pointer;

                touch-action: manipulation;

            }


            .game-button:active {

                transform:
                    scale(0.92);

            }


            .button-icon {

                font-size: 21px;

            }


            .button-text {

                margin-top: 2px;

                font-size: 7px;

                font-weight: 800;

                letter-spacing: 0.7px;

            }


            #mobile-joystick {

                position: absolute;

                left: 20px;

                bottom: 28px;

                pointer-events: auto;

                touch-action: none;

            }


            #joystick-base {

                width: 130px;

                height: 130px;

                border-radius: 50%;

                background:
                    rgba(
                        255,
                        255,
                        255,
                        0.08
                    );

                border: 2px solid
                    rgba(
                        255,
                        255,
                        255,
                        0.18
                    );

                position: relative;

                touch-action: none;

            }


            #joystick-stick {

                position: absolute;

                left: 50%;

                top: 50%;

                width: 58px;

                height: 58px;

                margin-left: -29px;

                margin-top: -29px;

                border-radius: 50%;

                background:
                    rgba(
                        255,
                        255,
                        255,
                        0.24
                    );

                border: 2px solid
                    rgba(
                        255,
                        255,
                        255,
                        0.35
                    );

                pointer-events: none;

            }


            .game-panel {

                position: absolute;

                left: 50%;

                top: 50%;

                width:
                    min(
                        430px,
                        90vw
                    );

                max-height:
                    80vh;

                overflow-y: auto;

                transform:
                    translate(
                        -50%,
                        -50%
                    );

                border-radius: 22px;

                padding: 18px;

                background:
                    rgba(
                        12,
                        18,
                        22,
                        0.94
                    );

                border: 1px solid
                    rgba(
                        255,
                        255,
                        255,
                        0.12
                    );

                box-shadow:
                    0 20px 70px
                    rgba(
                        0,
                        0,
                        0,
                        0.6
                    );

                pointer-events: auto;

            }


            .hidden {

                display: none !important;

            }


            .panel-header {

                display: flex;

                justify-content:
                    space-between;

                align-items: center;

                margin-bottom: 14px;

            }


            .panel-header h2 {

                margin: 0;

                font-size: 19px;

            }


            .close-button {

                width: 35px;

                height: 35px;

                border: 0;

                border-radius: 10px;

                background:
                    rgba(
                        255,
                        255,
                        255,
                        0.08
                    );

                color: white;

                font-size: 17px;

                cursor: pointer;

            }


            .panel-content {

                display: flex;

                flex-direction: column;

                gap: 8px;

            }


            .inventory-item {

                display: flex;

                justify-content:
                    space-between;

                align-items: center;

                padding: 13px;

                border-radius: 12px;

                background:
                    rgba(
                        255,
                        255,
                        255,
                        0.06
                    );

                font-size: 14px;

            }


            .pet-card {

                display: flex;

                align-items: center;

                gap: 10px;

                padding: 10px;

                border-radius: 14px;

                background:
                    rgba(
                        255,
                        255,
                        255,
                        0.06
                    );

            }


            .pet-card-icon {

                width: 45px;

                height: 45px;

                display: flex;

                align-items: center;

                justify-content: center;

                border-radius: 12px;

                background:
                    rgba(
                        255,
                        255,
                        255,
                        0.08
                    );

                font-size: 25px;

            }


            .pet-card-info {

                flex: 1;

                display: flex;

                flex-direction: column;

                gap: 2px;

            }


            .pet-card-info strong {

                font-size: 14px;

            }


            .pet-card-info span {

                font-size: 10px;

                opacity: 0.65;

            }


            .pet-select-button {

                border: 0;

                border-radius: 10px;

                padding: 9px 10px;

                background:
                    rgba(
                        93,
                        183,
                        108,
                        0.8
                    );

                color: white;

                font-size: 9px;

                font-weight: 800;

                cursor: pointer;

            }


            .pet-select-button:disabled {

                opacity: 0.45;

                cursor: default;

            }


            .empty-message {

                text-align: center;

                padding: 30px 10px;

                opacity: 0.65;

                font-size: 13px;

            }


            #notification-box {

                position: absolute;

                left: 50%;

                top: 18%;

                transform:
                    translateX(-50%);

                display: flex;

                flex-direction: column;

                align-items: center;

                gap: 6px;

                width:
                    min(
                        90vw,
                        400px
                    );

            }


            .notification {

                padding: 10px 16px;

                border-radius: 12px;

                background:
                    rgba(
                        0,
                        0,
                        0,
                        0.75
                    );

                backdrop-filter:
                    blur(8px);

                font-size: 12px;

                animation:
                    notificationIn
                    0.25s ease;

            }


            .notification.hide {

                opacity: 0;

                transform:
                    translateY(
                        -8px
                    );

                transition:
                    all 0.3s ease;

            }


            @keyframes notificationIn {

                from {

                    opacity: 0;

                    transform:
                        translateY(
                            -10px
                        );

                }

                to {

                    opacity: 1;

                    transform:
                        translateY(0);

                }

            }


            .pause-content {

                text-align: center;

                padding: 20px;

            }


            .pause-content h1 {

                margin: 0;

                font-size: 30px;

                letter-spacing: 3px;

            }


            .pause-content p {

                opacity: 0.6;

                font-size: 12px;

                letter-spacing: 2px;

                margin-bottom: 25px;

            }


            .large-button {

                display: block;

                width: 100%;

                padding: 14px;

                margin-top: 10px;

                border: 0;

                border-radius: 12px;

                background:
                    rgba(
                        255,
                        255,
                        255,
                        0.1
                    );

                color: white;

                font-weight: 700;

                cursor: pointer;

            }


            @media (
                max-width: 600px
            ) {

                .top-hud {

                    top: 8px;

                    left: 8px;

                    right: 8px;

                }


                .player-stats {

                    width: 145px;

                    padding: 7px;

                }


                .level-box {

                    padding: 7px 9px;

                }


                .active-pet-box {

                    min-width: 90px;

                    padding: 7px;

                }


                .game-button {

                    width: 58px;

                    height: 53px;

                }


                .action-buttons {

                    right: 9px;

                    bottom: 15px;

                    gap: 6px;

                }


                #mobile-joystick {

                    left: 10px;

                    bottom: 15px;

                }


                #joystick-base {

                    width: 115px;

                    height: 115px;

                }

            }

        `;


        document.head.appendChild(
            style
        );

    }

}
