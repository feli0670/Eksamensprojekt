class Bullet extends Sprite {
	constructor(x, y) { //needs x and y parameters in order to instansiate a new Bullet
		super(x, y); //initialize properties of mother class Sprite
		this.width = 7.5; //image width changed from default
		this.height = 24; //image width changed from default
		this.img = bulletImg; //bullet image is initialized
		this.speed; //move speed
	}

	//makes bullets move
	updatePosition() {
		this.y += this.speed; 
	}
}
