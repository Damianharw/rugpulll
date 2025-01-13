const container = document.getElementById('body');
    const SPEED = 2;               // pixels per frame (adjust to speed up/down)
    const GIF_URL = 'src/videos/car.gif'; // replace with your actual GIF path
    const SIZE = 100;             // width & height of the moving div
    const INTERVAL = 10000;       // 30 seconds

    /**
     * Creates a new div and animates it from left to right.
     */
    function createAndAnimateDiv() {
      // Random vertical position
      const maxTop = container.clientHeight - SIZE;
      const randomTop = Math.floor(Math.random() * maxTop);

      // Create the div
      const movingDiv = document.createElement('div');
      movingDiv.classList.add('moving-div');
      movingDiv.style.top = `${randomTop}px`;
      movingDiv.style.backgroundImage = `url(${GIF_URL})`;

      container.appendChild(movingDiv);

      /**
       * Animates the div using requestAnimationFrame.
       */
      function animate() {
        // Current left position, defaulting to -SIZE if not yet set
        const currentLeft = parseInt(movingDiv.style.left) || -SIZE;

        // If the div has moved off the right edge, remove it
        if (currentLeft > container.clientWidth) {
          container.removeChild(movingDiv);
        } else {
          // Move the div to the right by SPEED pixels, then queue next frame
          movingDiv.style.left = `${currentLeft + SPEED}px`;
          requestAnimationFrame(animate);
        }
      }

      // Start animation
      requestAnimationFrame(animate);
    }

    // Create one immediately on page load
    createAndAnimateDiv();

    // Then create a new one every 30 seconds
    setInterval(createAndAnimateDiv, INTERVAL);