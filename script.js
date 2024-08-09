const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const canvasSize = 400;
const pacSize = 30;
const pacSpeed = 5;
const pointSize = 10;
const ghostSize = 30;
const numPoints = 20; // Número de bolinhas

canvas.width = canvasSize;
canvas.height = canvasSize;

let pacX = canvasSize / 2 - pacSize / 2;
let pacY = canvasSize / 2 - pacSize / 2;
let pacDirection = 'right';

const points = [];
const ghosts = [{ x: 100, y: 100 }];
let score = 0;

// Initialize Points
function initializePoints() {
    points.length = 0; // Limpar bolinhas existentes
    for (let i = 0; i < numPoints; i++) {
        points.push({
            x: Math.random() * (canvasSize - pointSize * 2) + pointSize,
            y: Math.random() * (canvasSize - pointSize * 2) + pointSize
        });
    }
}

// Draw Pac-Man
function drawPacMan() {
    ctx.beginPath();
    ctx.arc(pacX + pacSize / 2, pacY + pacSize / 2, pacSize / 2, 0.2 * Math.PI, 1.8 * Math.PI);
    ctx.lineTo(pacX + pacSize / 2, pacY + pacSize / 2);
    ctx.fillStyle = 'yellow';
    ctx.fill();
    ctx.closePath();
}

// Draw Points
function drawPoints() {
    ctx.fillStyle = 'white';
    points.forEach(point => {
        ctx.beginPath();
        ctx.arc(point.x, point.y, pointSize, 0, 2 * Math.PI);
        ctx.fill();
        ctx.closePath();
    });
}

// Draw Ghosts
function drawGhosts() {
    ctx.fillStyle = 'red';
    ghosts.forEach(ghost => {
        ctx.beginPath();
        ctx.arc(ghost.x, ghost.y, ghostSize / 2, 0, 2 * Math.PI);
        ctx.fill();
        ctx.closePath();
    });
}

// Update Pac-Man Position
function updatePacMan() {
    switch (pacDirection) {
        case 'right':
            pacX += pacSpeed;
            break;
        case 'left':
            pacX -= pacSpeed;
            break;
        case 'up':
            pacY -= pacSpeed;
            break;
        case 'down':
            pacY += pacSpeed;
            break;
    }

    // Boundary collision detection
    if (pacX < 0) pacX = 0;
    if (pacY < 0) pacY = 0;
    if (pacX + pacSize > canvasSize) pacX = canvasSize - pacSize;
    if (pacY + pacSize > canvasSize) pacY = canvasSize - pacSize;
}

// Check Collision with Points
function checkPointCollision() {
    points.forEach((point, index) => {
        const dx = pacX + pacSize / 2 - point.x;
        const dy = pacY + pacSize / 2 - point.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < pacSize / 2 + pointSize) {
            score += 10;
            document.getElementById('score').innerText = `Score: ${score}`;
            points.splice(index, 1); // Remove the collected point
        }
    });
}

// Check Collision with Ghosts
function checkGhostCollision() {
    ghosts.forEach(ghost => {
        const dx = pacX + pacSize / 2 - ghost.x;
        const dy = pacY + pacSize / 2 - ghost.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < pacSize / 2 + ghostSize / 2) {
            alert('Game Over! Score: ' + score);
            score = 0;
            document.getElementById('score').innerText = `Score: ${score}`;
            pacX = canvasSize / 2 - pacSize / 2;
            pacY = canvasSize / 2 - pacSize / 2;
            initializePoints(); // Reinitialize points
        }
    });
}

// Handle Keyboard Input
function handleKeyDown(event) {
    switch (event.key) {
        case 'ArrowRight':
            pacDirection = 'right';
            break;
        case 'ArrowLeft':
            pacDirection = 'left';
            break;
        case 'ArrowUp':
            pacDirection = 'up';
            break;
        case 'ArrowDown':
            pacDirection = 'down';
            break;
    }
}

document.addEventListener('keydown', handleKeyDown);

// Game Loop
function gameLoop() {
    updatePacMan();
    checkPointCollision();
    checkGhostCollision();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawPacMan();
    drawPoints();
    drawGhosts();
    requestAnimationFrame(gameLoop);
}

initializePoints(); // Inicializar bolinhas no início do jogo
gameLoop();
