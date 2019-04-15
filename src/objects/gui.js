export default class GUI {
    constructor(scene) {
        this.scene = scene;
        this.tile = 1;
        
        const graphics = this.scene.add.graphics();
        graphics.fillStyle(0x000000, 0.5);
        graphics.fillRect(0, 0, 800, 34);
        graphics.setScrollFactor(0);
        
        const help = this.scene.add.text(2, 2, 'The Village', {
            fontSize: '18px',
            padding: { x: 10, y: 5 },
            backgroundColor: '#000000',
            fill: '#ffffff'
        });
        help.setScrollFactor(0);
        
        this.displayCurrentTile();
    }
    
    update() {
        if (Phaser.Input.Keyboard.JustDown(this.scene.cursors.nextItem)) {
            console.log('NEXT')
        }
        if (Phaser.Input.Keyboard.JustDown(this.scene.cursors.prevItem)) {
            console.log('prev')
        }
    }
    
    displayCurrentTile() {
        this.scene.map.putTileAt(1, 100, 100);
    }
}