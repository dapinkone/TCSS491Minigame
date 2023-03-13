class Turret {
    constructor(col, row) {
        this.animator = new Animator("./assets/Environmental_Blocks.png",
            /* sx */ 64, /* sy */ 32,
            /* sWidth */ 16, /* sHeight */ 16, 
            /*animation length*/ 1, /* fps */ 1, /* scale */ 4);
        this.animator.location = {x: 64*row, y: col * 64};
        this.attackTimer = gameEngine.timer.gameTime;
        this.collision = true;
        this.updateBB();
    }
    update() {
        // check weapon cooldown.
        const now = gameEngine.timer.gameTime;
        if(now - this.attackTimer < 2) {  // 1 second CD?
            return;
        }
        this.attackTimer = now;
        
        // check LoS and distance to player BB midpoint.
        // if all good, fire new projectile. set cooldown timer.
        //if(gameEngine.entities.filter(e => e instanceof Projectile).length > 10) return; // limit 10 projectiles at a time
        gameEngine.addEntity(new Projectile(this.animator.location, gameEngine.mainCharacter.location, false));
    }
    draw() {
        this.animator.draw(gameEngine.ctx);
        this.BB.draw();
    }
    updateBB() {
        //this.lastBB = this.BB;
        this.BB = new BoundingBox({
            width: this.animator.width,
            height: this.animator.height,
            location: this.animator.location,
            color: "red",
        });
    }
}
class Projectile {
    constructor(origin, target, friendly=false) {
        this.friendly = friendly;
        this.speed = 200;
        this.initTime = gameEngine.timer.gameTime;
        //this.collision = true;
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
        this.updateBB();
        this.lastBB = this.BB;
    }
    
    updateBB() {
        //this.lastBB = this.BB;
        this.BB = new BoundingBox({
            width: this.animator.width,
            height: this.animator.height,
            location: this.animator.location,
            color: this.friendly ? "green" : "red",
        });
    }
    
    update() {
        if(gameEngine.timer.gameTime - this.initTime > 2) {  // upper limit of 5s life span.
            this.removeFromWorld = true;
            return;
        }
        
        const location = this.animator.location;
        this.animator.location = {
            x: location.x + this.velocity.x * gameEngine.clockTick,
            y: location.y + this.velocity.y * gameEngine.clockTick,
        };
        // // check && resolve collision
        for(const entity of gameEngine.entities.filter(e => (e.collision || e instanceof Projectile))) {
            const collides = this.BB.collision(entity.BB);
            if(!collides) continue;
            if(entity instanceof Block) {
                // explosion animation? Sound?
                console.log("projectile collision with ", entity.constructor.name);
                this.removeFromWorld = true;
            } else if(entity instanceof Projectile) {
                if(this.friendly ^ entity.friendly) { // collision between friendly/unfriendly destroys.
                    this.removeFromWorld = true;
                    entity.removeFromWorld = true;
                }
            }
            if(this.friendly) {
                if(entity instanceof Turret) {
                    entity.removeFromWorld = true; // destruction noises / animations?
                }
            } else {
                if(entity instanceof MainCharacter) {
                    entity.HP -= 1; // deal dmg.
                    this.removeFromWorld = true;
                }
            }
             
        }
        this.lastBB = this.BB;
        this.updateBB();
    }
    draw() {
        this.animator.draw(gameEngine.ctx);
        this.BB.draw();
    }
}