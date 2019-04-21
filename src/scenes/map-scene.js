import Phaser from 'phaser';
import SimplexNoise from 'simplex-noise';

export default class MapScene extends Phaser.Scene {
    
    constructor() {
        super({ key: 'MapScene'})
    }

    preload() {
        this.load.image('tiles', 'assets/tilesets/tiles.png');
    }
    
    tileNum(name) {
        tiles = {
            water: 10086,
            ground: 12601,
            groundWaterTop: 12481,
            groundWaterTopRight: 12482,
            groundWaterRight: 12602,
            groundWaterBottomRight: 12722,
            groundWaterBottom: 12721,
            groundWaterBottomLeft: 12720,
            groundWaterLeft: 12600,
            groundWaterTopLeft: 12480,
        };
    }
    
    generateMap(width, height) {
        let map = [];
        const freq = 0.1;
        const simplex = new SimplexNoise();
        
        for (let x=0; x<width; x++) {
            map[x] = [];
            for (let y=0; y<height; y++) {
                let val = simplex.noise2D(x * freq, y * freq) 
                    + simplex.noise2D(x * freq * 0.3, y * freq * 0.2); // add more details
                let texture = val > 0 ? 10215 : 10086;
                if (val > 0.5) texture = 0;
                map[x][y] = texture;
            }
        }
        return map;
    }

    create() {
        this.map = this.make.tilemap({ data: this.generateMap(100, 100), tileWidth: 16, tileHeight: 16 });
        const tiles = this.map.addTilesetImage('tiles', null, 16, 16);
        
        // generate map
        this.ground = this.map.createStaticLayer(0, tiles);
        
        this.cameras.main.zoom = 1;
        
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
