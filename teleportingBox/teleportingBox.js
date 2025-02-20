
// function moveClicker() {
//     // Get container dimensions
//     const containerRect = container.getBoundingClientRect();
//     const containerWidth = containerRect.width;
//     const containerHeight = containerRect.height;

//     // Generate random position
//     const newX = Math.floor(Math.random() * (containerWidth - 50));
//     const newY = Math.floor(Math.random() * (containerHeight - 50));

//     // Move clicker
//     clicker.style.left = `${newX}px`;
//     clicker.style.top = `${newY}px`;
// }

// // Auto-move every second
// setInterval(moveClicker, 2000);

// clicker.addEventListener('click', () => {
//     // Increment score
//     score++;
//     scoreElement.textContent = `Points: ${score}`;

//     // Move clicker on click as well
//     moveClicker();
// });

// class NonFunctionalTestSnapshot {
//     constructor(application) {
//         this.application = application;
//     }

//     async capturePerformanceSnapshot() {
//         const start = performance.now();
//         const responses = await Promise.all([
//             fetch('/api/users'),
//             fetch('/api/products'),
//             fetch('/api/orders')
//         ]);

//         return {
//             timestamp: new Date().toISOString(),
//             totalResponseTime: performance.now() - start,
//             endpoints: [
//                 { 
//                     path: '/api/users', 
//                     status: responses[0].status,
//                     responseTime: this.measureResponseTime(responses[0])
//                 }]};


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

// class NonFunctionalTestSnapshot {
//     constructor(application) {
//         this.application = application;
//     }

//     async capturePerformanceSnapshot() {
//         const start = performance.now();
//         const responses = await Promise.all([
//             fetch('X'),
//             fetch('Y'),
//             fetch('Z')
//         ]);

//         return {
//             timestamp: new Date().toISOString(),
//             totalResponseTime: performance.now() - start,
//             endpoints: responses.map((response, index) => ({
//                 path: ['X', 'Y', 'Z'][index],
//                 status: response.status,
//                 responseTime: performance.now() - start
//             }))
//         };
//     }
// }
