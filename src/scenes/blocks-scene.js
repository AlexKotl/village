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
        let bottom = 0;
        let top = 0;
        let left = 0;
        let right = 0;
        
        let curPos = x;
        // calculate right moves
        while (curPos + 1 < this.board[y].length && this.board[y][curPos + 1] == 0) {
            curPos++;
            right++;
        }
        // calculate left moves
        curPos = x;
        while (curPos > 0 && this.board[y][curPos - 1] == 0) {
            curPos--;
            left++;
        }
        // calculate bottom moves
        curPos = y;
        while (curPos + 1 < this.board.length && this.board[curPos + 1][x] == 0) {
            curPos++;
            bottom++;
        }
        // calculate top moves
        curPos = y;
        while (curPos > 0 && this.board[curPos - 1][x] == 0) {
            curPos--;
            top++;
        }
        
        return {
            top: top * this.blockSize,
            bottom: bottom * this.blockSize,
            left: left * this.blockSize,
            right: right * this.blockSize,
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
            let mapPos = this.getMapPosition(obj.x, obj.y);
            let allowed = this.getAllowedMoves(mapPos.x, mapPos.y);
            console.log('allowed moves ', allowed);
            
            this.isVerticalMove = undefined;
            this.draggedFrom = {x: obj.x, y: obj.y};
        });

        this.input.on('drag', (pointer, obj, dragX, dragY) => {
            let mapPos = this.getMapPosition(obj.x, obj.y);
            let allowed = this.getAllowedMoves(mapPos.x, mapPos.y);
            let dX = dragX - obj.x;
            let dY = dragY - obj.y;
            console.log(allowed);
            
            if (this.isVerticalMove === undefined) {
                this.isVerticalMove = Math.abs(obj.y - dragY) > Math.abs(obj.x - dragX);
            }
            
            if (this.isVerticalMove) {
                if (dY > 0 && this.draggedFrom.y + allowed.bottom < dragY) { 
                    obj.setPosition(obj.x, this.draggedFrom.y + allowed.bottom);
                    return true;
                }
                if (dY < 0 &&  this.draggedFrom.y - allowed.top > dragY) {
                    obj.setPosition(obj.x, this.draggedFrom.y - allowed.top);
                    return true;
                }
                obj.setPosition(obj.x, dragY);
            }
            else {
                if (dX > 0 && allowed.right + this.draggedFrom.x < dragX) {
                    obj.setPosition(this.draggedFrom.x + allowed.right, obj.y);
                    return true;
                }
                if (dX < 0 && this.draggedFrom.x - allowed.left > dragX) {
                    obj.setPosition(this.draggedFrom.x - allowed.left, obj.y);
                    return true;
                }
                obj.setPosition(dragX, obj.y);
            }
            
            
        });

        this.input.on('dragend', (pointer, obj) => {
            let mapPos = this.getMapPosition(obj.x, obj.y);
            obj.setPosition(mapPos.x * this.blockSize + 50, mapPos.y * this.blockSize + 50);
        });

    }
    
    update(time, delta) {
        
    }
}
