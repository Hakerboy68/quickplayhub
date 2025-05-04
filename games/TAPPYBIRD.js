// Get the canvas element and context
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Set canvas size
canvas.width = 400;
canvas.height = 600;

// Game variables
let birdY = canvas.height / 2;
let birdVelocity = 0;
let birdGravity = 0.6;
let birdLift = -12;
let birdWidth = 30;
let birdHeight = 30;
let isFlapping = false;

let pipeWidth = 50;
let pipeGap = 150;
let pipeSpeed = 2;
let pipeArray = [];

let score = 0;
let gameOver = false;

// Bird image
const birdImage = new Image();
birdImage.src = 'bird.png'; // Replace with your image path

// Bird class
class Bird {
    constructor() {
        this.y = birdY;
        this.velocity = birdVelocity;
    }

    update() {
        if (isFlapping) {
            this.velocity = birdLift;
            isFlapping = false;
        }
        this.velocity += birdGravity;
        this.y += this.velocity;

        // Prevent bird from going out of bounds
        if (this.y + birdHeight > canvas.height) {
            this.y = canvas.height - birdHeight;
            this.velocity = 0;
        }
        if (this.y < 0) {
            this.y = 0;
            this.velocity = 0;
        }
    }

    draw() {
        // Draw the bird image instead of a rectangle
        ctx.drawImage(birdImage, 50, this.y, birdWidth, birdHeight);
    }
}

// Pipe class
class Pipe {
    constructor() {
        this.x = canvas.width;
        this.height = Math.floor(Math.random() * (canvas.height - pipeGap));
        this.passed = false;
    }

    update() {
        this.x -= pipeSpeed;
        if (this.x + pipeWidth < 0) {
            pipeArray.shift();
            score++;
        }
    }

    draw() {
        ctx.fillStyle = "#0f0";
        ctx.fillRect(this.x, 0, pipeWidth, this.height);
        ctx.fillRect(this.x, this.height + pipeGap, pipeWidth, canvas.height - this.height - pipeGap);
    }
}

// Handle key press for bird flapping
document.addEventListener('keydown', (e) => {
    if (e.key === ' ') {
        isFlapping = true;
    }
});

// Game loop
const bird = new Bird();

function gameLoop() {
    if (gameOver) {
        ctx.font = "30px Arial";
        ctx.fillStyle = "#f00";
        ctx.fillText("Game Over", canvas.width / 3, canvas.height / 2);
        ctx.fillText("Score: " + score, canvas.width / 3, canvas.height / 2 + 40);
        return;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    bird.update();
    bird.draw();

    // Spawn pipes
    if (Math.random() < 0.02) {
        pipeArray.push(new Pipe());
    }

    // Update and draw pipes
    pipeArray.forEach((pipe, index) => {
        pipe.update();
        pipe.draw();

        // Collision detection
        if (pipe.x < 50 + birdWidth && pipe.x + pipeWidth > 50 && (bird.y < pipe.height || bird.y + birdHeight > pipe.height + pipeGap)) {
            gameOver = true;
        }
    });

    // Display score
    ctx.font = "20px Arial";
    ctx.fillStyle = "#000";
    ctx.fillText("Score: " + score, 10, 30);

    requestAnimationFrame(gameLoop);
}

// Start game loop
gameLoop();

