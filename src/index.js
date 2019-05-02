import Phaser from 'phaser';
import MenuScene from './scenes/menu-scene';
import BlocksScene from './scenes/blocks-scene';

var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    parent: 'phaser-game',
    pixelArt: false,
    zoom: 1,
    physics: {
        default: 'arcade',
        arcade: {
            debug: true,
        }
    },
    scene: [MenuScene, BlocksScene]
};

var game = new Phaser.Game(config);