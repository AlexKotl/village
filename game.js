
var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'phaser-example', { 
    preload: preload, 
    create: create, 
    update: update, 
    render: render,
});

function preload() {

    //game.load.tilemap('map', 'assets/tilemaps/level.csv', null, Phaser.Tilemap.CSV);
    game.load.image('tiles', 'assets/tilemaps/tiles.png');
    game.load.spritesheet('player', 'assets-misc/sprites/spaceman.png', 16, 16);

}

var map;
var layer;
var cursors;
var player;

function create() {

    map = game.add.tilemap();
    map.addTilesetImage('tiles');
    
    game.stage.backgroundColor = '#2d2d2d';
    
    // generate map
    layer_ground = map.create('level1', 50, 50, 32, 32);
    
    for (var i=0; i<50; i++) {
        for (var j=0; j<50; j++) {
            map.putTile((Math.random() > 0.8 ? 14 : 6), i, j, layer_ground);
        }
    }
    
    layer_ground.resizeWorld();

    //  This isn't totally accurate, but it'll do for now
    map.setCollisionBetween(10, 20);

    //layer_ground.debug = true;

    //  Player
    player = game.add.sprite(48, 48, 'player', 1);
    player.animations.add('left', [8,9], 10, true);
    player.animations.add('right', [1,2], 10, true);
    player.animations.add('up', [11,12,13], 10, true);
    player.animations.add('down', [4,5,6], 10, true);

    game.physics.enable(player, Phaser.Physics.ARCADE);

    player.body.setSize(10, 14, 2, 1);

    game.camera.follow(player);

    cursors = game.input.keyboard.createCursorKeys();

    var title_text = game.add.text(16, 16, 'The Village', { font: '14px Arial', fill: '#ffffff' });
    title_text.fixedToCamera = true;

}

function update() {

    game.physics.arcade.collide(player, layer);

    player.body.velocity.set(0);

    if (cursors.left.isDown)
    {
        player.body.velocity.x = -100;
        player.play('left');
    }
    else if (cursors.right.isDown)
    {
        player.body.velocity.x = 100;
        player.play('right');
    }
    else if (cursors.up.isDown)
    {
        player.body.velocity.y = -100;
        player.play('up');
    }
    else if (cursors.down.isDown)
    {
        player.body.velocity.y = 100;
        player.play('down');
    }
    else
    {
        player.animations.stop();
    }

}

function render() {

    // game.debug.body(player);

}
