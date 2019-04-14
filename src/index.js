import Phaser from 'phaser';
import BootScene from './scenes/boot-scene';

var config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 200 }
    }
  },
  scene: [BootScene]
};

var game = new Phaser.Game(config);