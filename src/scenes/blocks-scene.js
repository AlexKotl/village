import Phaser from 'phaser';

const DEBUG_MODE = true;

export default class BlocksScene extends Phaser.Scene {
    
    constructor() {
        super({ key: 'BlocksScene'})
        
        this.blockSize = 54;
        this.boardSize = {width: 10, height: 7};
        
        // properties of figures
        this.figureTypes = {
            cat1: {
                shape: [[1],[1],[1]],
            },
            cat2: {
                shape: [[1,1,1], [1,0,1]],
            },
            cat3: {
                shape: [[1,1], [1,1]],
            },
            cat4: {
                shape: [[1]],
            },
            cat5: {
                shape: [[1,1]],
            },
        };
        
        this.figures = [
            {
                name: 'cat1',
                pos: {x: 0, y: 0},
            },
            {
                name: 'cat2',
                pos: {x: 1, y: 3},
            },
            {
                name: 'cat3',
                pos: {x: 5, y: 4},
            },
            {
                name: 'cat4',
                pos: {x: 6, y: 1},
            },
            {
                name: 'cat5',
                pos: {x: 5, y: 3},
            },
            {
                name: 'cat4',
                pos: {x: 2, y: 5},
            },
        ];
    }

    preload() {
        this.load.image('room', 'assets/sprites/room.png');
        this.load.image('cat1', 'assets/sprites/cats/cat1.png');
        this.load.image('cat2', 'assets/sprites/cats/cat2.png');
        this.load.image('cat3', 'assets/sprites/cats/cat3.png');
        this.load.image('cat4', 'assets/sprites/cats/cat4.png');
        this.load.image('cat5', 'assets/sprites/cats/cat5.png');
    }
    
    generateBoard() {
        // init empty board
        let board = [];
        for (let i=0; i<this.boardSize.height; i++) {
            board[i] = [];
            for (let j=0; j<this.boardSize.width; j++) {
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
                    if (DEBUG_MODE && shape[y][x] === 1) {
                        this.drawDebugSquare(x + figure.pos.x, y + figure.pos.y);
                    }
                    
                }
            }
        }
        
        return board;
    }
    
    drawDebugSquare(x, y, color=0x00ff00) {
        this.graphics.fillStyle(color, 0.3);
        this.graphics.fillRect(x * this.blockSize, y * this.blockSize, this.blockSize, this.blockSize);
    }
    
    getMapPosition(x, y) {
        return {
            x: Math.round(x / this.blockSize + 0.5) - 1,
            y: Math.round(y / this.blockSize + 0.5) - 1,
        }
    }
    
    isAllowed(x, y) {
        if (x >= this.boardSize.width || y >= this.boardSize.height || x < 0 || y < 0) {
            return false;
        }
        return this.board[y][x] === 0;
    }
    
    isFigureAllowed(figure, x, y) {
        let shape = this.figureTypes[figure.name].shape;
        for (let fy=0; fy<shape.length; fy++) {
            for (let fx=0; fx<shape[fy].length; fx++) {
                if (shape[fy][fx] === 1 && !this.isAllowed(x + fx, y + fy)) {
                    return false;
                }
            }
        }
        
        return true;
    }

    create() {
        // setup camera and background
        this.cameras.main.scrollX = -140;
        this.cameras.main.scrollY = -100;
        this.add.sprite(-140, -100, 'room').setOrigin(0);
        
        this.graphics = this.add.graphics(); 
        this.board = this.generateBoard();
        
        // add sprites
        for (let n in this.figures) {
            let figure = this.figures[n];
            let sprite = this.add.sprite(figure.pos.x * this.blockSize, figure.pos.y * this.blockSize, figure.name);
            sprite.setOrigin(0);
            sprite.alpha = DEBUG_MODE ? 0.8 : 1;
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
            
            this.drawDebugSquare(mapPos.x, mapPos.y, 0xff0000);
            
            // decide which axis we move block
            if (this.isVerticalMove === undefined) {
                this.isVerticalMove = Math.abs(obj.y - dragY) > Math.abs(obj.x - dragX);
            }
            
            if (this.isVerticalMove) {
                if (!this.isFigureAllowed(this.figures[this.draggedFigureIndex], mapPos.x, newMapPos.y)) {
                    obj.setPosition(obj.x, mapPos.y * this.blockSize);
                    return true;
                }
                // bottom bouce
                if (!this.isFigureAllowed(this.figures[this.draggedFigureIndex], mapPos.x, newMapPos.y + 1)) {
                    obj.setPosition(obj.x, newMapPos.y * this.blockSize);
                    return true;
                }
                
                obj.setPosition(obj.x, dragY);
            }
            else {
                if (!this.isFigureAllowed(this.figures[this.draggedFigureIndex], newMapPos.x, mapPos.y)) {
                    obj.setPosition(mapPos.x * this.blockSize, obj.y);
                    return true;
                }
                // right bouce
                if (!this.isFigureAllowed(this.figures[this.draggedFigureIndex], newMapPos.x + 1, mapPos.y)) {
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
