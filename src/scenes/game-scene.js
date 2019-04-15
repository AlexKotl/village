import Phaser from 'phaser';
import Player from '../objects/player'
import GUI from '../objects/gui'

class GameScene extends Phaser.Scene {
    
    constructor() {
        super({ key: 'GameScene' })
    }
    
    generateLevel() {
        var level = [];
        for (var i=0; i<50; i++) {
            level[i] = [];
            for (var j=0; j<50; j++) {
                level[i].push((Math.random() > 0.8 ? 14 : 6));
            }
        }
        
        return level;
    }

    preload() {
        this.load.image('tiles', 'assets/tilemaps/tiles.png');
        this.load.spritesheet('player', 'assets/player.png', {
            frameWidth: 45, 
            frameHeight: 45,
        });
    }

    create() {
        this.map = this.make.tilemap({ data: this.generateLevel(), tileWidth: 32, tileHeight: 32 });
        const tiles = this.map.addTilesetImage('tiles', null, 32, 32);
        
        // generate map
        this.layer = this.map.createStaticLayer(0, tiles);
        this.map.setCollisionBetween(10, 20);
        
        this.cursors = this.input.keyboard.createCursorKeys();
        this.cursors.nextItem = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.O);
        this.cursors.prevItem = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.I);

        this.player = new Player({
            scene: this,
            x: 50,
            y: 100,
            key: 'player',
        }); 
        
        this.physics.add.collider(this.player, this.layer);

        this.cameras.main.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
        this.cameras.main.startFollow(this.player);
        
        // GUI
        this.gui = new GUI(this);
    }
    
    update() {
    
        this.player.update();
        this.gui.update();

    }
}

export default GameScene;