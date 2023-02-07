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
        super("assets/characters.png", 5, (32 * row), 32, 32, 4, fps, scale);
        Object.assign(this, { location, mode, row });
        console.log(this, this.location);
        
        this.collision = true;
        this.canfall = true;
        this.animator = this;
        this.velocity = {x: 4, y: 0};
        this.updateBB();
        this.updateBB();
        this.gravitator = new Gravitator(this, this.onLanding);
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
        if (this.collision) {
            this.lastBB = this.BB;
            this.BB = new BoundingBox({
                width: this.width,
                height: this.height,
                location: this.location,
                color: "green"
            });
        }
    }
    update() {
        if (gameEngine.keys["d"]) { // moving right
            this.gravitator.velocity.x = 4;
            this.mirrored = false;
            this.mode = "WALK";
        }
        else if (gameEngine.keys["a"]) { // moving left
            this.gravitator.velocity.x = -4;
            this.mirrored = true;
            this.mode = "WALK";
        }
        if(!(gameEngine.keys["a"] || gameEngine.keys["d"])) {
            this.gravitator.velocity.x = 0;
        }
        if (gameEngine.keys['f']) {
            Gravitator.changeDirection();
            gameEngine.keys['f'] = false;
        }
        if (gameEngine.keys[" "]) { // initiate jump!
                if(this.mode != "JUMP" && !this.falling)
                    this.gravitator.jump();
        }
        // not in the air, not walking
        else if (this.mode != "JUMP" && !(gameEngine.keys['a'] | gameEngine.keys['d'])) { 
            this.mode = "IDLE";
        }
        this.gravitator.nextPosition();
        super.update();
    }
    draw() {
        super.draw(gameEngine.ctx);
        this.BB.draw();
    }
}