class Enemy extends Sprite {
  constructor(x, y, index) {
    //needs x and y parameters in order to instansiate a new Enemy
    super(x, y) //initialize properties of mother class Sprite
    this.img = enemyImg //enemy image is initialized
    this.index = index //enemy image is initialized
    this.width = 60
    this.height = (this.width * 584) / 804

    this.initializeMovement = true //initialize enemy movement towards right
    this.distanceMovedRight = 0 //storing distance moved for horizontal directions
    this.distanceMovedLeft = 0 //storing distance moved for horizontal directions
    this.distanceMovedDownRight = 0 //storing distance moved for vertical directions
    this.distanceMovedDownLeft = 0 //storing distance moved for vertical directions

    this.moveRight = true
    this.moveLeft = false
    this.moveDown = false
    this.latesDirection
    this.xStart = x
    this.yStart = y
    this.xStep = 125 //horizontal move distance per step
    this.yStep = this.width / 4 //vertical move distance per step
    this.speed = 0.25 //move speed
    this.xMoveDirection = 0
    this.yMoveDirection = 0

    this.prepareAttack = false //enemy doesn't attack from start
    this.magazine = [] //stores bullets
    this.totalShots = Infinity //number of shots each enemy has
    this.triggerValue = 1 //value that triggers an attack (bullet)
    this.triggerRandomizer //randomizer that will trigger a shot
    this.triggerInterval = 6000 //interval where the probability of shot will be 1/triggerInterval
    this.bulletCounter = 0 //counter for number of bullets fired

    this.alive = true
  }

  display(index) {
    image(this.img[this.index], this.x, this.y, this.width, this.height)
  }

  updatePosition() {
    this.x += this.speed * this.xMoveDirection //move towards right edge
    this.y += this.speed * this.yMoveDirection //move towards right edge
  }

  //makes enemy move in pattern
  move() {
    if (this.x >= this.xStart + this.xStep) {
      this.moveRight = false
      this.latesDirection = 'RIGHT'
      this.xStart += this.xStep
      this.moveDown = true
    }

    if (this.y >= this.yStart + this.yStep) {
      this.moveDown = false
      this.yStart += this.yStep
      if (this.latesDirection == 'RIGHT') {
        this.moveLeft = true
      } else if (this.latesDirection == 'LEFT') {
        this.moveRight = true
      }
    }

    if (this.x <= this.xStart - this.xStep) {
      this.moveLeft = false
      this.latesDirection = 'LEFT'
      this.xStart -= this.xStep
      this.moveDown = true
    }

    if (this.moveRight) {
      this.xMoveDirection = 1
    } else if (this.moveLeft) {
      this.xMoveDirection = -1
    } else if (!this.moveRight && !this.moveLeft) {
      this.xMoveDirection = 0
    }

    if (this.moveDown) {
      this.yMoveDirection = 1
    } else if (!this.moveDown) {
      this.yMoveDirection = 0
    }
  }

  //controlls the enemy attack
  attack() {
    if (this.bulletCounter < this.totalShots) {
      //if number of bullets fired isn't greater than number og total shots
      this.triggerRandomizer = int(random(this.triggerInterval)) //triggerRandomizer is set to a random number continuously
      if (this.triggerRandomizer == this.triggerValue) {
        //if triggerRandomzier is equal to the triggerValue
        this.bulletCounter += 1 //add 1 to the bulletCounter
        this.prepareAttack = true //enemy is now preparing an attack
      }
      if (this.prepareAttack) {
        //if enemy is preparing attack
        this.magazine.push(new Bullet(this.x, this.y + this.height / 2)) //load magazine with a bullet
        this.prepareAttack = false //finished preparing an attack
      }
    }
  }

  shootBullet() {
    for (let i = 0; i <= this.magazine.length - 1; i++) {
      //runs through magazine and shoots the bullets once loaded into magazine, also assures all bullets fired is still displayed
      this.magazine[i].speed = 2 //speed of the bullets are set
      this.magazine[i].display() //displays bullets
      this.magazine[i].updatePosition() //shoots bullet

      if (this.magazine[i].y >= height) {
        //if bullet hits bunker
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
