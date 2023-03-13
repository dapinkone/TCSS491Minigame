// class BG {
//     static blockwidth = 16*4;

//     constructor(sourceimg, sx, sy, x, y, width, height) {
//     this.img =  ASSET_MANAGER.getAsset(sourceimg);
//     }
//     draw(ctx) {
//         ctx.save();
//         const pattern = ctx.createPattern(this.img, "repeat")
//         ctx.fillstyle = this.pattern;
//         ctx.fillRect(x, y, width, height);

//         ctx.restore();
//     }
// }
class Block {
    static blockwidth = 16*4;
    constructor(sx, sy, x, y, runLength, collision = false, heavy = false, horizontal = true) {
        this.animator = new Animator("./assets/Environmental_Blocks.png",
            /* sx */ sx, /* sy */ sy,
            /* sWidth */ 16, /* sHeight */ 16, 
            /*animation length*/ 1, /* fps */ 1, /* scale */ 4);
        this.location = {x, y};
        Object.assign(this, {
            sx, sy,
            runLength,// width or height in blockwidths.
            collision,
            heavy,// can the block be moved/pushed from the side?
            horizontal, // is this run of blocks horizontal or vertical?
        });

        this.id = 1000*x + y;
        this.gravitator = new Gravitator(this);
        this.updateBB();
        this.lastBB = this.BB;
    }
    updateBB() {
        if (this.collision) {
            //this.lastBB = this.BB;
            if(this.horizontal)
                this.BB = new BoundingBox({
                    width: Block.blockwidth*this.runLength,
                    height: Block.blockwidth,
                    location: this.location,
                    color: "yellow"
                });
            else {
                this.BB = new BoundingBox({
                    width: Block.blockwidth,
                    height: Block.blockwidth*this.runLength,
                    location: this.location,
                    color: "yellow"
                });
            }
        }
    }
    update() {
        this.gravitator.nextPosition();
        const MC = gameEngine.mainCharacter;
        if(this.heavy && this.BB.collision(MC.BB)) {
            
        }  
    }
    draw() {
        if(this.horizontal) {
            for(const col of Array(this.runLength).keys()) {
                this.animator.location = {
                    x: this.location.x + col*this.animator.width,
                    y: this.location.y
                };
                this.animator.draw(gameEngine.ctx);
            }
        } else {
            throw new Error("Vertical draw() of Block class not implemented.");
        }
        if (this.collision && this.BB) this.BB.draw();
    }
}
class VictoryBlock extends Block {
    constructor(row, col) {
        super(432, 288, col*Block.blockwidth, row*Block.blockwidth, /*columns*/ 1, true, false);
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
        super(64, 32, startCol*Block.blockwidth, row*Block.blockwidth, 2, true, false);
        this.background = new Block(
            112, 32, // sx, sy
            startCol*Block.blockwidth, // x location
            row*Block.blockwidth, // y location
            endCol - startCol + 2, // runLength of bg, accounting for length
            false // collision
        );
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
        this.lastBB = this.BB;
        super.updateBB();
    }
    draw() {
        const ctx = gameEngine.ctx;
        
        ctx.save();
        ctx.globalAlpha = 0.3; // want to background to be semi-transparent
        this.background.draw();
        ctx.restore();

        super.draw();
    }
}
class Phantom extends Block {
    constructor(row, col, columns) {
        this.alpha = 1;
        Object.assign(self, {row, col});
        super(64, 32, col*Block.blockwidth, row*Block.blockwidth, columns, true, false);
        this.contactTime = 0; // time of contact with the player.
    }
    update() {
        this.timedelta = gameEngine.timer.gameTime - this.contactTime;

        if (this.timedelta < 2) {
            // no problem. still allowed to stand on it.
        } else if(this.timedelta > 2) {
            // > 2 seconds, begin to fade out.
            this.alpha -= gameEngine.clockTick;
            
            if(this.alpha < 0.5) { // if alpha < 0.5, no bounding box.
                this.BB = undefined;
                return;
            }
        }
        if(this.timedelta > 5) {// if now - contactTime > 5 seconds, reset.
            super.updateBB();
            super.updateBB();
        }
    }
    draw() {
        const ctx = gameEngine.ctx;
        ctx.save();
        ctx.globalAlpha = Math.floor(this.alpha);
        super.draw();
        ctx.restore();
    }
    setContact() {
        if(this.timedelta < 5) {
            return; // block is still busy.
        }
        // block is not busy. Initiate animation.
        this.contactTime = gameEngine.timer.gameTime;
    }
}