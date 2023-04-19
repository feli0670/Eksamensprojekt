//Forskellen på at lave variabler i constructor og i metoder?
//ved skud [i-1], for at første skud ikke er usynligt


class Sprite{
    constructor(x, y) { //needs x and y parameters in order to instansiate a new Sprite
        this.x = x; //x-coordinate initialized from the x parameter
        this.y = y; //y-coordinate initialized from the x parameter
        this.width; //sprites default width
        this.height; //sprites default height
        this.img; //variable for sprite image is declared
    }

    //displaying Sprite objects
    display() {
        image(this.img, this.x, this.y, this.width, this.height); //displays an image
    }
    
}

