class MainCharacter extends Animator {
    modeIndex = 0; // current spriteIndex for the sprite frame in the modeSequence
    modeSequences = {
        // mode and the frame sequences necessary
        "WALK": [0, 1, 2, 3],
        "JUMP": [4, 5, 6, 7],
        "HIT": [8, 9, 8],
        "SLASH": [10, 11, 12],
        "PUNCH": [11, 13, 11],
        "RUN": [14, 15, 14, 17],
        "IDLE": [0],
    };

    constructor({ row = 0, mode = "WALK", fps = 5, scale = 1, location = { x: 0, y: 0 } }) {
        //(filename, sx, sy, sWidth, sHeight, sLength=4, fps=5, scale=3) {
        super("assets/characters.png", 5, (32 * row)+8, 32, 32-8, 4, fps, scale);
        Object.assign(this, { location, mode, row });
        console.log(this, this.location);

        this.collision = true;
        this.canfall = true;
        this.animator = this;
        this.velocity = { x: 4, y: 0 };
        //this.updateBB();
        this.updateBB();
        this.lastBB = this.BB;
        this.gravitator = new Gravitator(this, this.onLanding);
        this.HP = this.maxHP = 10;
    }
    onLanding() {
        this.mode = "WALK";
    }
    nextSpriteIndex() {
        const seq = this.modeSequences[this.mode];
        this.modeIndex = (this.modeIndex + 1) % seq.length;
        return seq[this.modeIndex];
    }

    updateBB() {
            this.BB = new BoundingBox({
                width: this.width * 0.6,
                height: this.height,
                location: {x: this.location.x, y:this.location.y},
                color: "white"
            });
    }
    update() {
        const maxSpeed = 8;
        if (gameEngine.keys["d"]) { // moving right
            this.gravitator.velocity.x = Math.min(this.gravitator.velocity.x + 0.5, maxSpeed);
            this.mirrored = false;
            this.mode = "WALK";
        }
        else if (gameEngine.keys["a"]) { // moving left
            this.gravitator.velocity.x = Math.max(this.gravitator.velocity.x - 0.5, -maxSpeed);
            //this.gravitator.velocity.x = -4;
            this.mirrored = true;
            this.mode = "WALK";
        }
        if (!(gameEngine.keys["a"] || gameEngine.keys["d"])) {
            this.gravitator.velocity.x = 0;
        }
        // if (gameEngine.keys['f']) {
        //     Gravitator.changeDirection();
        //     gameEngine.keys['f'] = false;
        // }
        if (gameEngine.keys[" "]) { // initiate jump!
            if (this.mode != "JUMP")
                this.gravitator.jump();
        }
        if (gameEngine.keys['g']) { // flying for debug
            this.gravitator.velocity.y = -10;
        }
        if (gameEngine.click) { // shoot a projectile on click
            const tgt = {
                x: gameEngine.click.x + camera.x,
                y: gameEngine.click.y + camera.y,
            }; 
            gameEngine.addEntity(new Projectile(this.location, tgt, true));
            gameEngine.click = undefined;
        }
        // not in the air, not walking
        else if (this.mode != "JUMP" && !(gameEngine.keys['a'] | gameEngine.keys['d'])) {
            this.mode = "IDLE";
        }
        this.gravitator.nextPosition();
        super.update();
        
        const canvas = gameEngine.ctx.canvas;
        camera = {
            x: Math.floor(this.location.x - canvas.width/2),
            y: Math.floor(this.location.y - canvas.height/2)};
        if(this.HP <= 0) {
            gameEngine.deathMenu();
        }
    }
    draw() {
        const ctx = gameEngine.ctx;
        super.draw(ctx);
        this.BB.draw();
    }
}