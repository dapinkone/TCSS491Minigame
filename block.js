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
        super(432, 288, row*Block.blockwidth, col*Block.blockwidth, true, false, false);
    }
    onCollision() {
        levels.current++;
        gameEngine.mainCharacter.location = {x:0,y:0};
        console.log("Victory! loading level " + levels.current);
        loadLevel(levels.current);
    }
}