```javascript
// ============================================================
// PET WORLD
// public/js/ui.js
// Complete Game UI System
// ============================================================

export class GameUI {

    constructor(game) {

        this.game = game;

        this.inventoryOpen = false;
        this.mapOpen = false;
        this.petOpen = false;
        this.settingsOpen = false;
        this.statsOpen = false;
        this.initialized = false;

        this.lastInventoryUpdate = 0;
        this.lastMapUpdate = 0;
        this.lastXPUpdate = 0;
        this.lastPetUpdate = 0;

        this.notificationQueue = [];
        this.notificationsVisible = 0;

    }


    // ============================================================
    // INITIALIZE
    // ============================================================

    async init() {

        this.createUI();

        this.bindEvents();

        this.initialized = true;

        this.updateAll();

    }


    // ============================================================
    // CREATE UI
    // ============================================================

    createUI() {

        if (
            document.getElementById(
                "pet-world-ui"
            )
        ) {

            return;

        }


        const ui =
            document.createElement(
                "div"
            );


        ui.id =
            "pet-world-ui";


        ui.innerHTML = `

// =================================================
            <!-- TOP STATUS -->
            <!-- ================================================= -->

            <div
                id="top-status"
                class="top-status"
            >

                <div
                    id="player-status"
                    class="player-status"
                >

                    <div class="status-row">

                        <span>❤️</span>

                        <div class="status-bar">

                            <div
                                id="health-fill"
                                class="health-fill"
                            ></div>

                        </div>

                        <span
                            id="health-text"
                        >
                            100/100
                        </span>

                    </div>


                    <div class="status-row">

                        <span>⚡</span>

                        <div class="status-bar">

                            <div
                                id="stamina-fill"
                                class="stamina-fill"
                            ></div>

                        </div>

                        <span
                            id="stamina-text"
                        >
                            100/100
                        </span>

                    </div>


                    <div class="status-row">

                        <span>🍖</span>

                        <div class="status-bar">

                            <div
                                id="hunger-fill"
                                class="hunger-fill"
                            ></div>

                        </div>

                        <span
                            id="hunger-text"
                        >
                            100/100
                        </span>

                    </div>

                </div>


                <div
                    id="coin-display"
                    class="coin-display"
                >

                    🪙
                    <span id="ui-coins">
                        0
                    </span>

                </div>

            </div>


            <!-- ================================================= -->
            <!-- CROSSHAIR -->
            <!-- ================================================= -->

            <div
                id="crosshair"
                class="crosshair"
            >
                +
            </div>


            <!-- ================================================= -->
            <!-- ACTIVE PET -->
            <!-- ================================================= -->

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


                <div class="active-pet-level">

                    LV
                    <span
                        id="active-pet-level"
                    >
                        1
                    </span>

                </div>


                <div class="pet-health-bar">

                    <div
                        id="active-pet-health"
                    ></div>

                </div>


                <div
                    class="pet-hunger-small"
                >

                    <div
                        id="active-pet-hunger"
                    ></div>

                </div>

            </div>


            <!-- ================================================= -->
            <!-- XP -->
            <!-- ================================================= -->

            <div
                id="xp-container"
                class="xp-container"
            >

                <div class="xp-label">

                    <span>
                        LEVEL
                    </span>

                    <strong
                        id="ui-level"
                    >
                        1
                    </strong>

                    <span
                        id="xp-text"
                    >
                        0 / 100 XP
                    </span>

                </div>


                <div class="xp-bar">

                    <div
                        id="ui-xp-fill"
                    ></div>

                </div>

            </div>


            <!-- ================================================= -->
            <!-- ACTION BUTTONS -->
            <!-- ================================================= -->

            <div
                id="action-buttons"
                class="action-buttons"
            >

                <button
                    id="eat-button"
                    class="action-button"
                    title="Eat food"
                >
                    🍖
                </button>


                <button
                    id="potion-button"
                    class="action-button"
                    title="Use potion"
                >
                    🧪
                </button>


                <button
                    id="capture-button"
                    class="action-button"
                    title="Capture creature"
                >
                    🔵
                </button>

            </div>


            <!-- ================================================= -->
            <!-- MENU BUTTONS -->
            <!-- ================================================= -->

            <div
                id="menu-buttons"
                class="menu-buttons"
            >

                <button
                    id="inventory-floating-button"
                    class="floating-button"
                    title="Inventory"
                >
                    🎒
                </button>


                <button
                    id="pet-menu-button"
                    class="floating-button"
                    title="Pets"
                >
                    🐾
                </button>


                <button
                    id="map-button"
                    class="floating-button"
                    title="Map"
                >
                    🗺️
                </button>


                <button
                    id="settings-button"
                    class="floating-button"
                    title="Settings"
                >
                    ⚙️
                </button>

            </div>


            <!-- ================================================= -->
            <!-- PANELS -->
            <!-- ================================================= -->

            <div
                id="pet-world-panels"
            >


                <!-- INVENTORY -->

                <div
                    id="inventory-panel"
                    class="game-panel hidden"
                >

                    <div class="panel-header">

                        <span>
                            🎒 INVENTORY
                        </span>

                        <button
                            id="close-inventory"
                            class="close-button"
                        >
                            ×
                        </button>

                    </div>


                    <div
                        id="inventory-summary"
                        class="inventory-summary"
                    ></div>


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

                        <span>
                            🐾 MY PETS
                        </span>

                        <button
                            id="close-pets"
                            class="close-button"
                        >
                            ×
                        </button>

                    </div>


                    <div
                        id="pets-summary"
                        class="pets-summary"
                    ></div>


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

                        <span>
                            🗺️ WORLD MAP
                        </span>

                        <button
                            id="close-map"
                            class="close-button"
                        >
                            ×
                        </button>

                    </div>


                    <div
                        id="map-coordinates"
                        class="map-coordinates"
                    >
                        X: 0 | Z: 0
                    </div>


                    <div
                        id="world-map"
                        class="world-map"
                    >

                        <div class="map-grid"></div>

                        <div
                            id="player-map-marker"
                            class="player-map-marker"
                        >
                            ●
                        </div>

                    </div>


                    <div
                        id="discovered-count"
                        class="discovered-count"
                    >
                        Locations discovered: 0
                    </div>

                </div>


                <!-- STATS -->

                <div
                    id="stats-panel"
                    class="game-panel hidden"
                >

                    <div class="panel-header">

                        <span>
                            📊 STATISTICS
                        </span>

                        <button
                            id="close-stats"
                            class="close-button"
                        >
                            ×
                        </button>

                    </div>


                    <div
                        id="statistics-content"
                        class="statistics-content"
                    ></div>

                </div>


                <!-- SETTINGS -->

                <div
                    id="settings-panel"
                    class="game-panel hidden"
                >

                    <div class="panel-header">

                        <span>
                            ⚙️ SETTINGS
                        </span>

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
                            id="export-save-button"
                            class="settings-button"
                        >
                            📤 EXPORT SAVE
                        </button>


                        <button
                            id="import-save-button"
                            class="settings-button"
                        >
                            📥 IMPORT SAVE
                        </button>


                        <input
                            id="import-save-input"
                            type="file"
                            accept=".json,application/json"
                            hidden
                        />


                        <button
                            id="reset-game-button"
                            class="settings-button danger"
                        >
                            🗑️ RESET GAME
                        </button>

                    </div>

                </div>

            </div>


            <!-- ================================================= -->
            <!-- NOTIFICATIONS -->
            <!-- ================================================= -->

            <div
                id="ui-notifications"
            ></div>


            <!-- ================================================= -->
            <!-- HELP -->
            <!-- ================================================= -->

            <div
                id="controls-hint"
                class="controls-hint"
            >

                <span>
                    WASD
                </span>
                Move

                <span>
                    SHIFT
                </span>
                Run

                <span>
                    SPACE
                </span>
                Jump

                <span>
                    E
                </span>
                Capture

                <span>
                    F
                </span>
                Eat

            </div>

        `;


        document.body.appendChild(
            ui
        );


        this.injectStyles();

    }


    // ============================================================
    // EVENTS
    // ============================================================

    bindEvents() {

        this.bindClick(
            "inventory-floating-button",
            () => this.toggleInventory()
        );


        this.bindClick(
            "pet-menu-button",
            () => this.togglePets()
        );


        this.bindClick(
            "map-button",
            () => this.toggleMap()
        );


        this.bindClick(
            "settings-button",
            () => this.toggleSettings()
        );


        this.bindClick(
            "close-inventory",
            () => this.closeAll()
        );


        this.bindClick(
            "close-pets",
            () => this.closeAll()
        );


        this.bindClick(
            "close-map",
            () => this.closeAll()
        );


        this.bindClick(
            "close-stats",
            () => this.closeAll()
        );


        this.bindClick(
            "close-settings",
            () => this.closeAll()
        );


        this.bindClick(
            "eat-button",
            () => {

                if (
                    this.game.systems
                ) {

                    this.game.systems
                        .useHealingFood();

                }

                this.updatePlayerStatus();

            }
        );


        this.bindClick(
            "potion-button",
            () => {

                if (
                    this.game.systems
                ) {

                    this.game.systems
                        .usePotion();

                }

                this.updatePlayerStatus();

            }
        );


        this.bindClick(
            "capture-button",
            () => {

                if (
                    this.game.systems
                ) {

                    this.game.systems
                        .captureNearestCreature();

                }

                this.updatePets();

            }
        );


        this.bindClick(
            "save-game-button",
            () => {

                if (
                    this.game.systems
                ) {

                    const success =
                        this.game.systems
                            .saveGame();

                    this.notify(
                        success
                            ? "💾 Game saved"
                            : "❌ Save failed"
                    );

                }

            }
        );


        this.bindClick(
            "export-save-button",
            () => this.exportSave()
        );


        this.bindClick(
            "import-save-button",
            () => {

                const input =
                    document.getElementById(
                        "import-save-input"
                    );


                if (
                    input
                ) {

                    input.click();

                }

            }
        );


        const importInput =
            document.getElementById(
                "import-save-input"
            );


        if (
            importInput
        ) {

            importInput.addEventListener(
                "change",
                event => {

                    const file =
                        event.target.files &&
                        event.target.files[0];


                    if (
                        !file
                    ) {

                        return;

                    }


                    this.importSave(
                        file
                    );

                    event.target.value = "";

                }
            );

        }


        this.bindClick(
            "reset-game-button",
            () => {

                const confirmed =
                    window.confirm(
                        "Reset your complete PET WORLD save?"
                    );


                if (
                    !confirmed
                ) {

                    return;

                }


                if (
                    this.game.systems
                ) {

                    this.game.systems
                        .resetGame();

                }

            }
        );


        // Keyboard shortcuts

        window.addEventListener(
            "keydown",
            event => {

                if (
                    event.code === "Escape"
                ) {

                    this.closeAll();

                }


                if (
                    event.code === "KeyI"
                ) {

                    this.toggleInventory();

                }


                if (
                    event.code === "KeyP"
                ) {

                    this.togglePets();

                }


                if (
                    event.code === "KeyM"
                ) {

                    this.toggleMap();

                }

            }
        );

    }


    // ============================================================
    // BIND CLICK
    // ============================================================

    bindClick(
        id,
        callback
    ) {

        const element =
            document.getElementById(
                id
            );


        if (
            element
        ) {

            element.addEventListener(
                "click",
                callback
            );

        }

    }


    // ============================================================
    // INVENTORY
    // ============================================================

    toggleInventory() {

        if (
            this.inventoryOpen
        ) {

            this.closeAll();

            return;

        }


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


        const inventory =
            this.game.systems.inventory ||
            {};


        container.innerHTML = "";


        const itemInfo = {

            wood: {
                icon: "🪵",
                name: "Wood",
                description: "Basic building resource"
            },

            stone: {
                icon: "🪨",
                name: "Stone",
                description: "Strong construction resource"
            },

            fiber: {
                icon: "🌿",
                name: "Fiber",
                description: "Natural crafting material"
            },

            food: {
                icon: "🍖",
                name: "Food",
                description: "Restores hunger and health"
            },

            captureOrb: {
                icon: "🔵",
                name: "Capture Orb",
                description: "Used to capture creatures"
            },

            potion: {
                icon: "🧪",
                name: "Potion",
                description: "Restores health"
            }

        };


        const items =
            Object.keys(
                inventory
            );


        if (
            items.length === 0
        ) {

            container.innerHTML = `

                <div class="empty-message">

                    🎒 Inventory is empty.

                </div>

            `;

            return;

        }


        items.forEach(
            item => {

                const amount =
                    Number(
                        inventory[item]
                    ) || 0;


                const info =
                    itemInfo[item] || {

                        icon: "📦",

                        name: item,

                        description:
                            "Game item"

                    };


                const slot =
                    document.createElement(
                        "div"
                    );


                slot.className =
                    "inventory-slot";


                slot.innerHTML = `

                    <div class="item-icon">

                        ${info.icon}

                    </div>


                    <div class="item-name">

                        ${this.escapeHTML(
                            info.name
                        )}

                    </div>


                    <div class="item-description">

                        ${this.escapeHTML(
                            info.description
                        )}

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


        const summary =
            document.getElementById(
                "inventory-summary"
            );


        if (
            summary
        ) {

            let total = 0;


            Object.values(
                inventory
            ).forEach(
                value => {

                    total +=
                        Math.max(
                            0,
                            Number(value) || 0
                        );

                }
            );


            summary.textContent =
                `Items: ${total}`;

        }

    }


    // ============================================================
    // PETS
    // ============================================================

    togglePets() {

        if (
            this.petOpen
        ) {

            this.closeAll();

            return;

        }


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


        const pets =
            Array.isArray(
                this.game.systems.pets
            )
                ? this.game.systems.pets
                : [];


        container.innerHTML = "";


        const summary =
            document.getElementById(
                "pets-summary"
            );


        if (
            summary
        ) {

            summary.textContent =
                `Pets: ${pets.length}/${this.game.systems.maxPets || 50}`;

        }


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


                const healthPercent =
                    Math.max(
                        0,
                        Math.min(
                            100,
                            (
                                Number(
                                    pet.health
                                ) /
                                Math.max(
                                    1,
                                    Number(
                                        pet.maxHealth
                                    )
                                )
                            ) *
                            100
                        )
                    );


                const hungerPercent =
                    Math.max(
                        0,
                        Math.min(
                            100,
                            Number(
                                pet.hunger
                            ) || 0
                        )
                    );


                card.innerHTML = `

                    <div class="pet-avatar">

                        🐾

                    </div>


                    <div class="pet-details">

                        <strong>

                            ${this.escapeHTML(
                                pet.name ||
                                "Unknown"
                            )}

                        </strong>


                        <span>

                            ${this.escapeHTML(
                                pet.rarity ||
                                "Common"
                            )}

                        </span>


                        <span>

                            Level
                            ${Number(
                                pet.level
                            ) || 1}

                        </span>


                        <div class="mini-pet-bar">

                            <div
                                style="width:${healthPercent}%"
                            ></div>

                        </div>


                        <span>

                            ❤️
                            ${Math.round(
                                Number(
                                    pet.health
                                ) || 0
                            )}
                            /
                            ${Math.round(
                                Number(
                                    pet.maxHealth
                                ) || 0
                            )}

                        </span>


                        <span>

                            🍖
                            ${Math.round(
                                hungerPercent
                            )}%

                        </span>

                    </div>


                    <div class="pet-card-actions">

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


                        <button
                            class="pet-feed-button"
                            data-feed-pet-id="${this.escapeHTML(
                                pet.id
                            )}"
                        >

                            🍖

                        </button>

                    </div>

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


        container
            .querySelectorAll(
                ".pet-feed-button"
            )
            .forEach(
                button => {

                    button.addEventListener(
                        "click",
                        () => {

                            const petId =
                                button.dataset
                                    .feedPetId;


                            if (
                                this.game.systems
                            ) {

                                this.game.systems
                                    .feedPet(
                                        petId
                                    );

                            }


                            this.updatePets();

                            this.updateActivePet();

                        }
                    );

                }
            );

    }


    // ============================================================
    // ACTIVE PET
    // ============================================================

    updateActivePet() {

        const info =
            document.getElementById(
                "active-pet-info"
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


        const name =
            document.getElementById(
                "active-pet-name"
            );


        const level =
            document.getElementById(
                "active-pet-level"
            );


        const health =
            document.getElementById(
                "active-pet-health"
            );


        const hunger =
            document.getElementById(
                "active-pet-hunger"
            );


        if (
            name
        ) {

            name.textContent =
                pet.name ||
                "Pet";

        }


        if (
            level
        ) {

            level.textContent =
                Number(
                    pet.level
                ) || 1;

        }


        const healthPercent =
            Math.max(
                0,
                Math.min(
                    100,
                    (
                        Number(
                            pet.health
                        ) /
                        Math.max(
                            1,
                            Number(
                                pet.maxHealth
                            )
                        )
                    ) *
                    100
                )
            );


        if (
            health
        ) {

            health.style.width =
                `${healthPercent}%`;

        }


        if (
            hunger
        ) {

            hunger.style.width =
                `${Math.max(
                    0,
                    Math.min(
                        100,
                        Number(
                            pet.hunger
                        ) || 0
                    )
                )}%`;

        }

    }


    // ============================================================
    // MAP
    // ============================================================

    toggleMap() {

        if (
            this.mapOpen
        ) {

            this.closeAll();

            return;

        }


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
            Number.isFinite(
                Number(
                    this.game.world.size
                )
            )
                ? Number(
                    this.game.world.size
                )
                : 500;


        const half =
            worldSize / 2;


        const x =
            (
                (
                    position.x +
                    half
                ) /
                worldSize
            ) *
            100;


        const z =
            (
                (
                    position.z +
                    half
                ) /
                worldSize
            ) *
            100;


        marker.style.left =
            `${Math.max(
                2,
                Math.min(
                    98,
                    x
                )
            )}%`;


        marker.style.top =
            `${Math.max(
                2,
                Math.min(
                    98,
                    z
                )
            )}%`;


        const coordinates =
            document.getElementById(
                "map-coordinates"
            );


        if (
            coordinates
        ) {

            coordinates.textContent =
                `X: ${Math.round(
                    position.x
                )} | Z: ${Math.round(
                    position.z
                )}`;

        }


        const discovered =
            document.getElementById(
                "discovered-count"
            );


        if (
            discovered &&
            this.game.systems
        ) {

            const count =
                Array.isArray(
                    this.game.systems
                        .discoveredLocations
                )
                    ? this.game.systems
                        .discoveredLocations
                        .length
                    : 0;


            discovered.textContent =
                `Locations discovered: ${count}`;

        }

    }


    // ============================================================
    // SETTINGS
    // ============================================================

    toggleSettings() {

        if (
            this.settingsOpen
        ) {

            this.closeAll();

            return;

        }


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


    // ============================================================
    // CLOSE ALL
    // ============================================================

    closeAll() {

        document
            .querySelectorAll(
                "#pet-world-panels .game-panel"
            )
            .forEach(
                panel => {

                    panel.classList.add(
                        "hidden"
                    );

                }
            );


        this.inventoryOpen = false;

        this.mapOpen = false;

        this.petOpen = false;

        this.settingsOpen = false;

        this.statsOpen = false;

    }


    // ============================================================
    // PLAYER STATUS
    // ============================================================

    updatePlayerStatus() {

        if (
            !this.game ||
            !this.game.player
        ) {

            return;

        }


        const player =
            this.game.player;


        this.updateBar(
            "health-fill",
            player.health,
            player.maxHealth
        );


        this.updateBar(
            "stamina-fill",
            player.stamina,
            player.maxStamina
        );


        this.updateBar(
            "hunger-fill",
            player.hunger,
            player.maxHunger
        );


        this.setText(
            "health-text",
            `${Math.round(
                player.health
            )}/${Math.round(
                player.maxHealth
            )}`
        );


        this.setText(
            "stamina-text",
            `${Math.round(
                player.stamina
            )}/${Math.round(
                player.maxStamina
            )}`
        );


        this.setText(
            "hunger-text",
            `${Math.round(
                player.hunger
            )}/${Math.round(
                player.maxHunger
            )}`
        );


        if (
            this.game.systems
        ) {

            this.setText(
                "ui-coins",
                this.game.systems.coins
            );

        }

    }


    // ============================================================
    // XP
    // ============================================================

    updateXP() {

        if (
            !this.game ||
            !this.game.systems
        ) {

            return;

        }


        const systems =
            this.game.systems;


        this.setText(
            "ui-level",
            systems.level
        );


        this.setText(
            "xp-text",
            `${Math.floor(
                systems.xp
            )} / ${Math.floor(
                systems.xpToNextLevel
            )} XP`
        );


        const percent =
            (
                Number(
                    systems.xp
                ) /
                Math.max(
                    1,
                    Number(
                        systems.xpToNextLevel
                    )
                )
            ) *
            100;


        const fill =
            document.getElementById(
                "ui-xp-fill"
            );


        if (
            fill
        ) {

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


    // ============================================================
    // STATISTICS
    // ============================================================

    updateStatistics() {

        const container =
            document.getElementById(
                "statistics-content"
            );


        if (
            !container ||
            !this.game.systems
        ) {

            return;

        }


        const stats =
            this.game.systems.statistics ||
            {};


        const playTime =
            Number(
                stats.playTime
            ) || 0;


        const minutes =
            Math.floor(
                playTime / 60
            );


        const seconds =
            Math.floor(
                playTime % 60
            );


        container.innerHTML = `

            <div class="stat-row">

                <span>🐾 Creatures Captured</span>

                <strong>
                    ${Number(
                        stats.creaturesCaptured
                    ) || 0}
                </strong>

            </div>


            <div class="stat-row">

                <span>⚔️ Creatures Defeated</span>

                <strong>
                    ${Number(
                        stats.creaturesDefeated
                    ) || 0}
                </strong>

            </div>


            <div class="stat-row">

                <span>⛏️ Resources Collected</span>

                <strong>
                    ${Number(
                        stats.resourcesCollected
                    ) || 0}
                </strong>

            </div>


            <div class="stat-row">

                <span>🍖 Food Consumed</span>

                <strong>
                    ${Number(
                        stats.foodConsumed
                    ) || 0}
                </strong>

            </div>


            <div class="stat-row">

                <span>⚔️ Damage Dealt</span>

                <strong>
                    ${Math.round(
                        Number(
                            stats.damageDealt
                        ) || 0
                    )}
                </strong>

            </div>


            <div class="stat-row">

                <span>❤️ Damage Taken</span>

                <strong>
                    ${Math.round(
                        Number(
                            stats.damageTaken
                        ) || 0
                    )}
                </strong>

            </div>


            <div class="stat-row">

                <span>🗺️ Locations</span>

                <strong>
                    ${Number(
                        stats.locationsDiscovered
                    ) || 0}
                </strong>

            </div>


            <div class="stat-row">

                <span>🏆 Achievements</span>

                <strong>
                    ${
                        Array.isArray(
                            this.game.systems
                                .achievements
                        )
                            ? this.game.systems
                                .achievements
                                .length
                            : 0
                    }
                </strong>

            </div>


            <div class="stat-row">

                <span>⏱️ Play Time</span>

                <strong>
                    ${minutes}m ${seconds}s
                </strong>

            </div>

        `;

    }


    // ============================================================
    // UPDATE ALL
    // ============================================================

    updateAll() {

        this.updatePlayerStatus();

        this.updateXP();

        this.updateActivePet();

        this.updateInventory();

        this.updatePets();

        this.updateMap();

        this.updateStatistics();

    }


    // ============================================================
    // MAIN UPDATE
    // ============================================================

    update(delta = 0) {

        if (
            !this.initialized
        ) {

            return;

        }


        const now =
            performance.now();


        // Player status

        if (
            now -
            this.lastXPUpdate >
            100
        ) {

            this.lastXPUpdate =
                now;

            this.updatePlayerStatus();

            this.updateXP();

        }


        // Active pet

        if (
            now -
            this.lastPetUpdate >
            250
        ) {

            this.lastPetUpdate =
                now;

            this.updateActivePet();

        }


        // Inventory

        if (
            this.inventoryOpen &&
            now -
            this.lastInventoryUpdate >
            500
        ) {

            this.lastInventoryUpdate =
                now;

            this.updateInventory();

        }


        // Map

        if (
            this.mapOpen &&
            now -
            this.lastMapUpdate >
            100
        ) {

            this.lastMapUpdate =
                now;

            this.updateMap();

        }

    }


    // ============================================================
    // EXPORT SAVE
    // ============================================================

    exportSave() {

        if (
            !this.game.systems
        ) {

            return;

        }


        const data =
            this.game.systems
                .exportSave();


        if (
            !data
        ) {

            this.notify(
                "❌ Export failed"
            );

            return;

        }


        const blob =
            new Blob(
                [
                    data
                ],
                {
                    type:
                        "application/json"
                }
            );


        const url =
            URL.createObjectURL(
                blob
            );


        const link =
            document.createElement(
                "a"
            );


        link.href =
            url;


        link.download =
            "pet-world-save.json";


        document.body.appendChild(
            link
        );


        link.click();


        link.remove();


        URL.revokeObjectURL(
            url
        );


        this.notify(
            "📤 Save exported"
        );

    }


    // ============================================================
    // IMPORT SAVE
    // ============================================================

    importSave(file) {

        if (
            !file ||
            !this.game.systems
        ) {

            return;

        }


        const reader =
            new FileReader();


        reader.onload =
            event => {

                try {

                    const text =
                        event.target.result;


                    const success =
                        this.game.systems
                            .importSave(
                                text
                            );


                    if (
                        success
                    ) {

                        this.notify(
                            "📥 Save imported. Reloading..."
                        );


                        setTimeout(
                            () => {

                                location.reload();

                            },
                            800
                        );

                    } else {

                        this.notify(
                            "❌ Invalid save"
                        );

                    }

                } catch (
                    error
                ) {

                    console.error(
                        "Import error:",
                        error
                    );


                    this.notify(
                        "❌ Could not import save"
                    );

                }

            };


        reader.onerror =
            () => {

                this.notify(
                    "❌ File could not be read"
                );

            };


        reader.readAsText(
            file
        );

    }


    // ============================================================
    // NOTIFICATION
    // ============================================================

    notify(message) {

        message =
            String(
                message ??
                ""
            );


        if (
            !message
        ) {

            return;

        }


        if (
            this.game &&
            typeof this.game.showNotification ===
            "function"
        ) {

            this.game.showNotification(
                message
            );

            return;

        }


        const container =
            document.getElementById(
                "ui-notifications"
            );


        if (
            !container
        ) {

            return;

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


        requestAnimationFrame(
            () => {

                item.classList.add(
                    "show"
                );

            }
        );


        setTimeout(
            () => {

                item.classList.remove(
                    "show"
                );


                setTimeout(
                    () => {

                        item.remove();

                    },
                    250
                );

            },
            2500
        );

    }


    // ============================================================
    // UPDATE BAR
    // ============================================================

    updateBar(
        id,
        value,
        max
    ) {

        const element =
            document.getElementById(
                id
            );


        if (
            !element
        ) {

            return;

        }


        const current =
            Number(value) || 0;


        const maximum =
            Math.max(
                1,
                Number(max) || 1
            );


        const percent =
            Math.max(
                0,
                Math.min(
                    100,
                    (
                        current /
                        maximum
                    ) *
                    100
                )
            );


        element.style.width =
            `${percent}%`;

    }


    // ============================================================
    // SET TEXT
    // ============================================================

    setText(
        id,
        value
    ) {

        const element =
            document.getElementById(
                id
            );


        if (
            element
        ) {

            element.textContent =
                String(
                    value
                );

        }

    }


    // ============================================================
    // ESCAPE HTML
    // ============================================================

    escapeHTML(
        value
    ) {

        const element =
            document.createElement(
                "div"
            );


        element.textContent =
            String(
                value
            );


        return element.innerHTML;

    }


    // ============================================================
    // STYLES
    // ============================================================

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

                color: white;

                user-select: none;

            }


            #pet-world-ui button {

                font-family: inherit;

            }


            .hidden {

                display: none !important;

            }


            /* ==========================================
               TOP STATUS
               ========================================== */

            .top-status {

                position: absolute;

                top: 15px;

                left: 15px;

                right: 15px;

                display: flex;

                justify-content:
                    space-between;

                align-items:
                    flex-start;

            }


            .player-status {

                width: 230px;

                padding: 10px;

                border-radius: 14px;

                background:
                    rgba(
                        5,
                        12,
                        16,
                        0.72
                    );

                backdrop-filter:
                    blur(8px);

                pointer-events: none;

            }


            .status-row {

                display: grid;

                grid-template-columns:
                    20px 1fr 55px;

                gap: 6px;

                align-items:
                    center;

                margin-bottom: 6px;

                font-size: 11px;

            }


            .status-row:last-child {

                margin-bottom: 0;

            }


            .status-bar {

                height: 7px;

                overflow: hidden;

                border-radius: 10px;

                background:
                    rgba(
                        255,
                        255,
                        255,
                        0.15
                    );

            }


            .status-bar > div {

                width: 100%;

                height: 100%;

                transition:
                    width 0.15s ease;

            }


            .health-fill {

                background:
                    #e55353;

            }


            .stamina-fill {

                background:
                    #e9c85b;

            }


            .hunger-fill {

                background:
                    #db9a55;

            }


            .coin-display {

                padding:
                    9px 14px;

                border-radius: 18px;

                background:
                    rgba(
                        5,
                        12,
                        16,
                        0.72
                    );

                backdrop-filter:
                    blur(8px);

                font-size: 13px;

                font-weight: 800;

            }


            /* ==========================================
               CROSSHAIR
               ========================================== */

            .crosshair {

                position: absolute;

                left: 50%;

                top: 50%;

                transform:
                    translate(
                        -50%,
                        -50%
                    );

                font-size: 24px;

                font-weight: 300;

                text-shadow:
                    0 1px 4px black;

            }


            /* ==========================================
               ACTIVE PET
               ========================================== */

            .active-pet-info {

                position: absolute;

                left: 50%;

                top: 15px;

                transform:
                    translateX(-50%);

                width: 190px;

                padding: 9px;

                border-radius: 13px;

                background:
                    rgba(
                        5,
                        12,
                        16,
                        0.75
                    );

                text-align: center;

                pointer-events: none;

            }


            .active-pet-name {

                font-size: 13px;

                font-weight: 800;

            }


            .active-pet-level {

                margin:
                    2px 0 6px;

                font-size: 9px;

                opacity: 0.7;

            }


            .pet-health-bar,
            .pet-hunger-small {

                height: 5px;

                border-radius: 10px;

                overflow: hidden;

                background:
                    rgba(
                        255,
                        255,
                        255,
                        0.15
                    );

                margin-top: 4px;

            }


            #active-pet-health {

                height: 100%;

                width: 100%;

                background:
                    #61b56f;

            }


            #active-pet-hunger {

                height: 100%;

                width: 100%;

                background:
                    #dca653;

            }


            /* ==========================================
               XP
               ========================================== */

            .xp-container {

                position: absolute;

                left: 50%;

                bottom: 14px;

                transform:
                    translateX(-50%);

                width:
                    min(
                        360px,
                        45vw
                    );

            }


            .xp-label {

                display: flex;

                justify-content:
                    space-between;

                align-items:
                    center;

                font-size: 10px;

                margin-bottom: 4px;

                text-shadow:
                    0 1px 4px black;

            }


            .xp-bar {

                height: 7px;

                border-radius: 10px;

                overflow: hidden;

                background:
                    rgba(
                        255,
                        255,
                        255,
                        0.16
                    );

            }


            #ui-xp-fill {

                width: 0%;

                height: 100%;

                background:
                    #ffffff;

                transition:
                    width 0.2s ease;

            }


            /* ==========================================
               ACTION BUTTONS
               ========================================== */

            .action-buttons {

                position: absolute;

                right: 15px;

                bottom: 15px;

                display: flex;

                flex-direction:
                    column;

                gap: 8px;

            }


            .action-button {

                width: 48px;

                height: 48px;

                border-radius: 50%;

                border:
                    1px solid
                    rgba(
                        255,
                        255,
                        255,
                        0.16
                    );

                background:
                    rgba(
                        5,
                        12,
                        16,
                        0.72
                    );

                color: white;

                font-size: 19px;

                cursor: pointer;

                pointer-events: auto;

                box-shadow:
                    0 5px 20px
                    rgba(
                        0,
                        0,
                        0,
                        0.25
                    );

            }


            .action-button:active {

                transform:
                    scale(
                        0.92
                    );

            }


            /* ==========================================
               MENU BUTTONS
               ========================================== */

            .menu-buttons {

                position: absolute;

                right: 15px;

                bottom: 235px;

                display: flex;

                flex-direction:
                    column;

                gap: 8px;

            }


            .floating-button {

                width: 46px;

                height: 46px;

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

                font-size: 19px;

                cursor: pointer;

                pointer-events: auto;

                backdrop-filter:
                    blur(8px);

            }


            .floating-button:hover,
            .action-button:hover {

                background:
                    rgba(
                        35,
                        50,
                        58,
                        0.9
                    );

            }


            /* ==========================================
               PANELS
               ========================================== */

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
                        560px,
                        90vw
                    );

                max-height:
                    82vh;

                overflow-y: auto;

                padding: 18px;

                border-radius: 18px;

                background:
                    rgba(
                        7,
                        14,
                        19,
                        0.95
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
                        0.6
                    );

                color: white;

                pointer-events: auto;

                backdrop-filter:
                    blur(12px);

            }


            .panel-header {

                display: flex;

                justify-content:
                    space-between;

                align-items:
                    center;

                margin-bottom: 16px;

                font-size: 15px;

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
                        0.1
                    );

                color: white;

                font-size: 22px;

                cursor: pointer;

            }


            /* ==========================================
               INVENTORY
               ========================================== */

            .inventory-summary,
            .pets-summary {

                margin-bottom: 10px;

                color:
                    rgba(
                        255,
                        255,
                        255,
                        0.55
                    );

                font-size: 11px;

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

                min-height: 125px;

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

                margin-bottom: 5px;

            }


            .item-name {

                font-size: 12px;

                font-weight: 800;

            }


            .item-description {

                margin-top: 5px;

                font-size: 9px;

                line-height: 1.4;

                opacity: 0.5;

            }


            .item-count {

                position: absolute;

                top: 7px;

                right: 8px;

                min-width: 22px;

                padding:
                    2px 5px;

                border-radius: 10px;

                background:
                    rgba(
                        0,
                        0,
                        0,
                        0.4
                    );

                font-size: 11px;

                font-weight: 800;

            }


            /* ==========================================
               PETS
               ========================================== */

            .pets-list {

                display: flex;

                flex-direction:
                    column;

                gap: 9px;

            }


            .pet-card {

                display: flex;

                align-items:
                    center;

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

                border:
                    1px solid
                    rgba(
                        255,
                        255,
                        255,
                        0.05
                    );

            }


            .pet-avatar {

                width: 50px;

                height: 50px;

                display: flex;

                align-items:
                    center;

                justify-content:
                    center;

                border-radius: 12px;

                background:
                    rgba(
                        255,
                        255,
                        255,
                        0.08
                    );

                font-size: 27px;

                flex-shrink: 0;

            }


            .pet-details {

                display: flex;

                flex-direction:
                    column;

                flex: 1;

                gap: 2px;

                min-width: 0;

            }


            .pet-details strong {

                white-space: nowrap;

                overflow: hidden;

                text-overflow: ellipsis;

            }


            .pet-details span {

                font-size: 10px;

                opacity: 0.6;

            }


            .mini-pet-bar {

                width: 100%;

                height: 4px;

                overflow: hidden;

                border-radius: 10px;

                background:
                    rgba(
                        255,
                        255,
                        255,
                        0.12
                    );

                margin-top: 3px;

            }


            .mini-pet-bar div {

                height: 100%;

                background:
                    #61b56f;

            }


            .pet-card-actions {

                display: flex;

                flex-direction:
                    column;

                gap: 5px;

            }


            .pet-select-button,
            .pet-feed-button {

                border: 0;

                border-radius: 9px;

                padding: 8px 10px;

                background: white;

                color: #111;

                font-weight: 800;

                font-size: 10px;

                cursor: pointer;

            }


            .pet-feed-button {

                background:
                    rgba(
                        255,
                        255,
                        255,
                        0.12
                    );

                color: white;

            }


            /* ==========================================
               MAP
               ========================================== */

            .map-panel {

                width:
                    min(
                        620px,
                        92vw
                    );

            }


            .map-coordinates {

                margin-bottom: 8px;

                font-size: 10px;

                opacity: 0.6;

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


            .map-grid {

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

                font-size: 24px;

                z-index: 5;

                text-shadow:
                    0 0 10px black;

            }


            .discovered-count {

                margin-top: 9px;

                font-size: 10px;

                opacity: 0.6;

            }


            /* ==========================================
               STATISTICS
               ========================================== */

            .statistics-content {

                display: flex;

                flex-direction:
                    column;

                gap: 7px;

            }


            .stat-row {

                display: flex;

                justify-content:
                    space-between;

                align-items:
                    center;

                padding:
                    10px 12px;

                border-radius: 10px;

                background:
                    rgba(
                        255,
                        255,
                        255,
                        0.06
                    );

                font-size: 11px;

            }


            .stat-row strong {

                font-size: 12px;

            }


            /* ==========================================
               SETTINGS
               ========================================== */

            .settings-content {

                display: flex;

                flex-direction:
                    column;

                gap: 10px;

            }


            .settings-button {

                width: 100%;

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


            .settings-button:hover {

                background:
                    rgba(
                        255,
                        255,
                        255,
                        0.16
                    );

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


            /* ==========================================
               NOTIFICATIONS
               ========================================== */

            #ui-notifications {

                position: fixed;

                top: 80px;

                left: 50%;

                transform:
                    translateX(-50%);

                display: flex;

                flex-direction:
                    column;

                align-items:
                    center;

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
                        0.9
                    );

                color: white;

                font-size: 12px;

                opacity: 0;

                transform:
                    translateY(
                        -8px
                    );

                transition:
                    opacity 0.2s ease,
                    transform 0.2s ease;

                box-shadow:
                    0 8px 25px
                    rgba(
                        0,
                        0,
                        0,
                        0.25
                    );

            }


            .ui-notification.show {

                opacity: 1;

                transform:
                    translateY(
                        0
                    );

            }


            /* ==========================================
               CONTROLS HINT
               ========================================== */

            .controls-hint {

                position: absolute;

                left: 15px;

                bottom: 15px;

                display: flex;

                align-items:
                    center;

                gap: 5px;

                padding:
                    7px 10px;

                border-radius: 10px;

                background:
                    rgba(
                        5,
                        12,
                        16,
                        0.55
                    );

                font-size: 9px;

                opacity: 0.65;

                pointer-events: none;

            }


            .controls-hint span {

                padding:
                    2px 5px;

                border-radius: 4px;

                background:
                    rgba(
                        255,
                        255,
                        255,
                        0.12
                    );

                font-weight: 800;

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

                font-size: 12px;

            }


            /* ==========================================
               MOBILE
               ========================================== */

            @media (
                max-width: 700px
            ) {

                .top-status {

                    top: 8px;

                    left: 8px;

                    right: 8px;

                }


                .player-status {

                    width: 175px;

                    padding: 7px;

                }


                .status-row {

                    grid-template-columns:
                        17px 1fr 43px;

                    font-size: 9px;

                }


                .active-pet-info {

                    top: 70px;

                    width: 160px;

                }


                .menu-buttons {

                    right: 10px;

                    bottom: 220px;

                }


                .action-buttons {

                    right: 10px;

                    bottom: 10px;

                }


                .floating-button,
                .action-button {

                    width: 43px;

                    height: 43px;

                    font-size: 17px;

                }


                .inventory-grid {

                    grid-template-columns:
                        repeat(
                            2,
                            1fr
                        );

                }


                .game-panel {

                    width: 92vw;

                    max-height: 80vh;

                    padding: 14px;

                }


                .xp-container {

                    width: 48vw;

                    bottom: 7px;

                }


                .controls-hint {

                    display: none;

                }


                .coin-display {

                    font-size: 11px;

                    padding:
                        7px 10px;

                }

            }

        `;


        document.head.appendChild(
            style
        );

    }

}
```
