export default class Player extends Phaser.GameObjects.Sprite {
    constructor(config) {
        super(config.scene, config.x, config.y, config.key);
        config.scene.physics.world.enable(this);
        config.scene.add.existing(this);
        
        this.scene = config.scene;
        this.item = 1;
        this.body.setSize(26, 26, 10, 12);
        
        // animations
        config.scene.anims.create({
            key: 'left',
            frames: config.scene.anims.generateFrameNumbers('player', { start: 0, end: 4 }),
            frameRate: 10,
            repeat: -1
        });
        config.scene.anims.create({
            key: 'right',
            frames: config.scene.anims.generateFrameNumbers('player', { start: 5, end: 9 }),
            frameRate: 10,
            repeat: -1
        });
        config.scene.anims.create({
            key: 'up',
            frames: config.scene.anims.generateFrameNumbers('player', { start: 10, end: 14 }),
            frameRate: 10,
            repeat: -1
        });
        config.scene.anims.create({
            key: 'down',
            frames: config.scene.anims.generateFrameNumbers('player', { start: 15, end: 19 }),
            frameRate: 10,
            repeat: -1
        });
    }
    
    update() {
        this.body.setVelocity(0);
        
        if (this.scene.cursors.left.isDown) {
            this.body.setVelocityX(-100);
        }
        else if (this.scene.cursors.right.isDown) {
            this.body.setVelocityX(100);
        }

        // Vertical movement
        if (this.scene.cursors.up.isDown) {
            this.body.setVelocityY(-100);
        }
        else if (this.scene.cursors.down.isDown) {
            this.body.setVelocityY(100);
        }
        
        if (this.scene.cursors.left.isDown) {
            this.anims.play('left', true);
        }
        else if (this.scene.cursors.right.isDown) {
            this.anims.play('right', true);
        }
        else if (this.scene.cursors.up.isDown) {
            this.anims.play('up', true);
        }
        else if (this.scene.cursors.down.isDown) {
            this.anims.play('down', true);
        }
        else {
            this.anims.stop();
        }
        
        if (Phaser.Input.Keyboard.JustDown(this.scene.cursors.nextItem)) {
            console.log('NEXT')
        }
        if (Phaser.Input.Keyboard.JustDown(this.scene.cursors.prevItem)) {
            console.log('prev')
        }
        
        //this.scene.build.putTileAt(this.item, 10, 10);
    }
    
    setAnimations() {
        
    }
}