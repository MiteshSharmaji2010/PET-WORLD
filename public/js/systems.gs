export class GameSystems {

    constructor(game) {

        this.game = game;

        // =============================================
        // PLAYER PROGRESSION
        // =============================================

        this.level = 1;

        this.xp = 0;

        this.xpToNextLevel = 100;

        this.coins = 100;


        // =============================================
        // INVENTORY
        // =============================================

        this.inventory = {

            captureOrb: 10,

            food: 10,

            wood: 0,

            stone: 0,

            fiber: 0,

            crystal: 0

        };


        // =============================================
        // CAPTURED PETS
        // =============================================

        this.pets = [];

        this.activePetId = null;


        // =============================================
        // GAME STATE
        // =============================================

        this.isPaused = false;

        this.isCapturing = false;

        this.lastSaveTime = 0;

    }


    // =================================================
    // INITIALIZE
    // =================================================

    async init() {

        this.loadGame();

    }


    // =================================================
    // XP
    // =================================================

    addXP(
        amount
    ) {

        amount =
            Math.max(
                0,
                Number(amount) || 0
            );


        this.xp += amount;


        while (
            this.xp >=
            this.xpToNextLevel
        ) {

            this.xp -=
                this.xpToNextLevel;


            this.level++;


            this.xpToNextLevel =
                Math.floor(
                    this.xpToNextLevel *
                    1.25
                );


            if (
                this.game.player
            ) {

                this.game.player.maxHealth +=
                    5;

                this.game.player.health =
                    this.game.player.maxHealth;

            }


            if (
                this.game.ui
            ) {

                this.game.ui.notify(
                    `LEVEL UP! You are now level ${this.level}`
                );

            }

        }


        this.updateUI();

    }


    // =================================================
    // INVENTORY
    // =================================================

    addItem(
        item,
        amount = 1
    ) {

        if (
            !Object.prototype.hasOwnProperty.call(
                this.inventory,
                item
            )
        ) {

            this.inventory[item] =
                0;

        }


        this.inventory[item] +=
            Math.max(
                0,
                Number(amount) || 0
            );


        this.updateUI();

    }


    removeItem(
        item,
        amount = 1
    ) {

        amount =
            Math.max(
                0,
                Number(amount) || 0
            );


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


        this.updateUI();


        return true;

    }


    hasItem(
        item,
        amount = 1
    ) {

        return (
            Number(
                this.inventory[item] || 0
            ) >= amount
        );

    }


    // =================================================
    // CAPTURE
    // =================================================

    captureNearestCreature() {

        if (
            this.isCapturing
        ) {

            return false;

        }


        const creatureManager =
            this.game.creatures;


        if (
            !creatureManager
        ) {

            return false;

        }


        const creature =
            creatureManager
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
                    "No creature nearby."
                );

            }


            return false;

        }


        return this.captureCreature(
            creature
        );

    }


    // =================================================
    // CAPTURE CREATURE
    // =================================================

    captureCreature(
        creature
    ) {

        if (
            !creature ||
            !creature.alive
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
                    "You need a Capture Orb."
                );

            }


            return false;

        }


        this.removeItem(
            "captureOrb",
            1
        );


        this.isCapturing =
            true;


        // =============================================
        // CAPTURE CHANCE
        // =============================================

        const healthRatio =
            creature.health /
            creature.maxHealth;


        let chance =
            0.30 +
            (
                1 -
                healthRatio
            ) *
            0.45;


        if (
            creature.rarity ===
            "Uncommon"
        ) {

            chance -=
                0.08;

        }


        if (
            creature.rarity ===
            "Rare"
        ) {

            chance -=
                0.18;

        }


        chance +=
            Math.min(
                0.10,
                this.level * 0.01
            );


        chance =
            Math.max(
                0.05,
                Math.min(
                    0.90,
                    chance
                )
            );


        const success =
            Math.random() <
            chance;


        setTimeout(
            () => {

                this.isCapturing =
                    false;


                if (
                    success
                ) {

                    this.completeCapture(
                        creature
                    );

                } else {

                    this.captureFailed(
                        creature
                    );

                }

            },
            900
        );


        if (
            this.game.ui
        ) {

            this.game.ui.notify(
                "Throwing Capture Orb..."
            );

        }


        return true;

    }


    // =================================================
    // CAPTURE SUCCESS
    // =================================================

    completeCapture(
        creature
    ) {

        const pet = {

            id:
                `pet_${Date.now()}_${Math.random()
                    .toString(36)
                    .slice(2, 8)}`,

            species:
                creature.name,

            name:
                creature.name,

            level:
                creature.level,

            rarity:
                creature.rarity,

            maxHealth:
                creature.maxHealth,

            health:
                creature.maxHealth,

            damage:
                creature.damage,

            speed:
                creature.speed,

            experience:
                0,

            hunger:
                100,

            capturedAt:
                Date.now()

        };


        this.pets.push(
            pet
        );


        if (
            !this.activePetId
        ) {

            this.activePetId =
                pet.id;

        }


        creature.alive =
            false;


        if (
            this.game.ui
        ) {

            this.game.ui.notify(
                `${pet.name} captured!`
            );

        }


        this.addXP(
            50 +
            creature.level * 10
        );


        this.updateUI();

    }


    // =================================================
    // CAPTURE FAILED
    // =================================================

    captureFailed(
        creature
    ) {

        if (
            this.game.ui
        ) {

            this.game.ui.notify(
                `${creature.name} escaped!`
            );

        }


        creature.state =
            "flee";


        creature.fleeTimer =
            4;

    }


    // =================================================
    // ACTIVE PET
    // =================================================

    getActivePet() {

        if (
            !this.activePetId
        ) {

            return null;

        }


        return (
            this.pets.find(
                pet =>
                    pet.id ===
                    this.activePetId
            ) ||
            null
        );

    }


    // =================================================
    // SET ACTIVE PET
    // =================================================

    setActivePet(
        petId
    ) {

        const pet =
            this.pets.find(
                item =>
                    item.id ===
                    petId
            );


        if (
            !pet
        ) {

            return false;

        }


        this.activePetId =
            pet.id;


        if (
            this.game.ui
        ) {

            this.game.ui.notify(
                `${pet.name} is now your active pet.`
            );

        }


        this.updateUI();


        return true;

    }


    // =================================================
    // REMOVE PET
    // =================================================

    releasePet(
        petId
    ) {

        const index =
            this.pets.findIndex(
                pet =>
                    pet.id ===
                    petId
            );


        if (
            index === -1
        ) {

            return false;

        }


        const pet =
            this.pets[index];


        this.pets.splice(
            index,
            1
        );


        if (
            this.activePetId ===
            petId
        ) {

            this.activePetId =
                this.pets.length
                    ? this.pets[0].id
                    : null;

        }


        this.updateUI();


        return true;

    }


    // =================================================
    // FEED ACTIVE PET
    // =================================================

    feedActivePet() {

        const pet =
            this.getActivePet();


        if (
            !pet
        ) {

            if (
                this.game.ui
            ) {

                this.game.ui.notify(
                    "You don't have an active pet."
                );

            }


            return false;

        }


        if (
            !this.hasItem(
                "food",
                1
            )
        ) {

            if (
                this.game.ui
            ) {

                this.game.ui.notify(
                    "You don't have food."
                );

            }


            return false;

        }


        this.removeItem(
            "food",
            1
        );


        pet.hunger =
            Math.min(
                100,
                pet.hunger + 35
            );


        pet.health =
            Math.min(
                pet.maxHealth,
                pet.health + 20
            );


        if (
            this.game.ui
        ) {

            this.game.ui.notify(
                `${pet.name} has been fed.`
            );

        }


        this.updateUI();


        return true;

    }


    // =================================================
    // COLLECT RESOURCE
    // =================================================

    collectResource(
        type,
        amount = 1
    ) {

        const allowed = [

            "wood",

            "stone",

            "fiber",

            "crystal"

        ];


        if (
            !allowed.includes(
                type
            )
        ) {

            return false;

        }


        this.addItem(
            type,
            amount
        );


        if (
            this.game.ui
        ) {

            this.game.ui.notify(
                `+${amount} ${type}`
            );

        }


        return true;

    }


    // =================================================
    // UPDATE
    // =================================================

    update(
        delta
    ) {

        const pet =
            this.getActivePet();


        if (
            pet
        ) {

            pet.hunger -=
                0.25 *
                delta;


            pet.hunger =
                Math.max(
                    0,
                    pet.hunger
                );


            if (
                pet.hunger <= 0
            ) {

                pet.health -=
                    0.5 *
                    delta;

            }


            pet.health =
                Math.max(
                    1,
                    pet.health
                );

        }


        // Autosave every 30 seconds.

        this.lastSaveTime +=
            delta;


        if (
            this.lastSaveTime >=
            30
        ) {

            this.lastSaveTime =
                0;

            this.saveGame();

        }

    }


    // =================================================
    // UI UPDATE
    // =================================================

    updateUI() {

        if (
            this.game.ui &&
            typeof this.game.ui.updateStats ===
            "function"
        ) {

            this.game.ui.updateStats(
                this
            );

        }

    }


    // =================================================
    // SAVE
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

                coins:
                    this.coins,

                inventory:
                    this.inventory,

                pets:
                    this.pets,

                activePetId:
                    this.activePetId

            };


            localStorage.setItem(
                "pet_world_save",
                JSON.stringify(
                    data
                )
            );


            this.lastSaveTime =
                0;


            return true;

        } catch (
            error
        ) {

            console.error(
                "Save failed:",
                error
            );


            return false;

        }

    }


    // =================================================
    // LOAD
    // =================================================

    loadGame() {

        try {

            const saved =
                localStorage.getItem(
                    "pet_world_save"
                );


            if (
                !saved
            ) {

                return false;

            }


            const data =
                JSON.parse(
                    saved
                );


            if (
                typeof data.level ===
                "number"
            ) {

                this.level =
                    data.level;

            }


            if (
                typeof data.xp ===
                "number"
            ) {

                this.xp =
                    data.xp;

            }


            if (
                typeof data.xpToNextLevel ===
                "number"
            ) {

                this.xpToNextLevel =
                    data.xpToNextLevel;

            }


            if (
                typeof data.coins ===
                "number"
            ) {

                this.coins =
                    data.coins;

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
                typeof data.activePetId ===
                "string"
            ) {

                this.activePetId =
                    data.activePetId;

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
                "pet_world_save"
            );

        } catch (
            error
        ) {

            console.error(
                "Reset failed:",
                error
            );

        }


        this.level =
            1;

        this.xp =
            0;

        this.xpToNextLevel =
            100;

        this.coins =
            100;


        this.inventory = {

            captureOrb: 10,

            food: 10,

            wood: 0,

            stone: 0,

            fiber: 0,

            crystal: 0

        };


        this.pets = [];

        this.activePetId =
            null;


        this.updateUI();

    }


    // =================================================
    // GAME PAUSE
    // =================================================

    pause() {

        this.isPaused =
            true;

    }


    resume() {

        this.isPaused =
            false;

    }

}
