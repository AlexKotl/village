import Phaser from 'phaser';
import GameScene from './scenes/game-scene';
    
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
    scene: [GameScene]
};

var game = new Phaser.Game(config);