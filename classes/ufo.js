class Ufo extends Sprite {
	constructor(x, y) { //needs x and y parameters in order to instansiate a new Ufo
		super(x, y);
		this.width = 75; //sets width
		this.height = (this.width * 210) / 480; //sets height
		this.img = ufoImg; //initialize ufo img
		
		this.alive = true; //ufo alive or not
		
		this.xStart = width + this.width; //ufo start x
		this.speed = 2.5; //move speed
		this.moveRight; //should ufo move RIGHT?
		this.moveLeft; //should ufo move LEFT?
		this.moveDirection = 0; //move direction 	
	}
	
	//updates position
	updatePosition() {
		this.x += this.speed * this.moveDirection; //updates position based on move direction
	}
	
	move() {
		let triggerRandomizer; //randomizer that will trigger a shot
		let triggerValue = 1; //value that triggers an attack (bullet)
		let triggerInterval = 1000; //interval where the probability of shot will be 1/triggerInterval
		if (!this.alive) { //if ufo isn't alive
			triggerRandomizer = int(random(0,triggerInterval)); //triggerRandomizer is set to a random number continuously
			if (triggerRandomizer == 1) { //if trigger randomizer hits trigger value
				this.alive = true; //then ufo is alive
			}
		}
		
		if (this.x >= width + this.width / 2) { //if ufo outside right edge
			this.moveRight = false; //don't move RIGHT
			triggerRandomizer = int(random(0,triggerInterval)); //triggerRandomizer is set to a random number continuously
			if (triggerRandomizer == triggerValue) { //if trigger randomizer hits trigger value
				this.moveLeft = true; //move LEFT
			}
		}
		
		if (this.x <= -this.width / 2) { //if ufo outside left edge
			this.moveLeft = false; //don'tmove RIGHT
			triggerRandomizer = int(random(0,triggerInterval)); //triggerRandomizer is set to a random number continuously
			if (triggerRandomizer == triggerValue) { //if trigger randomizer hits trigger value
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
	
	//ufo killed
	kill() {
		this.alive = false; //isn't alive
		this.x = this.xStart; //reset position to start position
	}
}
