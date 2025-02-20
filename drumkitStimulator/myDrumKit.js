class SoundPlayer {
    constructor() {
        // Create pool of sounds for each key, so that multiple keys can be played at the ready
        this.soundPools = {
            'b': this.createSoundPool('./sounds/boom.wav', 5),
            'c': this.createSoundPool('./sounds/clap.wav', 5),
            'h': this.createSoundPool('./sounds/hihat.wav', 5),
            'k': this.createSoundPool('./sounds/kick.wav', 5),
            'o': this.createSoundPool('./sounds/openhat.wav', 5),
            'r': this.createSoundPool('./sounds/ride.wav', 5),
            's': this.createSoundPool('./sounds/snare.wav', 5),
            'i': this.createSoundPool('./sounds/tink.wav', 5),
            't': this.createSoundPool('./sounds/tom.wav', 5),
        };

        // Keep track of which sound to play next
        this.currentIndex = {
            'b': 0,
            'c': 0,
            'h': 0,
            'k': 0,
            'o': 0,
            'r': 0,
            's': 0,
            'i': 0,
            't': 0,
        };

        document.addEventListener('keypress', (event) => { // Event trigger for keyboard press
            this.playSound(event.key.toLowerCase()); // Converts keyboard keys to lowercase in case Caps lock was on
            this.addKeyboardFeedback(event.key.toLowerCase()); //Access the transition element
        });

        this.initializeClickListeners();
        this.initializeHelpToggle();
    }
    addKeyboardFeedback(key) {  // Function to acess the transition element and reset the animation when keyboards keys are pressed
        const keyElement = document.querySelector(`[data-sound="${key}"]`);
        if (keyElement) {
            keyElement.classList.add("expanded");
            setTimeout(() => {
                keyElement.classList.remove("expanded");
            }, 2000);
        }}
    initializeHelpToggle() {
        let helpButton = document.getElementById("toggleButton")
        let helpTextbox = document.getElementById("helpMessage")
        if (helpButton && helpTextbox) {
            helpButton.addEventListener("click", () => {
                // Toggle help message visibility
                helpMessage.classList.toggle("hidden");
                
                // Update button text based on help message visibility
                if (helpMessage.classList.contains("hidden")) {
                    helpButton.textContent = "Show How To";
                } else {
                    helpButton.textContent = "Hide How to";
                }
            });
        }}
    initializeClickListeners() {
        // Add click listeners to elements with data-sound attribute
        document.querySelectorAll('[data-sound]').forEach(element => { //Each sound is compile into data-sound and element is used to iterate through the list
            element.addEventListener('click', (event) => {
                const soundKey = event.target.getAttribute('data-sound').toLowerCase();
                this.playSound(soundKey);
                element.classList.add("expanded"); //Access the transition element
                setTimeout(function() {  // function to reset the transition after each click
                    element.classList.remove("expanded")},2000)
            });
        });
    }
    createSoundPool(soundPath, poolSize) {
        // Create multiple audio objects for each sound
        return Array.from({ length: poolSize }, () => {
            const audio = new Audio(soundPath);
            audio.volume = 0.5; // Set default volume
            return audio;
        });
    }

    playSound(key) {
        if (this.soundPools[key]) {
            // Get the next sound from the pool
            const soundPool = this.soundPools[key];
            const sound = soundPool[this.currentIndex[key]];
            
            // Reset and play
            sound.currentTime = 0;
            sound.play()
                .catch(error => console.log("Error playing sound:", error));

            // Update index for next time
            this.currentIndex[key] = (this.currentIndex[key] + 1) % soundPool.length;
        }
    }
}

// Initialize
const player = new SoundPlayer();

