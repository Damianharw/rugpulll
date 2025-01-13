const gameContainer = document.getElementById('game-container');
const startButton = document.getElementById('start-button');
const scoreDisplay = document.getElementById('score-number');
let gameActive = false;
let score = 0;
let spawnIntervalCoin, fallIntervalCoin, dangerInterval;
let soundArray = [
    'src/SFX/jasonLetsGo.mp4', 
    'src/SFX/jasonPumpItUp.mp4',
    'src/SFX/jasonSendIt.mp4',
    'src/SFX/jasonTakingOverOcean.mp4',
    'src/SFX/jasonWhalesOcean.mp4',
    'src/SFX/whitHellaBullish.mp4',
    'src/SFX/whitSendItSully.mp4'
]

let bgMusic = new Audio('src/SFX/pumpitup.mp3');

// Function to start the game
function startGame() {
    gameActive = true;
    score = 0;
    scoreDisplay.textContent = `${score}`;
    startButton.style.display = 'none';
    spawnObjects();
    spawnDangerObjects();
    checkCursorBounds();
    bgMusic.play();
    bgMusic.volume = 0.025;
    const isIos = /Safari/.test(navigator.userAgent);
    if (isIos) {
        bgMusic.volume = 0; // iOS-specific lower background volume
    } else {
        bgMusic.volume = 0.04;
    }
}

// Function to end the game
function endGame(reason = 'You pulled the rug!') {
    gameActive = false;
    bgMusic.currentTime = 0;
    bgMusic.pause();
    alert(`${reason} Your score: ${score}`);
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
        const val = Math.random() * (gameContainer.clientWidth*0.8);
        obj.style.left = Math.max(gameContainer.clientWidth*0.1, val) + 'px';
        obj.style.top = '-30px';
        gameContainer.appendChild(obj);
        fallObject(obj);
    }, 1000);
}

function spawnDangerObjects() {
    dangerInterval = setInterval(() => {
        const dangerObj = document.createElement('div');
        dangerObj.classList.add('danger-object');
        const val = Math.random() * (gameContainer.clientHeight*0.8);
        dangerObj.style.top = Math.max(gameContainer.clientHeight*0.2, val) + 'px';

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
                endGame('You pulled the rug!');
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
                playCollectedSound();
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

function playCollectedSound() {
    if(score % 5 !== 0) {
        const sound = new Audio('src/SFX/coin_collected.mp3');
        sound.volume = 0.2;
        sound.play();
    }
    else {
        if(score == 5) {
            const sound = new Audio('src/SFX/whitHellaBullish.mp4');
            sound.volume = 0.2;
            sound.play();
        }
        else {
            const sound = new Audio(soundArray[Math.floor(Math.random() * soundArray.length)]);
            sound.volume = 0.2;
            sound.play();
        }
    }
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