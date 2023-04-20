class Player extends Sprite {
  constructor(x, y) {
    //needs x and y parameters in order to instansiate a new Player
    super(x, y) //initialize properties of mother class Sprite
    this.img = playerImg //player image is initialized
    this.width = 75
    this.height = 75

    this.moveDirection = 0 //moveDirection set to 0 - results in no movement
    this.speed = 2.5 //move speed

    this.magazine = [] //will store Bullet objects
    this.bulletCounter = 0 //counts number of shots
    this.cooldownTime = 0

    this.hpImg = playerImg //player image is initialized
    this.alive = true
    this.maxHp = 3
    this.hp
    this.hit = false

    this.x1
    this.y1
    this.x2
    this.y2
    this.x3
    this.y3
    this.xPos
    this.yPos
  }

  //updates player methods
  update(gameState) {
    if (this.alive) {
      this.display() //displays player
      this.displayHealth() //displays health
      if (gameState) {
        this.updatePosition() //updates player poosition
        this.edgeDetection() //stays in game space
        this.fireBullet() //can shoot bullets
        this.manageHealth() //manages health
        this.xPos = mouseX
        this.YPos = mouseY
        this.x1 = this.x
        this.y1 = this.y - 10
        this.x2 = this.x - this.width / 2 - 10
        this.y2 = this.y + 25
        this.x3 = this.x + this.width / 2 + 10
        this.y3 = this.y2
      }
    }
  }

  //moves using arrow keys or 'wasd'
  controller() {
    if (!this.hit) {
      if (keyCode == 32 && this.cooledDown()) {
        //if SPACE key and weapon cooldownTime passed by
        this.loadMagazine() //calls method, bullet is fired
        frameCount = 0 //resetting framcount
      }

      //statements for controlling player direction
      if (keyCode == LEFT_ARROW || keyCode == 65) {
        //if LEFT_ARROW or A key
        this.moveDirection = -1 //player moves left
      } else if (keyCode == RIGHT_ARROW || keyCode == 68) {
        //if RIGHT_ARROW or D key
        this.moveDirection = 1 //player moves right
      } else if (keyCode == DOWN_ARROW || keyCode == UP_ARROW || keyCode == 83 || keyCode == 87) {
        //if DOWN- or UP_ARROW, W or Q key
        this.moveDirection = 0 //player movement static
      }
    }
  }

  //controls player movement based on direction
  updatePosition() {
    this.x += this.speed * this.moveDirection //moves player based on moveDirection
  }

  //edgeDetection, will prevent player from moving outside game space
  edgeDetection() {
    if (this.x > width - this.width) {
      //if player is near right edge
      this.moveDirection = -1 //changes direction, moves left instead
    } else if (this.x < this.width) {
      //if player is near left edge
      this.moveDirection = 1 //changes direction, moves right instead
    }
  }

  //checks if weapon has cooled down
  cooledDown() {
    if (frameCount >= this.cooldownTime) {
      //if cooldownTime has passed by
      return true
    } else {
      return false
    }
  }

  //loads player magazine with bullets
  loadMagazine() {
    this.magazine.push(new Bullet(this.x, this.y - 50)) //bullets pushed into magazine
    this.bulletCounter += 1 //shotCounter 1 higher for each shot fired/loaded
  }

  //fires shoot
  fireBullet() {
    for (let i = 0; i <= this.magazine.length - 1; i++) {
      //runs through magazine and assures all bullet fires and is still displayed
      this.magazine[i].speed = -5 //displays bullets
      this.magazine[i].display() //displays bullets
      this.magazine[i].updatePosition() //shoots bullet

      if (this.magazine[i].y < this.magazine[i].height / 2) {
        //if bullet has reached top edge
        this.magazine.shift() //destroy bullet by removing first bullet from array
      }
    }
  }

  //set start health
  setHealth() {
    this.hp = this.maxHp
  }

  displayHealth() {
    let hpSize = 50
    let xOffset = width - this.width

    fill('#71f200')
    textSize(hpSize)
    text('HP:', xOffset - hpSize * 5, hpSize)

    for (let i = 0; i < this.hp; i++) {
      //runs through hp value
      image(this.hpImg, xOffset + this.width * -i, hpSize, hpSize, hpSize) //displays the hp
    }
  }
  //manages health
  manageHealth() {
    if (this.hit) {
      //if player is hit by bullet
      if (frameCount <= 90) {
        //if framecount is less or equal to 90 (makes explosion animation run for 1.5 sec)
        this.img = playerExplosionImg //displays explosion
        this.moveDirection = 0 //make the player movement static
      } else {
        //else
        this.img = playerImg //reset player img
        this.x = width / 2 //reset player x
        this.y = height - this.width //reset player y
        this.hit = false //reset hit variable
      }
    }

    if (this.hp == 0 && frameCount > 90) {
      //if player has lost every hp and the explosion animation has run
      this.alive = false //the player has no hp left and is now dead
      this.y = height + this.height //move player out of scenary
    }
  }

  //triangular hit detection, recives 3 points creating player outline (hitbox), and the point which is checked for collision
  triPointHitbox(x1, y1, x2, y2, x3, y3, myX, myY) {
    let areaOrig = abs((x2 - x1) * (y3 - y1) - (x3 - x1) * (y2 - y1))
    let area1 = abs((x1 - myX) * (y2 - myY) - (x2 - myX) * (y1 - myY))
    let area2 = abs((x2 - myX) * (y3 - myY) - (x3 - myX) * (y2 - myY))
    let area3 = abs((x3 - myX) * (y1 - myY) - (x1 - myX) * (y3 - myY))

    if (area1 + area2 + area3 == areaOrig) {
      return true
    } else {
      return false
    }
  }
}
