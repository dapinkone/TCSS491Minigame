class Gravitator {
    // class to handle the effects of gravity on a client entity.


    constructor(client, onLanding) {
        this.client = client;
        this.v_0 = 0;// initial velocity in the y axis (blocks don't jump)
        this.onLanding = onLanding; // function to run when we land(change to walk mode or whatever)       
        // gravity-based constants:
        this.t_h = 0.25;       // time to apex of "jump" in seconds.
        this.h = 6;            // desired height of "jump"
        this.g = 2 * this.h / (this.t_h ** 2); // acceleration due to gravity.
    }
    jump() {
        let c = this.client;
        this.v_0 = -2 * this.h / this.t_h;
        c.fallInitPosition = c.location;
        c.fallStartTime = new Date();
        //console.log([this.v_0]);
    }
    nextPosition() {
        const c = this.client;
        c.animator.location = c.location;
        c.updateBB();

        if(!c.canfall) { return;} // if the client doesn't fall, it's not really moving.

        c.wasFalling = c.falling;   // need to remember if we were on the ground before.
        c.falling = true;           // assume falling until collision
        
        for(const entity of gameEngine.entities) { // collision checks
            if(entity == c || !entity.BB ) continue; // entity does not have collision
            if(entity.BB.collision(c.BB) && c.wasFalling) {
                // have landed, clean up data from fall
                c.falling = false;
                c.fallStartTime = null;
                c.fallInitPosition = null;
                this.v_0 = 0;

                console.log("collision detected", entity.constructor.name, c.constructor.name);
                if(c.location.y < entity.BB.location.y) // bounce back, preventing BB overlap.
                    c.location.y = entity.BB.location.y - c.BB.height - 2;
                if(this.onLanding !== undefined) this.onLanding();
                break;
            }
        }
        if(c.falling && c.fallStartTime == null) {
            c.fallStartTime = new Date();
            c.fallInitPosition = c.location;
        }
        if (c.collision && c.canfall && c.falling) { // fall until collision
            // are we already falling?
            const t = (new Date() - c.fallStartTime) / 1000; // current air time(seconds)
            c.location.y = Math.floor(0.5 * this.g * t ** 2 + this.v_0 * t + c.fallInitPosition.y);
        }
    }
}