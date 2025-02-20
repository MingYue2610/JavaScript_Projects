document.addEventListener("DOMContentLoaded", () => {
    const positionDisplay = document.getElementById('position');
  
    // Track mouse movement to update coordinates
    document.addEventListener('mousemove', (event) => {
      const x = event.clientX;
      const y = event.clientY;
      positionDisplay.textContent = `X: ${x}, Y: ${y}`;
    });
  
    // Track mouse click to highlight position
    document.addEventListener('click', (event) => {
      const x = event.clientX;
      const y = event.clientY;
  
      // Create highlight element at click position
      const highlight = document.createElement('div');
      highlight.classList.add('highlight');
      highlight.style.left = `${x - 5}px`; // Center the circle on click
      highlight.style.top = `${y - 5}px`;
  
      document.body.appendChild(highlight);
  
      // Remove highlight after a short delay
      setTimeout(() => {
        highlight.remove();
      }, 5000); // 1 second delay
    });
  });
  