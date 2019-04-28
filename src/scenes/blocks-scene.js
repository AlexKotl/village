import Phaser from 'phaser';

export default class BlocksScene extends Phaser.Scene {
    
    constructor() {
        super({ key: 'BlocksScene'})
        
        this.blockSize = 54;
        this.boardSize = 10;
        
        // properties of figures
        this.figureTypes = {
            line: {
                shape: [[1,1,1,1]],
            },
            square: {
                shape: [[1,1], [1,1]],
            },
            gun: {
                shape: [[1,0,0], [1,1,1]],
            }
        };
        
        this.figures = [
            {
                name: 'line',
                pos: {x: 0, y: 0},
            },
            {
                name: 'square',
                pos: {x: 1, y: 3},
            },
            {
                name: 'gun',
                pos: {x: 5, y: 6},
            }
        ];
    }

    preload() {
        this.load.image('block', 'assets/sprites/block.png');
        this.load.image('line', 'assets/sprites/line.png');
        this.load.image('gun', 'assets/sprites/l.png');
        this.load.image('square', 'assets/sprites/square.png');
    }
    
    generateBoard() {
        // init empty board
        let board = [];
        for (let i=0; i<this.boardSize; i++) {
            board[i] = [];
            for (let j=0; j<this.boardSize; j++) {
                board[i][j] = 0;
            }
        }
        
        this.graphics.clear(); // clear debug graphics
        
        // fill with figures
        for (let figure of this.figures) {
            let shape = this.figureTypes[figure.name].shape;
            for (let y=0; y<shape.length; y++) {
                for (let x=0; x<shape[y].length; x++) {
                    board[y + figure.pos.y][x + figure.pos.x] = shape[y][x];
                    // debug squares
                    if (shape[y][x] === 1) {
                        this.graphics.fillStyle(0x00ff00, 1);
                        this.graphics.fillRect((x + figure.pos.x) * this.blockSize, (y + figure.pos.y) * this.blockSize, this.blockSize, this.blockSize);
                    }
                    
                }
            }
        }
        
        return board;
    }
    
    getMapPosition(x, y) {
        return {
            x: Math.round(x / this.blockSize + 0.5) - 1,
            y: Math.round(y / this.blockSize + 0.5) - 1,
        }
    }
    
    isAllowed(x,y) {
        if (x > this.boardSize || y > this.boardSize || x < 0 || y < 0) {
            return false;
        }
        return this.board[y][x] === 0;
    }

    create() {
        this.graphics = this.add.graphics(); 
        this.board = this.generateBoard();
        
        // add sprites
        for (let n in this.figures) {
            let figure = this.figures[n];
            let sprite = this.add.sprite(figure.pos.x * this.blockSize, figure.pos.y * this.blockSize, figure.name);
            sprite.setOrigin(0);
            sprite.alpha = 0.8;
            this.input.setDraggable(sprite.setInteractive());
            
            this.figures[n].sprite = sprite;
        }
        
        this.input.on('dragstart', (pointer, obj) => {
            // rebuild collision map - remove figure
            this.draggedFigureIndex = this.figures.findIndex(el => obj === el.sprite);
            this.figures[this.draggedFigureIndex].pos.x = 100;
            this.board = this.generateBoard();
            
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
            
            // update collision map
            this.figures[this.draggedFigureIndex].pos.x = mapPos.x;
            this.figures[this.draggedFigureIndex].pos.y = mapPos.y;
            this.board = this.generateBoard();
        });

    }

}
