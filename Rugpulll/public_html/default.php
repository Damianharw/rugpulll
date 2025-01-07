<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Simple JavaScript Game</title>
    <style>
        body {
            margin: 0;
            padding: 0;
            background-color: black;
            color: white;
            font-family: Arial, sans-serif;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            overflow: hidden;
            display: block;
        }

        .game-container {
            position: relative;
            width: 600px;
            height: 400px;
            background-image: url('images/box.jpg');
            background-size: cover;
            background-position: center;
            border: 2px solid #fff;
            border-radius: 10px;
            overflow: hidden;
            display: block;
        }

        .start-button {
            position: absolute;
            bottom: 10px;
            left: 50%;
            transform: translateX(-50%);
            padding: 10px 20px;
            background-color: #f00;
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            font-size: 16px;
        }

        .falling-object {
            position: absolute;
            width: 20px;
            height: 20px;
            background-color: #00f;
            border-radius: 50%;
        }
        
        .danger-object {
            position: absolute;
            width: 100px;
            height: 20px;
            background-color: red;
        }

        .score {
            position: absolute;
            top: 10px;
            left: 10px;
            font-size: 18px;
        }
        .header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 10px 20px;
            background-color: #222;
            border-bottom: 2px solid #444;
            margin-right: 10%;
            margin-left: 10%;
        }

        .header .logo {
            font-size: 24px;
            font-weight: bold;
            color: #fff;
        }

        .header .nav {
            display: flex;
            gap: 20px;
            margin-right: 2rem;
        }

        .header .nav a {
            text-decoration: none;
            color: white;
            font-size: 18px;
            transition: color 0.3s;
        }

        .header .nav a:hover {
            color: #00bcd4;
        }

        .header .socials {
            display: flex;
            gap: 15px;
        }

        .header .socials a {
            color: white;
            font-size: 20px;
            text-decoration: none;
            transition: color 0.3s;
        }

        .header .socials a:hover {
            color: #00bcd4;
        }
        
    </style>
</head>
<body>
    <header class="header">
        <!-- Logo -->
        <div class="logo">MyLogo</div>
        
        <div style="display: flex;">
            <nav class="nav">
                <a href="#home">Home</a>
                <a href="#about">About</a>
            </nav>
            
            <div class="socials">
                <a href="https://facebook.com" target="_blank">FB</a>
                <a href="https://twitter.com" target="_blank">TW</a>
                <a href="https://instagram.com" target="_blank">IG</a>
            </div>
        </div>
    </header>
    <main>
        <div>
            <div class="game-container" id="game-container">
                <div class="score" id="score">Score: 0</div>
                <button class="start-button" id="start-button">Start Game</button>
            </div>
        </div>
    </main>

    <script>
        const gameContainer = document.getElementById('game-container');
        const startButton = document.getElementById('start-button');
        const scoreDisplay = document.getElementById('score');
        let gameActive = false;
        let score = 0;
        let spawnIntervalCoin, fallIntervalCoin, dangerInterval;

        // Function to start the game
        function startGame() {
            gameActive = true;
            score = 0;
            scoreDisplay.textContent = `Score: ${score}`;
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
                obj.style.top = '0px';
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
                        scoreDisplay.textContent = `Score: ${score}`;
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
    </script>
</body>
</html>