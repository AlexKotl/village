import Phaser from 'phaser';
import GameScene from './scenes/game-scene';
import MapScene from './scenes/map-scene';
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
            //gravity: { y: 0 }
        }
    },
    scene: [BlocksScene, MapScene, GameScene]
};

var game = new Phaser.Game(config);