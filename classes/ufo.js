class Ufo extends Sprite {
  constructor(x, y) {
    super(x, y);
    this.img = redEnemyImg;
    this.width = 75;
    this.height = (this.width * 210) / 480;
    this.x;
    this.y;
    
    this.xStart = width + this.width

    this.speed = 2.5;
    this.moveLeft;
    this.moveRight;
    this.moveDirection = 0;

    this.triggerValue = 1; //value that triggers an attack (bullet)
    this.triggerRandomizer; //randomizer that will trigger a shot
    this.triggerInterval = 5000; //interval where the probability of shot will be 1/triggerInterval

    this.alive = true;
  }

  move() {
    this.alive = true
    if (this.moveLeft) {
      this.moveDirection = -1
    } else if (this.moveRight) {
      this.moveDirection = 1
    } else {
      this.moveDirection = 0

    }
    
    if (this.x >= width+this.width/2) {
      this.moveRight = false
      this.triggerRandomizer = int(random(-this.triggerInterval)); //triggerRandomizer is set to a random number continuously
      if (this.triggerRandomizer == -this.triggerValue) {
        this.moveLeft = true
      } 
    }
    
    if (this.x <= -this.width/2) {
      this.moveLeft = false
      this.triggerRandomizer = int(random(this.triggerInterval)); //triggerRandomizer is set to a random number continuously
      if (this.triggerRandomizer == this.triggerValue) {
        this.moveRight = true
      }
    }

  }
 

  updatePosition() {
    this.x += this.speed * this.moveDirection;
  }
  
  killed() {
    this.alive = false
    this.x = this.xStart
  }


}
    