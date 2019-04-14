var config = {
        type: Phaser.AUTO,
        width: 800,
        height: 600,
        parent: 'phaser-game',
        pixelArt: true,
        physics: {
            default: 'arcade',
            arcade: {
                gravity: { y: 0 }
            }
        },
        scene: {
            preload: preload,
            create: create,
            update: update,
        }
    };
    

var map;
var layer;
var cursors;
var player;
var marker;

const game = new Phaser.Game(config);

function preload() {
    this.load.image('tiles', 'assets/tilemaps/tiles.png');
    this.load.spritesheet('player', 'assets/player.png', {
        frameWidth: 45, 
        frameHeight: 45,
    });
}

function generateLevel() {
    var level = [];
    for (var i=0; i<50; i++) {
        level[i] = [];
        for (var j=0; j<50; j++) {
            level[i].push((Math.random() > 0.8 ? 14 : 6));
        }
    }
    
    return level;
}

function create() {
    map = this.make.tilemap({ data: generateLevel(), tileWidth: 32, tileHeight: 32 });
    const tiles = map.addTilesetImage('tiles', null, 32, 32);
    
    // generate map
    layer = map.createStaticLayer(0, tiles);
    map.setCollisionBetween(10, 20);
    
    cursors = this.input.keyboard.createCursorKeys();

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
    
    player = this.physics.add.sprite(50, 100, 'player', 1);
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

function update() {
    
    // marker.x = layer.getTileX(player.x) * 32;
    // marker.y = layer.getTileY(player.y) * 32;
    // 
    // game.physics.arcade.collide(player, layer);
    // 
    player.body.setVelocity(0);

    if (cursors.left.isDown)
    {
        player.body.setVelocityX(-100);
    }
    else if (cursors.right.isDown)
    {
        player.body.setVelocityX(100);
    }

    // Vertical movement
    if (cursors.up.isDown)
    {
        player.body.setVelocityY(-100);
    }
    else if (cursors.down.isDown)
    {
        player.body.setVelocityY(100);
    }
    
    if (cursors.left.isDown)
    {
        player.anims.play('left', true);
    }
    else if (cursors.right.isDown)
    {
        player.anims.play('right', true);
    }
    else if (cursors.up.isDown)
    {
        player.anims.play('up', true);
    }
    else if (cursors.down.isDown)
    {
        player.anims.play('down', true);
    }
    else
    {
        player.anims.stop();
    }
    
    // adding to map
    // if (game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)) {
    //     map.putTile(3, layer.getTileX(marker.x), layer.getTileY(marker.y));
    // }

}

