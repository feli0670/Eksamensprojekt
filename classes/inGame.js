class EnemiesInGame{
    constructor() {
        this.enemies = []; //stores enemies 
        this.enemyNumberX = 14; //number of enemies on x axis
        this.enemyNumberY = 5; //number of enemies on y axis
        this.xOffset = 82.5; //start offset for x coordinate
        this.yOffset = 120; //start offset for y coordinate
        this.xSpace = 75
        this.ySpace = 55; //vertical space between enemies

        this.deadEnemies = 0; 

        this.xStart;
        this.yStart;
    }

    //instansiates the enemies
    setup() {

        //make enemies location by a grid
        for (let j = 0; j < this.enemyNumberY; j++){ //creates number of enemies (veritcal)
            this.enemies[j]=[]
            for (let i = 0; i < this.enemyNumberX; i++){ //creates number of enemies (horizontal)
                this.xStart = this.xOffset + this.xSpace * i
                this.yStart = this.yOffset + this.ySpace * j
                this.enemies[j].push(new Enemy(this.xStart, this.yOffset + this.ySpace * j, j)); //instantiates enemies by oushing in array
            }
        }
    }

    //updates enemies methods
    update(choosePlayer, gamestate) {
        for (let j = 0; j < this.enemies.length; j++){ //creates number of enemies (veritcal)
            for (let i = 0; i < this.enemies[j].length; i++) { //runs through every enemies
                console.log(this.enemies[j][i].triggerInterval)
                if (this.enemies[j][i].alive) { //
                    this.enemies[j][i].display() //displays them
                } else if(this.deadEnemies == 0) { //else if all enemies are died (deadEnemies reset) 
                    this.enemies[j][i].alive = true; //make them live
                    this.enemies[j][i].triggerInterval -= 1000; //makes them move
                }
                if (choosePlayer.alive && gamestate) { //if player alive and game started
                    this.enemies[j][i].move() //makes them move
                    this.enemies[j][i].attack() //all enemies are able attack
                    this.enemies[j][i].shootBullet() //all enemies are able attack
                }
                
                if (this.deadEnemies == this.enemyNumberX * this.enemyNumberY) {
                    if (frameCount > 30) { //if 30 frames has gone by
                        this.deadEnemies = 0 //reset number of dead enemies
                        this.setup()
                    }
                    
                } 
            }
        }
        this.damagedByPlayer(choosePlayer) //calls method that controls if enemies are damaged by player
        this.bulletsCollide(choosePlayer) //calls update method for the enemies with argument of player
        if (!choosePlayer.hit) {
            this.damagePlayer(choosePlayer) //calls update method for the enemies with argument of player
        }
    }
    
    
    
    damagePlayer(choosePlayer) {
        for (let m = 0; m < this.enemies.length; m++) { //runs through every enemy
            for (let i = 0; i < this.enemies[m].length; i++) { //runs through every enemy
                for (let j = 0; j < this.enemies[m][i].magazine.length; j++) { //runs through every enemy bullets
                    if (choosePlayer.triPointHitbox(choosePlayer.x1, choosePlayer.y1, choosePlayer.x2, choosePlayer.y2, choosePlayer.x3, choosePlayer.y3, this.enemies[m][i].magazine[j].x, this.enemies[m][i].magazine[j].y + this.enemies[m][i].magazine[j].height / 2)) { //if player bullet on left side of enemy edge
                        this.enemies[m][i].magazine.splice(j, 1) //destroy player bullet by removing from array
                        choosePlayer.hp -= 1;
                        choosePlayer.hit = true;
                        frameCount = 0;
                    }
                }
            }
        }
    }

    //method for enemy taking damage by player 
    damagedByPlayer(choosePlayer) {
        for (let m = 0; m < this.enemies.length; m++) { //runs through every enemy
            for (let i = 0; i < this.enemies[m].length; i++) { //runs through every enemy
            
                //compares enemies wwith player bullet
                for (let j = 0; j < choosePlayer.magazine.length; j++) { //runs trough bullets
                    let playerBullet = choosePlayer.magazine[j]
                    let compareEnemy = this.enemies[m][i]
                    
                    //if bullet hits enemy (compares enemy and bullet location)
                    if (compareEnemy.alive) {
                        if (playerBullet.y - playerBullet.height / 2 <= compareEnemy.y + compareEnemy.height / 2  //if player bullet at enemy altitude
                            && playerBullet.x + playerBullet.width / 2 >= compareEnemy.x - compareEnemy.width / 2 //if player bullet on right side of bunker edge
                            && playerBullet.x - playerBullet.width / 2 <= compareEnemy.x + compareEnemy.width / 2) { //if player bullet on left side of enemy edge
                            choosePlayer.magazine.splice(j, 1) //destroy bullet by removing from array
                            compareEnemy.alive = false //kill enemy by removing from array
                            if (this.deadEnemies == this.enemyNumberX*this.enemyNumberY-1) {
                                frameCount = 0
                                console.log('last enemy')
                            }
                            this.deadEnemies += 1
                            
                                 //purpose for spawwning new enemies after a certain time after a whole group has been eliminated
                            
                           
                            if (m == 0) {
                                score += 100 //1 is added to score
                            } else if (m == 1) {
                                score += 75 //1 is added to score
                            } else if (m == 2) {
                                score += 50 //1 is added to score
                            } else if (m == 3) {
                                score += 25 //1 is added to score
                            } else if (m == 4) {
                                score += 10 //1 is added to score
                            }
                            // break; 
                        }
                    }
                }
            }
        }
    }
    
    bulletsCollide(choosePlayer) {
        for (let m = 0; m < this.enemies.length; m++) { //runs through every enemy
            for (let i = 0; i < this.enemies[m].length; i++) { //runs through every enemy
                for (let l = 0; l < this.enemies[m][i].magazine.length; l++) { //runs through every enemy
                    for (let j = 0; j < choosePlayer.magazine.length; j++) {
                        let playerBullet = choosePlayer.magazine[j]
                        let enemyBullet = this.enemies[m][i].magazine[l]
                        if (playerBullet.y - playerBullet.height / 2 <= enemyBullet.y + enemyBullet.height / 2
                            && playerBullet.x + playerBullet.width / 2 >= enemyBullet.x - enemyBullet.width / 2
                            && playerBullet.x - playerBullet.width / 2 <= enemyBullet.x + enemyBullet.width / 2) {
                            choosePlayer.magazine.splice(j, 1)
                            this.enemies[m][i].magazine.splice(l, 1)
                            break
                        }
                    }
                }
            }
        }
    }
    
 

}


class BunkersInGame{
    constructor() {
        this.bunkers = [];
        this.numberOfBunkers = 4;
        this.xOffset = 155
        this.yOffset =  height - 170
        this.xSpace = width/4
    }
    
    //instansiates the bunkers
    setup() {

        //makes bunkers location in a line
        for (let i = 0; i < this.numberOfBunkers; i++){ //creates certain number of bunkers
            this.bunkers.push(new Bunker(this.xOffset + this.xSpace * i, this.yOffset)); //instansiates bunkers by pushing in array
          }
    }

    //updates bunkers methods
    update(choosePlayer, chooseEnemies) {
        for (let i = 0; i < this.bunkers.length; i++) { //runs trough every bunker
              this.bunkers[i].display() //displays them
        }
        this.damagedByPlayer(choosePlayer); //calls method that controls if enemies are damaged by player
        this.damagedByEnemy(chooseEnemies); //calls method that controls if enemies are damaged by enemy
    }

    //method for enemy taking damage by player 
    damagedByPlayer(choosePlayer) {
        for (let k = 0; k < this.bunkers.length; k++) { //runs through every bunker
    
            //compares bunkers with player bullet
            for (let j = 0; j < choosePlayer.magazine.length; j++) { //runs trough bullets
                let playerBullet = choosePlayer.magazine[j]
                let compareBunkers = this.bunkers[k]
                //if bullet hits bunker (compares bunker and bullet location)
                if (playerBullet.y - playerBullet.height / 2 <= compareBunkers.y + compareBunkers.height/2 //if player bullet at bunker altitude
                    && playerBullet.x +  playerBullet.width/2 >= compareBunkers.x - compareBunkers.width / 2 //if player bullet on right side of bunker edge
                    && playerBullet.x - playerBullet.width/2 <= compareBunkers.x + compareBunkers.width / 2) { //if player bullet on left side of enemy edge
                    choosePlayer.magazine.splice(j, 1) //destroy player bullet by removing from array
                    compareBunkers.health -= 1 //damage bunker looses health
                
                    if (compareBunkers.health == 0) { //if bunker's health is equal to zero
                        this.bunkers.splice(k, 1) //destry bunker by removing from array
                }
              }
            }
        }
    }

    //method for enemy taking damage by enemy 
    damagedByEnemy(chooseEnemies) {
        for (let m = 0; m < chooseEnemies.enemies.length; m++) { //runs through every enemy
            for (let i = 0; i < chooseEnemies.enemies[m].length; i++) { //runs through every enemy
                for (let j = 0; j < chooseEnemies.enemies[m][i].magazine.length; j++) { //runs through enemy magazine and shoots the bullets once loaded into magazine, also assures all bullets fired is still displayed
                    for (let k = 0; k < this.bunkers.length; k++) { //runs through every bunker
                        let enemyBullet = chooseEnemies.enemies[m][i].magazine[j]
                        let compareBunkers = this.bunkers[k]
                        //if bullet hits bunker (compares bunkeer and bullet location)
                        if (enemyBullet.y >= compareBunkers.y - compareBunkers.height / 2 //if enemy bullet at bunker altitude
                            && enemyBullet.x + enemyBullet.width / 2 >= compareBunkers.x - compareBunkers.width / 2 //if enemy bullet on right side of bunker edge
                            && enemyBullet.x - enemyBullet.width / 2 <= compareBunkers.x + compareBunkers.width / 2) { //if enemy bullet on left side of enemy edge
                            chooseEnemies.enemies[m][i].magazine.splice(j, 1) //destroy enemy bullet by removing from array
                            compareBunkers.health -= 1 //damage bunker looses health
                            
                            if (compareBunkers.health == 0) { //if bunker's health is equal to zero
                                this.bunkers.splice(k, 1) //destroy bunker by removing from array
                            }
                            break
                        }
                    }
                }
            }
        }
    }

}