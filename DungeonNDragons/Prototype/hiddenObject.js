document.addEventListener("DOMContentLoaded", () => {
    const gameArea = document.getElementById("game-area");
    const gameRect = gameArea.getBoundingClientRect();
    const message = document.getElementById("message");
    const toCombatButton = document.getElementById("to-combat");
    const musicToggleBtn = document.getElementById("music-toggle-btn-hidden");

    // Initialize backpack to display found items
    let backpack = {
        items: {}, // Object to track unique items and their counts
    };

    // Function to display backpack contents
    function updateBackpackDisplay() {
        const backpackElement = document.getElementById("backpack");
        if (backpackElement) {
            const displayItems = Object.entries(backpack.items)
                .map(([item, count]) => `${item} x${count}`)
                .join(", ") || "Empty";
            backpackElement.innerHTML = `<strong>Backpack:</strong> ${displayItems}`;
        } else {
            console.error("Backpack display element not found!");
        }
    }

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

    // Verify elements exist
    if (!gameArea) {
        console.error("Game area element not found!");
        return;
    }

    if (!message) {
        console.error("Message element not found!");
        return;
    }

    const characterName = localStorage.getItem("characterName") || "Player 1"; // Get characterName or use a default
    console.log("Character Name:", characterName);
    const itemName = localStorage.getItem("itemName") || characterName; 
    console.log("Item Name:", itemName);
    if (!localStorage.getItem("itemName")) {
        localStorage.setItem("itemName", characterName);
    }

    // Create clickable areas
    const hiddenItems = [
        { id: "sword", x: 50, y: 100 },
        { id: "dagger", x: 70, y: 400 },
        { id: "staff", x: 300, y: 300 },
        { id: "claymore", x: 200, y: 200 },
        { id: "bow", x: 400, y: 400 },
        { id: "potion", x: 400, y: 150 },
        { id: "potion", x: 300, y: 300 },
        { id: "potion", x: 300, y: 200 },
    ];

    hiddenItems.forEach(item => {
        const area = document.createElement("div");
        area.style.position = "absolute";
        area.style.left = `${item.x}px`;
        area.style.top = `${item.y}px`;
        area.style.width = "75px";
        area.style.height = "75px";
        area.style.backgroundColor = "#333";
        area.style.zIndex = 10;
        area.classList.add("clickable");
        area.dataset.itemId = item.id;
        gameArea.appendChild(area);
    });

    gameArea.addEventListener("click", event => {
        const itemId = event.target.dataset.itemId;
        if (itemId) {
            if (itemId === "potion") {
                // Allow multiple potions
                backpack.items[itemId] = (backpack.items[itemId] || 0) + 1;
                message.textContent = `You found a ${itemId}!`;
            } else {
                // Allow only one of each non-potion item
                if (backpack.items[itemId]) {
                    message.textContent = `You already have a ${itemId}!`;
                } else {
                    backpack.items[itemId] = 1;
                    message.textContent = `You found a ${itemId}!`;
                }
            }
            updateBackpackDisplay(); // Update backpack display
            event.target.remove();
        } else {
            console.log("No item at this position.");
            message.textContent = "There is nothing here, try again.";
        }
    });

    // Async function for saving inventory
    async function saveInventory() {
        console.log("Saving inventory:", { itemName, items: backpack.items });
        
        try {
            const response = await fetch("http://localhost:3000/inventory", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ 
                    itemName, 
                    items: backpack.items 
                }),
            });
            
            console.log("Response status:", response.status);
            const data = await response.json();
            console.log("Server response:", data);
            
            if (!data.success) throw new Error(data.message);
            console.log("Inventory saved:", data.inventory);
        } catch (err) {
            console.error("Full error saving inventory:", err);
        }
    }

    // Add event listener to combat button
    if (toCombatButton) {
        toCombatButton.addEventListener("click", async () => {
            await saveInventory();
            window.location.href = "combatSystem.html";
        });
    } else {
        console.error("To Combat button not found!");
    }

    // Mouse movement tracking
    document.addEventListener("click", (event) => {
        // Check if the mouse click is inside the game area
        if (
            event.clientX >= gameRect.left && 
            event.clientX <= gameRect.right &&
            event.clientY >= gameRect.top && 
            event.clientY <= gameRect.bottom
        ) {
            // If click is inside the game area, create the highlight element
            const x = event.clientX - gameRect.left; // Adjust for the game area's position
            const y = event.clientY - gameRect.top;
    
            const highlight = document.createElement("div");
            highlight.classList.add("highlight");
            highlight.style.left = `${x - 5}px`; // Center the circle on click
            highlight.style.top = `${y - 5}px`;
    
            // Append highlight to the game area instead of the entire body
            gameArea.appendChild(highlight);
    
            // Remove highlight after a short delay
            setTimeout(() => {
                highlight.remove();
            }, 1500); // 1.5 second delay
        }
    });

    // Initialize the backpack display on page load
    updateBackpackDisplay();
});
