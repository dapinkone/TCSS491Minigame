class Gravitator {
    // class to handle the effects of gravity on a client entity.

    // static direction = 1;
    // static timeOfDirectionChange = 0;
    // static changeDirection = () => {
    //     //if (gameEngine.timer.gameTime - this.timeOfDirectionChange < 1) return; // too soon.
    //     //this.timeOfDirectionChange = gameEngine.timer.gameTime;

    //     for (const entity of gameEngine.entities) {
    //         const now = new Date();
    //         if (entity.canfall) {
    //             entity.falling = true;
    //             entity.wasFalling = true;
    //             entity.fallInitPosition = entity.location;
    //             entity.fallStartTime = now;
    //         }
    //     }
    // }

    constructor(client, onLanding) {
        this.client = client;
        this.v_0 = 0;// initial velocity in the y axis (blocks don't jump)
        this.onLanding = onLanding; // function to run when we land(change to walk mode or whatever)       
        // gravity-based constants:
        this.t_h = 0.3;       // time to apex of "jump" in seconds.
        this.h = 3;            // desired height of "jump"
        this.g = 2 * this.h / (this.t_h ** 2); // acceleration due to gravity.
        this.velocity = { x: 0, y: 0 };
        this.falling = false; // tracks if we're in the air, can't jump if in the air.
    }
    jump() {
        if (!this.falling) {
            this.velocity.y = -2 * this.h / this.t_h;
            this.falling = true;
        }
    }
    nextPosition() {
        const c = this.client;
        c.animator.location = c.location; // NOTE: should this be here, or in client?
        const clockTick = gameEngine.clockTick;

        if (!c.canfall) { return; }    // if the client doesn't fall, it's not really moving.

        if (c.collision && c.canfall) { // fall until collision
            const newV = Math.floor(this.g * clockTick + this.velocity.y); // compound velocity + gravity
            const terminalVelocity = 60;
            this.velocity.y = Math.min(newV, terminalVelocity);
        }

        c.location.x += this.velocity.x;
        c.location.y += this.velocity.y;
        c.lastBB = c.BB;
        c.updateBB(); // update BB so we have are as accurate as we can be for collision.

        for (const entity of gameEngine.entities) { // collision checks

            if (entity == c || !entity.BB || !entity.collision) continue; // entity does not have collision
            if (entity.falling || entity instanceof MainCharacter) continue; // stationary blocks don't collide.
            //if (entity.constructor.name != c.constructor.name)
            //console.log(c.constructor.name + " hit " + entity.constructor.name + " from the " + [...hits]);
            let collides = c.BB.collision(entity.BB);
            if(collides && entity instanceof Phantom) entity.setContact();

            if (collides && c.onCollision !== undefined) {
                c.onCollision(entity);
            }
            if (collides && entity.onCollision !== undefined) {
                entity.onCollision(c);
            }

            if (collides && c.lastBB.bottom <= entity.BB.top) {// client was above last tick.
                c.location.y = entity.BB.top - c.BB.height;
                this.velocity.y = 0;
                this.falling = false;
            }
            else if (collides && c.lastBB.top >= entity.BB.bottom) { //d client below last tick.
                c.location.y = entity.BB.bottom;
                this.velocity.y = 0;
            }
            //c.lastBB = c.BB;
            c.updateBB();
            collides = c.BB.collision(entity.BB);

            if (collides && c.lastBB.right <= entity.BB.left) {// client was left last tick.
                c.location.x = entity.BB.left - c.BB.width;
                this.velocity.x = 0;
            }
            else if (collides && c.lastBB.left >= entity.BB.right) { // client was right last tick.
                c.location.x = entity.BB.right;
                this.velocity.x = 0;
            }


        }


        c.updateBB();
    }
    haveLanded() {
        // have landed, clean up data from fall
        // const c = this.client;
        // this.velocity.y = 0;
        // c.falling = false;
        // c.fallStartTime = null;
        // c.fallInitPosition = null;
        // this.v_0 = 0;
    }
}