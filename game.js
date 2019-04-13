
var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'phaser-example', { 
    preload: preload, 
    create: create, 
    update: update, 
    render: render,
});

function preload() {

    //game.load.tilemap('map', 'assets/tilemaps/level.csv', null, Phaser.Tilemap.CSV);
    game.load.image('tiles', 'assets/tilemaps/tiles.png');
    game.load.spritesheet('player', 'assets/player.png', 45, 45);

}

var map;
var layer;
var cursors;
var player;
var marker;

function create() {

    map = game.add.tilemap();
    map.addTilesetImage('tiles');
    
    game.stage.backgroundColor = '#2d2d2d';
    
    // generate map
    layer = map.create('level1', 50, 50, 32, 32);
    
    for (var i=0; i<50; i++) {
        for (var j=0; j<50; j++) {
            map.putTile((Math.random() > 0.8 ? 14 : 6), i, j, layer);
        }
    }
    
    layer.resizeWorld();

    //  This isn't totally accurate, but it'll do for now
    map.setCollisionBetween(10, 20);

    //layer.debug = true;

    //  Player
    player = game.add.sprite(48, 48, 'player', 1);
    player.animations.add('left', [0,1,2,3,4], 10, true);
    player.animations.add('right', [5,6,7,8,9], 10, true);
    player.animations.add('up', [10,11,12,13,14], 10, true);
    player.animations.add('down', [15,16,17,18,19], 10, true);

    game.physics.enable(player, Phaser.Physics.ARCADE);

    player.body.setSize(26, 32, 10, 5);

    game.camera.follow(player);

    cursors = game.input.keyboard.createCursorKeys();

    var title_text = game.add.text(16, 16, 'The Village', { font: '14px Arial', fill: '#ffffff' });
    title_text.fixedToCamera = true;
    
    marker = game.add.graphics();
    marker.lineStyle(2, 0x000000, 1);
    marker.drawRect(0, 0, 32, 32);

}

function update() {
    
    marker.x = layer.getTileX(player.x) * 32;
    marker.y = layer.getTileY(player.y) * 32;

    game.physics.arcade.collide(player, layer);

    player.body.velocity.set(0);

    if (cursors.left.isDown) {
        player.body.velocity.x = -100;
        player.play('left');
    }
    else if (cursors.right.isDown) {
        player.body.velocity.x = 100;
        player.play('right');
    }
    else if (cursors.up.isDown) {
        player.body.velocity.y = -100;
        player.play('up');
    }
    else if (cursors.down.isDown) {
        player.body.velocity.y = 100;
        player.play('down');
    }
    else {
        player.animations.stop();
    }
    
    // adding to map
    if (game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)) {
        map.putTile(3, layer.getTileX(marker.x), layer.getTileY(marker.y));
    }

}

function render() {

    // game.debug.body(player);

}
