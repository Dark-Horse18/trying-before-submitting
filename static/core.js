const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// 1. INITIALIZE STATE
initialState();
function initialState() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	msg = "";
	state = "START";
	player = { x: 250, y: 250, width: 25, height: 25, speed: 25, dir_x: 0, dir_y: 0 };
	keys = {};
	snake = [[250, 250]];
	spawnFruit();
}

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
		spawnFruit();
	}
}

// This forces the loop to run exactly every 'frameDelay' milliseconds
setInterval(gameLoop, frameDelay);


function spawnFruit() {
	do {
		onBody = false;
		fruit = [Math.floor(Math.random() * 20) * 25, Math.floor(Math.random() * 20) * 25, 'null'];
		for(let i = 0; i < snake.length; i++){
			if(snake[i][0] == fruit[0] && snake[i][1] == fruit[1]){
				onBody = true;
				break;
			}
		}
	}while(onBody);

	let probablity = Math.random();
	if(probablity > 0.9) fruit[2] = 'high';
	else if (probablity > 0.6) fruit[2] = 'medium';
	else fruit[2] = 'low';
}


lapse = 0;
immune = 0;
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
	if(immune > 0) immune--;
	if(immune > 0) {
		player.x += player.dir_x * player.speed;
		if(player.x < 0) {
			player.x += canvas.width;
		}
		else {
			player.x = player.x % canvas.width;
		}
		player.y += player.dir_y * player.speed;
		if(player.y < 0) {
			player.y += canvas.height;
		}
		else {
			player.y = player.y % canvas.height;
		}
	}
	else {
		player.x += player.dir_x * player.speed;
		player.y += player.dir_y * player.speed;
	}

	snake.unshift([player.x, player.y]);

	if(snake[0][0] == fruit[0] && snake[0][1] == fruit[1]) {
		if(fruit[2] == 'low') lapse += 1;
		else if(fruit[2] == 'medium') lapse += 3;
		else if(fruit[2] == 'high') {
			lapse += 1;
			immune = FPS * 10;
		}
		lapse--;
		spawnFruit();
	}
	else{
		if(lapse > 0) {
			lapse--;
		}
		else {
			snake.pop();
		}
	}

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

	// Draw fruit
	if(fruit[2] == 'high') ctx.fillStyle = 'yellow';
	else if (fruit[2] == 'medium') ctx.fillStyle = 'blue';
	else if (fruit[2] == 'low') ctx.fillStyle = 'red';
	ctx.fillRect(fruit[0], fruit[1], player.width, player.height);
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

	if(immune == 0) {
		for (let i = 1; i < snake.length; i++) {
			if (snake[0][0] == snake[i][0] && snake[0][1] == snake[i][1]) {
				msg = "Self Collision";
				state = "OVER";
				break;
			}
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

spawnFruit();

// Start the loop
gameLoop();