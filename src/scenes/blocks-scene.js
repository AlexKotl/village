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
        return {
            top: 10,
            bottom: 100,
            left: 0,
            right: 100,
        }
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
            this.isVerticalMove = undefined;
            this.draggedFrom = {x: obj.x, y: obj.y};
        });

        this.input.on('drag', (pointer, obj, dragX, dragY) => {
            let mapPos = this.getMapPosition(obj.x, obj.y);
            let allowed = this.getAllowedMoves(mapPos.x, mapPos.y);
            let dX = dragX - obj.x;
            let dY = dragY - obj.y;
            
            if (this.isVerticalMove === undefined) {
                this.isVerticalMove = Math.abs(obj.y - dragY) > Math.abs(obj.x - dragX);
            }
            
            if (this.isVerticalMove) {
                if (dY > 0 && this.draggedFrom.y + allowed.bottom < dragY) { 
                    obj.setPosition(obj.x, this.draggedFrom.y + allowed.bottom);
                    console.log('hit bottom')
                    return true;
                }
                if (dY < 0 &&  this.draggedFrom.y - allowed.top > dragY) {
                    obj.setPosition(obj.x, this.draggedFrom.y - allowed.top);
                    console.log('hit top')
                    return true;
                }
                obj.setPosition(obj.x, dragY);
            }
            else {
                if (dX > 0 && allowed.right + this.draggedFrom.x < dragX) {
                    obj.setPosition(this.draggedFrom.x + allowed.right, obj.y);
                    console.log('hit right')
                    return true;
                }
                if (dX < 0 && this.draggedFrom.x - allowed.left > dragX) {
                    obj.setPosition(this.draggedFrom.x - allowed.left, obj.y);
                    console.log('hit left')
                    return true;
                }
                obj.setPosition(dragX, obj.y);
            }
            
            
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
