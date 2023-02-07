class Gravitator {
    // class to handle the effects of gravity on a client entity.

    static direction = 1;
    static timeOfDirectionChange = 0;
    static changeDirection = () => {
        if (gameEngine.timer.gameTime - this.timeOfDirectionChange < 1) return; // too soon.
        this.timeOfDirectionChange = gameEngine.timer.gameTime;
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
        this.velocity = {x:0, y:0};
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

        if (!c.canfall) { return; } // if the client doesn't fall, it's not really moving.

        if (c.falling && c.fallStartTime == null) {
            c.fallStartTime = new Date();
            c.fallInitPosition = c.location;
        }
        if (c.collision && c.canfall && c.falling) { // fall until collision
            // are we already falling?
            const t = (new Date() - c.fallStartTime) / 1000; // current air time(seconds)
            c.location.y = Math.floor(
                Gravitator.direction * (0.5 * this.g * t ** 2 + this.v_0 * t) + c.fallInitPosition.y
            );
        }
        c.location.x += this.velocity.x;
        c.updateBB(); // update BB so we have are as accurate as we can be for collision.
        
        c.wasFalling = c.falling;   // need to remember if we were on the ground before.
        c.falling = true;           // assume falling until collision
        for (const entity of gameEngine.entities) { // collision checks
            if (entity == c || !entity.BB) continue; // entity does not have collision

            const collisionSides = c.BB.collisionSide(entity.BB);
            
            //if (entity.constructor.name != c.constructor.name)
                //console.log(c.constructor.name + " hit " + entity.constructor.name + " from the " + [...hits]);
            const collides = c.BB.collision(entity.BB);
            if(collisionSides.length > 0)
                console.log(`${c.constructor.name} hit ${entity.constructor.name} on `, collisionSides);
            if (collides && c.wasFalling && c.falling) {
               

                // bounce back, preventing overlap of boxes:
                if (c.lastBB.bottom <= entity.BB.top) {// client was above last tick.
                    c.location.y = entity.BB.top - c.BB.height;
                    this.haveLanded();
                }
                else if (c.lastBB.top >= entity.BB.bottom) { //d client below last tick.
                    c.location.y = entity.BB.top + c.BB.height;
                }
                else if (c.lastBB.right <= entity.BB.left) {// client was left last tick.
                    c.location.x = entity.BB.left - c.BB.width;
                    this.velocity.x = 0;
                }
                else if (c.lastBB.left >= entity.BB.right) { // client was right last tick.
                    c.location.x = entity.BB.right;
                    this.velocity.x = 0;
                }
                // if (this.onLanding !== undefined)
                //     this.onLanding();
                //   break;
            }

            if (collides && c.onCollision !== undefined) {
                c.onCollision(entity);
            }
            if (collides && entity.onCollision !== undefined) {
                entity.onCollision(c);
            }
        }


        c.updateBB();
    }
    haveLanded() {
 // have landed, clean up data from fall
 const c= this.client;
 c.falling = false;
 c.fallStartTime = null;
 c.fallInitPosition = null;
 this.v_0 = 0;
    }
}