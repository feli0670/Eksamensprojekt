class EnemiesInGame {
	constructor() {
		this.enemies = []; //stores enemies
		this.enemyNumberX = 2; //number of enemies on x axis
		this.enemyNumberY = 1; //number of enemies on y axis
		this.xOffset = 85; //start offset for x coordinate
		this.yOffset = 60 * 2.5; //start offset for y coordinate
		this.xSpace = 75; //horisontal space between enemies
		this.ySpace = 55; //vertical space between enemies

		this.deadEnemies = 0; //number of dead enemies 
	}

	//instansiates the enemies
	setup() {
		//make enemies location by a grid
		for (let j = 0; j < this.enemyNumberY; j++) { //creates number of enemies (downwards)
			this.enemies[j] = []; //creates 2D array, neww index for number of rows of enemies 
			for (let i = 0; i < this.enemyNumberX; i++) { //creates number of enemies (sidewways)
				let newX = this.xOffset + this.xSpace * i; //variable for x coordinate for new enemy
				let newY = this.yOffset + this.ySpace * j; //variable for y coordinate for new enemy
				this.enemies[j].push(new Enemy(newX, newY, j)); //instantiates enemies by pushing in array
				let speedIncrease = 1.2; //value for reducing trigger interval
				let triggerIntervalReducer = 9 / 20; //value for increase trigger interval
				this.enemies[j][i].speed = this.enemies[j][i].speed * speedIncrease; //update/increases enemy speed when starting a new wave
				this.enemies[j][i].triggerInterval = this.enemies[j][i].triggerInterval / triggerIntervalReducer; //update/reduces enemy trigger interval, enemies will shoot more often
			}
		}
	}

	//updates enemies methods
	update(choosePlayer, gamestate) {
		for (let j = 0; j < this.enemies.length; j++) { //creates number of enemies (downwards)
			for (let i = 0; i < this.enemies[j].length; i++) { //runs through every enemies in row
				if (this.enemies[j][i].alive) { //if enemy alive
					this.enemies[j][i].display(); //display enemy
					if (choosePlayer.alive && gamestate) { //if player alive and game started
						this.enemies[j][i].updatePosition(); //update position
						this.enemies[j][i].move(); //make enemy move
						this.enemies[j][i].attack(); //enemy can attack
					}
				}
				this.enemies[j][i].shootBullet(); //shoot enemy bullet, scope insures that bullets still are visable after enmy dies
				if (this.deadEnemies == this.enemyNumberX * this.enemyNumberY) { //if all enmies are dead
					if (frameCount > 30) { //if 30 frames has gone by (0.5 sec)
						this.deadEnemies = 0; //reset number of dead enemies
						this.setup(); //setup new wave of enemies
					}
				}
			}
		}
		this.damagedByPlayer(choosePlayer); //controls if enemies are damaged by player
		this.bulletsCollide(choosePlayer); //controls if enemy and player bullet has collided
		this.reachedSurface(choosePlayer); //checks if a enemy has reached surface
		if (!choosePlayer.hit) { //if player hasn't been hit
			this.damagePlayer(choosePlayer); //enemy can then damage player
		}
	}

	//make enmies able to damage player
	damagePlayer(choosePlayer) {
		for (let m = 0; m < this.enemies.length; m++) { //runs through every outer index containing enemies
			for (let i = 0; i < this.enemies[m].length; i++) { //runs through every enemy inside outer indexes
				for (let j = 0; j < this.enemies[m][i].magazine.length; j++) { //runs through every enemy bullets
					let enemyBullet = this.enemies[m][i].magazine[j]
					if (choosePlayer.triPointHitbox(choosePlayer.x1, choosePlayer.y1, choosePlayer.x2, choosePlayer.y2, choosePlayer.x3, choosePlayer.y3, enemyBullet.x, enemyBullet.y + this.enemies[m][i].magazine[j].height / 2)) { //if player has hit player 
						this.enemies[m][i].magazine.splice(j, 1); //destroy enemy bullet by removing from array
						choosePlayer.hp -= 1; //reduce player hp with 1
						choosePlayer.hit = true; //player has been hit
						frameCount = 0; //reset frameecount, purpose of respawn cooldown
					}
				}
			}
		}
	}

	//method for enemy taking damage by player
	damagedByPlayer(choosePlayer) {
		for (let m = 0; m < this.enemies.length; m++) { //runs through every outer index containing enemies
			for (let i = 0; i < this.enemies[m].length; i++) { //runs through every enemy inside outer indexes

				for (let j = 0; j < choosePlayer.magazine.length; j++) { //runs trough player bullets
					let playerBullet = choosePlayer.magazine[j];  //variable for player bullets
					let compareEnemy = this.enemies[m][i]; //variable for enemy

					//if bullet hits enemy (compares enemy and bullet location)
					if (compareEnemy.alive) {
						if (playerBullet.y - playerBullet.height / 2 <= compareEnemy.y + compareEnemy.height / 2  //if player bullet at enemy altitude
							&& playerBullet.x + playerBullet.width / 2 >= compareEnemy.x - compareEnemy.width / 2 //if player bullet on right side of bunker edge
							&& playerBullet.x - playerBullet.width / 2 <= compareEnemy.x + compareEnemy.width / 2) { //if player bullet on left side of enemy edge
							choosePlayer.magazine.splice(j, 1); //destroy player bullet by removing from array
							compareEnemy.alive = false; //kill enemy by removing from array
							if (this.deadEnemies == this.enemyNumberX * this.enemyNumberY - 1) { //if all enemies are dead
								frameCount = 0; //purpose for spawning new enemies after a certain time after a whole group has been eliminated
							}
							this.deadEnemies += 1; //add 1 to dead enemies
							
							if (m == 0) { //if killed enemy on upper row
								score += 100; //1 is added to score
							} else if (m == 1) { //if killed enemy on second highest row
								score += 75; //1 is added to score
							} else if (m == 2) { //if killed enemy on center row
								score += 50; //1 is added to score
							} else if (m == 3) { //if killed enemy on second lowest row
								score += 25; //1 is added to score
							} else if (m == 4) { //if killed enemy on buttom row
								score += 10; //1 is added to score
							}
						}
					}
				}
			}
		}
	}

	//enemy and player bullets collide
	bulletsCollide(choosePlayer) {
		for (let m = 0; m < this.enemies.length; m++) { //runs through every outer index containing enemies
			for (let i = 0; i < this.enemies[m].length; i++) { //runs through every enemy inside outer indexes
				for (let l = 0; l < this.enemies[m][i].magazine.length; l++) { //runs through every enemy bullet
					
					for (let j = 0; j < choosePlayer.magazine.length; j++) { //runs through player bullet
						let playerBullet = choosePlayer.magazine[j]; //variable fr player bullets
						let enemyBullet = this.enemies[m][i].magazine[l]; //variable for enemy bullets

						//if player bullet and enemy bullet ha collided
						if (playerBullet.y - playerBullet.height / 2 <= enemyBullet.y + enemyBullet.height / 2 //player bullet at enemy bullet altitude
							&& playerBullet.x + playerBullet.width / 2 >= enemyBullet.x - enemyBullet.width / 2 //player bullet at right side of enemy bullet edge
							&& playerBullet.x - playerBullet.width / 2 <= enemyBullet.x + enemyBullet.width / 2) { //player bullet at left side of enemy bullet edge
							choosePlayer.magazine.splice(j, 1); //destroy player bullet by splicing from array
							this.enemies[m][i].magazine.splice(l, 1); //destroy enemy bullet by splicing from array
						}
					}
				}
			}
		}
	}

	//checks if enemy has reached surface
	reachedSurface(choosePlayer) {
		for (let m = 0; m < this.enemies.length; m++) { //runs through every outer index containing enemies
			for (let i = 0; i < this.enemies[m].length; i++) { //runs through every enemy inside outer indexes
				if (this.enemies[m][i].y + this.enemies[m][i].height / 2 >= choosePlayer.y - choosePlayer.height / 2) { //if nemy has reached enemy altitude
					choosePlayer.hp = 0; //kill player
				}
			}
		}
	}
}

class BunkersInGame {
	constructor() {
		this.bunkers = []; //array for all bunkers
		this.numberOfBunkers = 4; //total number of bunkers
		this.xOffset = 135; //x offset
		this.yOffset = height - 150; //y offset
		this.xSpace = 310; //horizontal space between bunkers
	}

	//instansiates the bunkers
	setup() {
		for (let i = 0; i < this.numberOfBunkers; i++) { //creates certain number of bunkers
			this.bunkers.push(new Bunker(this.xOffset + this.xSpace * i, this.yOffset)); //instansiates bunkers by pushing in array
		}
	}

	//updates bunkers
	update(choosePlayer, chooseEnemies, gameState) {
		for (let i = 0; i < this.bunkers.length; i++) { //runs trough every bunker
			this.bunkers[i].display(); //displays them
		}
		if (gameState) {
			this.damagedByPlayer(choosePlayer); //calls method that controls if enemies are damaged by player
			this.damagedByEnemy(chooseEnemies); //calls method that controls if enemies are damaged by enemy
		}
	}

	//method for enemy taking damage by player
	damagedByPlayer(choosePlayer) {
		for (let k = 0; k < this.bunkers.length; k++) { //runs through every bunker

			//compares bunkers with player bullet
			for (let j = 0; j < choosePlayer.magazine.length; j++) { //runs trough bullets
				let playerBullet = choosePlayer.magazine[j]; //variable for player bullet
				let compareBunkers = this.bunkers[k]; //variable for bunker

				//if bullet hits bunker (compares bunker and bullet location)
				if (playerBullet.y - playerBullet.height / 2 <= compareBunkers.y + compareBunkers.height / 2 //if player bullet at bunker altitude
					&& playerBullet.x + playerBullet.width / 2 >= compareBunkers.x - compareBunkers.width / 2 //if player bullet on right side of bunker edge
					&& playerBullet.x - playerBullet.width / 2 <= compareBunkers.x + compareBunkers.width / 2) { //if player bullet on left side of enemy edge
					
					choosePlayer.magazine.splice(j, 1); //destroy player bullet by removing from array
					compareBunkers.hp -= 1; //damage bunker looses health

					if (compareBunkers.hp == 0) { //if bunker fully destoryed
						this.bunkers.splice(k, 1); //destry bunker by removing from array
					}
				}
			}
		}
	}

	//method for enemy taking damage by enemy
	damagedByEnemy(chooseEnemies) {
		for (let m = 0; m < chooseEnemies.enemies.length; m++) { //runs through every outer index containing enemies
			for (let i = 0; i < chooseEnemies.enemies[m].length; i++) {  //runs through every enemy inside outer indexes

				for (let j = 0; j < chooseEnemies.enemies[m][i].magazine.length; j++) { //runs through enemy magazine and shoots the bullets once loaded into magazine
					for (let k = 0; k < this.bunkers.length; k++) { //runs through every bunker
						let enemyBullet = chooseEnemies.enemies[m][i].magazine[j];
						let compareBunkers = this.bunkers[k];
						//if bullet hits bunker (compares bunkeer and bullet location)
						if (enemyBullet.y >= compareBunkers.y - compareBunkers.height / 2 //if enemy bullet at bunker altitude
							&& enemyBullet.x + enemyBullet.width / 2 >= compareBunkers.x - compareBunkers.width / 2 //if enemy bullet on right side of bunker edge
							&& enemyBullet.x - enemyBullet.width / 2 <= compareBunkers.x + compareBunkers.width / 2) { //if enemy bullet on left side of enemy edge
							chooseEnemies.enemies[m][i].magazine.splice(j, 1); //destroy enemy bullet by removing from array
							compareBunkers.hp -= 1; //damage bunker looses health

							if (compareBunkers.hp == 0) { //if bunker is fully destoryed
								this.bunkers.splice(k, 1); //destroy bunker by removing from array
							}
							break;
						}
					}
				}
			}
		}
	}
}

class UfoInGame {
	constructor() {
		this.ufo; //variable for ufo object
	}

	setup() {
		this.ufo = new Ufo(width + 75, 100); //instantiates a ufo into the variable
	}

	//updates ufo
	update(choosePlayer, gameState) {
		this.ufo.display(); //displays ufo
		if (this.ufo.alive && gameState) { //if ufo alive and game is started
			this.ufo.move(); //make ufo move
			this.ufo.updatePosition(); //update ufo position
			this.damagedByPlayer(choosePlayer); //make it possible for ufo to get dammaged by player
		}
	}

	//ufo taking damage by player
	damagedByPlayer(choosePlayer) {
		for (let j = 0; j < choosePlayer.magazine.length; j++) { //runs throough player magazine
			let playerBullet = choosePlayer.magazine[j]; //variable for player bullet

			//if bullet hits ufo (compares ufo and bullet location)
			if (playerBullet.y - playerBullet.height / 2 <= this.ufo.y + this.ufo.height / 2 //if player bullet at ufo altitude
				&& playerBullet.x + playerBullet.width / 2 >= this.ufo.x - this.ufo.width / 2 //if player bullet on right side of bunker edge
				&& playerBullet.x - playerBullet.width / 2 <= this.ufo.x + this.ufo.width / 2) { //if player bullet on left side of ufo edge
				
				this.ufo.killed(); //ufo are killed
				choosePlayer.magazine.splice(j, 1); //destroys bullet by removing from array
				score += 300; //300 points added to score
			}
		}
	}
}
