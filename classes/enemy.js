class Enemy extends Sprite {
    constructor(x, y,index) { //needs x and y parameters in order to instansiate a new Enemy
        super(x, y); //initialize properties of mother class Sprite
        this.img = enemyImg //enemy image is initialized
        this.index = index //enemy image is initialized
        this.width = 60;
        this.height= this.width * 584/804

        this.initializeMovement = true; //initialize enemy movement towards right
        this.distanceMovedRight = 0; //storing distance moved for horizontal directions
        this.distanceMovedLeft = 0; //storing distance moved for horizontal directions
        this.distanceMovedDownRight = 0; //storing distance moved for vertical directions
        this.distanceMovedDownLeft = 0; //storing distance moved for vertical directions
        this.xStep = this.width; //horizontal move distance per step
        this.yStep = this.height / 4; //vertical move distance per step
        this.speed =1; //move speed

        this.prepareAttack = false; //enemy doesn't attack from start
        this.magazine = []; //stores bullets
        this.totalShots = Infinity; //number of shots each enemy has
        this.triggerValue = 1; //value that triggers an attack (bullet)
        this.triggerRandomizer; //randomizer that will trigger a shot
        this.triggerInterval = 6000; //interval where the probability of shot will be 1/triggerInterval
        this.bulletCounter = 0; //counter for number of bullets fired

        this.alive = true;
    }

    display(index) {
        image(this.img[this.index],this.x, this.y, this.width, this.height)
    }


    //makes enemy move in pattern
    move() {


        if (this.initializeMovement || this.distanceMovedDownLeft > this.yStep) { //if enemy movement is initialized or it has moved yStep distance downwards along left side
            this.distanceMovedLeft = 0; //reset distanceMovedLeft
            this.x += this.speed; //move towards right edge
            this.distanceMovedRight += this.speed; //track distance moved to the right
        }
        if (this.distanceMovedRight >= this.xStep) { //if enemy has moved to xStep distance towards the right edge
            this.initializeMovement = false; //is no more an initialized movement
            this.distanceMovedDownLeft = 0; //reset tracked distance downwards while in left side
            this.y += this.speed //move downwards when in right side
            this.distanceMovedDownRight += this.speed //track distance downwards movement in right side
        }
        if (this.distanceMovedDownRight > this.yStep) { //if enemy has moved to yStep distance downwards along right edge
            this.distanceMovedRight = 0; //reset distanceMovedRight
            this.x -= this.speed; //move left
            this.distanceMovedLeft += this.speed; //track distance downwards movement
        }
        if (this.distanceMovedLeft > this.xStep) { //if enemy has moved to xStep distance towards the left edge
            this.distanceMovedDownRight = 0; //reset tracked distance downwards while in right side
            this.y += this.speed //move downwards when in left side
            this.distanceMovedDownLeft += this.speed //track distance downwards movement in left side
        }
    }

    //controlls the enemy attack
    attack() {
        if (this.bulletCounter < this.totalShots) { //if number of bullets fired isn't greater than number og total shots
            this.triggerRandomizer = int(random(this.triggerInterval)) //triggerRandomizer is set to a random number continuously
            if (this.triggerRandomizer == this.triggerValue) { //if triggerRandomzier is equal to the triggerValue
                this.bulletCounter += 1 //add 1 to the bulletCounter
                this.prepareAttack = true; //enemy is now preparing an attack
            }
            if (this.prepareAttack) { //if enemy is preparing attack
                this.magazine.push(new Bullet(this.x, this.y + this.height / 2)); //load magazine with a bullet
                this.prepareAttack = false //finished preparing an attack
            }
        }

    }

    shootBullet() {
        for (let i = 0; i <= this.magazine.length - 1; i++) { //runs through magazine and shoots the bullets once loaded into magazine, also assures all bullets fired is still displayed
            this.magazine[i].speed = 2 //speed of the bullets are set
            this.magazine[i].display() //displays bullets
            this.magazine[i].updatePosition() //shoots bullet

            if (this.magazine[i].y >= height) { //if bullet hits bunker
                this.magazine.shift() //destry bullet by removing first bullet from array
            }
        }
    }

    checkStatus() {
        if (!this.alive) {
            return false
        }
    }
}
