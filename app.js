document.addEventListener("DOMContentLoaded", () => {
    const gameArea = document.querySelector("#game-area");
    const gameAreaWidth = gameArea.width;
    const gameAreaHeight = gameArea.height;
    let directionModX = 0;
    let directionModY = -10;
    let gameAreaContext;
    if (gameArea.getContext) {
        gameAreaContext = gameArea.getContext("2d");
    } else {
        alert("Canvas API not supported! Unable to play the game!");
        console.error("Canvas API not supported! Unable to the play the game");
        return;
    }
    const score = document.querySelector("#score");
    const status = document.querySelector("#status");
    status.classList.add("hide");

    let snake = {
        parts: [
            { x: 170, y: 200 },
            { x: 180, y: 200 },
            { x: 190, y: 200 },
            { x: 200, y: 200 }
        ],
        getHead() {
            return this.parts[this.parts.length - 1];
        },
        getTail() {
            return this.parts[0];
        },
        appendNewHead(directionModX, directionModY) {
            const currentHead = this.getHead();
            const newHead = { x: 0, y: 0 };
            newHead.x = currentHead.x + directionModX;
            newHead.y = currentHead.y + directionModY;
            this.parts.push(newHead);
            // Cut the end of the tail
            snake.parts.shift();
        },
        appendNewTail() {
            const currentTail = this.getTail();
            const newTail = { x: 0, y: 0 };
            newTail.x = currentTail.x - directionModX;
            newTail.y = currentTail.y - directionModY;
            this.parts.unshift(newTail);
        }
    }

    document.addEventListener("keydown", event => {
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
        snake.appendNewHead(directionModX, directionModY);
        // Did we land on an apple? If so increase the score
        if (currentApple && currentApple.x === snake.getHead().x && currentApple.y === snake.getHead().y) {
            score.innerText = parseInt(score.innerText) + 10;
            // We ate the apple
            currentApple = null;
            snake.appendNewTail();
        }
    }

    let currentApple = null;
    const drawApple = () => {
        gameAreaContext.fillStyle = "#FF0000";
        if (!currentApple) {
            currentApple = createApple();
        }
        const isInvalidPosition = snake.parts
            .some(part => part.x === currentApple.x && part.y === currentApple.y);

        if (isInvalidPosition) {
            currentApple = null;
            return;
        }
        gameAreaContext.fillRect(currentApple.x, currentApple.y, 10, 10);
    }

    const createApple = () => {
        let x = Math.floor(Math.random() * (gameAreaWidth - 20)) + 10;
        // Remove the single digits, e.g. 427 becomes 420
        x = x - x % 10;
        let y = Math.floor(Math.random() * (gameAreaHeight - 20)) + 10;
        y = y - y % 10;
        return { x: x, y: y };
    }

    const isGameOver = () => {
        const head = snake.getHead();
        let isOutOfBounds = false;
        isOutOfBounds = head.x < 0 || head.y < 0;
        isOutOfBounds = isOutOfBounds || head.x >= gameAreaWidth || head.y >= gameAreaHeight;

        const isCollidedWith = snake.parts
            .slice(0, -1)
            .some(part => part.x === head.x && part.y === head.y);

        return isOutOfBounds || isCollidedWith;
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
            drawApple();
            moveSnake(directionModX, directionModY);
            if (isGameOver()) {
                status.classList.remove("hide");
                return;
            }
        }
        requestAnimationFrame(gameLoop);
    }

    alert("Use W A S D to control the snake. Eat the red dots to increase your score!");
    gameLoop();

})

