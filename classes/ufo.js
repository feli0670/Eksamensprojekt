class Ufo extends Sprite {
  constructor(x, y) {
    super(x, y);
    this.img = redEnemyImg;
    this.height = (this.width * 156) / 360;
    this.totalSpawn = Infinity; //number of shots each enemy has
    this.triggerValue = 1; //value that triggers an attack (bullet)
    this.triggerRandomizer; //randomizer that will trigger a shot
    this.triggerInterval = 5; //interval where the probability of shot will be 1/triggerInterval
    this.width = 75;
    this.height = (this.width * 210) / 480;
    this.x = width + this.width;
    this.y = 100;
    this.speed = 3;
    this.move = false;
  }

  spawn() {
    this.triggerRandomizer = int(random(this.triggerInterval));
    if (this.triggerRandomizer == this.triggerValue) {
      this.triggerRandomizer = this.triggerValue;
      this.move = true;
    }
    if (this.move && this.x > -this.width) {
      this.x -= this.speed;
    } else {
      this.move = false;
    }
  }
}
