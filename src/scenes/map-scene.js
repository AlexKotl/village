import Phaser from 'phaser';

export default class MapScene extends Phaser.Scene {
    
    constructor() {
        super({ key: 'MapScene'})
    }

    preload() {
        this.load.image('tiles', 'assets/tilemaps/tiles.png');
    }

    create() {
        this.map = this.make.tilemap({ data: [[1,2]], tileWidth: 32, tileHeight: 32 });
        const tiles = this.map.addTilesetImage('tiles', null, 32, 32);
        
        // generate map
        this.ground = this.map.createStaticLayer(0, tiles);
        
        this.cameras.main.zoom = 0.5;
        
        const cursors = this.input.keyboard.createCursorKeys();

        this.controls = new Phaser.Cameras.Controls.FixedKeyControl({
            camera: this.cameras.main,
            left: cursors.left,
            right: cursors.right,
            up: cursors.up,
            down: cursors.down,
            speed: 0.5
        });
    }
    
    update(time, delta) {
        this.controls.update(delta);
    }
}
