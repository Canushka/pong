const canvas = document.getElementById('pong');
const ctx = canvas.getContext('2d');

// Game settings
const PADDLE_WIDTH = 15;
const PADDLE_HEIGHT = 100;
const BALL_SIZE = 15;
const PADDLE_MARGIN = 10;
const PLAYER_COLOR = "#4CAF50";
const AI_COLOR = "#F44336";
const BALL_COLOR = "#FFD600";
const NET_COLOR = "#FFFFFF44";

// Initial positions and state
let playerY = (canvas.height - PADDLE_HEIGHT) / 2;
let aiY = (canvas.height - PADDLE_HEIGHT) / 2;
let ballX = canvas.width / 2 - BALL_SIZE / 2;
let ballY = canvas.height / 2 - BALL_SIZE / 2;
let ballSpeedX = 5 * (Math.random() > 0.5 ? 1 : -1);
let ballSpeedY = 3 * (Math.random() > 0.5 ? 1 : -1);

let playerScore = 0;
let aiScore = 0;

// Handle mouse movement for player paddle
canvas.addEventListener('mousemove', function(evt) {
    const rect = canvas.getBoundingClientRect();
    const mouseY = evt.clientY - rect.top;
    playerY = mouseY - PADDLE_HEIGHT / 2;

    // Keep paddle within bounds
    if (playerY < 0) playerY = 0;
    if (playerY + PADDLE_HEIGHT > canvas.height) playerY = canvas.height - PADDLE_HEIGHT;
});

// Draw functions
function drawRect(x, y, w, h, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, w, h);
}

function drawCircle(x, y, r, color) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2, false);
    ctx.closePath();
    ctx.fill();
}

function drawText(text, x, y, color, size = 32) {
    ctx.fillStyle = color;
    ctx.font = `${size}px Arial`;
    ctx.fillText(text, x, y);
}

function drawNet() {
    for (let i = 0; i < canvas.height; i += 30) {
        drawRect(canvas.width / 2 - 2, i, 4, 20, NET_COLOR);
    }
}

// Game logic
function resetBall() {
    ballX = canvas.width / 2 - BALL_SIZE / 2;
    ballY = canvas.height / 2 - BALL_SIZE / 2;
    ballSpeedX = 5 * (Math.random() > 0.5 ? 1 : -1);
    ballSpeedY = 3 * (Math.random() > 0.5 ? 1 : -1);
}

function updateBall() {
    ballX += ballSpeedX;
    ballY += ballSpeedY;

    // Top and bottom wall collision
    if (ballY <= 0 || ballY + BALL_SIZE >= canvas.height) {
        ballSpeedY = -ballSpeedY;
    }

    // Left paddle collision
    if (
        ballX <= PADDLE_MARGIN + PADDLE_WIDTH &&
        ballY + BALL_SIZE >= playerY &&
        ballY <= playerY + PADDLE_HEIGHT
    ) {
        ballSpeedX = -ballSpeedX;
        // Add some "spin" based on where it hit the paddle
        let collidePoint = (ballY + BALL_SIZE / 2) - (playerY + PADDLE_HEIGHT / 2);
        collidePoint = collidePoint / (PADDLE_HEIGHT / 2);
        ballSpeedY = collidePoint * 5;
    }

    // Right paddle collision (AI)
    if (
        ballX + BALL_SIZE >= canvas.width - PADDLE_MARGIN - PADDLE_WIDTH &&
        ballY + BALL_SIZE >= aiY &&
        ballY <= aiY + PADDLE_HEIGHT
    ) {
        ballSpeedX = -ballSpeedX;
        // Add some "spin" based on where it hit the paddle
        let collidePoint = (ballY + BALL_SIZE / 2) - (aiY + PADDLE_HEIGHT / 2);
        collidePoint = collidePoint / (PADDLE_HEIGHT / 2);
        ballSpeedY = collidePoint * 5;
    }

    // Left wall (AI scores)
    if (ballX < 0) {
        aiScore++;
        resetBall();
    }

    // Right wall (Player scores)
    if (ballX + BALL_SIZE > canvas.width) {
        playerScore++;
        resetBall();
    }
}

// Simple AI for right paddle
function updateAI() {
    // Move AI paddle center toward the ball
    const aiCenter = aiY + PADDLE_HEIGHT / 2;
    const ballCenter = ballY + BALL_SIZE / 2;
    if (aiCenter < ballCenter - 10) {
        aiY += 4;
    } else if (aiCenter > ballCenter + 10) {
        aiY -= 4;
    }
    // Keep AI paddle in bounds
    if (aiY < 0) aiY = 0;
    if (aiY + PADDLE_HEIGHT > canvas.height) aiY = canvas.height - PADDLE_HEIGHT;
}

function draw() {
    // Clear canvas
    drawRect(0, 0, canvas.width, canvas.height, "#222");

    // Draw net
    drawNet();

    // Draw paddles
    drawRect(PADDLE_MARGIN, playerY, PADDLE_WIDTH, PADDLE_HEIGHT, PLAYER_COLOR);
    drawRect(canvas.width - PADDLE_MARGIN - PADDLE_WIDTH, aiY, PADDLE_WIDTH, PADDLE_HEIGHT, AI_COLOR);

    // Draw ball
    drawRect(ballX, ballY, BALL_SIZE, BALL_SIZE, BALL_COLOR);

    // Draw scores
    drawText(playerScore, canvas.width / 4, 50, PLAYER_COLOR, 48);
    drawText(aiScore, 3 * canvas.width / 4, 50, AI_COLOR, 48);
}

function gameLoop() {
    updateBall();
    updateAI();
    draw();
    requestAnimationFrame(gameLoop);
}

// Start the game
gameLoop();