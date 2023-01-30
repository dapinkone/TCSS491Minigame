class Gravitator {
    // class to handle the effects of gravity on a client entity.

    static direction = 1;
    static changeDirection = () => {
        Gravitator.direction *= -1;
        for (const entity of gameEngine.entities) {
            const now = new Date();
            if (entity.canfall) {
                entity.falling = true;
                entity.wasFalling = true;
                entity.fallInitPosition = entity.location;
                entity.fallStartTime = now;
            }
        }
    }

    constructor(client, onLanding) {
        this.client = client;
        this.v_0 = 0;// initial velocity in the y axis (blocks don't jump)
        this.onLanding = onLanding; // function to run when we land(change to walk mode or whatever)       
        // gravity-based constants:
        this.t_h = 0.25;       // time to apex of "jump" in seconds.
        this.h = 8;            // desired height of "jump"
        this.g = Gravitator.direction * 2 * this.h / (this.t_h ** 2); // acceleration due to gravity.
    }
    jump() {
        let c = this.client;
        this.v_0 = Gravitator.direction * -2 * this.h / this.t_h;
        c.fallInitPosition = c.location;
        c.fallStartTime = new Date();
    }
    nextPosition() {
        const c = this.client;
        c.animator.location = c.location;
        //c.updateBB();

        if (!c.canfall) { return; } // if the client doesn't fall, it's not really moving.

        c.wasFalling = c.falling;   // need to remember if we were on the ground before.
        c.falling = true;           // assume falling until collision
        
        for (const entity of gameEngine.entities) { // collision checks
            if (entity == c || !entity.BB) continue; // entity does not have collision
            const hit = entity.BB.collision(c.BB);
            if (hit && c.wasFalling && c.falling) {
                // have landed, clean up data from fall
                c.falling = false;
                c.fallStartTime = null;
                c.fallInitPosition = null;
                this.v_0 = 0;
                
             //   console.log("collision detected", entity.constructor.name, c.constructor.name);
                if(c.location.y < entity.BB.location.y) {// bounce back, preventing BB overlap.
                    c.location.y = entity.BB.location.y - c.BB.height - 1;
                    console.log(hit);
                } else {
                    c.location.y = entity.BB.location.y + c.BB.height + 1;
                }
                if(this.onLanding !== undefined) 
                    this.onLanding();
                if (entity.onCollision !== undefined) {
                    entity.onCollision(c);
                }
                break;
            }
        }
        if (c.falling && c.fallStartTime == null) {
            c.fallStartTime = new Date();
            c.fallInitPosition = c.location;
        }
        if (c.collision && c.canfall && c.falling) { // fall until collision
            // are we already falling?
            const t = (new Date() - c.fallStartTime) / 1000; // current air time(seconds)
            c.location.y = Math.floor(
                Gravitator.direction * (0.5 * this.g * t ** 2
                    + this.v_0 * t) + c.fallInitPosition.y);
        }
        c.updateBB();
    }
}