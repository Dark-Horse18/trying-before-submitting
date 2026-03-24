const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// 1. INITIALIZE STATE
let player = { x: 250, y: 250, width: 25, height: 25, speed: 25, dir_x: 0, dir_y: 0 };
let keys = {};

const headImg = new Image();
headImg.src = "hq720.jpg"


// 2. INPUT HANDLING
window.addEventListener('keydown', e => keys[e.code] = true);
window.addEventListener('keyup', e => keys[e.code] = false);


// 3. THE GAME LOOP
const FPS = 10; // Set your desired Frames Per Second
const frameDelay = 1000 / FPS; // 1000ms divided by 10 FPS = 100ms delay

function gameLoop() {
    update();
    draw();
}

// This forces the loop to run exactly every 'frameDelay' milliseconds
setInterval(gameLoop, frameDelay);

function update() {
	if (keys['KeyW'] && player.dir_y == 0) {
		player.dir_x = 0;
		player.dir_y = -1;
	}
	if (keys['KeyS'] && player.dir_y == 0) {
		player.dir_x = 0;
		player.dir_y = 1;
	}
	if (keys['KeyA'] && player.dir_x == 0) {
		player.dir_x = -1;
		player.dir_y = 0;
	}
	if (keys['KeyD'] && player.dir_x == 0) {
		player.dir_x = 1;
		player.dir_y = 0;
	}

	player.x += player.dir_x * player.speed
	player.y += player.dir_y * player.speed


	// // Basic Screen Boundary Check
	// if (player.x < 0) player.x = 0;
	// if (player.x + player.width > canvas.width) player.x = canvas.width - player.width;
}

function draw() {
	// Clear the canvas every frame or you'll see a "trail"
	ctx.clearRect(0, 0, canvas.width, canvas.height);

	// draw grid
	drawGrid();

	// Draw Player
	ctx.drawImage(headImg, player.x, player.y, player.width, player.height);
}

function drawGrid() {
	ctx.strokeStyle = "#ccc"; // Light gray lines
	ctx.beginPath();

	// Draw Vertical Lines
	for (let x = 0; x <= canvas.width; x += player.speed) {
		ctx.moveTo(x, 0);
		ctx.lineTo(x, canvas.height);
	}

	// Draw Horizontal Lines
	for (let y = 0; y <= canvas.height; y += player.speed) {
		ctx.moveTo(0, y);
		ctx.lineTo(canvas.width, y);
	}

	ctx.stroke();
}

// Start the loop
gameLoop();