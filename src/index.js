import Phaser from 'phaser';
import GameScene from './scenes/game-scene';
import MapScene from './scenes/map-scene';
    
var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    parent: 'phaser-game',
    pixelArt: true,
    zoom: 2,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 }
        }
    },
    scene: [MapScene, GameScene]
};

var game = new Phaser.Game(config);