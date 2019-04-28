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
            x: Math.round(x / this.blockSize + 0.5) - 1,
            y: Math.round(y / this.blockSize + 0.5) - 1,
        }
    }
    
    isAllowed(x,y) {
        if (x > 4 || y > 4 || x < 0 || y < 0) {
            return false;
        }
        return this.board[y][x] === 0;
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
                    let block = this.add.sprite(y * this.blockSize, x * this.blockSize, 'block');
                    block.setOrigin(0);
                    this.input.setDraggable(block.setInteractive());
                }
            }
        }
        
        this.input.on('dragstart', (pointer, obj) => {
            let mapPos = this.getMapPosition(obj.x, obj.y);
            this.board[mapPos.y][mapPos.x] = 0;
            
            this.isVerticalMove = undefined;
            this.draggedFrom = {x: obj.x, y: obj.y};
        });

        // dragX - new pos of element
        this.input.on('drag', (pointer, obj, dragX, dragY) => {
            if (Math.abs(dragX - obj.x) < 5 && Math.abs(dragY - obj.y) < 5) {
                return true;
            }
            
            let mapPos = this.getMapPosition(obj.x, obj.y);
            let newMapPos = this.getMapPosition(dragX, dragY);
            
            // decide which axis we move block
            if (this.isVerticalMove === undefined) {
                this.isVerticalMove = Math.abs(obj.y - dragY) > Math.abs(obj.x - dragX);
            }
            
            if (this.isVerticalMove) {
                if (!this.isAllowed(mapPos.x, newMapPos.y)) {
                    obj.setPosition(obj.x, mapPos.y * this.blockSize);
                    return true;
                }
                // bottom bouce
                if (!this.isAllowed(mapPos.x, newMapPos.y + 1)) {
                    obj.setPosition(obj.x, newMapPos.y * this.blockSize);
                    return true;
                }
                
                obj.setPosition(obj.x, dragY);
            }
            else {
                if (!this.isAllowed(newMapPos.x, mapPos.y)) {
                    obj.setPosition(mapPos.x * this.blockSize, obj.y);
                    return true;
                }
                // right bouce
                if (!this.isAllowed(newMapPos.x + 1, mapPos.y)) {
                    obj.setPosition(newMapPos.x * this.blockSize, obj.y);
                    return true;
                }
                
                obj.setPosition(dragX, obj.y);
            }
        });

        this.input.on('dragend', (pointer, obj) => {
            let mapPos = this.getMapPosition(obj.x + this.blockSize/2, obj.y + this.blockSize/2); // get avarage pos
            obj.setPosition(mapPos.x * this.blockSize, mapPos.y * this.blockSize);
            this.board[mapPos.y][mapPos.x] = 1;
        });

    }
    
    update(time, delta) {
        
    }
}
