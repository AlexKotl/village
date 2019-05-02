export default class MenuScene extends Phaser.Scene {
    preload() {
        this.load.image('cats', 'assets/sprites/menu/cats.png');
        this.load.image('text', 'assets/sprites/menu/text.png');
        this.load.image('menu-mouse', 'assets/sprites/menu/mouse.png');
    }
    
    create() {
        const x = this.game.canvas.width / 2;
        const y = this.game.canvas.height / 2;
        this.add.sprite(x, y, 'cats');
        this.add.sprite(x, y, 'text');
        this.add.sprite(x, y, 'menu-mouse');
        
        this.cameras.main.backgroundColor.setTo(255,255,255);
        
        this.input.once('pointerdown', () => {
           this.scene.start('BlocksScene');
       });
    }
}