import Phaser from 'phaser';
import SimplexNoise from 'simplex-noise';

export default class MapScene extends Phaser.Scene {
    
    constructor() {
        super({ key: 'MapScene'})
    }

    preload() {
        this.load.image('tiles', 'assets/tilesets/tiles.png');
    }
    
    checkPattern(pattern) {
        // in this array we just keep tile number in key and land pattern 
        const patterns = {
            // strait tiles
            12604: '000' +
                   '000' +
                   '000',
                   
            12601: '111' +
                   '111' +
                   '111',
                          
            12481: '000' +
                   '111' +
                   '111',
               
            12721: '111' +
                   '111' +
                   '000',
               
            12600: '011' +
                   '011' +
                   '011',
                  
            12602: '110' +
                   '110' +
                   '110',

            // outer corners
            12480: '000' +
                   '011' +
                   '011',
                  
            12720: '011' +
                   '011' +
                   '000',
              
            12722: '110' +
                   '110' +
                   '000',
              
            12482: '000' +
                   '110' +
                   '110',
                 
            // inner corners
            12483: '111' +
                   '111' +
                   '110',
                  
            12485: '111' +
                   '111' +
                   '011',
                         
            12725: '011' +
                   '111' +
                   '111',
              
            12723: '110' +
                   '111' +
                   '111',
                   
            // other
           12481: '100' +
                  '111' +
                  '111',
                 
           // 12485: '111' +
           //        '111' +
           //        '011',
           // 
           // 12725: '011' +
           //        '111' +
           //        '111',
           // 
           // 12723: '110' +
           //        '111' +
           //        '111',

        }
        
        let newKey = Object.keys(patterns).find(key => patterns[key] === pattern);
        if (newKey === undefined) {
            newKey = 12604
        }
        return Number(newKey);
    }
    
    processCorners(data) {
        let result = [];
        for (let i=0; i<data.length; i++) {
            result[i] = []
            for (let j=0; j<data.length; j++) {
                // skip tiles on borders
                if (i < 1 || j < 1 || i >= data.length - 1 || j >= data.length - 1) {
                    continue;
                }
                
                let pattern = '' + data[i-1][j-1] + data[i-1][j] + data[i-1][j+1]
                    + data[i][j-1] + data[i][j] + data[i][j+1]
                    + data[i+1][j-1] + data[i+1][j] + data[i+1][j+1];
                
                let correctedValue = this.checkPattern(pattern);
                result[i][j] = correctedValue; 
                
            }
        }
        return result;
    }
    
    // generate random map
    generateMap(width, height) {
        let map = [];
        const freq = 0.1;
        const simplex = new SimplexNoise();
        
        for (let x=0; x<width; x++) {
            map[x] = [];
            for (let y=0; y<height; y++) {
                let val = simplex.noise2D(x * freq, y * freq) 
                    + simplex.noise2D(x * freq * 0.3, y * freq * 0.2); // add more details
                let texture = val > 0 ? 1 : 0;
                //if (val > 0.5) texture = 0;
                map[x][y] = texture;
            }
        }
        return map;
    }
    
    doubleMap(data) {
        let result = [];
        for (let i=0; i<data.length; i++) {
            result[i * 2] = [];
            for (let j=0; j<data.length; j++) {
                result[i * 2][j * 2] = result[i * 2][j * 2 + 1] = data[i][j];
            }
            result[i * 2 + 1] = result[i * 2];
        }
        return result;
    }
    
    generateTiles(width, height) {
        let data = this.generateMap(width, height);
        data = this.doubleMap(data);
        let dataCopy = data;

        data = this.processCorners(data);
        data.push(...dataCopy);
        console.table(data);
        return data;
    }

    create() {
        this.map = this.make.tilemap({ data: this.generateTiles(10, 10), tileWidth: 16, tileHeight: 16 });
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
