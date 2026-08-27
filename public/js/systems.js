// ============================================================
// PET WORLD
// public/js/systems.js
// Complete Game Systems
// ============================================================

export class GameSystems {

    constructor(game) {

        this.game = game;

        // ====================================================
        // PLAYER PROGRESSION
        // ====================================================

        this.level = 1;
        this.xp = 0;
        this.xpToNextLevel = 100;
        this.totalXP = 0;

        // ====================================================
        // PLAYER INVENTORY
        // ====================================================

        this.inventory = {
            wood: 0,
            stone: 0,
            fiber: 0,
            food: 3,
            captureOrb: 10,
            potion: 2
        };

        // ====================================================
        // PET SYSTEM
        // ====================================================

        this.pets = [];
        this.activePetId = null;
        this.maxPets = 50;

        // ====================================================
        // CURRENCY
        // ====================================================

        this.coins = 0;

        // ====================================================
        // WORLD PROGRESS
        // ====================================================

        this.discoveredLocations = [];
        this.achievements = [];

        // ====================================================
        // STATISTICS
        // ====================================================

        this.statistics = {
            creaturesCaptured: 0,
            creaturesDefeated: 0,
            resourcesCollected: 0,
            foodConsumed: 0,
            damageDealt: 0,
            damageTaken: 0,
            distanceTravelled: 0,
            locationsDiscovered: 0,
            playTime: 0
        };

        // ====================================================
        // SAVE SYSTEM
        // ====================================================

        this.saveKey = "pet-world-save-v2";
        this.saveTimer = 0;
        this.saveInterval = 30;

        // ====================================================
        // GAME STATE
        // ====================================================

        this.initialized = false;
    }


    // ============================================================
    // INITIALIZE
    // ============================================================

    async init() {

        this.loadGame();
        this.validateData();

        this.initialized = true;

        this.notify("💾 Game data loaded");

        return true;
    }


    // ============================================================
    // UPDATE
    // ============================================================

    update(delta) {

        if (!this.initialized) {
            return;
        }

        delta = Math.max(
            0,
            Number(delta) || 0
        );

        // --------------------------------------------------------
        // Play time
        // --------------------------------------------------------

        this.statistics.playTime += delta;

        // --------------------------------------------------------
        // Auto save
        // --------------------------------------------------------

        this.saveTimer += delta;

        if (this.saveTimer >= this.saveInterval) {

            this.saveTimer = 0;

            this.saveGame();
        }
    }


    // ============================================================
    // NOTIFICATION
    // ============================================================

    notify(message) {

        if (
            this.game &&
            this.game.ui &&
            typeof this.game.ui.notify === "function"
        ) {

            try {

                this.game.ui.notify(message);

            } catch (error) {

                console.warn(
                    "PET WORLD notification error:",
                    error
                );
            }

            return;
        }

        // Fallback for development/debugging.
        console.log("[PET WORLD]", message);
    }


    // ============================================================
    // PLAYER XP
    // ============================================================

    addXP(amount) {

        amount = Math.max(
            0,
            Number(amount) || 0
        );

        if (amount <= 0) {
            return false;
        }

        this.xp += amount;
        this.totalXP += amount;

        let leveledUp = false;

        while (this.xp >= this.xpToNextLevel) {

            this.xp -= this.xpToNextLevel;

            this.level++;

            this.xpToNextLevel =
                this.calculateXPRequired(this.level);

            leveledUp = true;
        }

        if (leveledUp) {
            this.onLevelUp();
        }

        this.saveGame();

        return true;
    }


    // ============================================================
    // XP CALCULATION
    // ============================================================

    calculateXPRequired(level) {

        level = Math.max(
            1,
            Math.floor(
                Number(level) || 1
            )
        );

        return Math.floor(
            100 * Math.pow(
                1.18,
                level - 1
            )
        );
    }


    // ============================================================
    // LEVEL UP
    // ============================================================

    onLevelUp() {

        if (
            this.game &&
            this.game.player
        ) {

            const player = this.game.player;

            // ----------------------------------------------------
            // Health
            // ----------------------------------------------------

            if (
                Number.isFinite(
                    Number(player.maxHealth)
                )
            ) {

                player.maxHealth += 5;

                player.health =
                    player.maxHealth;
            }

            // ----------------------------------------------------
            // Stamina
            // ----------------------------------------------------

            if (
                Number.isFinite(
                    Number(player.maxStamina)
                )
            ) {

                player.maxStamina += 3;

                player.stamina =
                    player.maxStamina;
            }

            // ----------------------------------------------------
            // Hunger
            // ----------------------------------------------------

            if (
                Number.isFinite(
                    Number(player.maxHunger)
                )
            ) {

                player.maxHunger += 2;

                if (
                    Number.isFinite(
                        Number(player.hunger)
                    )
                ) {

                    player.hunger =
                        Math.min(
                            player.maxHunger,
                            player.hunger + 2
                        );
                }
            }
        }

        this.notify(
            "🎉 LEVEL " + this.level + "!"
        );

        this.unlockAchievement(
            "level_" + this.level
        );
    }


    // ============================================================
    // GET LEVEL
    // ============================================================

    getLevel() {

        return this.level;
    }


    // ============================================================
    // GET XP
    // ============================================================

    getXP() {

        return this.xp;
    }


    // ============================================================
    // GET TOTAL XP
    // ============================================================

    getTotalXP() {

        return this.totalXP;
    }


    // ============================================================
    // GET XP PERCENT
    // ============================================================

    getXPPercent() {

        if (this.xpToNextLevel <= 0) {
            return 0;
        }

        return Math.max(
            0,
            Math.min(
                100,
                (
                    this.xp /
                    this.xpToNextLevel
                ) * 100
            )
        );
    }


    // ============================================================
    // INVENTORY
    // ============================================================

    addItem(item, amount = 1) {

        if (!item) {
            return false;
        }

        amount = Math.floor(
            Number(amount) || 0
        );

        if (amount <= 0) {
            return false;
        }

        if (
            !Object.prototype.hasOwnProperty.call(
                this.inventory,
                item
            )
        ) {

            this.inventory[item] = 0;
        }

        this.inventory[item] += amount;

        this.statistics.resourcesCollected += amount;

        this.saveGame();

        return true;
    }


    // ============================================================
    // REMOVE ITEM
    // ============================================================

    removeItem(item, amount = 1) {

        if (!item) {
            return false;
        }

        amount = Math.floor(
            Number(amount) || 0
        );

        if (amount <= 0) {
            return false;
        }

        if (!this.hasItem(item, amount)) {
            return false;
        }

        this.inventory[item] -= amount;

        if (this.inventory[item] < 0) {
            this.inventory[item] = 0;
        }

        this.saveGame();

        return true;
    }


    // ============================================================
    // CHECK ITEM
    // ============================================================

    hasItem(item, amount = 1) {

        amount = Math.max(
            0,
            Number(amount) || 0
        );

        return (
            Number(
                this.inventory[item] || 0
            ) >= amount
        );
    }


    // ============================================================
    // ITEM COUNT
    // ============================================================

    getItemCount(item) {

        return Number(
            this.inventory[item] || 0
        );
    }


    // ============================================================
    // CLEAR ITEM
    // ============================================================

    clearItem(item) {

        if (
            Object.prototype.hasOwnProperty.call(
                this.inventory,
                item
            )
        ) {

            this.inventory[item] = 0;

            this.saveGame();

            return true;
        }

        return false;
    }


    // ============================================================
    // GET INVENTORY
    // ============================================================

    getInventory() {

        return {
            ...this.inventory
        };
    }


    // ============================================================
    // USE HEALING FOOD
    // ============================================================

    useHealingFood() {

        if (
            !this.game ||
            !this.game.player
        ) {

            return false;
        }

        const player = this.game.player;

        if (
            Number.isFinite(
                Number(player.health)
            ) &&
            Number.isFinite(
                Number(player.maxHealth)
            ) &&
            player.health >= player.maxHealth
        ) {

            this.notify(
                "❤️ Health is already full"
            );

            return false;
        }

        if (
            !this.removeItem(
                "food",
                1
            )
        ) {

            this.notify(
                "🍖 No food!"
            );

            return false;
        }

        if (
            typeof player.heal ===
            "function"
        ) {

            player.heal(25);

        } else {

            player.health = Math.min(
                player.maxHealth,
                player.health + 25
            );
        }

        if (
            Number.isFinite(
                Number(player.maxHunger)
            ) &&
            Number.isFinite(
                Number(player.hunger)
            )
        ) {

            player.hunger = Math.min(
                player.maxHunger,
                player.hunger + 25
            );
        }

        this.statistics.foodConsumed++;

        this.notify(
            "🍖 Food consumed +25 HP"
        );

        this.saveGame();

        return true;
    }


    // ============================================================
    // USE POTION
    // ============================================================

    usePotion() {

        if (
            !this.game ||
            !this.game.player
        ) {

            return false;
        }

        const player = this.game.player;

        if (
            Number.isFinite(
                Number(player.health)
            ) &&
            Number.isFinite(
                Number(player.maxHealth)
            ) &&
            player.health >= player.maxHealth
        ) {

            this.notify(
                "❤️ Health is already full"
            );

            return false;
        }

        if (
            !this.removeItem(
                "potion",
                1
            )
        ) {

            this.notify(
                "🧪 No potion!"
            );

            return false;
        }

        if (
            typeof player.heal ===
            "function"
        ) {

            player.heal(50);

        } else {

            player.health = Math.min(
                player.maxHealth,
                player.health + 50
            );
        }

        this.notify(
            "🧪 Potion used +50 HP"
        );

        this.saveGame();

        return true;
    }


    // ============================================================
    // CAPTURE NEAREST CREATURE
    // ============================================================

    captureNearestCreature() {

        if (
            !this.game ||
            !this.game.creatures
        ) {

            this.notify(
                "🐾 Creature system unavailable"
            );

            return false;
        }

        let creature = null;

        // --------------------------------------------------------
        // Find nearest creature
        // --------------------------------------------------------

        if (
            typeof this.game.creatures
                .getNearestCreature ===
            "function"
        ) {

            creature =
                this.game.creatures
                    .getNearestCreature(5);
        }

        if (!creature) {

            this.notify(
                "🐾 No creature nearby"
            );

            return false;
        }

        if (creature.dead) {

            this.notify(
                "💀 This creature cannot be captured"
            );

            return false;
        }

        if (
            this.pets.length >=
            this.maxPets
        ) {

            this.notify(
                "🐾 Pet storage is full"
            );

            return false;
        }

        if (
            !this.hasItem(
                "captureOrb",
                1
            )
        ) {

            this.notify(
                "🔵 No Capture Orb!"
            );

            return false;
        }

        // --------------------------------------------------------
        // Remove orb only after creature was found
        // --------------------------------------------------------

        if (
            !this.removeItem(
                "captureOrb",
                1
            )
        ) {

            this.notify(
                "🔵 No Capture Orb!"
            );

            return false;
        }

        let captured = true;

        // --------------------------------------------------------
        // Creature capture method
        // --------------------------------------------------------

        if (
            typeof creature.capture ===
            "function"
        ) {

            try {

                const result =
                    creature.capture();

                if (
                    result !== undefined
                ) {

                    captured = Boolean(result);
                }

            } catch (error) {

                console.error(
                    "Creature capture error:",
                    error
                );

                captured = false;
            }
        }

        // --------------------------------------------------------
        // Creature manager capture method
        // --------------------------------------------------------

        if (
            captured &&
            typeof this.game.creatures
                .captureCreature ===
            "function"
        ) {

            try {

                const result =
                    this.game.creatures
                        .captureCreature(
                            creature
                        );

                if (
                    result !== undefined
                ) {

                    captured =
                        Boolean(result);
                }

            } catch (error) {

                console.error(
                    "Creature manager capture error:",
                    error
                );

                captured = false;
            }
        }

        // --------------------------------------------------------
        // Failed capture
        // --------------------------------------------------------

        if (!captured) {

            this.addItem(
                "captureOrb",
                1
            );

            this.notify(
                "❌ Capture failed"
            );

            return false;
        }

        // --------------------------------------------------------
        // Create pet
        // --------------------------------------------------------

        const pet =
            this.createPetFromCreature(
                creature
            );

        const added =
            this.addPet(pet);

        if (!added) {

            this.addItem(
                "captureOrb",
                1
            );

            this.notify(
                "❌ Could not store pet"
            );

            return false;
        }

        this.statistics.creaturesCaptured++;

        this.addXP(50);

        this.notify(
            "🐾 PET " +
            pet.name +
            " captured!"
        );

        this.saveGame();

        return true;
    }


    // ============================================================
    // CREATE PET FROM CREATURE
    // ============================================================

    createPetFromCreature(creature) {

        creature =
            creature || {};

        const speciesId =
            creature.speciesId ||
            creature.type ||
            creature.species ||
            "creature";

        const name =
            creature.name ||
            creature.species ||
            creature.type ||
            "Wild Pet";

        const rarity =
            creature.rarity ||
            "Common";

        const health =
            Number(
                creature.health
            ) || 50;

        const maxHealth =
            Number(
                creature.maxHealth
            ) || health;

        const damage =
            Number(
                creature.damage
            ) || 5;

        const speed =
            Number(
                creature.speed
            ) || 1;

        return {

            id:
                this.createUniquePetId(),

            speciesId,

            name,

            rarity,

            level:
                Math.max(
                    1,
                    Number(
                        creature.level
                    ) || 1
                ),

            health:
                Math.max(
                    1,
                    health
                ),

            maxHealth:
                Math.max(
                    1,
                    maxHealth
                ),

            damage:
                Math.max(
                    0,
                    damage
                ),

            speed:
                Math.max(
                    0,
                    speed
                ),

            experience: 0,

            hunger: 100,

            loyalty: 50
        };
    }


    // ============================================================
    // UNIQUE PET ID
    // ============================================================

    createUniquePetId() {

        return (
            "pet_" +
            Date.now() +
            "_" +
            Math.random()
                .toString(36)
                .slice(2, 10)
        );
    }


    // ============================================================
    // ADD PET
    // ============================================================

    addPet(pet) {

        if (!pet) {
            return false;
        }

        if (
            this.pets.length >=
            this.maxPets
        ) {

            return false;
        }

        const petId =
            pet.id ||
            this.createUniquePetId();

        if (
            this.pets.some(
                existing =>
                    existing.id === petId
            )
        ) {

            return false;
        }

        const maxHealth =
            Math.max(
                1,
                Number(
                    pet.maxHealth
                ) || 50
            );

        const savedPet = {

            id:
                petId,

            speciesId:
                pet.speciesId ||
                "unknown",

            name:
                pet.name ||
                "Unknown",

            rarity:
                pet.rarity ||
                "Common",

            level:
                Math.max(
                    1,
                    Number(
                        pet.level
                    ) || 1
                ),

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

            maxHealth,

            damage:
                Math.max(
                    0,
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

        this.pets.push(savedPet);

        if (this.activePetId === null) {

            this.activePetId =
                savedPet.id;
        }

        this.saveGame();

        return true;
    }


    // ============================================================
    // REMOVE PET
    // ============================================================

    removePet(petId) {

        if (!petId) {
            return false;
        }

        const index =
            this.pets.findIndex(
                pet =>
                    pet.id === petId
            );

        if (index === -1) {
            return false;
        }

        const removed =
            this.pets.splice(
                index,
                1
            )[0];

        if (
            this.activePetId ===
            petId
        ) {

            this.activePetId =
                this.pets.length > 0
                    ? this.pets[0].id
                    : null;
        }

        this.saveGame();

        return removed;
    }


    // ============================================================
    // GET PET
    // ============================================================

    getPet(petId) {

        if (!petId) {
            return null;
        }

        return (
            this.pets.find(
                pet =>
                    pet.id === petId
            ) ||
            null
        );
    }


    // ============================================================
    // GET ALL PETS
    // ============================================================

    getPets() {

        return this.pets.map(
            pet => ({
                ...pet
            })
        );
    }


    // ============================================================
    // GET ACTIVE PET
    // ============================================================

    getActivePet() {

        if (!this.activePetId) {
            return null;
        }

        return this.getPet(
            this.activePetId
        );
    }


    // ============================================================
    // SET ACTIVE PET
    // ============================================================

    setActivePet(petId) {

        const pet =
            this.getPet(petId);

        if (!pet) {

            this.notify(
                "🐾 Pet not found"
            );

            return false;
        }

        this.activePetId =
            pet.id;

        this.notify(
            "🐾 PET " +
            pet.name +
            " is now active!"
        );

        this.saveGame();

        return true;
    }


    // ============================================================
    // PET XP
    // ============================================================

    addPetXP(
        petId,
        amount
    ) {

        const pet =
            this.getPet(petId);

        if (!pet) {
            return false;
        }

        amount = Math.max(
            0,
            Number(amount) || 0
        );

        if (amount <= 0) {
            return false;
        }

        pet.experience += amount;

        let leveledUp = false;

        while (
            pet.experience >=
            this.getPetXPRequired(
                pet.level
            )
        ) {

            const required =
                this.getPetXPRequired(
                    pet.level
                );

            pet.experience -=
                required;

            pet.level++;

            pet.maxHealth += 5;

            pet.health =
                pet.maxHealth;

            pet.damage += 1;

            leveledUp = true;
        }

        if (leveledUp) {

            this.notify(
                "🐾 PET " +
                pet.name +
                " reached Level " +
                pet.level +
                "!"
            );

            this.unlockAchievement(
                "pet_level_" +
                pet.level
            );
        }

        this.saveGame();

        return true;
    }


    // ============================================================
    // PET XP REQUIRED
    // ============================================================

    getPetXPRequired(level) {

        level = Math.max(
            1,
            Math.floor(
                Number(level) || 1
            )
        );

        return Math.floor(
            50 *
            Math.pow(
                1.2,
                level - 1
            )
        );
    }


    // ============================================================
    // PET XP PERCENT
    // ============================================================

    getPetXPPercent(petId) {

        const pet =
            this.getPet(petId);

        if (!pet) {
            return 0;
        }

        const required =
            this.getPetXPRequired(
                pet.level
            );

        if (required <= 0) {
            return 0;
        }

        return Math.max(
            0,
            Math.min(
                100,
                (
                    pet.experience /
                    required
                ) * 100
            )
        );
    }


    // ============================================================
    // PET HEAL
    // ============================================================

    healPet(
        petId,
        amount = 20
    ) {

        const pet =
            this.getPet(petId);

        if (!pet) {
            return false;
        }

        amount = Math.max(
            0,
            Number(amount) || 0
        );

        if (amount <= 0) {
            return false;
        }

        pet.health =
            Math.min(
                pet.maxHealth,
                pet.health + amount
            );

        this.saveGame();

        return true;
    }


    // ============================================================
    // PET HUNGER
    // ============================================================

    feedPet(petId) {

        const pet =
            this.getPet(petId);

        if (!pet) {
            return false;
        }

        if (
            !this.removeItem(
                "food",
                1
            )
        ) {

            this.notify(
                "🍖 No food!"
            );

            return false;
        }

        pet.hunger =
            Math.min(
                100,
                pet.hunger + 30
            );

        pet.loyalty =
            Math.min(
                100,
                pet.loyalty + 2
            );

        this.statistics.foodConsumed++;

        this.notify(
            "🍖 PET " +
            pet.name +
            " fed"
        );

        this.saveGame();

        return true;
    }


    // ============================================================
    // PET LOYALTY
    // ============================================================

    increasePetLoyalty(
        petId,
        amount = 1
    ) {

        const pet =
            this.getPet(petId);

        if (!pet) {
            return false;
        }

        amount = Math.max(
            0,
            Number(amount) || 0
        );

        pet.loyalty =
            Math.min(
                100,
                pet.loyalty + amount
            );

        this.saveGame();

        return true;
    }


    // ============================================================
    // COINS
    // ============================================================

    addCoins(amount) {

        amount = Math.max(
            0,
            Math.floor(
                Number(amount) || 0
            )
        );

        if (amount <= 0) {
            return false;
        }

        this.coins += amount;

        this.notify(
            "🪙 +" +
            amount +
            " coins"
        );

        this.saveGame();

        return true;
    }


    // ============================================================
    // SPEND COINS
    // ============================================================

    spendCoins(amount) {

        amount = Math.max(
            0,
            Math.floor(
                Number(amount) || 0
            )
        );

        if (amount <= 0) {
            return false;
        }

        if (this.coins < amount) {

            this.notify(
                "🪙 Not enough coins"
            );

            return false;
        }

        this.coins -= amount;

        this.saveGame();

        return true;
    }


    // ============================================================
    // GET COINS
    // ============================================================

    getCoins() {

        return this.coins;
    }


    // ============================================================
    // LOCATION DISCOVERY
    // ============================================================

    discoverLocation(locationId) {

        if (!locationId) {
            return false;
        }

        if (
            this.discoveredLocations
                .includes(locationId)
        ) {

            return false;
        }

        this.discoveredLocations.push(
            locationId
        );

        this.statistics.locationsDiscovered++;

        this.addXP(25);

        this.notify(
            "📍 New location discovered!"
        );

        this.saveGame();

        return true;
    }


    // ============================================================
    // IS LOCATION DISCOVERED
    // ============================================================

    isLocationDiscovered(locationId) {

        return this.discoveredLocations
            .includes(locationId);
    }


    // ============================================================
    // GET DISCOVERED LOCATIONS
    // ============================================================

    getDiscoveredLocations() {

        return [
            ...this.discoveredLocations
        ];
    }


    // ============================================================
    // ACHIEVEMENTS
    // ============================================================

    unlockAchievement(achievementId) {

        if (!achievementId) {
            return false;
        }

        if (
            this.achievements
                .includes(achievementId)
        ) {

            return false;
        }

        this.achievements.push(
            achievementId
        );

        this.notify(
            "🏆 Achievement unlocked!"
        );

        this.saveGame();

        return true;
    }


    // ============================================================
    // CHECK ACHIEVEMENT
    // ============================================================

    hasAchievement(achievementId) {

        return this.achievements
            .includes(
                achievementId
            );
    }


    // ============================================================
    // GET ACHIEVEMENTS
    // ============================================================

    getAchievements() {

        return [
            ...this.achievements
        ];
    }


    // ============================================================
    // DAMAGE DEALT
    // ============================================================

    recordDamageDealt(amount) {

        amount = Math.max(
            0,
            Number(amount) || 0
        );

        this.statistics.damageDealt +=
            amount;
    }


    // ============================================================
    // DAMAGE TAKEN
    // ============================================================

    recordDamageTaken(amount) {

        amount = Math.max(
            0,
            Number(amount) || 0
        );

        this.statistics.damageTaken +=
            amount;
    }


    // ============================================================
    // CREATURE DEFEATED
    // ============================================================

    recordCreatureDefeated() {

        this.statistics.creaturesDefeated++;

        this.addXP(20);

        this.addCoins(5);

        // --------------------------------------------------------
        // Hunter achievement
        // --------------------------------------------------------

        if (
            this.statistics.creaturesDefeated >=
            10
        ) {

            this.unlockAchievement(
                "hunter_10"
            );
        }

        if (
            this.statistics.creaturesDefeated >=
            50
        ) {

            this.unlockAchievement(
                "hunter_50"
            );
        }

        if (
            this.statistics.creaturesDefeated >=
            100
        ) {

            this.unlockAchievement(
                "hunter_100"
            );
        }

        this.saveGame();
    }


    // ============================================================
    // CREATURE CAPTURED
    // ============================================================

    recordCreatureCaptured() {

        this.statistics.creaturesCaptured++;

        if (
            this.statistics.creaturesCaptured >=
            1
        ) {

            this.unlockAchievement(
                "first_pet"
            );
        }

        if (
            this.statistics.creaturesCaptured >=
            10
        ) {

            this.unlockAchievement(
                "collector_10"
            );
        }

        this.saveGame();
    }


    // ============================================================
    // RESOURCE COLLECTED
    // ============================================================

    recordResourceCollected(
        amount = 1
    ) {

        amount = Math.max(
            0,
            Number(amount) || 0
        );

        this.statistics.resourcesCollected +=
            amount;

        this.saveGame();
    }


    // ============================================================
    // DISTANCE
    // ============================================================

    recordDistance(distance) {

        distance = Math.max(
            0,
            Number(distance) || 0
        );

        this.statistics.distanceTravelled +=
            distance;
    }


    // ============================================================
    // GET STATISTICS
    // ============================================================

    getStatistics() {

        return {
            ...this.statistics
        };
    }


    // ============================================================
    // VALIDATE SAVE DATA
    // ============================================================

    validateData() {

        // --------------------------------------------------------
        // Level
        // --------------------------------------------------------

        if (
            !Number.isFinite(
                Number(this.level)
            ) ||
            this.level < 1
        ) {

            this.level = 1;
        }

        this.level =
            Math.floor(
                Number(this.level)
            );


        // --------------------------------------------------------
        // XP
        // --------------------------------------------------------

        if (
            !Number.isFinite(
                Number(this.xp)
            ) ||
            this.xp < 0
        ) {

            this.xp = 0;
        }


        // --------------------------------------------------------
        // Total XP
        // --------------------------------------------------------

        if (
            !Number.isFinite(
                Number(this.totalXP)
            ) ||
            this.totalXP < 0
        ) {

            this.totalXP = 0;
        }


        // --------------------------------------------------------
        // XP required
        // --------------------------------------------------------

        this.xpToNextLevel =
            this.calculateXPRequired(
                this.level
            );


        // --------------------------------------------------------
        // Inventory
        // --------------------------------------------------------

        if (
            !this.inventory ||
            typeof this.inventory !==
            "object" ||
            Array.isArray(this.inventory)
        ) {

            this.inventory = {};
        }

        const defaultItems = {

            wood: 0,
            stone: 0,
            fiber: 0,
            food: 3,
            captureOrb: 10,
            potion: 2
        };

        Object.keys(defaultItems)
            .forEach(item => {

                if (
                    !Number.isFinite(
                        Number(
                            this.inventory[item]
                        )
                    )
                ) {

                    this.inventory[item] =
                        defaultItems[item];

                } else {

                    this.inventory[item] =
                        Math.max(
                            0,
                            Number(
                                this.inventory[item]
                            )
                        );
                }
            });


        // --------------------------------------------------------
        // Pets
        // --------------------------------------------------------

        if (
            !Array.isArray(
                this.pets
            )
        ) {

            this.pets = [];
        }

        this.pets =
            this.pets
                .filter(
                    pet =>
                        pet &&
                        typeof pet === "object"
                )
                .slice(
                    0,
                    this.maxPets
                );


        // --------------------------------------------------------
        // Validate pets
        // --------------------------------------------------------

        this.pets.forEach(pet => {

            if (!pet.id) {
                pet.id =
                    this.createUniquePetId();
            }

            pet.speciesId =
                pet.speciesId ||
                "unknown";

            pet.name =
                pet.name ||
                "Unknown";

            pet.rarity =
                pet.rarity ||
                "Common";

            pet.level =
                Math.max(
                    1,
                    Math.floor(
                        Number(
                            pet.level
                        ) || 1
                    )
                );

            pet.maxHealth =
                Math.max(
                    1,
                    Number(
                        pet.maxHealth
                    ) || 50
                );

            pet.health =
                Math.max(
                    0,
                    Math.min(
                        pet.maxHealth,
                        Number(
                            pet.health
                        ) || pet.maxHealth
                    )
                );

            pet.damage =
                Math.max(
                    0,
                    Number(
                        pet.damage
                    ) || 5
                );

            pet.speed =
                Math.max(
                    0,
                    Number(
                        pet.speed
                    ) || 1
                );

            pet.experience =
                Math.max(
                    0,
                    Number(
                        pet.experience
                    ) || 0
                );

            pet.hunger =
                Math.max(
                    0,
                    Math.min(
                        100,
                        Number(
                            pet.hunger
                        ) || 100
                    )
                );

            pet.loyalty =
                Math.max(
                    0,
                    Math.min(
                        100,
                        Number(
                            pet.loyalty
                        ) || 50
                    )
                );
        });


        // --------------------------------------------------------
        // Active pet
        // --------------------------------------------------------

        if (
            this.activePetId &&
            !this.getPet(
                this.activePetId
            )
        ) {

            this.activePetId =
                this.pets.length > 0
                    ? this.pets[0].id
                    : null;
        }

        if (
            !this.activePetId &&
            this.pets.length > 0
        ) {

            this.activePetId =
                this.pets[0].id;
        }


        // --------------------------------------------------------
        // Locations
        // --------------------------------------------------------

        if (
            !Array.isArray(
                this.discoveredLocations
            )
        ) {

            this.discoveredLocations = [];
        }


        // --------------------------------------------------------
        // Achievements
        // --------------------------------------------------------

        if (
            !Array.isArray(
                this.achievements
            )
        ) {

            this.achievements = [];
        }


        // --------------------------------------------------------
        // Coins
        // --------------------------------------------------------

        if (
            !Number.isFinite(
                Number(this.coins)
            ) ||
            this.coins < 0
        ) {

            this.coins = 0;
        }

        this.coins =
            Math.floor(
                Number(this.coins)
            );


        // --------------------------------------------------------
        // Statistics
        // --------------------------------------------------------

        const defaultStatistics = {

            creaturesCaptured: 0,
            creaturesDefeated: 0,
            resourcesCollected: 0,
            foodConsumed: 0,
            damageDealt: 0,
            damageTaken: 0,
            distanceTravelled: 0,
            locationsDiscovered: 0,
            playTime: 0
        };

        if (
            !this.statistics ||
            typeof this.statistics !==
            "object" ||
            Array.isArray(this.statistics)
        ) {

            this.statistics = {};
        }

        Object.keys(defaultStatistics)
            .forEach(key => {

                if (
                    !Number.isFinite(
                        Number(
                            this.statistics[key]
                        )
                    )
                ) {

                    this.statistics[key] =
                        defaultStatistics[key];

                } else {

                    this.statistics[key] =
                        Math.max(
                            0,
                            Number(
                                this.statistics[key]
                            )
                        );
                }
            });


        return true;
    }


    // ============================================================
    // SAVE GAME
    // ============================================================

    saveGame() {

        try {

            this.validateData();

            const data = {

                version: 2,

                level:
                    this.level,

                xp:
                    this.xp,

                xpToNextLevel:
                    this.xpToNextLevel,

                totalXP:
                    this.totalXP,

                inventory:
                    {
                        ...this.inventory
                    },

                pets:
                    JSON.parse(
                        JSON.stringify(
                            this.pets
                        )
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
                    ],

                statistics:
                    {
                        ...this.statistics
                    }
            };

            localStorage.setItem(
                this.saveKey,
                JSON.stringify(data)
            );

            return true;

        } catch (error) {

            console.error(
                "PET WORLD save failed:",
                error
            );

            return false;
        }
    }


    // ============================================================
    // LOAD GAME
    // ============================================================

    loadGame() {

        try {

            const raw =
                localStorage.getItem(
                    this.saveKey
                );

            if (!raw) {
                return false;
            }

            const data =
                JSON.parse(raw);

            if (
                !data ||
                typeof data !== "object"
            ) {

                return false;
            }


            // ----------------------------------------------------
            // Player progression
            // ----------------------------------------------------

            if (
                Number.isFinite(
                    Number(data.level)
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

            if (
                Number.isFinite(
                    Number(data.xp)
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

            if (
                Number.isFinite(
                    Number(data.totalXP)
                )
            ) {

                this.totalXP =
                    Math.max(
                        0,
                        Number(
                            data.totalXP
                        )
                    );
            }

            this.xpToNextLevel =
                this.calculateXPRequired(
                    this.level
                );


            // ----------------------------------------------------
            // Inventory
            // ----------------------------------------------------

            if (
                data.inventory &&
                typeof data.inventory ===
                "object" &&
                !Array.isArray(
                    data.inventory
                )
            ) {

                this.inventory = {

                    ...this.inventory,

                    ...data.inventory
                };
            }


            // ----------------------------------------------------
            // Pets
            // ----------------------------------------------------

            if (
                Array.isArray(
                    data.pets
                )
            ) {

                this.pets =
                    data.pets;
            }


            // ----------------------------------------------------
            // Active pet
            // ----------------------------------------------------

            if (
                data.activePetId !==
                undefined
            ) {

                this.activePetId =
                    data.activePetId;
            }


            // ----------------------------------------------------
            // Coins
            // ----------------------------------------------------

            if (
                Number.isFinite(
                    Number(data.coins)
                )
            ) {

                this.coins =
                    Math.max(
                        0,
                        Number(
                            data.coins
                        )
                    );
            }


            // ----------------------------------------------------
            // Locations
            // ----------------------------------------------------

            if (
                Array.isArray(
                    data.discoveredLocations
                )
            ) {

                this.discoveredLocations =
                    data.discoveredLocations;
            }


            // ----------------------------------------------------
            // Achievements
            // ----------------------------------------------------

            if (
                Array.isArray(
                    data.achievements
                )
            ) {

                this.achievements =
                    data.achievements;
            }


            // ----------------------------------------------------
            // Statistics
            // ----------------------------------------------------

            if (
                data.statistics &&
                typeof data.statistics ===
                "object" &&
                !Array.isArray(
                    data.statistics
                )
            ) {

                this.statistics = {

                    ...this.statistics,

                    ...data.statistics
                };
            }


            this.validateData();

            return true;

        } catch (error) {

            console.error(
                "PET WORLD load failed:",
                error
            );

            return false;
        }
    }


    // ============================================================
    // EXPORT SAVE
    // ============================================================

    exportSave() {

        try {

            this.saveGame();

            const data =
                localStorage.getItem(
                    this.saveKey
                );

            if (!data) {
                return null;
            }

            return data;

        } catch (error) {

            console.error(
                "Export save failed:",
                error
            );

            return null;
        }
    }


    // ============================================================
    // IMPORT SAVE
    // ============================================================

    importSave(saveString) {

        try {

            if (
                typeof saveString !==
                "string"
            ) {

                return false;
            }

            const data =
                JSON.parse(
                    saveString
                );

            if (
                !data ||
                typeof data !==
                "object"
            ) {

                return false;
            }

            localStorage.setItem(
                this.saveKey,
                JSON.stringify(data)
            );

            this.loadGame();

            this.validateData();

            this.notify(
                "📥 Save imported"
            );

            return true;

        } catch (error) {

            console.error(
                "Import save failed:",
                error
            );

            this.notify(
                "❌ Invalid save file"
            );

            return false;
        }
    }


    // ============================================================
    // RESET GAME
    // ============================================================

    resetGame() {

        try {

            localStorage.removeItem(
                this.saveKey
            );

        } catch (error) {

            console.error(
                "Reset failed:",
                error
            );
        }

        if (
            typeof location !==
            "undefined"
        ) {

            location.reload();
        }
    }


    // ============================================================
    // DEBUG / GIVE ITEMS
    // ============================================================

    debugGiveItems() {

        this.addItem(
            "wood",
            100
        );

        this.addItem(
            "stone",
            100
        );

        this.addItem(
            "fiber",
            100
        );

        this.addItem(
            "food",
            20
        );

        this.addItem(
            "captureOrb",
            20
        );

        this.addItem(
            "potion",
            10
        );

        this.addCoins(
            1000
        );

        this.notify(
            "🛠️ Debug resources added"
        );

        this.saveGame();
    }


    // ============================================================
    // GET COMPLETE GAME DATA
    // ============================================================

    getGameData() {

        return {

            level:
                this.level,

            xp:
                this.xp,

            xpToNextLevel:
                this.xpToNextLevel,

            totalXP:
                this.totalXP,

            inventory:
                {
                    ...this.inventory
                },

            pets:
                JSON.parse(
                    JSON.stringify(
                        this.pets
                    )
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
                ],

            statistics:
                {
                    ...this.statistics
                }
        };
    }
}


// ============================================================
// MODULE EXPORT CHECK
// ============================================================

export default GameSystems;
