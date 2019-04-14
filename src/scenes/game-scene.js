import Phaser from 'phaser';

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
        
        this.player = this.physics.add.sprite(50, 100, 'player', 1);
        this.player.body.setSize(26, 26, 10, 12);
        
        this.physics.add.collider(this.player, this.layer);

        this.cameras.main.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
        this.cameras.main.startFollow(this.player);
        
        // GUI
        var graphics = this.add.graphics();
        graphics.fillStyle(0x000000, 0.5);
        graphics.fillRect(0, 0, 800, 34);
        graphics.setScrollFactor(0);
    }
    
    update() {
        
        // marker.x = layer.getTileX(player.x) * 32;
        // marker.y = layer.getTileY(player.y) * 32;
        // 
        // game.physics.arcade.collide(player, layer);
        // 
        this.player.body.setVelocity(0);

        if (this.cursors.left.isDown) {
            this.player.body.setVelocityX(-100);
        }
        else if (this.cursors.right.isDown) {
            this.player.body.setVelocityX(100);
        }

        // Vertical movement
        if (this.cursors.up.isDown) {
            this.player.body.setVelocityY(-100);
        }
        else if (this.cursors.down.isDown) {
            this.player.body.setVelocityY(100);
        }
        
        if (this.cursors.left.isDown) {
            this.player.anims.play('left', true);
        }
        else if (this.cursors.right.isDown) {
            this.player.anims.play('right', true);
        }
        else if (this.cursors.up.isDown) {
            this.player.anims.play('up', true);
        }
        else if (this.cursors.down.isDown) {
            this.player.anims.play('down', true);
        }
        else {
            this.player.anims.stop();
        }
        
        // adding to map
        // if (game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)) {
        //     map.putTile(3, layer.getTileX(marker.x), layer.getTileY(marker.y));
        // }

    }
}

export default GameScene;