class Turret {
    constructor(col, row) {
        this.animator = new Animator("./assets/Environmental_Blocks.png",
            /* sx */ 64, /* sy */ 32,
            /* sWidth */ 16, /* sHeight */ 16, 
            /*animation length*/ 1, /* fps */ 1, /* scale */ 4);
        this.animator.location = {x: 64*row, y: col * 64};
        this.attackTimer = gameEngine.timer.gameTime;
    }
    update() {
        // check weapon cooldown.
        const now = gameEngine.timer.gametime
        if(now - this.attackTimer < 2) {  // 2 second CD?
            return;
        }
        this.attackTimer = now;
        // check LoS and distance to player BB midpoint.d
        // if all good, fire new projectile. set cooldown timer.
        if(gameEngine.entities.filter(e => e instanceof Projectile).length > 10) return;

        gameEngine.addEntity(new Projectile(this.animator.location, gameEngine.mainCharacter.location));
    }
    draw() {
        this.animator.draw(gameEngine.ctx);
    }
}
class Projectile {
    constructor(origin, target, friendly=false) {
        // const deltax = origin.x - target.x;
        // const deltay = origin.y - target.y;
        const getDistance = (pt_a, pt_b) => {
            const a = pt_a.x - pt_b.x;
            const b = pt_a.y - pt_b.y;
            return Math.sqrt(a**2 + b**2);
        }
        this.speed = 400;
        this.initTime = gameEngine.timer.gameTime;
        const distToTarget = getDistance(origin, target);
        this.velocity = {
            x: (target.x - origin.x) / distToTarget * this.speed,
            y: (target.y - origin.y) / distToTarget * this.speed,
        };

        // TODO: handle NaN, infinity, etc exceptions.
        this.animator = new Animator("./assets/Environmental_Blocks.png",
        /* sx */ 64, /* sy */ 32,
        /* sWidth */ 16, /* sHeight */ 16, 
        /*animation length*/ 1, /* fps */ 1, /* scale */ 1);
        this.animator.location = origin;
    }
    update() {
        if(gameEngine.timer.gameTime - this.initTime > 2) {  // upper limit of 5s life span.
            this.removeFromWorld = true;
            return;
        }
        // TODO: damage collision?
        const location = this.animator.location;
        this.animator.location = {
            x: location.x + this.velocity.x * gameEngine.clockTick,
            y: location.y + this.velocity.y * gameEngine.clockTick,
        };
    }
    draw() {
        this.animator.draw(gameEngine.ctx);
    }
}