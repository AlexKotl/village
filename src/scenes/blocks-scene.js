import Phaser from 'phaser';

export default class BlocksScene extends Phaser.Scene {
    
    constructor() {
        super({ key: 'BlocksScene'})
    }

    preload() {
        this.load.image('block', 'assets/sprites/block.png');
    }
    
    getMapPosition(x, y) {
        return {
            x: Math.round(x / this.blockSize) - 1,
            y: Math.round(y / this.blockSize) - 1,
        }
    }
    
    getAllowedMoves(x, y) {
        
    }

    create() {
        this.blockSize = 64;
        
        this.board = [
            [1,1,1,0,0],
            [0,0,0,0,1],
            [0,0,0,0,0],
            [1,1,0,0,1],
            [1,1,0,0,1]
        ];
        
        for (let y=0; y<this.board.length; y++) {
            for (let x=0; x<this.board[y].length; x++) {
                if (this.board[x][y] > 0) {
                    let block = this.add.sprite(y * this.blockSize + 50, x * this.blockSize + 50, 'block');
                    this.input.setDraggable(block.setInteractive());
                }
            }
        }
        
        this.input.on('dragstart', (pointer, obj) => {
            console.log('start from ', this.getMapPosition(obj.x, obj.y));
            
            //obj.body.moves = false;
        });

        this.input.on('drag', function (pointer, obj, dragX, dragY) {
            obj.setPosition(dragX, obj.y);
            //console.log(obj);
        });

        this.input.on('dragend', (pointer, obj) => {
            let mapPos = this.getMapPosition(obj.x, obj.y);
            console.log('dropped on ', mapPos.x, mapPos.y);
            obj.setPosition(mapPos.x * this.blockSize + 50, mapPos.y * this.blockSize + 50);
        });

    }
    
    update(time, delta) {
        
    }
}
