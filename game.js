const canvas = document.getElementById('pong');
const ctx = canvas.getContext('2d');

const WIDTH = canvas.width;
const HEIGHT = canvas.height;

// Paddle constants
const PADDLE_WIDTH = 12;
const PADDLE_HEIGHT = 80;
const PADDLE_MARGIN = 18;
const PADDLE_SPEED = 4;

// Ball constants
const BALL_SIZE = 15;
const BALL_SPEED = 6;

// Game state
let leftPaddle = {
    x: PADDLE_MARGIN,
    y: HEIGHT / 2 - PADDLE_HEIGHT / 2,
    width: PADDLE_WIDTH,
    height: PADDLE_HEIGHT
};

let rightPaddle = {
    x: WIDTH - PADDLE_MARGIN - PADDLE_WIDTH,
    y: HEIGHT / 2 - PADDLE_HEIGHT / 2,
    width: PADDLE_WIDTH,
    height: PADDLE_HEIGHT
};

let ball = {
    x: WIDTH / 2 - BALL_SIZE / 2,
    y: HEIGHT / 2 - BALL_SIZE / 2,
    size: BALL_SIZE,
    speedX: BALL_SPEED * (Math.random() < 0.5 ? 1 : -1),
    speedY: BALL_SPEED * (Math.random() * 2 - 1)
};

function resetBall() {
    ball.x = WIDTH / 2 - BALL_SIZE / 2;
    ball.y = HEIGHT / 2 - BALL_SIZE / 2;
    ball.speedX = BALL_SPEED * (Math.random() < 0.5 ? 1 : -1);
    ball.speedY = BALL_SPEED * (Math.random() * 2 - 1);
}

function drawRect(x, y, w, h, color='#fff') {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, w, h);
}

function drawBall() {
    ctx.fillStyle = "#fff";
    ctx.fillRect(ball.x, ball.y, ball.size, ball.size);
}

function drawNet() {
    ctx.fillStyle = '#444';
    for (let i = 10; i < HEIGHT; i += 30) {
        ctx.fillRect(WIDTH / 2 - 2, i, 4, 18);
    }
}

function clear() {
    ctx.clearRect(0, 0, WIDTH, HEIGHT);
}

function draw() {
    clear();
    drawNet();
    drawRect(leftPaddle.x, leftPaddle.y, leftPaddle.width, leftPaddle.height);
    drawRect(rightPaddle.x, rightPaddle.y, rightPaddle.width, rightPaddle.height);
    drawBall();
}

function update() {
    // Move ball
    ball.x += ball.speedX;
    ball.y += ball.speedY;

    // Top & bottom wall bounce
    if (ball.y <= 0) {
        ball.y = 0;
        ball.speedY = -ball.speedY;
    } else if (ball.y + ball.size >= HEIGHT) {
        ball.y = HEIGHT - ball.size;
        ball.speedY = -ball.speedY;
    }

    // Left paddle collision
    if (
        ball.x <= leftPaddle.x + leftPaddle.width &&
        ball.y + ball.size > leftPaddle.y &&
        ball.y < leftPaddle.y + leftPaddle.height
    ) {
        ball.x = leftPaddle.x + leftPaddle.width;
        ball.speedX = -ball.speedX;

        // Add some "spin"
        let collidePoint = (ball.y + ball.size / 2) - (leftPaddle.y + leftPaddle.height / 2);
        collidePoint = collidePoint / (leftPaddle.height / 2);
        ball.speedY = BALL_SPEED * collidePoint;
    }

    // Right paddle collision
    if (
        ball.x + ball.size >= rightPaddle.x &&
        ball.y + ball.size > rightPaddle.y &&
        ball.y < rightPaddle.y + rightPaddle.height
    ) {
        ball.x = rightPaddle.x - ball.size;
        ball.speedX = -ball.speedX;

        let collidePoint = (ball.y + ball.size / 2) - (rightPaddle.y + rightPaddle.height / 2);
        collidePoint = collidePoint / (rightPaddle.height / 2);
        ball.speedY = BALL_SPEED * collidePoint;
    }

    // Score (ball out of bounds)
    if (ball.x < 0 || ball.x > WIDTH) {
        resetBall();
    }

    // AI for right paddle
    let paddleCenter = rightPaddle.y + rightPaddle.height / 2;
    if (paddleCenter < ball.y + ball.size / 2 - 10) {
        rightPaddle.y += PADDLE_SPEED;
    } else if (paddleCenter > ball.y + ball.size / 2 + 10) {
        rightPaddle.y -= PADDLE_SPEED;
    }
    // Clamp right paddle
    rightPaddle.y = Math.max(0, Math.min(HEIGHT - rightPaddle.height, rightPaddle.y));
}

// Player control: left paddle follows mouse Y
canvas.addEventListener('mousemove', function(evt) {
    const rect = canvas.getBoundingClientRect();
    let mouseY = evt.clientY - rect.top;
    leftPaddle.y = mouseY - leftPaddle.height / 2;
    // Clamp
    leftPaddle.y = Math.max(0, Math.min(HEIGHT - leftPaddle.height, leftPaddle.y));
});

function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

// Start game
gameLoop();