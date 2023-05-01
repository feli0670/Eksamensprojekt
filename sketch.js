let playerImg, playerExplosionImg; //player images
let enemyImg = []; //array for enemy imgages
let ufoImg; //ufo image
let bulletImg; //bullet image

let font; //for font

let player, bunkers, enemies, ufo; //game objects in game

let myHighScore = JSON.parse(localStorage.getItem('myScore')); //local highscore
let score = 0; //score

let gameStarted = false; //game state variable
let gamePaused = false; //game paused

let frameGap = 15; //gamespacee frame gap

let title, buttonText, highScoreOffset; //menu variables

//before website is closed
window.onbeforeunload = function () {
	localStorage.setItem('myScore', JSON.stringify(myHighScore)); //save myHighScore localy
};

function setup() {
	createCanvas(1200, 800);
	rectMode(CENTER);
	imageMode(CENTER);
	textAlign(CENTER, CENTER);
	textFont(font);

	initializeObjects(); //initialize all objects
	if (myHighScore === null) { //if myHighScore hasn't been defined yet
		myHighScore = 0; //set myHighScore to 0
	}
}

function draw() {
	background('black');
	ufo.update(player, gameStarted); //calls update method for the ufo
	
	fill('#71f200');
	stroke('#71f200');
	
	//game frames
	rect(width / 2, 0, width, frameGap);
	rect(width / 2, height, width, frameGap);
	rect(0, height / 2, frameGap, height);
	rect(width, height / 2, frameGap, height);


	player.update(gameStarted); //calls update method for the player
	bunkers.update(player, enemies, gameStarted); //calls update method for the enemies with argument of player and enemies
	enemies.update(player, gameStarted); //calls update method for the enemies with argument of player

	scoreboard(); //displays scoreboard

	if (!player.alive || gamePaused) { //if player is dead or game is paused
		gameStarted = false; //game started set to falsse
	}
	if (!gameStarted) { //if games isn't started
		menu(); //display menu
	}
}

//runs once when a key is pressed
function keyPressed() {
	if (gameStarted) { //if game started
		if (player.alive) { //if player alive
			player.controller(); //calls method that makes player move and shoot when key pressed
		}
		if (keyCode == 27) { //if ESC key 
			if (!gamePaused) { //if game isn't paused
				gamePaused = true; //pause game
			} 
		}
	}
}

function scoreboard() {
	textSize(50);
	fill('#71f200');
	text(score, width / 2, 50); //displays number of fired bullets
}

function menu() {
	const xOffset = width / 2; // xOffset
	const yOffset = height / 1.9; //yOffste
	const buttonWidth = 300; //buttom width
	const buttonHeight = 50; //buttom height
	let fillColor, strokeColor, scoreOffset;

	//window
	fill(87, 89, 96, 127);
	rect(xOffset, height / 2, width - frameGap, height - frameGap);

	//outline
	fill(87, 89, 96, 215);
	stroke(113, 242, 0);
	rect(xOffset, yOffset - 115, 800, height / 2.5);

	//headline
	fill('#71f200');
	textSize(100);
	text(title, width / 2, height / 3.75);

	if (!gameStarted && !gamePaused) { //if game isn't started and game isn't paused
		startMenu(); //display start menu
	} else if (gamePaused) { //else if game is paused
		textSize(25); 
		noStroke();
		highScoreOffset = 125;
		scoreOffset = 75;
		pausedMenu(); //diaplay pause menu
		text('Score: ' + score, xOffset, yOffset - scoreOffset); //display current game score
	}

	if (!player.alive) { //if player is dead
		textSize(25);
		noStroke();
		highScoreOffset = 125;
		scoreOffset = 75;
		text('Score: ' + score, xOffset, yOffset - scoreOffset); //display current game score
		gameOver(); //display gameover menu
	}

	if (mouseX >= xOffset - buttonWidth / 2 && mouseX <= xOffset + buttonWidth / 2 //if mouseX is between buttom right and left edge
		&& mouseY >= yOffset - buttonHeight / 2 && mouseY <= yOffset + buttonHeight / 2) { //if mouseX is between top and buttom edge
		//hover effect
		fillColor = '#71f200';
		strokeColor = 'black';

		if (mouseIsPressed) { //if mouse pressed
			if (!gamePaused) { //if games isn't paused, then player must be dead
				restart(); //in that case then restart the game
			} else { //else the game is paused
				gameStarted = true; //and the game should just continue
				gamePaused = false; //game isn't paused any more
			}
		}
	} else {
		//static effect
		fillColor = 'black';
		strokeColor = '#71f200';
	}
	
	//button
	fill(fillColor);
	stroke(strokeColor);
	rect(xOffset, yOffset, buttonWidth, buttonHeight); 

	//button text
	fill(strokeColor);
	textSize(35);
	noStroke();
	text(buttonText, xOffset, yOffset);

	//highscore text
	fill('#71f200');
	text('Highscore: ' + myHighScore, xOffset, yOffset - highScoreOffset); //displays local highscore
}

function startMenu() {
	title = 'Space Invaders';
	buttonText = 'Start';
	highScoreOffset = 100;
}

function gameOver() {
	updateHighScore();
	title = 'Game Over';
	buttonText = 'Restart';
}

function pausedMenu() {
	title = 'Paused';
	buttonText = 'Continue';
}

function restart() {
	initializeObjects();
	gameStarted = true;
	score = 0;
}

function updateHighScore() {
	if (!player.alive) { //if player is dead
		if (score > myHighScore) { //if game score greater than highscore
			myHighScore = score; //set game score to local highscore
		}
	}
}

function initializeObjects() {
	player = new Player(width / 2, height - 75); //object of Player class is instantiated

	enemies = new EnemiesInGame(); //object of EnemisInGame class is instantiated
	enemies.setup(); //calls setup method for the object that instansiates enemies

	bunkers = new BunkersInGame(); //object of BunkersInGame class is instantiated
	bunkers.setup(); //calls setup method for the object that instansiates bunkers

	ufo = new UfoInGame(); //object of ufoInGame class is instantiated
	ufo.setup(); //calls setup method for the object that instansiates bunkers
}

//preload of images
function preload() {
	playerImg = loadImage('images/player.png'); //player image loaded
	playerExplosionImg = loadImage('images/playerExplosion.gif'); //player explosion loaded
	for (let i = 5; i >= 1; i--) { //runs trough number of different enmy types
		let img = loadImage(`images/enemy${i}.png`); //variable changes with loop
		enemyImg.push(img); //pushes img into array
	}

	bulletImg = loadImage('images/bullet.png'); //bullet image loaded
	ufoImg = loadImage('images/redEnemy.png'); //ufo image loaded
	font = loadFont('font/poxel-font.ttf'); //font loaded
}
