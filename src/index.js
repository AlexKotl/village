import Phaser from 'phaser';
import MenuScene from './scenes/menu-scene';
import BlocksScene from './scenes/blocks-scene';

var config = {
    type: Phaser.AUTO,
    scale: {
        mode: Phaser.Scale.FIT,
        parent: 'phaser-example',
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: 800,
        height: 480,
    },
    pixelArt: false,
    physics: {
        default: 'arcade',
        arcade: {
            debug: true,
        }
    },
    scene: [MenuScene, BlocksScene]
};

var game = new Phaser.Game(config);