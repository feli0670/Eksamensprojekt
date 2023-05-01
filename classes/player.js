class Player extends Sprite {
	constructor(x, y) { //needs x and y parameters in order to instansiate a new Player
		super(x, y); //initialize properties of mother class Sprite
		this.width = 75; //image width
		this.height = 75; //image height
		this.img = playerImg; //player image is initialized
		
		this.moveDirection = 0; //moveDirection set to 0 - results in no movement
		this.speed = 2.5; //move speed

		this.magazine = []; //will store Bullet objects
		this.cooldownTime = 30; //shot cooldowntime

		this.hpImg = playerImg; //player hp image is initialized
		this.alive = true; //player alive or dead
		this.maxHp = 3; //player max hp
		this.hp = this.maxHp //player hp
		this.hit = false; //controls if player has been hit by a enmy bullet or not

		this.newWave = false

		this.x1, this.y1, this.x2, this.y2, this.x3, this.y3;//points for triangular hitbox
	}

	//updates player methods
	update(gameState) { //needs a gameState parameter when called
		if (this.alive) { //if player is alive
			this.display(); //displays player
			this.displayHealth(); //displays health
			if (gameState) { //if game started
				this.updatePosition(); //updates player poosition
				this.edgeDetection(); //stays in game space
				this.manageHealth(); //manages health
				this.x1 = this.x; //1st point x initialized
				this.y1 = this.y - 20; //1st point y initialized
				this.x2 = this.x - this.width / 2 - 20; //2nd point x initialized
				this.y2 = this.y + 25; //2nd point y initialized
				this.x3 = this.x + this.width / 2 + 20; //3rd point x initialized
				this.y3 = this.y2; //3rd point y initialized
			}
			this.fireBullet(gameState); //can shoot bullets
		}
	}
	
	//controls player movement based on direction
	updatePosition() {
		this.x += this.speed * this.moveDirection; //moves player based on moveDirection
	}

	//moves using arrow keys or 'wasd'
	controller() {
		if (!this.hit) { //if player hasn't been hit
			if (keyCode == 32 && this.cooledDown() && !this.newWave) { //if SPACE key and weapon cooldownTime passed by
				this.loadMagazine(); //calls method, bullet is fired
				frameCount = 0; //reset framecount
			}
			
			//statements for controlling player direction
			if (keyCode == LEFT_ARROW || keyCode == 65) { //if LEFT_ARROW or A key
				this.moveDirection = -1; //player moves left
			} else if (keyCode == RIGHT_ARROW || keyCode == 68) { //if RIGHT_ARROW or D key
				this.moveDirection = 1; //player moves right
			} else if (keyCode == DOWN_ARROW || keyCode == UP_ARROW || keyCode == 83 || keyCode == 87) { //if DOWN- or UP_ARROW, W or Q key
				this.moveDirection = 0; //player movement static
			}
		}
	}
	
	//edgeDetection, will prevent player from moving outside game space
	edgeDetection() {
		if (this.x > width - this.width) { //if player is near right edge
			this.moveDirection = -1; //changes direction, moves left instead
		} else if (this.x < this.width) { //if player is near left edge
			this.moveDirection = 1; //changes direction, moves right instead
		}
	}

	//loads player magazine with bullets
	loadMagazine() {
		this.magazine.push(new Bullet(this.x, this.y - 50)); //bullets pushed into magazine
	}

	//checks if weapon has cooled down
	cooledDown() {
		if (frameCount >= this.cooldownTime) { //if cooldown time has passed by
			return true;
		} else {
			return false;
		}
	}
	
	//fires shoot
	fireBullet(gameState) { //needs a gameState parameter when called
		this.magazine.forEach(bullet => {
			bullet.speed = -5; //displays bullets
			bullet.display(); //displays bullets
			if (gameState) { //if game is running
				bullet.updatePosition(); //shoots bullet
			}
	
			if (bullet.y <= 15) { //if bullet has reached top edge
				this.magazine.shift(); //destroy bullet by removing first bullet from array
			}
		})
	}

	//displays health
	displayHealth() {
		const hpSize = 50; //hp size value
		const xOffset = width - this.width; //hp offset

		//hp text
		fill('#71f200'); 
		textSize(hpSize);
		text('HP:', xOffset - hpSize * 5, hpSize);
		
		for (let i = 0; i < this.hp; i++) { //runs through hp value
			image(this.hpImg, xOffset + this.width * -i, hpSize, hpSize, hpSize); //displays the number hp
		}
	}

	//manages health
	manageHealth() {
		if (this.hit) { //if player is hit by bullet
			if (frameCount <= 90) { //if framecount is less or equal to 90 (makes explosion animation run for 1.5 sec)
				this.img = playerExplosionImg; //displays explosion
				this.moveDirection = 0; //make the player movement static
			} else {
				this.img = playerImg; //reset player img
				this.x = width / 2; //reset player x
				this.y = height - this.width; //reset player y
				this.hit = false; //reset hit variable
			}
		}

		if (this.hp == 0 && frameCount > 90) { //if player has lost every hp and the explosion animation has run
			this.alive = false; //the player has no hp left and is now dead
			this.y = height + this.height; //move player out of scenary
		}
	}

	//triangular hit detection, recives 3 points creating player outline (hitbox), and the point which is checked for collision
	triPointHitbox(x1, y1, x2, y2, x3, y3, myX, myY) {
		let areaOrig = abs((x2 - x1) * (y3 - y1) - (x3 - x1) * (y2 - y1)); //Heron's formula for calculating the area of the triangle
		let area1 = abs((x1 - myX) * (y2 - myY) - (x2 - myX) * (y1 - myY)); //calculating area from point 1, 2 and dynamic point
		let area2 = abs((x2 - myX) * (y3 - myY) - (x3 - myX) * (y2 - myY)); //calculating area from point 2, 3 and dynamic point
		let area3 = abs((x3 - myX) * (y1 - myY) - (x1 - myX) * (y3 - myY)); //calculating area from point 1, 3 and dynamic point

		if (area1 + area2 + area3 == areaOrig) { //if the dynamic point is inside the triangles
			return true;
		} else {
			return false;
		}
	}
}
