import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js";

export class GameUI {

    constructor(game) {

        this.game = game;

        this.notificationTimer = 0;

        this.createUI();

    }


    // =================================================
    // CREATE UI
    // =================================================

    createUI() {

        this.container =
            document.createElement("div");

        this.container.id =
            "game-ui";

        document.body.appendChild(
            this.container
        );


        // -----------------------------
        // PLAYER HUD
        // -----------------------------

        this.hud =
            document.createElement("div");

        this.hud.id =
            "player-hud";

        this.container.appendChild(
            this.hud
        );


        // -----------------------------
        // HEALTH
        // -----------------------------

        this.healthBar =
            this.createBar(
                "❤️ Health"
            );

        this.hud.appendChild(
            this.healthBar.wrapper
        );


        // -----------------------------
        // STAMINA
        // -----------------------------

        this.staminaBar =
            this.createBar(
                "⚡ Stamina"
            );

        this.hud.appendChild(
            this.staminaBar.wrapper
        );


        // -----------------------------
        // HUNGER
        // -----------------------------

        this.hungerBar =
            this.createBar(
                "🍖 Hunger"
            );

        this.hud.appendChild(
            this.hungerBar.wrapper
        );


        // -----------------------------
        // LEVEL
        // -----------------------------

        this.levelText =
            document.createElement("div");

        this.levelText.id =
            "level-text";

        this.hud.appendChild(
            this.levelText
        );


        // -----------------------------
        // PET INFO
        // -----------------------------

        this.petText =
            document.createElement("div");

        this.petText.id =
            "pet-text";

        this.hud.appendChild(
            this.petText
        );


        // -----------------------------
        // INVENTORY BUTTON
        // -----------------------------

        this.inventoryButton =
            this.createButton(
                "🎒 Inventory"
            );

        this.inventoryButton.onclick =
            () => {

                this.toggleInventory();

            };


        // -----------------------------
        // PET BUTTON
        // -----------------------------

        this.petButton =
            this.createButton(
                "🐾 Pets"
            );

        this.petButton.onclick =
            () => {

                this.togglePets();

            };


        // -----------------------------
        // CAPTURE BUTTON
        // -----------------------------

        this.captureButton =
            this.createButton(
                "🔴 Capture"
            );

        this.captureButton.onclick =
            () => {

                if (
                    this.game.systems
                ) {

                    this.game.systems
                        .captureNearestCreature();

                }

            };


        // -----------------------------
        // FOOD BUTTON
        // -----------------------------

        this.foodButton =
            this.createButton(
                "🍎 Heal"
            );

        this.foodButton.onclick =
            () => {

                if (
                    this.game.systems
                ) {

                    this.game.systems
                        .useHealingFood();

                }

            };


        // -----------------------------
        // BUTTON CONTAINER
        // -----------------------------

        this.buttons =
            document.createElement("div");

        this.buttons.id =
            "game-buttons";

        this.buttons.appendChild(
            this.inventoryButton
        );

        this.buttons.appendChild(
            this.petButton
        );

        this.buttons.appendChild(
            this.captureButton
        );

        this.buttons.appendChild(
            this.foodButton
        );

        this.container.appendChild(
            this.buttons
        );


        // -----------------------------
        // INVENTORY PANEL
        // -----------------------------

        this.inventoryPanel =
            document.createElement("div");

        this.inventoryPanel.id =
            "inventory-panel";

        this.inventoryPanel.style.display =
            "none";

        this.container.appendChild(
            this.inventoryPanel
        );


        // -----------------------------
        // PET PANEL
        // -----------------------------

        this.petPanel =
            document.createElement("div");

        this.petPanel.id =
            "pet-panel";

        this.petPanel.style.display =
            "none";

        this.container.appendChild(
            this.petPanel
        );


        // -----------------------------
        // NOTIFICATION
        // -----------------------------

        this.notification =
            document.createElement("div");

        this.notification.id =
            "game-notification";

        this.container.appendChild(
            this.notification
        );

    }


    // =================================================
    // CREATE BAR
    // =================================================

    createBar(
        title
    ) {

        const wrapper =
            document.createElement("div");

        wrapper.className =
            "status-bar";


        const label =
            document.createElement("span");

        label.textContent =
            title;


        const outer =
            document.createElement("div");

        outer.className =
            "bar-outer";


        const inner =
            document.createElement("div");

        inner.className =
            "bar-inner";


        outer.appendChild(
            inner
        );

        wrapper.appendChild(
            label
        );

        wrapper.appendChild(
            outer
        );


        return {

            wrapper,
            inner

        };

    }


    // =================================================
    // CREATE BUTTON
    // =================================================

    createButton(
        text
    ) {

        const button =
            document.createElement(
                "button"
            );

        button.textContent =
            text;

        button.className =
            "game-button";

        return button;

    }


    // =================================================
    // UPDATE BAR
    // =================================================

    updateBar(
        bar,
        value,
        max
    ) {

        if (
            !bar
        ) {

            return;

        }


        const percentage =
            THREE.MathUtils.clamp(
                (value / max) * 100,
                0,
                100
            );


        bar.inner.style.width =
            `${percentage}%`;

    }


    // =================================================
    // UPDATE HUD
    // =================================================

    updateHUD() {

        const player =
            this.game.player;


        if (
            !player
        ) {

            return;

        }


        this.updateBar(
            this.healthBar,
            player.health,
            player.maxHealth
        );


        this.updateBar(
            this.staminaBar,
            player.stamina,
            player.maxStamina
        );


        this.updateBar(
            this.hungerBar,
            player.hunger,
            player.maxHunger
        );


        const level =
            this.game.systems
                ? this.game.systems.level
                : 1;


        const xp =
            this.game.systems
                ? this.game.systems.xp
                : 0;


        const required =
            this.game.systems
                ? this.game.systems.xpRequired
                : 100;


        this.levelText.textContent =
            `⭐ Level ${level}   XP ${xp}/${required}`;


        const pets =
            this.game.systems
                ? this.game.systems.pets.length
                : 0;


        const activePet =
            this.game.systems &&
            this.game.systems.activePet
                ? this.game.systems.activePet.name
                : "None";


        this.petText.textContent =
            `🐾 Pets: ${pets}   Active: ${activePet}`;

    }


    // =================================================
    // INVENTORY
    // =================================================

    toggleInventory() {

        const visible =
            this.inventoryPanel.style.display
            !==
            "none";


        if (
            visible
        ) {

            this.inventoryPanel.style.display =
                "none";

            return;

        }


        this.petPanel.style.display =
            "none";


        this.inventoryPanel.style.display =
            "block";


        this.renderInventory();

    }


    // =================================================
    // RENDER INVENTORY
    // =================================================

    renderInventory() {

        this.inventoryPanel.innerHTML =
            "";


        const title =
            document.createElement("h2");

        title.textContent =
            "🎒 Inventory";

        this.inventoryPanel.appendChild(
            title
        );


        const inventory =
            this.game.systems
                ? this.game.systems.inventory
                : {};


        const keys =
            Object.keys(
                inventory
            );


        if (
            keys.length === 0
        ) {

            const empty =
                document.createElement(
                    "p"
                );

            empty.textContent =
                "Inventory empty";

            this.inventoryPanel.appendChild(
                empty
            );

            return;

        }


        for (
            const item of keys
        ) {

            const row =
                document.createElement(
                    "div"
                );

            row.className =
                "inventory-item";


            const name =
                this.formatItemName(
                    item
                );


            row.textContent =
                `${this.getItemIcon(item)} ${name} × ${inventory[item]}`;


            this.inventoryPanel.appendChild(
                row
            );

        }


        const close =
            this.createButton(
                "Close"
            );


        close.onclick =
            () => {

                this.inventoryPanel.style.display =
                    "none";

            };


        this.inventoryPanel.appendChild(
            close
        );

    }


    // =================================================
    // PET MENU
    // =================================================

    togglePets() {

        const visible =
            this.petPanel.style.display
            !==
            "none";


        if (
            visible
        ) {

            this.petPanel.style.display =
                "none";

            return;

        }


        this.inventoryPanel.style.display =
            "none";


        this.petPanel.style.display =
            "block";


        this.renderPets();

    }


    // =================================================
    // RENDER PETS
    // =================================================

    renderPets() {

        this.petPanel.innerHTML =
            "";


        const title =
            document.createElement(
                "h2"
            );

        title.textContent =
            "🐾 My Pets";

        this.petPanel.appendChild(
            title
        );


        const pets =
            this.game.systems
                ? this.game.systems.pets
                : [];


        if (
            pets.length === 0
        ) {

            const empty =
                document.createElement(
                    "p"
                );

            empty.textContent =
                "No pets captured yet.";

            this.petPanel.appendChild(
                empty
            );

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


                const name =
                    document.createElement(
                        "div"
                    );

                name.textContent =
                    `🐾 ${pet.name}`;


                const level =
                    document.createElement(
                        "div"
                    );

                level.textContent =
                    `Level ${pet.level}`;


                const health =
                    document.createElement(
                        "div"
                    );

                health.textContent =
                    `❤️ ${Math.round(pet.health)}/${pet.maxHealth}`;


                card.appendChild(
                    name
                );

                card.appendChild(
                    level
                );

                card.appendChild(
                    health
                );


                const active =
                    document.createElement(
                        "button"
                    );


                active.textContent =
                    pet.active
                        ? "✓ Active"
                        : "Use";


                active.onclick =
                    () => {

                        this.game.systems
                            .setActivePet(
                                pet.id
                            );

                        this.renderPets();

                    };


                card.appendChild(
                    active
                );


                this.petPanel.appendChild(
                    card
                );

            }
        );


        const close =
            this.createButton(
                "Close"
            );


        close.onclick =
            () => {

                this.petPanel.style.display =
                    "none";

            };


        this.petPanel.appendChild(
            close
        );

    }


    // =================================================
    // NOTIFICATION
    // =================================================

    notify(
        message,
        duration = 2500
    ) {

        if (
            !this.notification
        ) {

            return;

        }


        this.notification.textContent =
            message;


        this.notification.style.display =
            "block";


        this.notificationTimer =
            duration / 1000;

    }


    // =================================================
    // ITEM ICON
    // =================================================

    getItemIcon(
        item
    ) {

        const icons = {

            wood:
                "🪵",

            stone:
                "🪨",

            berry:
                "🫐",

            capture_ball:
                "🔴",

            wooden_tool:
                "🪓",

            healing_food:
                "🍎"

        };


        return icons[item] || "📦";

    }


    // =================================================
    // FORMAT ITEM NAME
    // =================================================

    formatItemName(
        item
    ) {

        return item
            .replaceAll(
                "_",
                " "
            )
            .replace(
                /\b\w/g,
                char =>
                    char.toUpperCase()
            );

    }


    // =================================================
    // UPDATE
    // =================================================

    update(
        delta
    ) {

        this.updateHUD();


        if (
            this.notificationTimer >
            0
        ) {

            this.notificationTimer -=
                delta;

            if (
                this.notificationTimer <=
                0
            ) {

                this.notification.style.display =
                    "none";

            }

        }

    }

}
