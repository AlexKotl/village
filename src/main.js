class Game extends Phaser.Game {

    constructor() {
        super({
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
        });
    }

}

class GameState extends Phaser.State {
    
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

    create() {
        map = this.make.tilemap({ data: this.generateLevel(), tileWidth: 32, tileHeight: 32 });
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

}

class RainbowText extends Phaser.Text {

	constructor(game, x, y, text) {
		super(game, x, y, text, { font: "45px Arial", fill: "#ff0044", align: "center" });
		this._speed = 125; //ms
		this._colorIndex = 0;
		this._colors = ['#ee4035', '#f37736', '#fdf498', '#7bc043', '#0392cf'];
		this.colorize();
		this.startTimer();
		this.game.stage.addChild(this);
	}
	
	startTimer() {
		this.game.time.events.loop(this._speed, this.colorize, this).timer.start();
	}

	colorize() {
		for (let i = 0; i < this.text.length; i++) {
			if (this._colorIndex === this._colors.length) {
				this._colorIndex = 0;
			}
			this.addColor(this._colors[this._colorIndex], i);
			this._colorIndex++;
		}
	}

}

new Game();