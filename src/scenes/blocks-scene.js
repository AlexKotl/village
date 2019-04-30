import Phaser from 'phaser';
import Board from '../objects/board';
import map from '../objects/map';

const DEBUG_MODE = true;

export default class BlocksScene extends Phaser.Scene {
    
    constructor() {
        super({ key: 'BlocksScene'})
    }

    preload() {
        this.load.image('room', 'assets/sprites/room.png');
        this.load.image('cat1', 'assets/sprites/cats/cat1.png');
        this.load.image('cat2', 'assets/sprites/cats/cat2.png');
        this.load.image('cat3', 'assets/sprites/cats/cat3.png');
        this.load.image('cat4', 'assets/sprites/cats/cat4.png');
        this.load.image('cat5', 'assets/sprites/cats/cat5.png');
    }
    
    getMapPosition(x, y) {
        return {
            x: Math.round(x / this.board.blockSize + 0.5) - 1,
            y: Math.round(y / this.board.blockSize + 0.5) - 1,
        }
    }
    
    

    create() {
        // setup camera and background
        this.cameras.main.scrollX = -140;
        this.cameras.main.scrollY = -100;
        this.add.sprite(-140, -100, 'room').setOrigin(0);
        
        this.graphics = this.add.graphics(); 
        
        this.board = new Board({
            blockSize: 54,
            size: {
                width: 10, 
                height: 7
            },
            scene: this,
        });
        
        
        // add sprites
        for (let n in map.figures) {
            console.log('sss');
            let figure = map.figures[n];
            
            let sprite = this.add.sprite(figure.pos.x * this.board.blockSize, figure.pos.y * this.board.blockSize, figure.name);
            sprite.setOrigin(0);
            sprite.alpha = DEBUG_MODE ? 0.8 : 1;
            this.input.setDraggable(sprite.setInteractive());
            
            map.figures[n].sprite = sprite;
        }
        
        this.input.on('dragstart', (pointer, obj) => {
            // rebuild collision map - remove figure
            this.draggedFigureIndex = map.figures.findIndex(el => obj === el.sprite);
            map.figures[this.draggedFigureIndex].pos.x = 100;
            this.board.generateBoard();
            
            let mapPos = this.getMapPosition(obj.x, obj.y);
            this.board.cells[mapPos.y][mapPos.x] = 0;
            
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
            
            // make new map pos difference not bigger than 1 as we move cell by cell and cant jump over figures
            for (let axis of ['x', 'y']) {
                if (Math.abs(mapPos[axis] - newMapPos[axis]) > 1) {
                    newMapPos[axis] = mapPos[axis] + Math.sign(newMapPos[axis] - mapPos[axis]);
                }
            }
            
            // decide which axis we move block
            if (this.isVerticalMove === undefined) {
                this.isVerticalMove = Math.abs(obj.y - dragY) > Math.abs(obj.x - dragX);
            }
            
            if (this.isVerticalMove) {
                if (!this.board.isFigureAllowed(map.figures[this.draggedFigureIndex], mapPos.x, newMapPos.y)) {
                    obj.setPosition(obj.x, mapPos.y * this.board.blockSize);
                    return true;
                }
                // bottom bouce
                if (!this.board.isFigureAllowed(map.figures[this.draggedFigureIndex], mapPos.x, newMapPos.y + 1)) {
                    obj.setPosition(obj.x, newMapPos.y * this.board.blockSize);
                    return true;
                }
                
                obj.setPosition(obj.x, dragY);
            }
            else {
                if (!this.board.isFigureAllowed(map.figures[this.draggedFigureIndex], newMapPos.x, mapPos.y)) {
                    obj.setPosition(mapPos.x * this.board.blockSize, obj.y);
                    return true;
                }
                // right bouce
                if (!this.board.isFigureAllowed(map.figures[this.draggedFigureIndex], newMapPos.x + 1, mapPos.y)) {
                    obj.setPosition(newMapPos.x * this.board.blockSize, obj.y);
                    return true;
                }
                
                obj.setPosition(dragX, obj.y);
            }
        });

        this.input.on('dragend', (pointer, obj) => {
            let mapPos = this.getMapPosition(obj.x + this.board.blockSize/2, obj.y + this.board.blockSize/2); // get avarage pos
            obj.setPosition(mapPos.x * this.board.blockSize, mapPos.y * this.board.blockSize);
            
            // update collision map
            map.figures[this.draggedFigureIndex].pos.x = mapPos.x;
            map.figures[this.draggedFigureIndex].pos.y = mapPos.y;
            this.board.generateBoard();
        });

    }

}
