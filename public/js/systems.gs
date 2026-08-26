import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js";

export class GameSystems {

    constructor(game) {

        this.game = game;

        // =============================================
        // PLAYER PROGRESSION
        // =============================================

        this.xp = 0;

        this.level = 1;

        this.xpRequired = 100;

        // =============================================
        // INVENTORY
        // =============================================

        this.inventory = {};

        this.inventorySize = 30;

        // =============================================
        // PET COLLECTION
        // =============================================

        this.pets = [];

        this.activePet = null;

        // =============================================
        // WORLD DATA
        // =============================================

        this.discoveredAreas = [];

        this.craftedItems = {};

        this.gameStarted = false;

        this.loadGame();

    }


    // =================================================
    // INITIALIZE
    // =================================================

    async init() {

        this.createStartingItems();

        this.gameStarted = true;

        return true;

    }


    // =================================================
    // STARTING ITEMS
    // =================================================

    createStartingItems() {

        if (
            Object.keys(this.inventory).length > 0
        ) {

            return;

        }

        this.addItem(
            "capture_ball",
            10
        );

        this.addItem(
            "wood",
            20
        );

        this.addItem(
            "stone",
            15
        );

        this.addItem(
            "berry",
            8
        );

    }


    // =================================================
    // INVENTORY
    // =================================================

    addItem(
        itemId,
        amount = 1
    ) {

        if (
            !itemId ||
            amount <= 0
        ) {

            return false;

        }

        if (
            this.inventory[itemId] === undefined
        ) {

            if (
                Object.keys(this.inventory).length >=
                this.inventorySize
            ) {

                if (
                    this.game.ui
                ) {

                    this.game.ui.notify(
                        "Inventory is full!"
                    );

                }

                return false;

            }

            this.inventory[itemId] = 0;

        }

        this.inventory[itemId] += amount;

        return true;

    }


    // =================================================
    // REMOVE ITEM
    // =================================================

    removeItem(
        itemId,
        amount = 1
    ) {

        if (
            !this.hasItem(
                itemId,
                amount
            )
        ) {

            return false;

        }

        this.inventory[itemId] -= amount;

        if (
            this.inventory[itemId] <= 0
        ) {

            delete this.inventory[itemId];

        }

        return true;

    }


    // =================================================
    // HAS ITEM
    // =================================================

    hasItem(
        itemId,
        amount = 1
    ) {

        return (
            this.inventory[itemId] !== undefined &&
            this.inventory[itemId] >= amount
        );

    }


    // =================================================
    // GET ITEM COUNT
    // =================================================

    getItemCount(
        itemId
    ) {

        return this.inventory[itemId] || 0;

    }


    // =================================================
    // EXPERIENCE
    // =================================================

    addXP(
        amount
    ) {

        if (
            amount <= 0
        ) {

            return;

        }

        this.xp += amount;

        while (
            this.xp >=
            this.xpRequired
        ) {

            this.xp -=
                this.xpRequired;

            this.levelUp();

        }

    }


    // =================================================
    // LEVEL UP
    // =================================================

    levelUp() {

        this.level++;

        this.xpRequired =
            Math.floor(
                100 *
                Math.pow(
                    1.25,
                    this.level - 1
                )
            );


        if (
            this.game.player
        ) {

            this.game.player.level =
                this.level;

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
            this.game.ui
        ) {

            this.game.ui.notify(
                `LEVEL UP! You are now level ${this.level}`
            );

        }

    }


    // =================================================
    // ADD PET
    // =================================================

    addPet(
        creature
    ) {

        if (
            !creature
        ) {

            return null;

        }


        const pet = {

            id:
                creature.id,

            speciesId:
                creature.speciesId,

            name:
                creature.name,

            level:
                creature.level,

            maxHealth:
                creature.maxHealth,

            health:
                creature.maxHealth,

            xp:
                0,

            active:
                false

        };


        this.pets.push(
            pet
        );


        // First pet becomes active.

        if (
            !this.activePet
        ) {

            this.setActivePet(
                pet.id
            );

        }


        this.addXP(
            25
        );


        return pet;

    }


    // =================================================
    // SET ACTIVE PET
    // =================================================

    setActivePet(
        petId
    ) {

        const pet =
            this.pets.find(
                p =>
                    p.id === petId
            );


        if (
            !pet
        ) {

            return false;

        }


        for (
            const p of this.pets
        ) {

            p.active =
                false;

        }


        pet.active =
            true;

        this.activePet =
            pet;


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
                p =>
                    p.id === petId
            );


        if (
            index === -1
        ) {

            return false;

        }


        this.pets.splice(
            index,
            1
        );


        if (
            this.activePet &&
            this.activePet.id === petId
        ) {

            this.activePet =
                null;

            if (
                this.pets.length > 0
            ) {

                this.setActivePet(
                    this.pets[0].id
                );

            }

        }


        return true;

    }


    // =================================================
    // PET XP
    // =================================================

    addPetXP(
        petId,
        amount
    ) {

        const pet =
            this.pets.find(
                p =>
                    p.id === petId
            );


        if (
            !pet
        ) {

            return;

        }


        pet.xp +=
            amount;


        const required =
            pet.level *
            100;


        if (
            pet.xp >=
            required
        ) {

            pet.xp -=
                required;

            pet.level++;

            pet.maxHealth +=
                10;

            pet.health =
                pet.maxHealth;


            if (
                this.game.ui
            ) {

                this.game.ui.notify(
                    `${pet.name} reached level ${pet.level}!`
                );

            }

        }

    }


    // =================================================
    // CAPTURE CREATURE
    // =================================================

    captureNearestCreature() {

        if (
            !this.hasItem(
                "capture_ball",
                1
            )
        ) {

            if (
                this.game.ui
            ) {

                this.game.ui.notify(
                    "You don't have a Capture Ball!"
                );

            }

            return false;

        }


        const creature =
            this.game.creatures
                .getNearestCreature(
                    8
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


        this.removeItem(
            "capture_ball",
            1
        );


        return this.game.creatures
            .captureCreature(
                creature
            );

    }


    // =================================================
    // CRAFTING
    // =================================================

    craft(
        recipeId
    ) {

        const recipes = {

            capture_ball: {

                result:
                    "capture_ball",

                amount:
                    1,

                ingredients: {

                    wood:
                        5,

                    stone:
                        3

                }

            },

            wooden_tool: {

                result:
                    "wooden_tool",

                amount:
                    1,

                ingredients: {

                    wood:
                        8,

                    stone:
                        2

                }

            },

            healing_food: {

                result:
                    "healing_food",

                amount:
                    1,

                ingredients: {

                    berry:
                        3,

                    wood:
                        1

                }

            }

        };


        const recipe =
            recipes[recipeId];


        if (
            !recipe
        ) {

            return false;

        }


        // Check ingredients

        for (
            const item in
            recipe.ingredients
        ) {

            if (
                !this.hasItem(
                    item,
                    recipe.ingredients[item]
                )
            ) {

                if (
                    this.game.ui
                ) {

                    this.game.ui.notify(
                        "Not enough materials."
                    );

                }

                return false;

            }

        }


        // Remove ingredients

        for (
            const item in
            recipe.ingredients
        ) {

            this.removeItem(
                item,
                recipe.ingredients[item]
            );

        }


        // Add result

        this.addItem(
            recipe.result,
            recipe.amount
        );


        this.craftedItems[
            recipeId
        ] =
            (
                this.craftedItems[
                    recipeId
                ] || 0
            ) + 1;


        if (
            this.game.ui
        ) {

            this.game.ui.notify(
                "Item crafted!"
            );

        }


        return true;

    }


    // =================================================
    // DISCOVER AREA
    // =================================================

    discoverArea(
        name
    ) {

        if (
            !name
        ) {

            return;

        }


        if (
            !this.discoveredAreas.includes(
                name
            )
        ) {

            this.discoveredAreas.push(
                name
            );


            this.addXP(
                15
            );


            if (
                this.game.ui
            ) {

                this.game.ui.notify(
                    `New area discovered: ${name}`
                );

            }

        }

    }


    // =================================================
    // HEAL PLAYER USING FOOD
    // =================================================

    useHealingFood() {

        if (
            !this.hasItem(
                "healing_food",
                1
            )
        ) {

            if (
                this.game.ui
            ) {

                this.game.ui.notify(
                    "You don't have healing food."
                );

            }

            return false;

        }


        this.removeItem(
            "healing_food",
            1
        );


        this.game.player.heal(
            30
        );


        return true;

    }


    // =================================================
    // SAVE GAME
    // =================================================

    saveGame() {

        try {

            const saveData = {

                version:
                    1,

                xp:
                    this.xp,

                level:
                    this.level,

                xpRequired:
                    this.xpRequired,

                inventory:
                    this.inventory,

                pets:
                    this.pets,

                activePetId:
                    this.activePet
                        ? this.activePet.id
                        : null,

                discoveredAreas:
                    this.discoveredAreas,

                craftedItems:
                    this.craftedItems

            };


            localStorage.setItem(
                "petWorldSave",
                JSON.stringify(
                    saveData
                )
            );


            console.log(
                "Game saved."
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

            const saved =
                localStorage.getItem(
                    "petWorldSave"
                );


            if (
                !saved
            ) {

                return;

            }


            const data =
                JSON.parse(
                    saved
                );


            this.xp =
                data.xp || 0;

            this.level =
                data.level || 1;

            this.xpRequired =
                data.xpRequired ||
                100;


            this.inventory =
                data.inventory || {};


            this.pets =
                data.pets || [];


            this.discoveredAreas =
                data.discoveredAreas ||
                [];


            this.craftedItems =
                data.craftedItems ||
                {};


            if (
                data.activePetId
            ) {

                this.setActivePet(
                    data.activePetId
                );

            }


            console.log(
                "Game loaded."
            );

        } catch (
            error
        ) {

            console.error(
                "Load failed:",
                error
            );

        }

    }


    // =================================================
    // RESET SAVE
    // =================================================

    resetSave() {

        localStorage.removeItem(
            "petWorldSave"
        );

        location.reload();

    }


    // =================================================
    // UPDATE
    // =================================================

    update(
        delta,
        elapsed
    ) {

        // Autosave every 30 seconds.

        if (
            !this.saveTimer
        ) {

            this.saveTimer = 0;

        }


        this.saveTimer +=
            delta;


        if (
            this.saveTimer >=
            30
        ) {

            this.saveTimer = 0;

            this.saveGame();

        }


        // Pet regeneration

        if (
            this.activePet
        ) {

            this.activePet.health =
                Math.min(

                    this.activePet.maxHealth,

                    this.activePet.health +
                    delta * 0.5

                );

        }

    }

}
