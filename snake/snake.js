document.addEventListener('DOMContentLoaded', function () {
    const canvas = document.getElementById('game-canvas');
    const ctx = canvas.getContext('2d');
    const questionContainer = document.getElementById('question-container');
    const optionsContainer = document.getElementById('options-container');
    const restartButton = document.getElementById('restart-button');
    const scoreText = document.getElementById('score-text');
    const questionText = document.getElementById('question-text');

    const GRID_SIZE = 5;
    const WIDTH = 800;
    const HEIGHT = 600;
    const FPS = 10;
    let snake = [[100, 100], [90, 100], [80, 100]];
    let snakeDirection = [GRID_SIZE, 0];
    let goodFood = [getRandomPosition(), getRandomPosition()];
    let badFood = [getRandomPosition(), getRandomPosition()];
    let obstacles = [[300, 300], [350, 350], [400, 400]];
    let score = 0;
    let currentQuestion = null;

    // Function to generate random position
    function getRandomPosition() {
        return Math.floor(Math.random() * (WIDTH / GRID_SIZE)) * GRID_SIZE;
    }

    // Function to restart the game
    function restartGame() {
        snake = [[100, 100], [90, 100], [80, 100]];
        snakeDirection = [GRID_SIZE, 0];
        goodFood = [getRandomPosition(), getRandomPosition()];
        badFood = [getRandomPosition(), getRandomPosition()];
        currentQuestion = null;
        score = 0;
        questionContainer.style.display = 'none';
    }

    // Function to handle game over
    function gameOver() {
        questionContainer.style.display = 'block';
        questionText.innerText = 'Game Over';
    }

    // Function to display a random question
    function displayQuestion() {
        currentQuestion = questions[Math.floor(Math.random() * questions.length)];

        questionText.innerText = currentQuestion.question;

        optionsContainer.innerHTML = '';
        currentQuestion.options.forEach((option, index) => {
            const optionElement = document.createElement('div');
            optionElement.textContent = option;
            optionElement.classList.add('option');
            optionElement.addEventListener('click', function () {
                if (option.startsWith(currentQuestion.correct_option)) {
                    score += 20; // Increase score for correct answer
                } else {
                    score -= 10; // Decrease score for wrong answer
                }
                currentQuestion = null; // Hide question after answering
            });
            optionsContainer.appendChild(optionElement);
        });

        questionContainer.style.display = 'block';
    }

    // Draw function to draw on the canvas
    function draw() {
        // Clear canvas
        ctx.clearRect(0, 0, WIDTH, HEIGHT);

        // Draw snake
        ctx.fillStyle = '#008000'; // Snake color
        snake.forEach(segment => {
            ctx.fillRect(segment[0], segment[1], GRID_SIZE, GRID_SIZE);
        });

        // Draw good food
        ctx.fillStyle = '#00ff00'; // Good food color
        ctx.fillRect(goodFood[0], goodFood[1], GRID_SIZE, GRID_SIZE);

        // Draw bad food
        ctx.fillStyle = '#ff0000'; // Bad food color
        ctx.fillRect(badFood[0], badFood[1], GRID_SIZE, GRID_SIZE);

        // Draw obstacles
        ctx.fillStyle = '#fff'; // Obstacle color
        obstacles.forEach(obstacle => {
            ctx.fillRect(obstacle[0], obstacle[1], GRID_SIZE, GRID_SIZE);
        });

        // Draw score
        scoreText.textContent = 'Score: ' + score;
    }

    // Collision detection function
    function checkCollision() {
        const head = snake[0];
        // Check wall collision
        if (head[0] < 0 || head[0] >= WIDTH || head[1] < 0 || head[1] >= HEIGHT) {
            return true;
        }
        // Check self collision
        for (let i = 1; i < snake.length; i++) {
            if (head[0] === snake[i][0] && head[1] === snake[i][1]) {
                return true;
            }
        }
        // Check obstacle collision
        for (const obstacle of obstacles) {
            if (head[0] === obstacle[0] && head[1] === obstacle[1]) {
                return true;
            }
        }
        return false;
    }

    // Function to update the game state
    function update() {
        // Update snake position based on direction
        const newHead = [snake[0][0] + snakeDirection[0], snake[0][1] + snakeDirection[1]];
        snake.unshift(newHead);

        // Check for collisions
        if (checkCollision()) {
            gameOver();
            return;
        }

        // Check if snake eats good food
        if (newHead[0] === goodFood[0] && newHead[1] === goodFood[1]) {
            score += 10;
            // Increase snake length
            snake.push(snake[snake.length - 1].slice());
            goodFood = [getRandomPosition(), getRandomPosition()];
            displayQuestion(); // Display question when snake eats good food
        }

        // Check if snake eats bad food
        if (newHead[0] === badFood[0] && newHead[1] === badFood[1]) {
            score -= 10;
            // Decrease snake length if possible
            if (snake.length > 3) {
                snake.pop();
                snake.pop();
            }
            badFood = [getRandomPosition(), getRandomPosition()];
        }

        // Update direction based on user input
        document.addEventListener('keydown', function (event) {
            if (event.key === 'ArrowUp' && snakeDirection[1] !== GRID_SIZE) {
                snakeDirection = [0, -GRID_SIZE];
            } else if (event.key === 'ArrowDown' && snakeDirection[1] !== -GRID_SIZE) {
                snakeDirection = [0, GRID_SIZE];
            } else if (event.key === 'ArrowLeft' && snakeDirection[0] !== GRID_SIZE) {
                snakeDirection = [-GRID_SIZE, 0];
            } else if (event.key === 'ArrowRight' && snakeDirection[0] !== -GRID_SIZE) {
                snakeDirection = [GRID_SIZE, 0];
            }
        });

        // Remove last segment if snake is too long
        if (snake.length > 1 && snake.length > score / 10 + 3) {
            snake.pop();
        }
    }

    // Main game loop
    function gameLoop() {
        update();
        draw();
    }

    setInterval(gameLoop, 1000 / FPS);

    // Event listener for restart button
    restartButton.addEventListener('click', restartGame);
});
