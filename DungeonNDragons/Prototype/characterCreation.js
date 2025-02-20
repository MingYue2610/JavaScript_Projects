document.addEventListener("DOMContentLoaded", () => {
    const video = document.getElementById("class-video");
    const nameInput = document.getElementById("character-name");
    const musicToggleBtn = document.getElementById("music-toggle-btn-character");
    const backgroundMusic = document.getElementById("background-music");
    const feedback = document.getElementById("name-feedback");
    const submitButton = document.getElementById("to-hidden-objects");

    const classes = {
        warrior: { video: "videos/Warrior_animation.mp4" },
        mage: { video: "videos/Mage_animation.mp4" },
        rogue: { video: "videos/Rogue_animation.mp4" },
    };

    // Class selection event
    document.querySelectorAll(".class-button").forEach((button) => {
        button.addEventListener("click", () => {
            const className = button.id;
            const { video: videoFile } = classes[className];

            if (video) {
                // Set the video source and play
                video.src = videoFile;
                video.load(); // Ensure the new video source is loaded
                video.play();
            }

            // Save class to localStorage
            localStorage.setItem("characterClass", className);
            console.log(`Class selected: ${className}`);
        });
    });

    // Play background music on page load
    window.addEventListener("load", () => {
        if (backgroundMusic) {
            backgroundMusic.volume = 0.5; // Adjust volume (0.0 to 1.0)
            backgroundMusic.play().catch((error) => {
                console.log("Music autoplay blocked. User interaction required:", error);
            });
        }
    });

    // Add play/pause toggle for user control
    if (musicToggleBtn && backgroundMusic) {
        musicToggleBtn.addEventListener("click", () => {
            if (backgroundMusic.paused) {
                backgroundMusic.play();
                musicToggleBtn.textContent = "Pause Music";
            } else {
                backgroundMusic.pause();
                musicToggleBtn.textContent = "Play Music";
            }
        });
    }

    // Validate on form submission
    submitButton.addEventListener("click", () => {
        const characterName = nameInput.value.trim();
        const isValidName = /^[a-zA-Z0-9]+$/.test(characterName);

        // Check if name is empty
        if (!characterName) {
            feedback.textContent = "Character name is required.";
            return;
        }

        // Check if name contains invalid characters
        if (!isValidName) {
            feedback.textContent = "Character name can only contain alphanumeric characters.";
            return;
        }

        // Check length constraints
        if (characterName.length < 1 || characterName.length > 20) {
            feedback.textContent = "Character name must be between 1 and 20 characters.";
            return;
        }

        // If all validations pass, clear feedback, save the name, and proceed
        feedback.textContent = ""; // Clear any error messages
        localStorage.setItem("characterName", characterName);
        window.location.href = "hiddenObject.html";
    });
});
