export class GameUI {

    constructor(game) {

        this.game = game;

        this.inventoryOpen = false;

        this.mapOpen = false;

        this.petOpen = false;

        this.settingsOpen = false;

        this.initialized = false;

    }


    async init() {

        this.createUI();

        this.bindEvents();

        this.initialized = true;

    }


    createUI() {

        if (
            document.getElementById(
                "pet-world-ui"
            )
        ) {

            return;

        }


        const ui =
            document.createElement("div");

        ui.id =
            "pet-world-ui";

        ui.innerHTML = `

            <div id="pet-world-panels">

                <!-- INVENTORY -->

                <div
                    id="inventory-panel"
                    class="game-panel hidden"
                >

                    <div class="panel-header">

                        <span>🎒 INVENTORY</span>

                        <button
                            id="close-inventory"
                            class="close-button"
                        >
                            ×
                        </button>

                    </div>

                    <div
                        id="inventory-items"
                        class="inventory-grid"
                    ></div>

                </div>


                <!-- PETS -->

                <div
                    id="pets-panel"
                    class="game-panel hidden"
                >

                    <div class="panel-header">

                        <span>🐾 MY PETS</span>

                        <button
                            id="close-pets"
                            class="close-button"
                        >
                            ×
                        </button>

                    </div>

                    <div
                        id="pets-list"
                        class="pets-list"
                    ></div>

                </div>


                <!-- MAP -->

                <div
                    id="map-panel"
                    class="game-panel map-panel hidden"
                >

                    <div class="panel-header">

                        <span>🗺️ WORLD MAP</span>

                        <button
                            id="close-map"
                            class="close-button"
                        >
                            ×
                        </button>

                    </div>

                    <div
                        id="world-map"
                        class="world-map"
                    >

                        <div
                            id="player-map-marker"
                            class="player-map-marker"
                        >
                            ●
                        </div>

                    </div>

                </div>


                <!-- SETTINGS -->

                <div
                    id="settings-panel"
                    class="game-panel hidden"
                >

                    <div class="panel-header">

                        <span>⚙️ SETTINGS</span>

                        <button
                            id="close-settings"
                            class="close-button"
                        >
                            ×
                        </button>

                    </div>


                    <div class="settings-content">

                        <button
                            id="save-game-button"
                            class="settings-button"
                        >
                            💾 SAVE GAME
                        </button>


                        <button
                            id="reset-game-button"
                            class="settings-button danger"
                        >
                            🗑️ RESET GAME
                        </button>

                    </div>

                </div>

            </div>


            <!-- PET BUTTON -->

            <button
                id="pet-menu-button"
                class="floating-button pet-button"
            >
                🐾
            </button>


            <!-- INVENTORY BUTTON -->

            <button
                id="inventory-floating-button"
                class="floating-button inventory-button"
            >
                🎒
            </button>


            <!-- PET INFO -->

            <div
                id="active-pet-info"
                class="active-pet-info hidden"
            >

                <div
                    id="active-pet-name"
                    class="active-pet-name"
                >
                    No Pet
                </div>

                <div class="pet-health-bar">

                    <div
                        id="active-pet-health"
                    ></div>

                </div>

            </div>


            <!-- XP -->

            <div
                id="xp-container"
                class="xp-container"
            >

                <div class="xp-label">

                    <span>LEVEL</span>

                    <strong
                        id="ui-level"
                    >
                        1
                    </strong>

                </div>


                <div class="xp-bar">

                    <div
                        id="ui-xp-fill"
                    ></div>

                </div>

            </div>

        `;


        document.body.appendChild(ui);

        this.injectStyles();

    }


    bindEvents() {

        const inventoryButton =
            document.getElementById(
                "inventory-button"
            );


        const inventoryFloating =
            document.getElementById(
                "inventory-floating-button"
            );


        const petButton =
            document.getElementById(
                "pet-menu-button"
            );


        const mapButton =
            document.getElementById(
                "map-button"
            );


        const settingsButton =
            document.getElementById(
                "settings-button"
            );


        if (
            inventoryButton
        ) {

            inventoryButton.addEventListener(
                "click",
                () => {

                    this.toggleInventory();

                }
            );

        }


        if (
            inventoryFloating
        ) {

            inventoryFloating.addEventListener(
                "click",
                () => {

                    this.toggleInventory();

                }
            );

        }


        if (
            petButton
        ) {

            petButton.addEventListener(
                "click",
                () => {

                    this.togglePets();

                }
            );

        }


        if (
            mapButton
        ) {

            mapButton.addEventListener(
                "click",
                () => {

                    this.toggleMap();

                }
            );

        }


        if (
            settingsButton
        ) {

            settingsButton.addEventListener(
                "click",
                () => {

                    this.toggleSettings();

                }
            );

        }


        this.bindClose(
            "close-inventory",
            () => this.closeAll()
        );


        this.bindClose(
            "close-pets",
            () => this.closeAll()
        );


        this.bindClose(
            "close-map",
            () => this.closeAll()
        );


        this.bindClose(
            "close-settings",
            () => this.closeAll()
        );


        const saveButton =
            document.getElementById(
                "save-game-button"
            );


        if (
            saveButton
        ) {

            saveButton.addEventListener(
                "click",
                () => {

                    if (
                        this.game.systems
                    ) {

                        this.game.systems.saveGame();

                        this.notify(
                            "💾 Game saved"
                        );

                    }

                }
            );

        }


        const resetButton =
            document.getElementById(
                "reset-game-button"
            );


        if (
            resetButton
        ) {

            resetButton.addEventListener(
                "click",
                () => {

                    const confirmed =
                        window.confirm(
                            "Reset your complete game?"
                        );


                    if (
                        !confirmed
                    ) {

                        return;

                    }


                    if (
                        this.game.systems
                    ) {

                        this.game.systems.resetGame();

                    }

                }
            );

        }

    }


    bindClose(
        id,
        callback
    ) {

        const element =
            document.getElementById(id);


        if (
            element
        ) {

            element.addEventListener(
                "click",
                callback
            );

        }

    }


    toggleInventory() {

        this.closeAll();

        const panel =
            document.getElementById(
                "inventory-panel"
            );


        if (
            !panel
        ) {

            return;

        }


        panel.classList.remove(
            "hidden"
        );


        this.inventoryOpen =
            true;


        this.updateInventory();

    }


    togglePets() {

        this.closeAll();

        const panel =
            document.getElementById(
                "pets-panel"
            );


        if (
            !panel
        ) {

            return;

        }


        panel.classList.remove(
            "hidden"
        );


        this.petOpen =
            true;


        this.updatePets();

    }


    toggleMap() {

        this.closeAll();

        const panel =
            document.getElementById(
                "map-panel"
            );


        if (
            !panel
        ) {

            return;

        }


        panel.classList.remove(
            "hidden"
        );


        this.mapOpen =
            true;


        this.updateMap();

    }


    toggleSettings() {

        this.closeAll();

        const panel =
            document.getElementById(
                "settings-panel"
            );


        if (
            !panel
        ) {

            return;

        }


        panel.classList.remove(
            "hidden"
        );


        this.settingsOpen =
            true;

    }


    closeAll() {

        document
            .querySelectorAll(
                ".game-panel"
            )
            .forEach(
                panel => {

                    panel.classList.add(
                        "hidden"
                    );

                }
            );


        this.inventoryOpen =
            false;

        this.petOpen =
            false;

        this.mapOpen =
            false;

        this.settingsOpen =
            false;

    }


    updateInventory() {

        const container =
            document.getElementById(
                "inventory-items"
            );


        if (
            !container ||
            !this.game.systems
        ) {

            return;

        }


        container.innerHTML = "";


        const inventory =
            this.game.systems.inventory;


        const itemNames = {

            wood: "🪵 Wood",

            stone: "🪨 Stone",

            fiber: "🌿 Fiber",

            food: "🍖 Food",

            captureOrb: "🔵 Capture Orb",

            potion: "🧪 Potion"

        };


        Object.keys(inventory)
            .forEach(
                item => {

                    const amount =
                        inventory[item];


                    const slot =
                        document.createElement(
                            "div"
                        );


                    slot.className =
                        "inventory-slot";


                    slot.innerHTML = `

                        <div class="item-icon">

                            ${
                                item === "wood"
                                    ? "🪵"
                                    : item === "stone"
                                    ? "🪨"
                                    : item === "fiber"
                                    ? "🌿"
                                    : item === "food"
                                    ? "🍖"
                                    : item === "captureOrb"
                                    ? "🔵"
                                    : item === "potion"
                                    ? "🧪"
                                    : "📦"
                            }

                        </div>

                        <div class="item-name">

                            ${
                                itemNames[item] ||
                                item
                            }

                        </div>

                        <div class="item-count">

                            ${amount}

                        </div>

                    `;


                    container.appendChild(
                        slot
                    );

                }
            );

    }


    updatePets() {

        const container =
            document.getElementById(
                "pets-list"
            );


        if (
            !container ||
            !this.game.systems
        ) {

            return;

        }


        container.innerHTML = "";


        const pets =
            this.game.systems.pets;


        if (
            pets.length === 0
        ) {

            container.innerHTML = `

                <div class="empty-message">

                    🐾 No pets captured yet.

                    <br><br>

                    Explore the world and
                    capture your first pet!

                </div>

            `;


            return;

        }


        pets.forEach(
            pet => {

                const card =
                    document.createElement(
                        "div"
                    );


                card.className =
                    "pet-card";


                const active =
                    this.game.systems
                        .activePetId ===
                    pet.id;


                card.innerHTML = `

                    <div class="pet-avatar">

                        🐾

                    </div>


                    <div class="pet-details">

                        <strong>

                            ${this.escapeHTML(
                                pet.name
                            )}

                        </strong>

                        <span>

                            ${this.escapeHTML(
                                pet.rarity
                            )}

                        </span>

                        <span>

                            Level ${pet.level}

                        </span>

                    </div>


                    <button
                        class="pet-select-button"
                        data-pet-id="${this.escapeHTML(
                            pet.id
                        )}"
                    >

                        ${
                            active
                                ? "ACTIVE"
                                : "USE"
                        }

                    </button>

                `;


                container.appendChild(
                    card
                );

            }
        );


        container
            .querySelectorAll(
                ".pet-select-button"
            )
            .forEach(
                button => {

                    button.addEventListener(
                        "click",
                        () => {

                            const petId =
                                button.dataset
                                    .petId;


                            this.game.systems
                                .setActivePet(
                                    petId
                                );


                            this.updatePets();

                            this.updateActivePet();

                        }
                    );

                }
            );

    }


    updateActivePet() {

        const info =
            document.getElementById(
                "active-pet-info"
            );


        const name =
            document.getElementById(
                "active-pet-name"
            );


        const health =
            document.getElementById(
                "active-pet-health"
            );


        if (
            !info ||
            !this.game.systems
        ) {

            return;

        }


        const pet =
            this.game.systems
                .getActivePet();


        if (
            !pet
        ) {

            info.classList.add(
                "hidden"
            );

            return;

        }


        info.classList.remove(
            "hidden"
        );


        if (
            name
        ) {

            name.textContent =
                pet.name;

        }


        if (
            health
        ) {

            const percent =
                Math.max(
                    0,
                    Math.min(
                        100,
                        (
                            pet.health /
                            Math.max(
                                1,
                                pet.maxHealth
                            )
                        ) *
                        100
                    )
                );


            health.style.width =
                `${percent}%`;

        }

    }


    updateXP() {

        if (
            !this.game.systems
        ) {

            return;

        }


        const level =
            document.getElementById(
                "ui-level"
            );


        const fill =
            document.getElementById(
                "ui-xp-fill"
            );


        if (
            level
        ) {

            level.textContent =
                this.game.systems.level;

        }


        if (
            fill
        ) {

            const percent =
                (
                    this.game.systems.xp /
                    Math.max(
                        1,
                        this.game.systems
                            .xpToNextLevel
                    )
                ) *
                100;


            fill.style.width =
                `${Math.max(
                    0,
                    Math.min(
                        100,
                        percent
                    )
                )}%`;

        }

    }


    updateMap() {

        const marker =
            document.getElementById(
                "player-map-marker"
            );


        if (
            !marker ||
            !this.game.player
        ) {

            return;

        }


        const position =
            this.game.player
                .getPosition();


        const worldSize =
            this.game.world &&
            this.game.world.size
                ? this.game.world.size
                : 500;


        const x =
            (
                position.x /
                worldSize
            ) *
            100;


        const z =
            (
                position.z /
                worldSize
            ) *
            100;


        marker.style.left =
            `${50 + x}%`;


        marker.style.top =
            `${50 + z}%`;

    }


    notify(
        message
    ) {

        if (
            this.game &&
            typeof
            this.game.showNotification ===
            "function"
        ) {

            this.game.showNotification(
                message
            );

            return;

        }


        let container =
            document.getElementById(
                "ui-notifications"
            );


        if (
            !container
        ) {

            container =
                document.createElement(
                    "div"
                );

            container.id =
                "ui-notifications";

            document.body.appendChild(
                container
            );

        }


        const item =
            document.createElement(
                "div"
            );


        item.className =
            "ui-notification";


        item.textContent =
            message;


        container.appendChild(
            item
        );


        setTimeout(
            () => {

                item.remove();

            },
            2500
        );

    }


    update(
        delta
    ) {

        this.updateXP();

        this.updateActivePet();

        if (
            this.mapOpen
        ) {

            this.updateMap();

        }


        if (
            this.inventoryOpen
        ) {

            this.updateInventory();

        }

    }


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


    injectStyles() {

        if (
            document.getElementById(
                "pet-world-ui-style"
            )
        ) {

            return;

        }


        const style =
            document.createElement(
                "style"
            );


        style.id =
            "pet-world-ui-style";


        style.textContent = `

            #pet-world-ui {

                position: fixed;

                inset: 0;

                z-index: 150;

                pointer-events: none;

                font-family:
                    Arial,
                    Helvetica,
                    sans-serif;

            }


            .game-panel {

                position: absolute;

                left: 50%;

                top: 50%;

                transform:
                    translate(
                        -50%,
                        -50%
                    );

                width:
                    min(
                        520px,
                        90vw
                    );

                max-height:
                    80vh;

                overflow-y: auto;

                padding: 18px;

                border-radius: 18px;

                background:
                    rgba(
                        7,
                        14,
                        19,
                        0.94
                    );

                border:
                    1px solid
                    rgba(
                        255,
                        255,
                        255,
                        0.12
                    );

                box-shadow:
                    0 25px 70px
                    rgba(
                        0,
                        0,
                        0,
                        0.55
                    );

                color: white;

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

                margin-bottom: 16px;

                font-weight: 800;

                letter-spacing: 1px;

            }


            .close-button {

                width: 32px;

                height: 32px;

                border: 0;

                border-radius: 50%;

                background:
                    rgba(
                        255,
                        255,
                        255,
                        0.12
                    );

                color: white;

                font-size: 22px;

                cursor: pointer;

            }


            .inventory-grid {

                display: grid;

                grid-template-columns:
                    repeat(
                        3,
                        1fr
                    );

                gap: 10px;

            }


            .inventory-slot {

                position: relative;

                min-height: 110px;

                padding: 12px;

                border-radius: 14px;

                background:
                    rgba(
                        255,
                        255,
                        255,
                        0.06
                    );

                border:
                    1px solid
                    rgba(
                        255,
                        255,
                        255,
                        0.08
                    );

                text-align: center;

            }


            .item-icon {

                font-size: 34px;

            }


            .item-name {

                margin-top: 6px;

                font-size: 11px;

                opacity: 0.75;

            }


            .item-count {

                position: absolute;

                top: 7px;

                right: 8px;

                font-weight: 800;

            }


            .pets-list {

                display: flex;

                flex-direction: column;

                gap: 9px;

            }


            .pet-card {

                display: flex;

                align-items: center;

                gap: 12px;

                padding: 11px;

                border-radius: 13px;

                background:
                    rgba(
                        255,
                        255,
                        255,
                        0.06
                    );

            }


            .pet-avatar {

                width: 48px;

                height: 48px;

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

                font-size: 27px;

            }


            .pet-details {

                display: flex;

                flex-direction: column;

                flex: 1;

                gap: 2px;

            }


            .pet-details span {

                font-size: 11px;

                opacity: 0.6;

            }


            .pet-select-button {

                border: 0;

                border-radius: 9px;

                padding: 8px 10px;

                background: white;

                color: #111;

                font-weight: 800;

                font-size: 10px;

                cursor: pointer;

            }


            .empty-message {

                padding: 30px 10px;

                text-align: center;

                color:
                    rgba(
                        255,
                        255,
                        255,
                        0.6
                    );

                line-height: 1.5;

            }


            .map-panel {

                width:
                    min(
                        600px,
                        92vw
                    );

            }


            .world-map {

                position: relative;

                width: 100%;

                aspect-ratio: 1 / 1;

                overflow: hidden;

                border-radius: 14px;

                background:
                    radial-gradient(
                        circle,
                        #36553c,
                        #172a25
                    );

                border:
                    2px solid
                    rgba(
                        255,
                        255,
                        255,
                        0.12
                    );

            }


            .world-map::before {

                content: "";

                position: absolute;

                inset: 0;

                background-image:
                    linear-gradient(
                        rgba(
                            255,
                            255,
                            255,
                            0.05
                        ) 1px,
                        transparent 1px
                    ),
                    linear-gradient(
                        90deg,
                        rgba(
                            255,
                            255,
                            255,
                            0.05
                        ) 1px,
                        transparent 1px
                    );

                background-size:
                    10% 10%;

            }


            .player-map-marker {

                position: absolute;

                transform:
                    translate(
                        -50%,
                        -50%
                    );

                color: white;

                font-size: 25px;

                text-shadow:
                    0 0 10px
                    black;

            }


            .floating-button {

                position: absolute;

                bottom: 210px;

                width: 48px;

                height: 48px;

                border-radius: 50%;

                border:
                    1px solid
                    rgba(
                        255,
                        255,
                        255,
                        0.15
                    );

                background:
                    rgba(
                        8,
                        15,
                        20,
                        0.72
                    );

                color: white;

                font-size: 20px;

                pointer-events: auto;

                cursor: pointer;

            }


            .inventory-button {

                right: 15px;

                display: none;

            }


            .pet-button {

                right: 15px;

                bottom: 265px;

            }


            .active-pet-info {

                position: absolute;

                left: 50%;

                top: 15px;

                transform:
                    translateX(-50%);

                width: 170px;

                padding: 8px;

                border-radius: 12px;

                background:
                    rgba(
                        5,
                        12,
                        16,
                        0.7
                    );

                text-align: center;

                color: white;

            }


            .active-pet-name {

                font-size: 12px;

                font-weight: 800;

                margin-bottom: 5px;

            }


            .pet-health-bar {

                width: 100%;

                height: 6px;

                border-radius: 10px;

                overflow: hidden;

                background:
                    rgba(
                        255,
                        255,
                        255,
                        0.15
                    );

            }


            #active-pet-health {

                width: 100%;

                height: 100%;

                background: #61b56f;

            }


            .xp-container {

                position: absolute;

                left: 50%;

                bottom: 12px;

                transform:
                    translateX(-50%);

                width:
                    min(
                        300px,
                        45vw
                    );

                pointer-events: none;

            }


            .xp-label {

                display: flex;

                justify-content:
                    space-between;

                color: white;

                font-size: 10px;

                margin-bottom: 4px;

            }


            .xp-bar {

                height: 6px;

                border-radius: 10px;

                overflow: hidden;

                background:
                    rgba(
                        255,
                        255,
                        255,
                        0.15
                    );

            }


            #ui-xp-fill {

                width: 0%;

                height: 100%;

                background: white;

            }


            .settings-content {

                display: flex;

                flex-direction: column;

                gap: 10px;

            }


            .settings-button {

                padding: 13px;

                border: 0;

                border-radius: 11px;

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


            .settings-button.danger {

                background:
                    rgba(
                        170,
                        50,
                        50,
                        0.5
                    );

            }


            #ui-notifications {

                position: fixed;

                top: 80px;

                left: 50%;

                transform:
                    translateX(-50%);

                display: flex;

                flex-direction: column;

                gap: 7px;

                z-index: 9999;

                pointer-events: none;

            }


            .ui-notification {

                padding:
                    9px 16px;

                border-radius: 20px;

                background:
                    rgba(
                        5,
                        12,
                        16,
                        0.85
                    );

                color: white;

                font-size: 12px;

            }


            @media (
                max-width: 600px
            ) {

                .game-panel {

                    width: 92vw;

                    max-height: 78vh;

                    padding: 14px;

                }


                .inventory-grid {

                    grid-template-columns:
                        repeat(
                            2,
                            1fr
                        );

                }


                .pet-button {

                    bottom: 220px;

                }


                .xp-container {

                    bottom: 8px;

                    width: 42vw;

                }


                .active-pet-info {

                    top: 75px;

                }

            }

        `;


        document.head.appendChild(
            style
        );

    }

}
