class EnemiesInGame {
	constructor() {
		this.enemies = []; //stores enemies
		this.enemyNumberX = 13; //number of enemies on x axis
		this.enemyNumberY = 1; //number of enemies on y axis
		this.deadEnemies = 0; //number of dead enemies

		this.speedIncrease = 1; //value for reducing trigger interval
		this.triggerIntervalReducer = 1; //value for increase trigger interval
	}

	//instansiates the enemies
	setup() {
		//make enemies location by a grid
		for (let j = 0; j < this.enemyNumberY; j++) { //creates number of enemies (downwards)
			this.enemies[j] = []; //creates 2D array, neww index for number of rows of enemies
			for (let i = 0; i < this.enemyNumberX; i++) { //creates number of enemies (sidewways)
				let xOffset = 85; //start offset for x coordinate
				let yOffset = 60 * 2.5; //start offset for y coordinate
				let xSpace = 75; //horisontal space between enemies
				let ySpace = 55; //vertical space between enemies
				let newX = xOffset + xSpace * i; //variable for x coordinate for new enemy
				let newY = yOffset + ySpace * j; //variable for y coordinate for new enemy

				this.enemies[j].push(new Enemy(newX, newY, j)); //instantiates enemies by pushing in array

				this.enemies[j][i].speed *= this.speedIncrease //speed will increase, makes game harder for each wave
				this.enemies[j][i].triggerInterval *= this.triggerIntervalReducer //enemies will shoot more often, makes game harder for each wave
			}
		}
	}

	//updates enemies methods
	update(choosePlayer, gamestate) {
		this.enemies.forEach(row => {
			row.forEach(enemy => {
			  if (enemy.alive) {
				 enemy.display();
				 if (choosePlayer.alive && gamestate) {
					enemy.updatePosition();
					enemy.move();
					enemy.attack();
				 }
			  }
			  enemy.fireBullet(gamestate);
			  if (this.deadEnemies == this.enemyNumberX * this.enemyNumberY) {
				 choosePlayer.newWave = true;
				 if (frameCount > 30) {
					this.deadEnemies = 0;
					this.speedIncrease += 0.1;
					this.triggerIntervalReducer -= 0.05;
					this.setup();
					choosePlayer.newWave = false;
				 }
			  }
			});
		 });

		this.damagedByPlayer(choosePlayer); //controls if enemies are damaged by player
		this.bulletsCollide(choosePlayer); //controls if enemy and player bullet has collided
		this.reachedSurface(choosePlayer); //checks if a enemy has reached surface
		if (!choosePlayer.hit) { //if player hasn't been hit
			this.damagePlayer(choosePlayer); //enemy can then damage player
		}
	}

	//make enmies able to damage player
	damagePlayer(choosePlayer) {
		this.enemies.forEach(row => {
			row.forEach(enemy => {
				enemy.magazine.forEach((enemyBullet, enemyIndex) => {
					if (choosePlayer.triPointHitbox(choosePlayer.x1, choosePlayer.y1, choosePlayer.x2, choosePlayer.y2, choosePlayer.x3, choosePlayer.y3, enemyBullet.x, enemyBullet.y + enemyBullet.height / 2)) { //if player has hit player
						enemy.magazine.splice(enemyIndex, 1); //destroy enemy bullet by removing from array
						choosePlayer.hp -= 1; //reduce player hp with 1
						choosePlayer.hit = true; //player has been hit
						frameCount = 0; //reset frameecount, purpose of respawn cooldown
					}
				});
			});
		});
	}

	//method for enemy taking damage by player
	damagedByPlayer(choosePlayer) {
		this.enemies.forEach((row, rowIndex) => {
			row.forEach(enemy => {
				choosePlayer.magazine.forEach((playerBullet, playerIndex) => {
					if (enemy.alive) {
						if (playerBullet.x + playerBullet.width / 2 >= enemy.x - enemy.width / 2 //if player bullet on right side of bunker edge
							&& playerBullet.x - playerBullet.width / 2 <= enemy.x + enemy.width / 2 //if player bullet on left side of enemy edge
							&& playerBullet.y + playerBullet.height / 2 >= enemy.y - enemy.height / 2 //if player bullet at enemy altitude from buttom
							&& playerBullet.y - playerBullet.height / 2 <= enemy.y + enemy.height / 2) { //if player bullet at enemy altitude from top 
							choosePlayer.magazine.splice(playerIndex, 1); //destroy player bullet by removing from array
							enemy.alive = false; //kill enemy by removing from array
							if (this.deadEnemies == this.enemyNumberX * this.enemyNumberY - 1) { //if all enemies are dead
								frameCount = 0; //purpose for spawning new enemies after a certain time after a whole group has been eliminated
							}
							this.deadEnemies += 1; //add 1 to dead enemies

							if (rowIndex == 0) { //if killed enemy on upper row
								score += 100; //1 is added to score
								console.log('score 100')
							} else if (rowIndex == 1) { //if killed enemy on second highest row
								score += 75; //1 is added to score
								console.log('score 75')
							} else if (rowIndex == 2) { //if killed enemy on center row
								score += 50; //1 is added to score
								console.log('score 50')
							} else if (rowIndex == 3) { //if killed enemy on second lowest row
								score += 25; //1 is added to score
								console.log('score 35')
							} else if (rowIndex == 4) { //if killed enemy on buttom row
								score += 10; //1 is added to score
								console.log('score 10')
							}
						}
					}
				});
			});
		});
	}

	//enemy and player bullets collide
	bulletsCollide(choosePlayer) {
		this.enemies.forEach(row => {
			row.forEach(enemy => {
				enemy.magazine.forEach((enemyBullet, enemyIndex) => {
					choosePlayer.magazine.forEach((playerBullet, playerIndex) => {
						if (playerBullet.x + playerBullet.width / 2 >= enemyBullet.x - enemyBullet.width / 2 //player bullet at right side of enemy bullet edge
							&& playerBullet.x - playerBullet.width / 2 <= enemyBullet.x + enemyBullet.width / 2 //player bullet at left side of enemy bullet edge
							&& playerBullet.y + playerBullet.height / 2 >= enemyBullet.y - enemyBullet.height / 2 //player bullet at enemy bullet altitude from bottom
							&& playerBullet.y - playerBullet.height / 2 <= enemyBullet.y + enemyBullet.height / 2) {  //player bullet at enemy bullet altitude from top 
							choosePlayer.magazine.splice(playerIndex, 1); //destroy player bullet by splicing from array
							enemy.magazine.splice(enemyIndex, 1); //destroy enemy bullet by splicing from array
						}
					});
				});
			});
		});
	}

	//checks if enemy has reached surface
	reachedSurface(choosePlayer) {
		this.enemies.forEach(row => {
			row.forEach(enemy => {
				if (enemy.y + enemy.height / 2 >= choosePlayer.y - choosePlayer.height / 2) { //if nemy has reached enemy altitude
					choosePlayer.hp = 0; //kill player
				}
			});
		});
	}
}

class BunkersInGame {
	constructor() {
		this.bunkers = []; //array for all bunkers
	}

	//instansiates the bunkers
	setup() {
		let numberOfBunkers = 4; //total number of bunkers
		let xSpace = 310; //horizontal space between bunkers
		let xOffset = 135; //x offset
		let yOffset = height - 150; //y offset
		for (let i = 0; i < numberOfBunkers; i++) { //creates certain number of bunkers
			this.bunkers.push(new Bunker(xOffset + xSpace * i, yOffset)); //instansiates bunkers by pushing in array
		}
	}

	//updates bunkers
	update(choosePlayer, chooseEnemies, gameState) {
		this.bunkers.forEach(bunker => {
			bunker.display(); //displays them
		});

		if (gameState) {
			this.damagedByPlayer(choosePlayer); //calls method that controls if enemies are damaged by player
			this.damagedByEnemy(chooseEnemies); //calls method that controls if enemies are damaged by enemy
			this.destroy()
		}	
	}

	//method for enemy taking damage by player
	damagedByPlayer(choosePlayer) {
		this.bunkers.forEach((bunker, bunkerIndex) => { //runs through every bunker
			choosePlayer.magazine.forEach((playerBullet, playerIndex) => { //runs trough bullets
				//if bullet hits bunker (compares bunker and bullet location)
				if (playerBullet.x + playerBullet.width / 2 >= bunker.x - bunker.width / 2 //if player bullet on right side of bunker edge
					&& playerBullet.x - playerBullet.width / 2 <= bunker.x + bunker.width / 2 //if player bullet on left side of enemy edge
					&& playerBullet.y + playerBullet.height / 2 >= bunker.y - bunker.height / 2 //if player bullet at bunker altitude from top
					&& playerBullet.y - playerBullet.height / 2 <= bunker.y + bunker.height / 2) { //if player bullet at bunker altitude from buttom
					  choosePlayer.magazine.splice(playerIndex, 1); //destroy player bullet by removing from array
					  bunker.hp -= 1; //damage bunker looses health
				 }
			});
	  });
	}

	//method for enemy taking damage by enemy
	damagedByEnemy(chooseEnemies) {
		this.bunkers.forEach((bunker, bunkerIndex) => {
			chooseEnemies.enemies.forEach(row => {
				row.forEach(enemy => {
					enemy.magazine.forEach((enemyBullet, enemyIndex) => {
						if (enemyBullet.x + enemyBullet.width / 2 >= bunker.x - bunker.width / 2 //if enemy bullet on right side of bunker edge
							&& enemyBullet.x - enemyBullet.width / 2 <= bunker.x + bunker.width / 2 //if enemy bullet on left side of enemy edge
							&& enemyBullet.y + enemyBullet.height / 2 >= bunker.y - bunker.height / 2 //if enemy bullet at bunker altitude from top
							&& enemyBullet.y - enemyBullet.height / 2 <= bunker.y + bunker.height / 2) { //if enemy bullet at bunker altitude from buttom
							enemy.magazine.splice(enemyIndex, 1); //destroy enemy bullet by removing from array
						bunker.hp -= 1; //damage bunker looses health
						}
					});
				});
			});
		});
	}

	destroy() {
		this.bunkers.forEach((bunker, bunkerIndex) => {
			if (bunker.hp == 0) { //if bunker fully destoryed
				this.bunkers.splice(bunkerIndex, 1); //destry bunker by removing from array
			}
		});
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
		if (gameState) { //if ufo alive and game is started
			this.ufo.move(); //make ufo move
			this.ufo.updatePosition(); //update ufo position
			this.damagedByPlayer(choosePlayer); //make it possible for ufo to get dammaged by player
		}
	}

	//ufo taking damage by player
	damagedByPlayer(choosePlayer) {
		choosePlayer.magazine.forEach((playerBullet, playerIndex) => {
			if (playerBullet.x + playerBullet.width / 2 >= this.ufo.x - this.ufo.width / 2 //if player bullet on right side of bunker edge
				&& playerBullet.x - playerBullet.width / 2 <= this.ufo.x + this.ufo.width / 2 //if player bullet on left side of ufo edge
				&& playerBullet.y + playerBullet.height / 2 >= this.ufo.y //if player bullet at ufo alitude from top
				&& playerBullet.y - playerBullet.height / 2 <= this.ufo.y + this.ufo.height / 2 ){ //if player bullet at ufo altitude buttom

				this.ufo.kill(); //ufo are killed
				console.log('killed')
				choosePlayer.magazine.splice(playerIndex, 1); //destroys bullet by removing from array
				score += 300; //300 points added to score
			}
		});
	}
}
