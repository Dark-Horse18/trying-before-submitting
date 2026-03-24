const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// 1. INITIALIZE STATE
let player = { x: 250, y: 250, width: 25, height: 25, speed: 25, dir_x: 0, dir_y: 0 }; // snake head(basically snake[0])
let keys = {};
msg = "";
snake = [[250, 250]];
state = "START";
// fruit_carrot = [Math.floor(Math.random() * 20) * 25, Math.floor(Math.random() * 20) * 25]
// fruit_pumkin = [Math.floor(Math.random() * 20) * 25, Math.floor(Math.random() * 20) * 25]
// fruit_apple = [Math.floor(Math.random() * 20) * 25, Math.floor(Math.random() * 20) * 25]

const headImg = new Image();
headImg.src = "hq720.jpg"
const bodyImg = new Image();
bodyImg.src = "goku.jpg.jpeg"


// 2. INPUT HANDLING
window.addEventListener('keydown', e => keys[e.code] = true);
window.addEventListener('keyup', e => keys[e.code] = false);


// 3. THE GAME LOOP
const FPS = 10; // Set your desired Frames Per Second
const frameDelay = 1000 / FPS; // 1000ms divided by 10 FPS = 100ms delay

function gameLoop() {

	if (state == "START") {
		alert("Press Ok to start")
		state = "PLAYING"
	}
	else if (state == "PLAYING") {
		update();
		draw();
		gameOver();
	}
	else if (state == "OVER") {
		alert(msg);
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		msg = "";
		state = "START";
		player = { x: 250, y: 250, width: 25, height: 25, speed: 25, dir_x: 0, dir_y: 0 };
		keys = {};
		snake = [[250, 250]];
	}
}

// This forces the loop to run exactly every 'frameDelay' milliseconds
setInterval(gameLoop, frameDelay);

function update() {
	if ((keys['KeyW'] || keys['ArrowUp']) && player.dir_y == 0) {
		player.dir_x = 0;
		player.dir_y = -1;
	}
	if ((keys['KeyS'] || keys['ArrowDown']) && player.dir_y == 0) {
		player.dir_x = 0;
		player.dir_y = 1;
	}
	if ((keys['KeyA'] || keys['ArrowLeft']) && player.dir_x == 0) {
		player.dir_x = -1;
		player.dir_y = 0;
	}
	if ((keys['KeyD'] || keys['ArrowRight']) && player.dir_x == 0) {
		player.dir_x = 1;
		player.dir_y = 0;
	}

	player.x += player.dir_x * player.speed
	player.y += player.dir_y * player.speed

	snake.unshift([player.x, player.y]);
	snake.pop();
	
}

function draw() {
	// Clear the canvas every frame or you'll see a "trail"
	ctx.clearRect(0, 0, canvas.width, canvas.height);

	// draw grid
	drawGrid();

	// Draw Player
	for(let i = 1; i < snake.length; i++) {
		ctx.drawImage(bodyImg, snake[i][0], snake[i][1], player.width, player.height);
	}
	ctx.drawImage(headImg, snake[0][0], snake[0][1], player.width, player.height);
}

function gameOver() {
	if (player.x < 0) {
		msg = "Wall Collision";
		state = "OVER";
	}
	if (player.x + player.width > canvas.width) {
		msg = "Wall Collision";
		state = "OVER";
	}
	if (player.y < 0) {
		msg = "Wall Collision";
		state = "OVER";
	}
	if (player.y + player.width > canvas.height) {
		msg = "Wall Collision";
		state = "OVER";
	}

	for (let i = 1; i < snake.length; i++) {
		if (snake[0][0] == snake[i][0] && snake[0][1] == snake[i][1]) {
			msg = "Self Collision";
			state = "OVER";
			break;
		}
	}
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