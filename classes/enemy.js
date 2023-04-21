class Enemy extends Sprite {
	constructor(x, y, index) { //needs x and y parameters in order to instansiate a new Enemy
		super(x, y); //initialize properties of mother class Sprite
		this.img = enemyImg; //enemy image is initialized
		this.index = index; //enemy image is initialized
		this.width = 60; //image width changed from default
		this.height = (this.width * 584) / 804; //image height changed from default

		this.moveRight = true; //makes enemies move right from start, and controls movement to the right
		this.moveLeft = false; //controls movement to the left
		this.moveDown = false; //controls movement down
		this.lastDirection; //checks the latest move direction
		this.xStart = x; //the x from where too initialize movement after directions change
		this.yStart = y; //the y from where too initialize movement after directions change
		this.xStep = 125; //horizontal move distance per step
		this.yStep = this.width / 4; //vertical move distance per step
		this.speed = 0.25; //move speed
		this.xMoveDirection = 0; //horizontal move directions
		this.yMoveDirection = 0; //vertial move direction

		this.prepareAttack = false; //enemy doesn't attack from start
		this.magazine = []; //stores bullets
		this.totalShots = Infinity; //number of shots each enemy has
		this.triggerRandomizer; //randomizer that will trigger a shot
		this.triggerValue = 1; //value that triggers an attack (bullet)
		this.triggerInterval = 60; //interval where the probability of shot will be 1/triggerInterval pr frame

		this.alive = true; //status of enemy 
	}

	//displays enemy
	display(index) {
		image(this.img[this.index], this.x, this.y, this.width, this.height); //expects an array containing images
	}

	updatePosition() {
		this.x += this.speed * this.xMoveDirection; //move towards edges, based on move direction
		this.y += this.speed * this.yMoveDirection; //move downwards
	}

	//makes enemy move in pattern
	move() {
		if (this.x >= this.xStart + this.xStep) { //if enemy has moved RIGHT
			this.moveRight = false; //stop moving RIGHT
			this.lastDirection = 'RIGHT'; //set last direction to RIGHT
			this.xStart += this.xStep; //set new xStart to be xStep greater
			this.moveDown = true; //move DOWN
		}

		if (this.y >= this.yStart + this.yStep) { //if enemy has moved DOWN
			this.moveDown = false; //stop moving DOWN
			this.yStart += this.yStep; //set yStart to be yStep greater
			if (this.lastDirection == 'RIGHT') { //if last direction was RIGHT
				this.moveLeft = true; //move LEFT 
			} else if (this.lastDirection == 'LEFT') { //else if last diretion was LEFT
				this.moveRight = true; //move RIGHT
			}
		}

		if (this.x <= this.xStart - this.xStep) { //if enemy has moved LEFT
			this.moveLeft = false; //stop moving LEFT
			this.lastDirection = 'LEFT'; //set last direction to LEFT
			this.xStart -= this.xStep; //set xStart to be xStep less
			this.moveDown = true; //move DOWN
		}

		if (this.moveRight) { //if move RIGHT
			this.xMoveDirection = 1; //horizontal direction towards RIGHT
		} else if (this.moveLeft) { //else if move LEFT
			this.xMoveDirection = -1; //horizontal direction towards LEFT
		} else if (!this.moveRight && !this.moveLeft) { //isn't moving RIGHT and LEFT 
			this.xMoveDirection = 0; //stop horizontal movement
		}

		if (this.moveDown) { //if move DOWN
			this.yMoveDirection = 1; //vertical direction downwwards
		} else if (!this.moveDown) { //isn't moving down 
			this.yMoveDirection = 0; //stop vertical movement
		}
	}

	//controlls the enemy attack
	attack() {
			this.triggerRandomizer = int(random(this.triggerInterval)); //triggerRandomizer is set to a random number continuously
			if (this.triggerRandomizer == this.triggerValue) { //if triggerRandomzier is equal to the triggerValue
				this.prepareAttack = true; //enemy is now preparing an attack
			}
			if (this.prepareAttack) { //if enemy is preparing attack
				this.magazine.push(new Bullet(this.x, this.y + this.height / 2)); //load magazine with a bullet
				this.prepareAttack = false; //finished preparing an attack
		}
	}

	shootBullet() {
		for (let i = 0; i <= this.magazine.length - 1; i++) { //runs through magazine and shoots the bullets once loaded into magazine, also assures all bullets fired is still displayed
			this.magazine[i].speed = 2; //speed of the bullets are set
			this.magazine[i].display(); //displays bullets
			this.magazine[i].updatePosition(); //make bullets move

			if (this.magazine[i].y >= height) { //if bullet hits buttom of game space
				this.magazine.shift(); //destroy bullet by removing first bullet from array
			}
		}
	}
}
