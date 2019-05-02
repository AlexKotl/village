export default class Mouse extends Phaser.GameObjects.Sprite {
    constructor(config) {
        super(config.scene, config.x, config.y, config.key);
        config.scene.add.existing(this);
        
        this.board = config.board;
        this.isRunning = false;
        
        this.setInteractive();
        this.setOrigin(0);
        
        this.on('pointerdown', (pointer) => {
            this.isRunning = true;
            console.log('touch')
        });
    }
    
    create() {
        
    }
    
    update() {
        if (this.isRunning) {
            this.x++;
        }
    }
}