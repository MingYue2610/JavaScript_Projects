const clickIcon = document.getElementById("clicker");
const scoreElement = document.getElementById("score");
const container = document.getElementById("game-container");

let score = 0;

function moveClicker() {
    if (!clickIcon || !container) return; 

    // Get container dimensions
    const containerRect = container.getBoundingClientRect();
    const containerWidth = containerRect.width;
    const containerHeight = containerRect.height;

    // Generate random position within bounds
    const newX = Math.floor(Math.random() * (containerWidth - clickIcon.clientWidth));
    const newY = Math.floor(Math.random() * (containerHeight - clickIcon.clientHeight));

    // Move clicker
    clickIcon.style.left = `${newX}px`;
    clickIcon.style.top = `${newY}px`;
}

// Auto-move every second
setInterval(moveClicker, 1000);

clickIcon?.addEventListener("click", () => {
    score++;
    scoreElement.textContent = `Points: ${score}`;

    moveClicker(); // Move clicker method
});
