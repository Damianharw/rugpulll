const gameContainer = document.getElementById('game-container');
const startButton = document.getElementById('start-button');
const scoreDisplay = document.getElementById('score-number');
let gameActive = false;
let score = 0;
let spawnIntervalCoin, fallIntervalCoin, dangerInterval;

// Function to start the game
function startGame() {
    gameActive = true;
    score = 0;
    scoreDisplay.textContent = `${score}`;
    startButton.style.display = 'none';
    spawnObjects();
    spawnDangerObjects();
    checkCursorBounds();
}

// Function to end the game
function endGame() {
    gameActive = false;
    alert(`Game Over! Your score: ${score}`);
    startButton.style.display = 'block';
    clearInterval(spawnIntervalCoin);
    clearInterval(dangerInterval);
    clearInterval(fallIntervalCoin);
    document.querySelectorAll('.danger-object').forEach(obj => obj.remove());
    document.querySelectorAll('.falling-object').forEach(obj => obj.remove());
}

// Spawn falling objects
function spawnObjects() {
    spawnIntervalCoin = setInterval(() => {
        const obj = document.createElement('div');
        obj.classList.add('falling-object');
        obj.style.left = Math.random() * (gameContainer.clientWidth - 20) + 'px';
        obj.style.top = '-30px';
        gameContainer.appendChild(obj);
        fallObject(obj);
    }, 1000);
}

function spawnDangerObjects() {
    dangerInterval = setInterval(() => {
        const dangerObj = document.createElement('div');
        dangerObj.classList.add('danger-object');
        dangerObj.style.top = Math.random() * (gameContainer.clientHeight - 40) + 'px';

        // Randomly decide direction (left to right or right to left)
        const moveRight = Math.random() > 0.5;
        dangerObj.style.left = moveRight ? '-100px' : `${gameContainer.clientWidth}px`;

        gameContainer.appendChild(dangerObj);
        moveDangerObject(dangerObj, moveRight);
    }, 2000 + Math.random() * 2000); // Spawn every 2-4 seconds
}

function moveDangerObject(obj, moveRight) {
    let left = moveRight ? -100 : gameContainer.clientWidth;
    const speed = 5;

    const moveInterval = setInterval(() => {
        if (!gameActive) {
            clearInterval(moveInterval);
            return;
        }

        left += moveRight ? speed : -speed;
        obj.style.left = `${left}px`;

        // Check collision with cursor
        obj.addEventListener('mousemove', () => {
            if (gameActive) {
                endGame();
            }
        });

        // Remove object if it goes out of bounds
        if (moveRight && left > gameContainer.clientWidth || !moveRight && left < -100) {
            obj.remove();
            clearInterval(moveInterval);
        }
    }, 30);
}


function fallObject(obj) {
    let top = 0;
    let isCollected = false;
    const fallIntervalCoin = setInterval(() => {
        if (!gameActive) return;
        top += 5;
        obj.style.top = top + 'px';

        // Check if object is collected
        obj.addEventListener('mousemove', () => {
            if (gameActive && !isCollected) {
                score++;
                isCollected = true;
                const sound = new Audio('src/SFX/coin_collected.mp3');
                sound.volume = 0.2;
                sound.play();
                scoreDisplay.textContent = `${score}`;
                clearInterval(fallIntervalCoin);
                obj.remove();
            }
        });

        // Remove object if it goes out of bounds
        if (top > gameContainer.clientHeight) {
            obj.remove();
        }
    }, 25);
}

// Check if cursor is inside the rectangle
function checkCursorBounds() {
    gameContainer.addEventListener('mouseleave', () => {
        if (gameActive) {
            endGame();
        }
    });
}

// Start button event listener
startButton.addEventListener('click', startGame);