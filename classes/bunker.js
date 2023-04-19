class Bunker extends Sprite{
    constructor(x, y) {
        super(x, y)
        this.width = 100
        this.height = 40
        this.startHealth = 5;
        this.health = this.startHealth;
    }

    display() {
        rectMode(CENTER)

        stroke('#d50100')
        fill('#d50100')
        if (this.health >= 5) {
            rect(this.x+this.width/3/2, this.y-70, this.width/3, this.height/2)
        }

        stroke('#5d25b2')
        fill('#5d25b2')
        if (this.health >= 4) {
            rect(this.x, this.y - 45, this.width / 20, this.height * 2)
        }
        
        stroke('#71f200')
        fill('#71f200')
        if (this.health >= 3) {
            ellipse(this.x, this.y-this.height/2, this.width, this.height)
        }
        
        if (this.health >= 1) {
            rect(this.x, this.y, this.width, this.height)
        }
        
        stroke('#5d25b2')
        fill('#5d25b2')
        if (this.health >= 2) {
            ellipse(this.x, this.y, this.width / 6, this.height / 2)
            rect(this.x, this.y+8, this.width/6, this.height/2)
        }
    }

}