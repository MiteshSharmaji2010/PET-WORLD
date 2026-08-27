```javascript
// ============================================================
// PET WORLD
// public/js/ui.js
// Complete & Defensive Game UI System
// ============================================================

export class GameUI {

    constructor(game) {

        this.game = game || null;

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
        this.lastStatsUpdate = 0;

        this.notificationQueue = [];
        this.notificationsVisible = 0;

        this.boundKeyboardHandler = null;
    }


    // ============================================================
    // INITIALIZE
    // ============================================================

    async init() {

        try {

            this.createUI();
            this.bindEvents();

            this.initialized = true;

            this.updateAll();

        } catch (error) {

            console.error(
                "GameUI initialization error:",
                error
            );

        }

    }


    // ============================================================
    // CREATE UI
    // ============================================================

    createUI() {

        let ui =
            document.getElementById(
                "pet-world-ui"
            );

        if (ui) {

            this.injectStyles();

            return;

        }


        ui =
            document.createElement(
                "div"
            );


        ui.id =
            "pet-world-ui";


        ui.innerHTML = `

            <!-- ================================================= -->
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

                        <span id="health-text">
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

                        <span id="stamina-text">
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

                        <span id="hunger-text">
                            100/100
                        </span>

                    </div>

                </div>


                <div
                    id="coin-display"
                    class="coin-display"
                >

                    🪙
                    <span id="ui-coins">0</span>

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
                    <span id="active-pet-level">
                        1
                    </span>

                </div>


                <div class="pet-health-bar">

                    <div
                        id="active-pet-health"
                    ></div>

                </div>


                <div class="pet-hunger-small">

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

                    <span>LEVEL</span>

                    <strong id="ui-level">
                        1
                    </strong>

                    <span id="xp-text">
                        0 / 100 XP
                    </span>

                </div>


                <div class="xp-bar">

                    <div id="ui-xp-fill"></div>

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
                    type="button"
                    title="Eat food"
                >
                    🍖
                </button>


                <button
                    id="potion-button"
                    class="action-button"
                    type="button"
                    title="Use potion"
                >
                    🧪
                </button>


                <button
                    id="capture-button"
                    class="action-button"
                    type="button"
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
                    type="button"
                    title="Inventory"
                >
                    🎒
                </button>


                <button
                    id="pet-menu-button"
                    class="floating-button"
                    type="button"
                    title="Pets"
                >
                    🐾
                </button>


                <button
                    id="map-button"
                    class="floating-button"
                    type="button"
                    title="Map"
                >
                    🗺️
                </button>


                <button
                    id="settings-button"
                    class="floating-button"
                    type="button"
                    title="Settings"
                >
                    ⚙️
                </button>

            </div>


            <!-- ================================================= -->
            <!-- PANELS -->
            <!-- ================================================= -->

            <div id="pet-world-panels">


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
                            type="button"
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
                            type="button"
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
                            type="button"
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


                <!-- STATISTICS -->

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
                            type="button"
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
                            type="button"
                        >
                            ×
                        </button>

                    </div>


                    <div class="settings-content">

                        <button
                            id="save-game-button"
                            class="settings-button"
                            type="button"
                        >
                            💾 SAVE GAME
                        </button>


                        <button
                            id="export-save-button"
                            class="settings-button"
                            type="button"
                        >
                            📤 EXPORT SAVE
                        </button>


                        <button
                            id="import-save-button"
                            class="settings-button"
                            type="button"
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
                            type="button"
                        >
                            🗑️ RESET GAME
                        </button>

                    </div>

                </div>

            </div>


            <!-- ================================================= -->
            <!-- NOTIFICATIONS -->
            <!-- ================================================= -->

            <div id="ui-notifications"></div>


            <!-- ================================================= -->
            <!-- HELP -->
            <!-- ================================================= -->

            <div
                id="controls-hint"
                class="controls-hint"
            >

                <span>WASD</span>
                Move

                <span>SHIFT</span>
                Run

                <span>SPACE</span>
                Jump

                <span>E</span>
                Capture

                <span>F</span>
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


        // --------------------------------------------------------
        // EAT
        // --------------------------------------------------------

        this.bindClick(
            "eat-button",
            () => {

                const systems =
                    this.getSystems();

                if (
                    systems &&
                    typeof systems.useHealingFood ===
                    "function"
                ) {

                    try {

                        systems.useHealingFood();

                    } catch (error) {

                        console.error(
                            "useHealingFood error:",
                            error
                        );

                        this.notify(
                            "❌ Could not use food"
                        );

                    }

                } else {

                    this.notify(
                        "❌ Food system unavailable"
                    );

                }


                this.updatePlayerStatus();

            }
        );


        // --------------------------------------------------------
        // POTION
        // --------------------------------------------------------

        this.bindClick(
            "potion-button",
            () => {

                const systems =
                    this.getSystems();

                if (
                    systems &&
                    typeof systems.usePotion ===
                    "function"
                ) {

                    try {

                        systems.usePotion();

                    } catch (error) {

                        console.error(
                            "usePotion error:",
                            error
                        );

                        this.notify(
                            "❌ Could not use potion"
                        );

                    }

                } else {

                    this.notify(
                        "❌ Potion system unavailable"
                    );

                }


                this.updatePlayerStatus();

            }
        );


        // --------------------------------------------------------
        // CAPTURE
        // --------------------------------------------------------

        this.bindClick(
            "capture-button",
            () => {

                const systems =
                    this.getSystems();

                if (
                    systems &&
                    typeof systems.captureNearestCreature ===
                    "function"
                ) {

                    try {

                        systems.captureNearestCreature();

                    } catch (error) {

                        console.error(
                            "captureNearestCreature error:",
                            error
                        );

                        this.notify(
                            "❌ Capture failed"
                        );

                    }

                } else {

                    this.notify(
                        "❌ Capture system unavailable"
                    );

                }


                this.updatePets();

            }
        );


        // --------------------------------------------------------
        // SAVE
        // --------------------------------------------------------

        this.bindClick(
            "save-game-button",
            () => {

                const systems =
                    this.getSystems();


                if (
                    !systems ||
                    typeof systems.saveGame !==
                    "function"
                ) {

                    this.notify(
                        "❌ Save system unavailable"
                    );

                    return;

                }


                try {

                    const result =
                        systems.saveGame();


                    if (
                        result === false
                    ) {

                        this.notify(
                            "❌ Save failed"
                        );

                    } else {

                        this.notify(
                            "💾 Game saved"
                        );

                    }

                } catch (error) {

                    console.error(
                        "Save error:",
                        error
                    );

                    this.notify(
                        "❌ Save failed"
                    );

                }

            }
        );


        // --------------------------------------------------------
        // EXPORT
        // --------------------------------------------------------

        this.bindClick(
            "export-save-button",
            () => this.exportSave()
        );


        // --------------------------------------------------------
        // IMPORT BUTTON
        // --------------------------------------------------------

        this.bindClick(
            "import-save-button",
            () => {

                const input =
                    document.getElementById(
                        "import-save-input"
                    );


                if (input) {

                    input.click();

                }

            }
        );


        const importInput =
            document.getElementById(
                "import-save-input"
            );


        if (importInput) {

            importInput.addEventListener(
                "change",
                event => {

                    try {

                        const file =
                            event.target &&
                            event.target.files &&
                            event.target.files[0];


                        if (!file) {

                            return;

                        }


                        this.importSave(
                            file
                        );


                    } finally {

                        event.target.value =
                            "";

                    }

                }
            );

        }


        // --------------------------------------------------------
        // RESET
        // --------------------------------------------------------

        this.bindClick(
            "reset-game-button",
            () => {

                const confirmed =
                    window.confirm(
                        "Reset your complete PET WORLD save?"
                    );


                if (!confirmed) {

                    return;

                }


                const systems =
                    this.getSystems();


                if (
                    systems &&
                    typeof systems.resetGame ===
                    "function"
                ) {

                    try {

                        systems.resetGame();

                    } catch (error) {

                        console.error(
                            "Reset error:",
                            error
                        );

                        this.notify(
                            "❌ Reset failed"
                        );

                    }

                } else {

                    this.notify(
                        "❌ Reset system unavailable"
                    );

                }

            }
        );


        // --------------------------------------------------------
        // KEYBOARD
        // --------------------------------------------------------

        if (
            this.boundKeyboardHandler
        ) {

            window.removeEventListener(
                "keydown",
                this.boundKeyboardHandler
            );

        }


        this.boundKeyboardHandler =
            event => {

                if (!event) {

                    return;

                }


                const target =
                    event.target;


                if (
                    target &&
                    (
                        target.tagName === "INPUT" ||
                        target.tagName === "TEXTAREA" ||
                        target.tagName === "SELECT"
                    )
                ) {

                    return;

                }


                switch (event.code) {

                    case "Escape":

                        this.closeAll();

                        break;


                    case "KeyI":

                        this.toggleInventory();

                        break;


                    case "KeyP":

                        this.togglePets();

                        break;


                    case "KeyM":

                        this.toggleMap();

                        break;


                    default:

                        break;

                }

            };


        window.addEventListener(
            "keydown",
            this.boundKeyboardHandler
        );

    }


    // ============================================================
    // SYSTEMS HELPER
    // ============================================================

    getSystems() {

        if (
            !this.game ||
            !this.game.systems
        ) {

            return null;

        }


        return this.game.systems;

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
            !element ||
            typeof callback !==
            "function"
        ) {

            return;

        }


        element.addEventListener(
            "click",
            event => {

                try {

                    callback(
                        event
                    );

                } catch (error) {

                    console.error(
                        `UI click error (${id}):`,
                        error
                    );

                }

            }
        );

    }


    // ============================================================
    // INVENTORY
    // ============================================================

    toggleInventory() {

        if (this.inventoryOpen) {

            this.closeAll();

            return;

        }


        this.closeAll();


        const panel =
            document.getElementById(
                "inventory-panel"
            );


        if (!panel) {

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


        const systems =
            this.getSystems();


        if (
            !container ||
            !systems
        ) {

            return;

        }


        const inventory =
            systems.inventory &&
            typeof systems.inventory === "object"
                ? systems.inventory
                : {};


        container.innerHTML =
            "";


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

        } else {

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
                            description: "Game item"

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
                            ${this.escapeHTML(info.name)}
                        </div>

                        <div class="item-description">
                            ${this.escapeHTML(info.description)}
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


        const summary =
            document.getElementById(
                "inventory-summary"
            );


        if (summary) {

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

        if (this.petOpen) {

            this.closeAll();

            return;

        }


        this.closeAll();


        const panel =
            document.getElementById(
                "pets-panel"
            );


        if (!panel) {

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


        const systems =
            this.getSystems();


        if (
            !container ||
            !systems
        ) {

            return;

        }


        const pets =
            Array.isArray(
                systems.pets
            )
                ? systems.pets
                : [];


        container.innerHTML =
            "";


        const summary =
            document.getElementById(
                "pets-summary"
            );


        if (summary) {

            const maxPets =
                Math.max(
                    1,
                    Number(
                        systems.maxPets
                    ) || 50
                );


            summary.textContent =
                `Pets: ${pets.length}/${maxPets}`;

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
            (pet, index) => {

                if (
                    !pet ||
                    typeof pet !== "object"
                ) {

                    return;

                }


                const card =
                    document.createElement(
                        "div"
                    );


                card.className =
                    "pet-card";


                const petId =
                    pet.id !== undefined &&
                    pet.id !== null
                        ? String(pet.id)
                        : String(index);


                const active =
                    String(
                        systems.activePetId
                    ) ===
                    petId;


                const maxHealth =
                    Math.max(
                        1,
                        Number(
                            pet.maxHealth
                        ) || 1
                    );


                const health =
                    Math.max(
                        0,
                        Number(
                            pet.health
                        ) || 0
                    );


                const healthPercent =
                    Math.max(
                        0,
                        Math.min(
                            100,
                            (
                                health /
                                maxHealth
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


                const petName =
                    pet.name ||
                    "Unknown";


                const rarity =
                    pet.rarity ||
                    "Common";


                const petLevel =
                    Math.max(
                        1,
                        Number(
                            pet.level
                        ) || 1
                    );


                card.innerHTML = `

                    <div class="pet-avatar">
                        🐾
                    </div>


                    <div class="pet-details">

                        <strong>
                            ${this.escapeHTML(petName)}
                        </strong>


                        <span>
                            ${this.escapeHTML(rarity)}
                        </span>


                        <span>
                            Level ${petLevel}
                        </span>


                        <div class="mini-pet-bar">

                            <div
                                style="width:${healthPercent}%"
                            ></div>

                        </div>


                        <span>
                            ❤️
                            ${Math.round(health)}
                            /
                            ${Math.round(maxHealth)}
                        </span>


                        <span>
                            🍖
                            ${Math.round(hungerPercent)}%
                        </span>

                    </div>


                    <div class="pet-card-actions">

                        <button
                            class="pet-select-button"
                            type="button"
                            data-pet-id="${this.escapeHTML(petId)}"
                        >
                            ${active ? "ACTIVE" : "USE"}
                        </button>


                        <button
                            class="pet-feed-button"
                            type="button"
                            data-feed-pet-id="${this.escapeHTML(petId)}"
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


        // --------------------------------------------------------
        // SELECT PET
        // --------------------------------------------------------

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
                                button.dataset &&
                                button.dataset.petId;


                            if (
                                !petId
                            ) {

                                return;

                            }


                            if (
                                typeof systems.setActivePet ===
                                "function"
                            ) {

                                try {

                                    systems.setActivePet(
                                        petId
                                    );

                                } catch (error) {

                                    console.error(
                                        "setActivePet error:",
                                        error
                                    );

                                }

                            } else {

                                this.notify(
                                    "❌ Pet system unavailable"
                                );

                            }


                            this.updatePets();
                            this.updateActivePet();

                        }
                    );

                }
            );


        // --------------------------------------------------------
        // FEED PET
        // --------------------------------------------------------

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
                                button.dataset &&
                                button.dataset.feedPetId;


                            if (
                                !petId
                            ) {

                                return;

                            }


                            if (
                                typeof systems.feedPet ===
                                "function"
                            ) {

                                try {

                                    systems.feedPet(
                                        petId
                                    );

                                } catch (error) {

                                    console.error(
                                        "feedPet error:",
                                        error
                                    );

                                    this.notify(
                                        "❌ Could not feed pet"
                                    );

                                }

                            } else {

                                this.notify(
                                    "❌ Pet feeding unavailable"
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


        const systems =
            this.getSystems();


        if (
            !info ||
            !systems
        ) {

            return;

        }


        let pet = null;


        if (
            typeof systems.getActivePet ===
            "function"
        ) {

            try {

                pet =
                    systems.getActivePet();

            } catch (error) {

                console.error(
                    "getActivePet error:",
                    error
                );

            }

        }


        if (!pet) {

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


        if (name) {

            name.textContent =
                pet.name ||
                "Pet";

        }


        if (level) {

            level.textContent =
                Math.max(
                    1,
                    Number(
                        pet.level
                    ) || 1
                );

        }


        const maxHealth =
            Math.max(
                1,
                Number(
                    pet.maxHealth
                ) || 1
            );


        const currentHealth =
            Math.max(
                0,
                Number(
                    pet.health
                ) || 0
            );


        const healthPercent =
            Math.max(
                0,
                Math.min(
                    100,
                    (
                        currentHealth /
                        maxHealth
                    ) *
                    100
                )
            );


        if (health) {

            health.style.width =
                `${healthPercent}%`;

        }


        if (hunger) {

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


            hunger.style.width =
                `${hungerPercent}%`;

        }

    }


    // ============================================================
    // MAP
    // ============================================================

    toggleMap() {

        if (this.mapOpen) {

            this.closeAll();

            return;

        }


        this.closeAll();


        const panel =
            document.getElementById(
                "map-panel"
            );


        if (!panel) {

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
            !this.game ||
            !this.game.player
        ) {

            return;

        }


        let position = null;


        try {

            if (
                typeof this.game.player.getPosition ===
                "function"
            ) {

                position =
                    this.game.player.getPosition();

            } else if (
                this.game.player.position
            ) {

                position =
                    this.game.player.position;

            }

        } catch (error) {

            console.error(
                "Player position error:",
                error
            );

            return;

        }


        if (!position) {

            return;

        }


        const px =
            Number(
                position.x
            ) || 0;


        const pz =
            Number(
                position.z
            ) || 0;


        let worldSize = 500;


        if (
            this.game.world &&
            Number.isFinite(
                Number(
                    this.game.world.size
                )
            )
        ) {

            worldSize =
                Number(
                    this.game.world.size
                );

        }


        worldSize =
            Math.max(
                1,
                worldSize
            );


        const half =
            worldSize / 2;


        const x =
            (
                (
                    px +
                    half
                ) /
                worldSize
            ) *
            100;


        const z =
            (
                (
                    pz +
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


        if (coordinates) {

            coordinates.textContent =
                `X: ${Math.round(px)} | Z: ${Math.round(pz)}`;

        }


        const discovered =
            document.getElementById(
                "discovered-count"
            );


        const systems =
            this.getSystems();


        if (
            discovered &&
            systems
        ) {

            const locations =
                Array.isArray(
                    systems.discoveredLocations
                )
                    ? systems.discoveredLocations
                    : [];


            discovered.textContent =
                `Locations discovered: ${locations.length}`;

        }

    }


    // ============================================================
    // SETTINGS
    // ============================================================

    toggleSettings() {

        if (this.settingsOpen) {

            this.closeAll();

            return;

        }


        this.closeAll();


        const panel =
            document.getElementById(
                "settings-panel"
            );


        if (!panel) {

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


        this.inventoryOpen =
            false;

        this.mapOpen =
            false;

        this.petOpen =
            false;

        this.settingsOpen =
            false;

        this.statsOpen =
            false;

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


        const health =
            Number(
                player.health
            ) || 0;


        const maxHealth =
            Math.max(
                1,
                Number(
                    player.maxHealth
                ) || 1
            );


        const stamina =
            Number(
                player.stamina
            ) || 0;


        const maxStamina =
            Math.max(
                1,
                Number(
                    player.maxStamina
                ) || 1
            );


        const hunger =
            Number(
                player.hunger
            ) || 0;


        const maxHunger =
            Math.max(
                1,
                Number(
                    player.maxHunger
                ) || 1
            );


        this.updateBar(
            "health-fill",
            health,
            maxHealth
        );


        this.updateBar(
            "stamina-fill",
            stamina,
            maxStamina
        );


        this.updateBar(
            "hunger-fill",
            hunger,
            maxHunger
        );


        this.setText(
            "health-text",
            `${Math.round(health)}/${Math.round(maxHealth)}`
        );


        this.setText(
            "stamina-text",
            `${Math.round(stamina)}/${Math.round(maxStamina)}`
        );


        this.setText(
            "hunger-text",
            `${Math.round(hunger)}/${Math.round(maxHunger)}`
        );


        const systems =
            this.getSystems();


        if (systems) {

            this.setText(
                "ui-coins",
                Number(
                    systems.coins
                ) || 0
            );

        }

    }


    // ============================================================
    // XP
    // ============================================================

    updateXP() {

        const systems =
            this.getSystems();


        if (!systems) {

            return;

        }


        const level =
            Math.max(
                1,
                Number(
                    systems.level
                ) || 1
            );


        const xp =
            Math.max(
                0,
                Number(
                    systems.xp
                ) || 0
            );


        const xpToNextLevel =
            Math.max(
                1,
                Number(
                    systems.xpToNextLevel
                ) || 100
            );


        this.setText(
            "ui-level",
            level
        );


        this.setText(
            "xp-text",
            `${Math.floor(xp)} / ${Math.floor(xpToNextLevel)} XP`
        );


        const percent =
            (
                xp /
                xpToNextLevel
            ) *
            100;


        const fill =
            document.getElementById(
                "ui-xp-fill"
            );


        if (fill) {

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


        const systems =
            this.getSystems();


        if (
            !container ||
            !systems
        ) {

            return;

        }


        const stats =
            systems.statistics &&
            typeof systems.statistics === "object"
                ? systems.statistics
                : {};


        const playTime =
            Math.max(
                0,
                Number(
                    stats.playTime
                ) || 0
            );


        const minutes =
            Math.floor(
                playTime / 60
            );


        const seconds =
            Math.floor(
                playTime % 60
            );


        const achievements =
            Array.isArray(
                systems.achievements
            )
                ? systems.achievements.length
                : 0;


        container.innerHTML = `

            <div class="stat-row">

                <span>
                    🐾 Creatures Captured
                </span>

                <strong>
                    ${Number(
                        stats.creaturesCaptured
                    ) || 0}
                </strong>

            </div>


            <div class="stat-row">

                <span>
                    ⚔️ Creatures Defeated
                </span>

                <strong>
                    ${Number(
                        stats.creaturesDefeated
                    ) || 0}
                </strong>

            </div>


            <div class="stat-row">

                <span>
                    ⛏️ Resources Collected
                </span>

                <strong>
                    ${Number(
                        stats.resourcesCollected
                    ) || 0}
                </strong>

            </div>


            <div class="stat-row">

                <span>
                    🍖 Food Consumed
                </span>

                <strong>
                    ${Number(
                        stats.foodConsumed
                    ) || 0}
                </strong>

            </div>


            <div class="stat-row">

                <span>
                    ⚔️ Damage Dealt
                </span>

                <strong>
                    ${Math.round(
                        Number(
                            stats.damageDealt
                        ) || 0
                    )}
                </strong>

            </div>


            <div class="stat-row">

                <span>
                    ❤️ Damage Taken
                </span>

                <strong>
                    ${Math.round(
                        Number(
                            stats.damageTaken
                        ) || 0
                    )}
                </strong>

            </div>


            <div class="stat-row">

                <span>
                    🗺️ Locations
                </span>

                <strong>
                    ${Number(
                        stats.locationsDiscovered
                    ) || 0}
                </strong>

            </div>


            <div class="stat-row">

                <span>
                    🏆 Achievements
                </span>

                <strong>
                    ${achievements}
                </strong>

            </div>


            <div class="stat-row">

                <span>
                    ⏱️ Play Time
                </span>

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

        try {

            this.updatePlayerStatus();
            this.updateXP();
            this.updateActivePet();
            this.updateInventory();
            this.updatePets();
            this.updateMap();
            this.updateStatistics();

        } catch (error) {

            console.error(
                "GameUI updateAll error:",
                error
            );

        }

    }


    // ============================================================
    // MAIN UPDATE
    // ============================================================

    update(delta = 0) {

        if (!this.initialized) {

            return;

        }


        const now =
            performance.now();


        // --------------------------------------------------------
        // PLAYER + XP
        // --------------------------------------------------------

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


        // --------------------------------------------------------
        // ACTIVE PET
        // --------------------------------------------------------

        if (
            now -
            this.lastPetUpdate >
            250
        ) {

            this.lastPetUpdate =
                now;

            this.updateActivePet();

        }


        // --------------------------------------------------------
        // INVENTORY
        // --------------------------------------------------------

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


        // --------------------------------------------------------
        // PETS
        // --------------------------------------------------------

        if (
            this.petOpen &&
            now -
            this.lastPetUpdate >
            500
        ) {

            this.updatePets();

        }


        // --------------------------------------------------------
        // MAP
        // --------------------------------------------------------

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


        // --------------------------------------------------------
        // STATISTICS
        // --------------------------------------------------------

        if (
            now -
            this.lastStatsUpdate >
            1000
        ) {

            this.lastStatsUpdate =
                now;

            this.updateStatistics();

        }

    }


    // ============================================================
    // EXPORT SAVE
    // ============================================================

    exportSave() {

        const systems =
            this.getSystems();


        if (
            !systems ||
            typeof systems.exportSave !==
            "function"
        ) {

            this.notify(
                "❌ Export system unavailable"
            );

            return;

        }


        let data = null;


        try {

            data =
                systems.exportSave();

        } catch (error) {

            console.error(
                "Export error:",
                error
            );

            this.notify(
                "❌ Export failed"
            );

            return;

        }


        if (
            data === null ||
            data === undefined ||
            data === ""
        ) {

            this.notify(
                "❌ Export failed"
            );

            return;

        }


        if (
            typeof data !== "string"
        ) {

            try {

                data =
                    JSON.stringify(
                        data,
                        null,
                        2
                    );

            } catch (error) {

                console.error(
                    "Export stringify error:",
                    error
                );

                this.notify(
                    "❌ Export failed"
                );

                return;

            }

        }


        try {

            const blob =
                new Blob(
                    [data],
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


            link.style.display =
                "none";


            document.body.appendChild(
                link
            );


            link.click();


            link.remove();


            setTimeout(
                () => {

                    URL.revokeObjectURL(
                        url
                    );

                },
                1000
            );


            this.notify(
                "📤 Save exported"
            );

        } catch (error) {

            console.error(
                "Export download error:",
                error
            );

            this.notify(
                "❌ Export failed"
            );

        }

    }


    // ============================================================
    // IMPORT SAVE
    // ============================================================

    importSave(file) {

        const systems =
            this.getSystems();


        if (
            !file ||
            !systems ||
            typeof systems.importSave !==
            "function"
        ) {

            this.notify(
                "❌ Import system unavailable"
            );

            return;

        }


        if (
            file.size >
            10 * 1024 * 1024
        ) {

            this.notify(
                "❌ Save file is too large"
            );

            return;

        }


        const reader =
            new FileReader();


        reader.onload =
            event => {

                try {

                    const text =
                        event &&
                        event.target
                            ? event.target.result
                            : "";


                    if (
                        typeof text !==
                        "string" ||
                        !text.trim()
                    ) {

                        this.notify(
                            "❌ Empty save file"
                        );

                        return;

                    }


                    const success =
                        systems.importSave(
                            text
                        );


                    if (success === false) {

                        this.notify(
                            "❌ Invalid save"
                        );

                        return;

                    }


                    this.notify(
                        "📥 Save imported. Reloading..."
                    );


                    setTimeout(
                        () => {

                            window.location.reload();

                        },
                        800
                    );

                } catch (error) {

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


        try {

            reader.readAsText(
                file
            );

        } catch (error) {

            console.error(
                "FileReader error:",
                error
            );

            this.notify(
                "❌ File could not be read"
            );

        }

    }


    // ============================================================
    // NOTIFICATION
    // ============================================================

    notify(message) {

        const text =
            String(
                message ??
                ""
            ).trim();


        if (!text) {

            return;

        }


        // --------------------------------------------------------
        // Use game's notification system only if it exists.
        // --------------------------------------------------------

        if (
            this.game &&
            typeof this.game.showNotification ===
            "function"
        ) {

            try {

                this.game.showNotification(
                    text
                );

                return;

            } catch (error) {

                console.error(
                    "Game notification error:",
                    error
                );

            }

        }


        const container =
            document.getElementById(
                "ui-notifications"
            );


        if (!container) {

            return;

        }


        const item =
            document.createElement(
                "div"
            );


        item.className =
            "ui-notification";


        item.textContent =
            text;


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

                        if (
                            item &&
                            item.parentNode
                        ) {

                            item.remove();

                        }

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


        if (!element) {

            return;

        }


        const current =
            Number(
                value
            ) || 0;


        const maximum =
            Math.max(
                1,
                Number(
                    max
                ) || 1
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


        if (element) {

            element.textContent =
                String(
                    value ?? ""
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
                value ?? ""
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


            /* ==================================================
               TOP STATUS
               ================================================== */

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


            /* ==================================================
               CROSSHAIR
               ================================================== */

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

                pointer-events: none;

            }


            /* ==================================================
               ACTIVE PET
               ================================================== */

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


            /* ==================================================
               XP
               ================================================== */

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


            /* ==================================================
               ACTION BUTTONS
               ================================================== */

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


            /* ==================================================
               MENU BUTTONS
               ================================================== */

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


            /* ==================================================
               PANELS
               ================================================== */

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


            /* ==================================================
               INVENTORY
               ================================================== */

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


            /* ==================================================
               PETS
               ================================================== */

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


            /* ==================================================
               MAP
               ================================================== */

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


            /* ==================================================
               STATISTICS
               ================================================== */

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


            /* ==================================================
               SETTINGS
               ================================================== */

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


            /* ==================================================
               NOTIFICATIONS
               ================================================== */

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

                width:
                    max-content;

                max-width:
                    90vw;

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


            /* ==================================================
               CONTROLS HINT
               ================================================== */

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

                padding:
                    30px 10px;

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


            /* ==================================================
               MOBILE
               ================================================== */

            @media (max-width: 700px) {

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
