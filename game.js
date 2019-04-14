var config = {
        type: Phaser.AUTO,
        width: 800,
        height: 600,
        parent: 'phaser-game',
        pixelArt: true,
        // physics: {
        //     default: 'arcade',
        //     arcade: {
        //         gravity: { y: 200 }
        //     }
        // },
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

    //game.load.tilemap('map', 'assets/tilemaps/level.csv', null, Phaser.Tilemap.CSV);
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
    
    //  This isn't totally accurate, but it'll do for now
    //map.setCollisionBetween(10, 20);

    //layer.debug = true;

    //  Player
    // player = this.add.sprite(48, 48, 'player', 1);
    // player.animations.add('left', [0,1,2,3,4], 10, true);
    // player.animations.add('right', [5,6,7,8,9], 10, true);
    // player.animations.add('up', [10,11,12,13,14], 10, true);
    // player.animations.add('down', [15,16,17,18,19], 10, true);
    // 
    // this.physics.enable(player, Phaser.Physics.ARCADE);
    // 
    // player.body.setSize(26, 26, 10, 12);
    // 
    // this.camera.follow(player);
    // 
    // cursors = game.input.keyboard.createCursorKeys();
    // 
    // marker = game.add.graphics();
    // marker.lineStyle(2, 0x000000, 1);
    // marker.drawRect(0, 0, 32, 32);

    //buildGUI();
}

function update() {
    
    // marker.x = layer.getTileX(player.x) * 32;
    // marker.y = layer.getTileY(player.y) * 32;
    // 
    // game.physics.arcade.collide(player, layer);
    // 
    // player.body.velocity.set(0);
    // 
    // if (cursors.left.isDown) {
    //     player.body.velocity.x = -100;
    //     player.play('left');
    // }
    // else if (cursors.right.isDown) {
    //     player.body.velocity.x = 100;
    //     player.play('right');
    // }
    // else if (cursors.up.isDown) {
    //     player.body.velocity.y = -100;
    //     player.play('up');
    // }
    // else if (cursors.down.isDown) {
    //     player.body.velocity.y = 100;
    //     player.play('down');
    // }
    // else {
    //     player.animations.stop();
    // }
    
    // adding to map
    // if (game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)) {
    //     map.putTile(3, layer.getTileX(marker.x), layer.getTileY(marker.y));
    // }

}

function buildGUI() {
    var tileSelectorBackground = game.add.graphics();
    tileSelectorBackground.beginFill(0x000000, 0.5);
    tileSelectorBackground.drawRect(0, 0, 800, 34);
    tileSelectorBackground.endFill();
    tileSelectorBackground.fixedToCamera = true;
    
    var titleText = game.add.text(16, 8, 'The Village', { font: 'bold 16px Arial', fill: '#ffffff' });
    titleText.fixedToCamera = true;
    
    console.log('GUI inited');
}

function render() {

    // game.debug.body(player);

}
