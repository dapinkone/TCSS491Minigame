class Block {
    static blockwidth = 16*4;
    constructor(sx, sy, x, y, collision = false, canfall=false, heavy = false) {
        this.animator = new Animator("./assets/Environmental_Blocks.png",
            /* sx */ sx, /* sy */ sy,
            /* sWidth */ 16, /* sHeight */ 16, 
            /*animation length*/ 1, /* fps */ 1, /* scale */ 4);
        //Object.assign(this, {sx, sy, location: {x, y}, collision, canfall});
        this.sx = sx;
        this.sy = sy;
        this.location = {x, y};
        this.collision = collision;
        this.canfall = canfall;
        this.heavy = heavy;   // can the block be moved/pushed from the side?
    
        this.id = 1000*x + y;
        this.gravitator = new Gravitator(this);
        this.updateBB();
        this.updateBB();
    }
    updateBB() {
        if (this.collision) {
            this.lastBB = this.BB;
            this.BB = new BoundingBox({
                width: Block.blockwidth,
                height: Block.blockwidth,
                location: this.location,
                color: "yellow"
            });
        }
    }
    update() {
        this.gravitator.nextPosition();
        const MC = gameEngine.mainCharacter;
        if(this.heavy && this.BB.collision(MC.BB)) {
            
        }  
    }
    draw() {
        this.animator.draw(gameEngine.ctx);
        if (this.collision) this.BB.draw();
    }
}
class VictoryBlock extends Block {
    constructor(row, col) {
        super(432, 288, col*Block.blockwidth, row*Block.blockwidth, true, false, false);
    }
    onCollision(entity) {
        // if we touch the box, move to the next level
        if(entity instanceof MainCharacter) {
            levels.current++;
            console.log("Victory! loading level " + levels.current);
            loadLevel(levels.current);
        }
    }
}
class Mover extends Block {
    // blocks that move horizontally
    constructor(row, startCol, endCol) {
        super(64, 32, startCol*Block.blockwidth, row*Block.blockwidth, true, false, false);
        Object.assign(this, {row, startCol, endCol});
        this.direction = 1;
    }
    update() {
        const startx = this.startCol * Block.blockwidth;
        const endx = this.endCol * Block.blockwidth;
        const diff = endx - startx;
        
        if(this.location.x > endx) {
            this.direction = -1;
            this.location.x = endx;
        }
        if(this.location.x < startx) {
            this.direction = 1;
            this.location.x= startx;
        }
        this.location.x += this.direction * 2;
        this.animator.location = this.location;
        super.updateBB();
    }
    draw() {
        super.draw();
    }
}
class Phantom extends Block {
    constructor(row, col, rate) {
        this.alpha = 1;
        Object.assign(self, {row, col});
        super(64, 32, col*Block.blockwidth, row*Block.blockwidth, true, false, false);
    }
    update() {
        
        super.updateBB();
    }
    draw() {
        gameEngine.ctx.save();
    }
}