document.addEventListener("DOMContentLoaded", () => {
    const gameArea = document.querySelector("#game-area");
    const gameAreaWidth = gameArea.width;
    const gameAreaHeight = gameArea.height;
    let directionModX = 0;
    let directionModY = -10;


    let gameAreaContext;
    if (gameArea.getContext) {
        gameAreaContext = gameArea.getContext("2d");
    }

    let snake = {
        parts: [
            { x: 170, y: 200 },
            { x: 180, y: 200 },
            { x: 190, y: 200 },
            { x: 200, y: 200 }
        ],
        getHead() {
            return this.parts[this.parts.length - 1];
        }
    }

    document.addEventListener("keydown", event => {
        console.log(event);
        if (event.key === "a") {
            if (directionModX !== 10) {
                directionModX = -10;
                directionModY = 0;
            }
        } else if (event.key === "d") {
            if (directionModX !== -10) {
                directionModX = 10;
                directionModY = 0;
            }
        } else if (event.key === "w") {
            if (directionModY !== 10) {
                directionModY = -10;
                directionModX = 0;
            }
        } else if (event.key === "s") {
            if (directionModY !== -10) {
                directionModY = 10;
                directionModX = 0;
            }
        }
    })

    const clearGameArea = () => {
        gameAreaContext.clearRect(0, 0, gameAreaWidth, gameAreaHeight);
    }

    const drawSnake = () => {
        for (const part of snake.parts) {
            gameAreaContext.fillStyle = "#D9ED92";
            gameAreaContext.strokeStyle = "#168AAD";
            gameAreaContext.fillRect(part.x, part.y, 10, 10);
            gameAreaContext.strokeRect(part.x, part.y, 10, 10);
        }
    }

    const moveSnake = (directionModX, directionModY) => {
        moveHead(directionModX, directionModY);
        // Cut the end of the tail
        snake.parts.shift();
    }

    const moveHead = (directionModX, directionModY) => {
        const currentHead = snake.getHead();
        const newHead = { x: 0, y: 0 };
        newHead.x = currentHead.x + directionModX;
        newHead.y = currentHead.y + directionModY;
        snake.parts.push(newHead);
    }

    const isGameOver = () => {
        const head = snake.getHead();
        let isGameOver = false;

        isGameOver = head.x < 0 || head.y < 0;
        isGameOver = isGameOver || head.x > gameAreaWidth || head.y > gameAreaHeight;

        return isGameOver;
    }

    let previousTime = null;
    const gameLoop = (timestamp) => {
        if (!previousTime) {
            previousTime = timestamp;
        }
        // Render the snake roughly every 100 miliseconds
        if (timestamp - previousTime >= 100) {
            previousTime = timestamp;
            clearGameArea();
            drawSnake();
            moveSnake(directionModX, directionModY);
            if (isGameOver()) {
                return;
            }
        }
        requestAnimationFrame(gameLoop);
    }

    gameLoop();

})

