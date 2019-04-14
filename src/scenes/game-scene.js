import Phaser from 'phaser';

class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene' })
    }

    preload() {
        this.load.image('tiles', 'assets/tilemaps/tiles.png');
        this.load.spritesheet('player', 'assets/player.png', {
            frameWidth: 45, 
            frameHeight: 45,
        });
    }

    create() {
        var map = this.make.tilemap({ data: [[1,2], [2,3], [4,1]], tileWidth: 32, tileHeight: 32 });
        const tiles = map.addTilesetImage('tiles', null, 32, 32);
        
        // generate map
        var layer = map.createStaticLayer(0, tiles);
        map.setCollisionBetween(10, 20);
        
        var cursors = this.input.keyboard.createCursorKeys();

        this.anims.create({
            key: 'left',
            frames: this.anims.generateFrameNumbers('player', { start: 0, end: 4 }),
            frameRate: 10,
            repeat: -1
        });
        this.anims.create({
            key: 'right',
            frames: this.anims.generateFrameNumbers('player', { start: 5, end: 9 }),
            frameRate: 10,
            repeat: -1
        });
        this.anims.create({
            key: 'up',
            frames: this.anims.generateFrameNumbers('player', { start: 10, end: 14 }),
            frameRate: 10,
            repeat: -1
        });
        this.anims.create({
            key: 'down',
            frames: this.anims.generateFrameNumbers('player', { start: 15, end: 19 }),
            frameRate: 10,
            repeat: -1
        });
        
        var player = this.physics.add.sprite(50, 100, 'player', 1);
        player.body.setSize(26, 26, 10, 12);
        
        this.physics.add.collider(player, layer);

        this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
        this.cameras.main.startFollow(player);
        
        // GUI
        var graphics = this.add.graphics();
        graphics.fillStyle(0x000000, 0.5);
        graphics.fillRect(0, 0, 800, 34);
        graphics.setScrollFactor(0);
    }
}

export default GameScene;