class Ufo extends Sprite {
  constructor(x, y) {
    super(x, y)
    this.img = redEnemyImg
    this.width = 75
    this.height = (this.width * 210) / 480

    this.xStart = width + this.width

    this.speed = 2.5
    this.moveLeft
    this.moveRight
    this.moveDirection = 0

    this.triggerValue = 1 //value that triggers an attack (bullet)
    this.triggerInterval = 1000 //interval where the probability of shot will be 1/triggerInterval

    this.alive = true
  }

  move() {
    let triggerRandomizer //randomizer that will trigger a shot
    if (!this.alive) {
      triggerRandomizer = int(random(this.triggerInterval)) //triggerRandomizer is set to a random number continuously
      if (triggerRandomizer == this.triggerValue) {
        this.alive = true
      }
    }

    if (this.moveLeft) {
      this.moveDirection = -1
    } else if (this.moveRight) {
      this.moveDirection = 1
    } else {
      this.moveDirection = 0
    }

    if (this.x >= width + this.width / 2) {
      this.moveRight = false
      triggerRandomizer = int(random(this.triggerInterval)) //triggerRandomizer is set to a random number continuously
      if (triggerRandomizer == this.triggerValue) {
        this.moveLeft = true
      }
    }

    if (this.x <= -this.width / 2) {
      this.moveLeft = false
      triggerRandomizer = int(random(this.triggerInterval)) //triggerRandomizer is set to a random number continuously
      if (triggerRandomizer == this.triggerValue) {
        this.moveRight = true
      }
    }
  }

  updatePosition() {
    this.x += this.speed * this.moveDirection
  }

  killed() {
    this.alive = false
    this.x = this.xStart
  }
}
