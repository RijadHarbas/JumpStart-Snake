document.addEventListener("DOMContentLoaded", () => {
    const gameArea = document.querySelector("#game-area");
    const gameAreaWidth = gameArea.width;
    const gameAreaHeight = gameArea.height;

    const horizontal

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
        ]
    }

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

    const moveSnake = () => {
        moveHead();
        // Cut the end of the tail
        snake.parts.shift();
    }

    const moveHead = (directionModX, directionModY) => {
        const currentHead = snake.parts[snake.parts.length - 1];
        const newHead = { x: 0, y: 0 };
        newHead.x = currentHead.x + directionModX;
        newHead.y = currentHead.y + directionModY;
        snake.parts.push(newHead);
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
            moveSnake();
        }
        requestAnimationFrame(gameLoop);
    }

    gameLoop();

})

