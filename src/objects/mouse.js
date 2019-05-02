export default class Mouse extends Phaser.GameObjects.Sprite {
    constructor(config) {
        super(config.scene, config.x, config.y, config.key);
        config.scene.add.existing(this);
        
        this.start = {x: config.x, y: config.y};
        this.board = config.board;
        this.isRunning = false;
        this.isReturning = false;
        this.speed = 2;
        
        this.setInteractive();
        this.setOrigin(0);
        
        // launch mouse
        this.on('pointerdown', (pointer) => {
            this.isRunning = true;
        });
    }
    
    update() {
        if (this.isRunning) {
            const mousePos = this.board.getMapPosition(this.x, this.y);
            
            if (mousePos.x + 1 >= this.board.size.width) {
                console.log('finish!');
                this.isRunning = false;
            }
            
            if (!this.board.isAllowed(mousePos.x + 1, mousePos.y) && mousePos.x >= 0) {
                this.isRunning = false;
                this.x = this.start.x;
            }
            
            this.x += this.speed;
        }
        
        
    }
}