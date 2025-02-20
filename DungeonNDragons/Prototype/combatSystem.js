const playerHealthElem = document.getElementById("player-health");
const bossHealthElem = document.getElementById("boss-health");
const combatLog = document.getElementById("combat-log");
const abilitiesElem = document.getElementById("abilities");
const musicToggleBtn = document.getElementById("music-toggle-btn-combat");
const characterNameDisplay = document.getElementById("character-name");
const characterClassDisplay = document.getElementById("character-class");
const rollDiceButton = document.getElementById("roll-dice-button");
const attackButton = document.getElementById("attack");
const restartButton = document.getElementById("restart");
const classVideo = document.getElementById("class-video");
const classVideoSource = document.getElementById("class-video-source");

const DOM = {
    diceResult: document.getElementById("dice-result"), // Update log area to show dice results
    battleSection: document.getElementById("combat-area"),
    abilitiesContainer: document.getElementById("abilities"),
    abilityLog: document.getElementById("combat-log"), // Same area for ability log
};

const CONFIG = {
    classAbilities: {
        warrior: ["Cleave", "Power Strike", "Battle Cry"],
        mage: ["Fireball", "Ice Barrier", "Arcane Surge"],
        rogue: ["Backstab", "Sneak Attack", "Poison Dart"],
    },
    classVideos: {
        warrior: "videos/Warrior_animation.mp4",
        mage: "videos/Mage_animation.mp4",
        rogue: "videos/Rogue_animation.mp4",
    },
};

let state = {
    character: {
        name: localStorage.getItem("characterName") || "Player 1",
        class: localStorage.getItem("characterClass") || "Warrior", // Default to warrior if none set
    },
    selectedAbility: null,
};

let playerHealth = 100;
let bossHealth = 100;
let diceRoll = null;

characterNameDisplay.textContent = `Character Name: ${state.character.name}`;
characterClassDisplay.textContent = `Class: ${state.character.class}`;

// Play background music on page load
const backgroundMusic = document.getElementById("background-music");
window.addEventListener("load", () => {
    backgroundMusic.volume = 0.5; // Adjust volume (0.0 to 1.0)
    backgroundMusic.play().catch((error) => {
        console.log("Music autoplay blocked. User interaction required:", error);
    });
});

// Add play/pause toggle for user control
musicToggleBtn.addEventListener("click", () => {
    const backgroundMusic = document.getElementById("background-music");
    if (backgroundMusic.paused) {
        backgroundMusic.play();
        musicToggleBtn.textContent = "Pause Music";
    } else {
        backgroundMusic.pause();
        musicToggleBtn.textContent = "Play Music";
    }
});

// Load class-specific video
function loadClassVideo(charClass) {
    const videoFile = CONFIG.classVideos[charClass];
    if (videoFile) {
        classVideoSource.src = videoFile;
        classVideo.load(); // Reload the video element
        classVideo.play(); // Autoplay the loaded video
    } else {
        console.error(`No video found for class: ${charClass}`);
    }
}

// Call the function to load the video based on character class
loadClassVideo(state.character.class);

rollDiceButton.addEventListener("click", () => {
    diceRoll = Math.floor(Math.random() * 20);
    DOM.diceResult.textContent = `You rolled a ${diceRoll}! Power level: ${diceRoll}`;
    displayAbilities(state.character.class); // Show abilities after dice roll
    DOM.battleSection.classList.remove("hidden"); // Show combat area after dice roll
    rollDiceButton.classList.add("hidden"); // Hide the Roll Dice button
    rollDiceButton.disabled = true; // Disable the button after the first click
});

// Function to display abilities
function displayAbilities(charClass) {
    const abilities = CONFIG.classAbilities[charClass];
    DOM.abilitiesContainer.innerHTML = abilities
        .map(
            (ability) =>
                `<button class="ability-btn" data-ability="${ability}">${ability}</button>`
        )
        .join("");

    DOM.abilitiesContainer.classList.remove("hidden");

    // Add event listeners for ability buttons
    DOM.abilitiesContainer.addEventListener("click", (event) => {
        const ability = event.target.dataset.ability;
        if (ability) {
            state.selectedAbility = ability;
            DOM.abilityLog.textContent = `You selected ${state.selectedAbility}. Ready to attack!`;
            attackButton.style.display = "inline-block"; // Show the attack button after selecting ability
        };
    });
}

// Handle inventory of items found in hiddenObject browser
async function loadInventory() {
    try {
        const response = await fetch ("http://localhost:3000/inventory/Player1");

        // Check if the response is successful
        if (!response.ok) throw new Error("Failed to fetch inventory");

        // Parse the JSON data from the response
        const data = await response.json();

        // Check for the 'success' field to handle the response correctly
        if (!data.success) throw new Error(data.message);

        // Save the inventory to the state (ensure the items array exists)
        state.inventory = data.inventory.items || []; 
        console.log("Loaded inventory:", state.inventory);
    } catch (err) {
        console.error("Error loading inventory:", err);
        state.inventory = []; // Fallback to an empty inventory
    }
}

// Update health bars
function updateHealthBars() {
    playerHealthElem.textContent = `Player Health: ${playerHealth}`;
    bossHealthElem.textContent = `Boss Health: ${bossHealth}`;
}

// Handle attack button click
attackButton.addEventListener("click", async () => {
    if (diceRoll === null) {
        combatLog.textContent = "Roll the dice before attacking!";
        return;
    }
    // Ensure the player has selected an ability before attacking
    if (!state.selectedAbility) {
        combatLog.textContent = "Select an ability before attacking!";
        return; // Prevent the rest of the attack logic from executing
    }
    if (!state.inventory || state.inventory.length === 0) {
        await loadInventory(); // Load inventory if not already loaded
    }

    // Separate inventory items into potions and non-potion items
    const nonPotionItems = state.inventory.filter((item) => item !== "potion");

    // Calculate bonuses
    const itemBonus = nonPotionItems.length; // 1 bonus damage for each non-potion item

    // Calculate damage to boss
    const damage = diceRoll + itemBonus; // Include item bonus

    // Boss's turn: Attack the player first
    const bossDamage = Math.floor(Math.random() * 11) + 10; // Boss attacks
    playerHealth -= bossDamage;

    // Flash player health after taking damage
    playerHealthElem.classList.add("flash");
    setTimeout(() => playerHealthElem.classList.remove("flash"), 500); // Match flash duration to CSS animation.

    // Apply potion after taking boss damage
    if (playerHealth > 0 && state.inventory.includes("potion")) {
        const potionHeal = 5; // Fixed heal amount
        const missingHealth = 100 - playerHealth;

        const healAmount = Math.min(potionHeal, missingHealth); // Prevent overhealing
        playerHealth += healAmount;

        // Remove the potion from inventory
        const potionIndex = state.inventory.indexOf("potion");
        if (potionIndex !== -1) {
            state.inventory.splice(potionIndex, 1);
        }

        combatLog.textContent = `The boss attacked you for ${bossDamage} damage! You used a potion and healed ${healAmount} health!`;
    } else {
        combatLog.textContent = `The boss attacked you for ${bossDamage} damage!`;
    }

    // Check if player is defeated
    if (playerHealth <= 0) {
        playerHealth = 0;
        combatLog.textContent += " You were defeated!";
        restartButton.style.display = "inline-block"; // Show restart button on defeat
        attackButton.style.display = "none"; // Hide attack button after defeat
        updateHealthBars();
        return; // Stop further execution since the player is defeated
    }

    // After boss attack, player's turn to attack
    setTimeout(() => {
        bossHealth -= damage;

        // Flash boss health after taking damage
        bossHealthElem.classList.add("flash");
        setTimeout(() => bossHealthElem.classList.remove("flash"), 500); // Match flash duration to CSS animation.

        // Update combat log with attack details
        combatLog.textContent += ` You attacked the boss with ${state.selectedAbility}, dealing ${damage} damage! (${itemBonus} bonus from items found) `;

        // Check if boss is defeated
        if (bossHealth <= 0) {
            bossHealth = 0;
            combatLog.textContent += " You defeated the boss!";
            restartButton.style.display = "inline-block"; // Show restart button on victory
            attackButton.style.display = "none"; // Hide attack button after victory
        }

        updateHealthBars();
    }, 1000); // Delay player's attack and boss health flash to ensure it happens after player's health flash
});

// Restart button functionality
restartButton.addEventListener("click", () => {
    playerHealth = 100;
    bossHealth = 100;
    diceRoll = null;
    state.selectedAbility = null;
    state.inventory = []; // Reset inventory
    combatLog.textContent = "";
    updateHealthBars();
    rollDiceButton.disabled = false; // Re-enable Roll Dice button
    rollDiceButton.style.display = "inline-block"; // Show Roll Dice button again
    restartButton.style.display = "none"; // Hide Restart button
    attackButton.style.display = "none"; // Hide Attack button
    DOM.abilitiesContainer.classList.add("hidden"); // Hide abilities
});



