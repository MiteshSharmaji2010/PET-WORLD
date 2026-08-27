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
        // SAVE
        // =============================================

        this.saveKey =
            "pet-world-save-v1";


        this.saveTimer = 0;

    }


    // =================================================
    // INITIALIZE
    // =================================================

    async init() {

        this.loadGame();

    }


    // =================================================
    // UPDATE
    // =================================================

    update(delta) {

        this.saveTimer += delta;


        // Automatic save every 30 seconds.

        if (
            this.saveTimer >= 30
        ) {

            this.saveTimer = 0;

            this.saveGame();

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


        this.xp += amount;


        let leveledUp =
            false;


        while (
            this.xp >=
            this.xpToNextLevel
        ) {

            this.xp -=
                this.xpToNextLevel;


            this.level++;


            this.xpToNextLevel =
                Math.floor(
                    100 *
                    Math.pow(
                        1.18,
                        this.level - 1
                    )
                );


            leveledUp =
                true;

        }


        if (
            leveledUp
        ) {

            this.onLevelUp();

        }


        this.saveGame();

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
            !Object.prototype.hasOwnProperty
                .call(
                    this.inventory,
                    item
                )
        ) {

            this.inventory[item] =
                0;

        }


        amount =
            Math.max(
                0,
                Math.floor(
                    Number(amount) || 0
                )
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

        return (
            Number(
                this.inventory[item] || 0
            ) >=
            Number(amount)
        );

    }


    // =================================================
    // GET ITEM COUNT
    // =================================================

    getItemCount(
        item
    ) {

        return Number(
            this.inventory[item] || 0
        );

    }


    // =================================================
    // ADD PET
    // =================================================

    addPet(
        pet
    ) {

        if (
            !pet ||
            !pet.id
        ) {

            return false;

        }


        const existing =
            this.pets.find(
                item =>
                    item.id ===
                    pet.id
            );


        if (
            existing
        ) {

            return false;

        }


        const savedPet = {

            id:
                pet.id,

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
                pet.level ||
                1,

            health:
                pet.health ||
                50,

            maxHealth:
                pet.maxHealth ||
                50,

            damage:
                pet.damage ||
                5,

            speed:
                pet.speed ||
                1,

            experience:
                0,

            hunger:
                100,

            loyalty:
                50

        };


        this.pets.push(
            savedPet
        );


        // Automatically use the first
        // captured pet.

        if (
            this.activePetId ===
            null
        ) {

            this.activePetId =
                savedPet.id;

        }


        this.saveGame();


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
                    pet.id ===
                    petId
            );


        if (
            index ===
            -1
        ) {

            return false;

        }


        this.pets.splice(
            index,
            1
        );


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
                pet.id ===
                petId
        ) || null;

    }


    // =================================================
    // GET ACTIVE PET
    // =================================================

    getActivePet() {

        if (
            this.activePetId ===
            null
        ) {

            return null;

        }


        return this.getPet(
            this.activePetId
        );

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
            Math.max(
                0,
                Math.floor(
                    Number(amount) || 0
                )
            );


        this.coins +=
            amount;


        this.saveGame();

    }


    // =================================================
    // SPEND COINS
    // =================================================

    spendCoins(
        amount
    ) {

        amount =
            Math.max(
                0,
                Math.floor(
                    Number(amount) || 0
                )
            );


        if (
            this.coins <
            amount
        ) {

            return false;

        }


        this.coins -=
            amount;


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
            !locationId
        ) {

            return false;

        }


        if (
            this.discoveredLocations
                .includes(
                    locationId
                )
        ) {

            return false;

        }


        this.discoveredLocations.push(
            locationId
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
    // ACHIEVEMENT
    // =================================================

    unlockAchievement(
        achievementId
    ) {

        if (
            this.achievements
                .includes(
                    achievementId
                )
        ) {

            return false;

        }


        this.achievements.push(
            achievementId
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
    // SAVE GAME
    // =================================================

    saveGame() {

        try {

            const data = {

                level:
                    this.level,

                xp:
                    this.xp,

                xpToNextLevel:
                    this.xpToNextLevel,

                inventory:
                    this.inventory,

                pets:
                    this.pets,

                activePetId:
                    this.activePetId,

                coins:
                    this.coins,

                discoveredLocations:
                    this.discoveredLocations,

                achievements:
                    this.achievements

            };


            localStorage.setItem(
                this.saveKey,
                JSON.stringify(
                    data
                )
            );


        } catch (
            error
        ) {

            console.error(
                "Save failed:",
                error
            );

        }

    }


    // =================================================
    // LOAD GAME
    // =================================================

    loadGame() {

        try {

            const raw =
                localStorage.getItem(
                    this.saveKey
                );


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


            if (
                Number.isFinite(
                    data.level
                )
            ) {

                this.level =
                    Math.max(
                        1,
                        data.level
                    );

            }


            if (
                Number.isFinite(
                    data.xp
                )
            ) {

                this.xp =
                    Math.max(
                        0,
                        data.xp
                    );

            }


            if (
                Number.isFinite(
                    data.xpToNextLevel
                )
            ) {

                this.xpToNextLevel =
                    Math.max(
                        1,
                        data.xpToNextLevel
                    );

            }


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


            if (
                Array.isArray(
                    data.pets
                )
            ) {

                this.pets =
                    data.pets;

            }


            if (
                data.activePetId !==
                undefined
            ) {

                this.activePetId =
                    data.activePetId;

            }


            if (
                Number.isFinite(
                    data.coins
                )
            ) {

                this.coins =
                    Math.max(
                        0,
                        data.coins
                    );

            }


            if (
                Array.isArray(
                    data.discoveredLocations
                )
            ) {

                this.discoveredLocations =
                    data.discoveredLocations;

            }


            if (
                Array.isArray(
                    data.achievements
                )
            ) {

                this.achievements =
                    data.achievements;

            }


            return true;


        } catch (
            error
        ) {

            console.error(
                "Load failed:",
                error
            );


            return false;

        }

    }


    // =================================================
    // RESET SAVE
    // =================================================

    resetGame() {

        try {

            localStorage.removeItem(
                this.saveKey
            );

        } catch (
            error
        ) {

            console.error(
                "Reset failed:",
                error
            );

        }


        location.reload();

    }

}
