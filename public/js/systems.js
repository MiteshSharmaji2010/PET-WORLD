export class GameSystems {

    constructor(game) {

        this.game = game;

        // =============================================
        // PLAYER PROGRESSION
        // =============================================

        this.level = 1;

        this.xp = 0;

        this.xpToNextLevel = 100;


        // =============================================
        // INVENTORY
        // =============================================

        this.inventory = {

            wood: 0,

            stone: 0,

            fiber: 0,

            food: 3,

            captureOrb: 10,

            potion: 2

        };


        // =============================================
        // CAPTURED PETS
        // =============================================

        this.pets = [];

        this.activePetId = null;


        // =============================================
        // GAME PROGRESS
        // =============================================

        this.coins = 0;

        this.discoveredLocations = [];

        this.achievements = [];


        // =============================================
        // SAVE SYSTEM
        // =============================================

        this.saveKey =
            "pet-world-save-v2";

        this.saveTimer = 0;

        this.saveInterval = 30;


        // =============================================
        // STATE
        // =============================================

        this.initialized = false;

    }


    // =================================================
    // INITIALIZE
    // =================================================

    async init() {

        this.loadGame();

        this.validateState();

        this.initialized = true;

        return true;

    }


    // =================================================
    // UPDATE
    // =================================================

    update(delta = 0) {

        delta =
            Math.max(
                0,
                Number(delta) || 0
            );


        this.saveTimer += delta;


        if (
            this.saveTimer >=
            this.saveInterval
        ) {

            this.saveTimer = 0;

            this.saveGame();

        }


        this.updatePets(delta);

    }


    // =================================================
    // PET UPDATE
    // =================================================

    updatePets(delta) {

        if (
            !Array.isArray(
                this.pets
            )
        ) {

            this.pets = [];

            return;

        }


        for (
            const pet of this.pets
        ) {

            if (
                !pet ||
                typeof pet !== "object"
            ) {

                continue;

            }


            pet.hunger =
                Math.max(
                    0,
                    Math.min(
                        100,
                        Number(
                            pet.hunger
                        ) || 0
                    )
                );


            pet.loyalty =
                Math.max(
                    0,
                    Math.min(
                        100,
                        Number(
                            pet.loyalty
                        ) || 0
                    )
                );


            // Slowly consume pet hunger.

            if (
                delta > 0
            ) {

                pet.hunger =
                    Math.max(
                        0,
                        pet.hunger -
                        0.15 *
                        delta
                    );

            }


            // Pet loses a little loyalty
            // when hunger reaches zero.

            if (
                pet.hunger <= 0 &&
                delta > 0
            ) {

                pet.loyalty =
                    Math.max(
                        0,
                        pet.loyalty -
                        0.05 *
                        delta
                    );

            }


            // Keep health valid.

            pet.maxHealth =
                Math.max(
                    1,
                    Number(
                        pet.maxHealth
                    ) || 1
                );


            pet.health =
                Math.max(
                    0,
                    Math.min(
                        pet.maxHealth,
                        Number(
                            pet.health
                        ) || 0
                    )
                );

        }

    }


    // =================================================
    // ADD XP
    // =================================================

    addXP(amount) {

        amount =
            Math.max(
                0,
                Number(amount) || 0
            );


        if (
            amount <= 0
        ) {

            return false;

        }


        this.xp += amount;


        let leveledUp = false;


        while (
            this.xp >=
            this.xpToNextLevel
        ) {

            this.xp -=
                this.xpToNextLevel;


            this.level++;


            this.xpToNextLevel =
                this.calculateXPRequirement(
                    this.level
                );


            leveledUp = true;

        }


        if (
            leveledUp
        ) {

            this.onLevelUp();

        }


        this.saveGame();


        return true;

    }


    // =================================================
    // XP REQUIREMENT
    // =================================================

    calculateXPRequirement(level) {

        level =
            Math.max(
                1,
                Math.floor(
                    Number(level) || 1
                )
            );


        return Math.max(
            100,
            Math.floor(
                100 *
                Math.pow(
                    1.18,
                    level - 1
                )
            )
        );

    }


    // =================================================
    // LEVEL UP
    // =================================================

    onLevelUp() {

        if (
            this.game.player
        ) {

            this.game.player.maxHealth +=
                5;


            this.game.player.health =
                this.game.player.maxHealth;


            this.game.player.maxStamina +=
                3;


            this.game.player.stamina =
                this.game.player.maxStamina;

        }


        if (
            this.game.ui &&
            typeof this.game.ui.notify ===
            "function"
        ) {

            this.game.ui.notify(
                `🎉 LEVEL ${this.level}!`
            );

        }

    }


    // =================================================
    // ADD ITEM
    // =================================================

    addItem(
        item,
        amount = 1
    ) {

        if (
            typeof item !==
            "string" ||
            item.trim() === ""
        ) {

            return false;

        }


        amount =
            Math.floor(
                Number(amount) || 0
            );


        if (
            amount <= 0
        ) {

            return false;

        }


        if (
            !Object.prototype.hasOwnProperty
                .call(
                    this.inventory,
                    item
                )
        ) {

            this.inventory[item] =
                0;

        }


        this.inventory[item] =
            Math.max(
                0,
                Number(
                    this.inventory[item]
                ) || 0
            );


        this.inventory[item] +=
            amount;


        this.saveGame();


        return true;

    }


    // =================================================
    // REMOVE ITEM
    // =================================================

    removeItem(
        item,
        amount = 1
    ) {

        amount =
            Math.floor(
                Number(amount) || 0
            );


        if (
            amount <= 0
        ) {

            return false;

        }


        if (
            !this.hasItem(
                item,
                amount
            )
        ) {

            return false;

        }


        this.inventory[item] -=
            amount;


        this.inventory[item] =
            Math.max(
                0,
                this.inventory[item]
            );


        this.saveGame();


        return true;

    }


    // =================================================
    // CHECK ITEM
    // =================================================

    hasItem(
        item,
        amount = 1
    ) {

        amount =
            Math.max(
                0,
                Number(amount) || 0
            );


        return (
            Number(
                this.inventory[item] || 0
            ) >=
            amount
        );

    }


    // =================================================
    // GET ITEM COUNT
    // =================================================

    getItemCount(
        item
    ) {

        return Math.max(
            0,
            Number(
                this.inventory[item] || 0
            )
        );

    }


    // =================================================
    // USE HEALING FOOD
    // =================================================

    useHealingFood() {

        if (
            !this.game.player
        ) {

            return false;

        }


        if (
            this.game.player.dead
        ) {

            return false;

        }


        if (
            this.game.player.health >=
            this.game.player.maxHealth
        ) {

            if (
                this.game.ui
            ) {

                this.game.ui.notify(
                    "❤️ Health is already full."
                );

            }

            return false;

        }


        if (
            !this.removeItem(
                "food",
                1
            )
        ) {

            if (
                this.game.ui
            ) {

                this.game.ui.notify(
                    "🍖 No food!"
                );

            }

            return false;

        }


        this.game.player.hunger =
            Math.min(
                this.game.player.maxHunger,
                this.game.player.hunger +
                25
            );


        this.game.player.heal(
            20
        );


        if (
            this.game.ui
        ) {

            this.game.ui.notify(
                "🍖 Food used. +20 HP"
            );

        }


        return true;

    }


    // =================================================
    // USE POTION
    // =================================================

    usePotion() {

        if (
            !this.game.player
        ) {

            return false;

        }


        if (
            this.game.player.dead
        ) {

            return false;

        }


        if (
            this.game.player.health >=
            this.game.player.maxHealth
        ) {

            if (
                this.game.ui
            ) {

                this.game.ui.notify(
                    "❤️ Health is already full."
                );

            }

            return false;

        }


        if (
            !this.removeItem(
                "potion",
                1
            )
        ) {

            if (
                this.game.ui
            ) {

                this.game.ui.notify(
                    "🧪 No potion!"
                );

            }

            return false;

        }


        this.game.player.heal(
            50
        );


        if (
            this.game.ui
        ) {

            this.game.ui.notify(
                "🧪 Potion used. +50 HP"
            );

        }


        return true;

    }


    // =================================================
    // CAPTURE NEAREST CREATURE
    // =================================================

    captureNearestCreature() {

        if (
            !this.game.creatures
        ) {

            return false;

        }


        if (
            !this.hasItem(
                "captureOrb",
                1
            )
        ) {

            if (
                this.game.ui
            ) {

                this.game.ui.notify(
                    "🔵 No Capture Orb!"
                );

            }

            return false;

        }


        const creature =
            this.game.creatures
                .getNearestCreature(
                    6
                );


        if (
            !creature
        ) {

            if (
                this.game.ui
            ) {

                this.game.ui.notify(
                    "🐾 No creature nearby."
                );

            }

            return false;

        }


        const success =
            this.game.creatures
                .captureNearestCreature();


        if (
            success
        ) {

            this.removeItem(
                "captureOrb",
                1
            );

        }


        return success;

    }


    // =================================================
    // ADD PET
    // =================================================

    addPet(
        pet
    ) {

        if (
            !pet ||
            pet.id === undefined ||
            pet.id === null
        ) {

            return false;

        }


        const existing =
            this.pets.find(
                item =>
                    String(item.id) ===
                    String(pet.id)
            );


        if (
            existing
        ) {

            return false;

        }


        const level =
            Math.max(
                1,
                Math.floor(
                    Number(
                        pet.level
                    ) || 1
                )
            );


        const maxHealth =
            Math.max(
                1,
                Number(
                    pet.maxHealth
                ) || 50
            );


        const savedPet = {

            id:
                pet.id,

            speciesId:
                pet.speciesId ||
                "unknown",

            name:
                String(
                    pet.name ||
                    "Unknown"
                ),

            rarity:
                String(
                    pet.rarity ||
                    "Common"
                ),

            level:
                level,

            health:
                Math.max(
                    1,
                    Math.min(
                        maxHealth,
                        Number(
                            pet.health
                        ) || maxHealth
                    )
                ),

            maxHealth:
                maxHealth,

            damage:
                Math.max(
                    1,
                    Number(
                        pet.damage
                    ) || 5
                ),

            speed:
                Math.max(
                    0,
                    Number(
                        pet.speed
                    ) || 1
                ),

            experience:
                Math.max(
                    0,
                    Number(
                        pet.experience
                    ) || 0
                ),

            hunger:
                Math.max(
                    0,
                    Math.min(
                        100,
                        Number(
                            pet.hunger
                        ) || 100
                    )
                ),

            loyalty:
                Math.max(
                    0,
                    Math.min(
                        100,
                        Number(
                            pet.loyalty
                        ) || 50
                    )
                )

        };


        this.pets.push(
            savedPet
        );


        if (
            this.activePetId ===
            null
        ) {

            this.activePetId =
                savedPet.id;

        }


        this.saveGame();


        if (
            this.game.ui &&
            typeof this.game.ui.notify ===
            "function"
        ) {

            this.game.ui.notify(
                `🐾 ${savedPet.name} added to your pets!`
            );

        }


        return true;

    }


    // =================================================
    // REMOVE PET
    // =================================================

    removePet(
        petId
    ) {

        const index =
            this.pets.findIndex(
                pet =>
                    String(pet.id) ===
                    String(petId)
            );


        if (
            index ===
            -1
        ) {

            return false;

        }


        const removed =
            this.pets[index];


        this.pets.splice(
            index,
            1
        );


        if (
            String(this.activePetId) ===
            String(petId)
        ) {

            this.activePetId =
                this.pets.length > 0
                    ? this.pets[0].id
                    : null;

        }


        this.saveGame();


        if (
            this.game.ui
        ) {

            this.game.ui.notify(
                `🐾 ${removed.name} removed.`
            );

        }


        return true;

    }


    // =================================================
    // GET PET
    // =================================================

    getPet(
        petId
    ) {

        return this.pets.find(
            pet =>
                String(pet.id) ===
                String(petId)
        ) || null;

    }


    // =================================================
    // GET ACTIVE PET
    // =================================================

    getActivePet() {

        if (
            this.activePetId ===
            null ||
            this.activePetId ===
            undefined
        ) {

            return null;

        }


        const pet =
            this.getPet(
                this.activePetId
            );


        if (
            !pet
        ) {

            this.activePetId =
                this.pets.length > 0
                    ? this.pets[0].id
                    : null;


            return this.activePetId !== null
                ? this.getPet(
                    this.activePetId
                )
                : null;

        }


        return pet;

    }


    // =================================================
    // SET ACTIVE PET
    // =================================================

    setActivePet(
        petId
    ) {

        const pet =
            this.getPet(
                petId
            );


        if (
            !pet
        ) {

            return false;

        }


        this.activePetId =
            pet.id;


        this.saveGame();


        if (
            this.game.ui &&
            typeof this.game.ui.notify ===
            "function"
        ) {

            this.game.ui.notify(
                `${pet.name} is now active!`
            );

        }


        return true;

    }


    // =================================================
    // ADD COINS
    // =================================================

    addCoins(
        amount
    ) {

        amount =
            Math.floor(
                Number(amount) || 0
            );


        if (
            amount <= 0
        ) {

            return false;

        }


        this.coins +=
            amount;


        this.coins =
            Math.max(
                0,
                this.coins
            );


        this.saveGame();


        return true;

    }


    // =================================================
    // SPEND COINS
    // =================================================

    spendCoins(
        amount
    ) {

        amount =
            Math.floor(
                Number(amount) || 0
            );


        if (
            amount <= 0
        ) {

            return false;

        }


        if (
            this.coins <
            amount
        ) {

            return false;

        }


        this.coins -=
            amount;


        this.coins =
            Math.max(
                0,
                this.coins
            );


        this.saveGame();


        return true;

    }


    // =================================================
    // DISCOVER LOCATION
    // =================================================

    discoverLocation(
        locationId
    ) {

        if (
            locationId ===
            undefined ||
            locationId ===
            null ||
            String(locationId).trim() === ""
        ) {

            return false;

        }


        const id =
            String(
                locationId
            );


        if (
            this.discoveredLocations
                .includes(
                    id
                )
        ) {

            return false;

        }


        this.discoveredLocations.push(
            id
        );


        if (
            this.game.ui &&
            typeof this.game.ui.notify ===
            "function"
        ) {

            this.game.ui.notify(
                "📍 New location discovered!"
            );

        }


        this.saveGame();


        return true;

    }


    // =================================================
    // CHECK LOCATION
    // =================================================

    hasDiscoveredLocation(
        locationId
    ) {

        return this.discoveredLocations
            .includes(
                String(
                    locationId
                )
            );

    }


    // =================================================
    // ACHIEVEMENT
    // =================================================

    unlockAchievement(
        achievementId
    ) {

        if (
            achievementId ===
            undefined ||
            achievementId ===
            null ||
            String(achievementId).trim() === ""
        ) {

            return false;

        }


        const id =
            String(
                achievementId
            );


        if (
            this.achievements
                .includes(
                    id
                )
        ) {

            return false;

        }


        this.achievements.push(
            id
        );


        if (
            this.game.ui &&
            typeof this.game.ui.notify ===
            "function"
        ) {

            this.game.ui.notify(
                "🏆 Achievement unlocked!"
            );

        }


        this.saveGame();


        return true;

    }


    // =================================================
    // CHECK ACHIEVEMENT
    // =================================================

    hasAchievement(
        achievementId
    ) {

        return this.achievements
            .includes(
                String(
                    achievementId
                )
            );

    }


    // =================================================
    // SAVE GAME
    // =================================================

    saveGame() {

        try {

            const data = {

                version:
                    2,

                level:
                    this.level,

                xp:
                    this.xp,

                xpToNextLevel:
                    this.xpToNextLevel,

                inventory:
                    {
                        ...this.inventory
                    },

                pets:
                    this.pets.map(
                        pet => ({
                            ...pet
                        })
                    ),

                activePetId:
                    this.activePetId,

                coins:
                    this.coins,

                discoveredLocations:
                    [
                        ...this.discoveredLocations
                    ],

                achievements:
                    [
                        ...this.achievements
                    ]

            };


            localStorage.setItem(
                this.saveKey,
                JSON.stringify(
                    data
                )
            );


            return true;


        } catch (
            error
        ) {

            console.error(
                "PET WORLD save failed:",
                error
            );


            return false;

        }

    }


    // =================================================
    // LOAD GAME
    // =================================================

    loadGame() {

        try {

            let raw =
                localStorage.getItem(
                    this.saveKey
                );


            // Backward compatibility.

            if (
                !raw
            ) {

                raw =
                    localStorage.getItem(
                        "pet-world-save-v1"
                    );

            }


            if (
                !raw
            ) {

                return false;

            }


            const data =
                JSON.parse(
                    raw
                );


            if (
                !data ||
                typeof data !==
                "object"
            ) {

                return false;

            }


            // -----------------------------
            // LEVEL
            // -----------------------------

            if (
                Number.isFinite(
                    Number(
                        data.level
                    )
                )
            ) {

                this.level =
                    Math.max(
                        1,
                        Math.floor(
                            Number(
                                data.level
                            )
                        )
                    );

            }


            // -----------------------------
            // XP
            // -----------------------------

            if (
                Number.isFinite(
                    Number(
                        data.xp
                    )
                )
            ) {

                this.xp =
                    Math.max(
                        0,
                        Number(
                            data.xp
                        )
                    );

            }


            // -----------------------------
            // XP REQUIREMENT
            // -----------------------------

            this.xpToNextLevel =
                Math.max(
                    1,
                    Number(
                        data.xpToNextLevel
                    ) ||
                    this.calculateXPRequirement(
                        this.level
                    )
                );


            // -----------------------------
            // INVENTORY
            // -----------------------------

            if (
                data.inventory &&
                typeof data.inventory ===
                "object"
            ) {

                this.inventory =
                    {
                        ...this.inventory,
                        ...data.inventory
                    };

            }


            // -----------------------------
            // PETS
            // -----------------------------

            if (
                Array.isArray(
                    data.pets
                )
            ) {

                this.pets =
                    data.pets;

            }


            // -----------------------------
            // ACTIVE PET
            // -----------------------------

            if (
                data.activePetId !==
                undefined
            ) {

                this.activePetId =
                    data.activePetId;

            }


            // -----------------------------
            // COINS
            // -----------------------------

            if (
                Number.isFinite(
                    Number(
                        data.coins
                    )
                )
            ) {

                this.coins =
                    Math.max(
                        0,
                        Math.floor(
                            Number(
                                data.coins
                            )
                        )
                    );

            }


            // -----------------------------
            // LOCATIONS
            // -----------------------------

            if (
                Array.isArray(
                    data.discoveredLocations
                )
            ) {

                this.discoveredLocations =
                    data.discoveredLocations
                        .map(
                            value =>
                                String(value)
                        );

            }


            // -----------------------------
            // ACHIEVEMENTS
            // -----------------------------

            if (
                Array.isArray(
                    data.achievements
                )
            ) {

                this.achievements =
                    data.achievements
                        .map(
                            value =>
                                String(value)
                        );

            }


            this.validateState();


            return true;


        } catch (
            error
        ) {

            console.error(
                "PET WORLD load failed:",
                error
            );


            return false;

        }

    }


    // =================================================
    // VALIDATE STATE
    // =================================================

    validateState() {

        this.level =
            Math.max(
                1,
                Math.floor(
                    Number(
                        this.level
                    ) || 1
                )
            );


        this.xp =
            Math.max(
                0,
                Number(
                    this.xp
                ) || 0
            );


        this.xpToNextLevel =
            Math.max(
                1,
                Number(
                    this.xpToNextLevel
                ) ||
                this.calculateXPRequirement(
                    this.level
                )
            );


        if (
            !this.inventory ||
            typeof this.inventory !==
            "object"
        ) {

            this.inventory = {};

        }


        const defaultInventory = {

            wood: 0,

            stone: 0,

            fiber: 0,

            food: 3,

            captureOrb: 10,

            potion: 2

        };


        this.inventory =
            {
                ...defaultInventory,
                ...this.inventory
            };


        Object.keys(
            this.inventory
        )
            .forEach(
                item => {

                    this.inventory[item] =
                        Math.max(
                            0,
                            Math.floor(
                                Number(
                                    this.inventory[item]
                                ) || 0
                            )
                        );

                }
            );


        if (
            !Array.isArray(
                this.pets
            )
        ) {

            this.pets = [];

        }


        if (
            !Array.isArray(
                this.discoveredLocations
            )
        ) {

            this.discoveredLocations = [];

        }


        if (
            !Array.isArray(
                this.achievements
            )
        ) {

            this.achievements = [];

        }


        this.coins =
            Math.max(
                0,
                Math.floor(
                    Number(
                        this.coins
                    ) || 0
                )
            );


        // Remove invalid pets.

        this.pets =
            this.pets.filter(
                pet =>
                    pet &&
                    pet.id !==
                    undefined &&
                    pet.id !==
                    null
            );


        // Repair active pet.

        if (
            this.pets.length === 0
        ) {

            this.activePetId =
                null;

        } else {

            const activeExists =
                this.pets.some(
                    pet =>
                        String(
                            pet.id
                        ) ===
                        String(
                            this.activePetId
                        )
                );


            if (
                !activeExists
            ) {

                this.activePetId =
                    this.pets[0].id;

            }

        }

    }


    // =================================================
    // RESET GAME
    // =================================================

    resetGame() {

        try {

            localStorage.removeItem(
                this.saveKey
            );

            localStorage.removeItem(
                "pet-world-save-v1"
            );

        } catch (
            error
        ) {

            console.error(
                "PET WORLD reset failed:",
                error
            );

        }


        if (
            this.game &&
            typeof this.game.stop ===
            "function"
        ) {

            this.game.stop();

        }


        window.location.reload();

    }

}
