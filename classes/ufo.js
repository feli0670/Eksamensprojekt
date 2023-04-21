class Ufo extends Sprite {
	constructor(x, y) {
		super(x, y);
		this.img = ufoImg; //initialize ufo img
		this.width = 75; //sets width
		this.height = (this.width * 210) / 480; //sets height

		this.xStart = width + this.width; //ufo start x

		this.speed = 2.5; //move speed
		this.moveLeft; //should ufo move LEFT?
		this.moveRight; //should ufo move RIGHT?
		this.moveDirection = 0; //move direction 

		this.triggerValue = 1; //value that triggers an attack (bullet)
		this.triggerInterval = 1000; //interval where the probability of shot will be 1/triggerInterval

		this.alive = true; //ufo alive or not
	}

	move() {
		let triggerRandomizer; //randomizer that will trigger a shot
		
		if (!this.alive) { //if ufo isn't alive
			triggerRandomizer = int(random(this.triggerInterval)); //triggerRandomizer is set to a random number continuously
			if (triggerRandomizer == this.triggerValue) { //if trigger randomizer hits trigger value
				this.alive = true; //then ufo is alive
			}
		}

		if (this.x >= width + this.width / 2) { //if ufo outside right edge
			this.moveRight = false; //don't move RIGHT
			triggerRandomizer = int(random(this.triggerInterval)); //triggerRandomizer is set to a random number continuously
			if (triggerRandomizer == this.triggerValue) { //if trigger randomizer hits trigger value
				this.moveLeft = true; //move LEFT
			}
		}

		if (this.x <= -this.width / 2) { //if ufo outside left edge
			this.moveLeft = false; //don'tmove RIGHT
			triggerRandomizer = int(random(this.triggerInterval)); //triggerRandomizer is set to a random number continuously
			if (triggerRandomizer == this.triggerValue) { //if trigger randomizer hits trigger value
				this.moveRight = true; //move RIGHT
			}
		}

		if (this.moveLeft) { //if ufo moving left
			this.moveDirection = -1; //move direction towards LEFT
		} else if (this.moveRight) { //else if ufo moving RIGHT
			this.moveDirection = 1; //move direction towards RIGHT
		} else {
			this.moveDirection = 0; //else don't move
		}
	}

	//updates position
	updatePosition() {
		this.x += this.speed * this.moveDirection; //updates position based on move direction
	}

	//ufo killed
	killed() {
		this.alive = false; //isn't alive
		this.x = this.xStart; //reset position to start position
	}
}
