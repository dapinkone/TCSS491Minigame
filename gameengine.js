// This game shell was happily modified from Googler Seth Ladd's "Bad Aliens" game and his Google IO talk in 2011

class GameEngine {
    constructor(options) {
        // What you will use to draw
        // Documentation: https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D
        this.ctx = null;

        // Everything that will be updated and drawn each frame
        this.entities = [];

        // Information on the input
        this.click = null;
        this.mouse = null;
        this.wheel = null;
        this.keys = {};
        
        // Options and the Details
        this.options = options || {
            debugging: false,
        };
    };

    init(ctx) {
        this.ctx = ctx;
        this.startInput();
        this.timer = new Timer();
    };

    start() {
        this.running = true;
        const gameLoop = () => {
            this.loop();
            requestAnimFrame(gameLoop, this.ctx.canvas);
        };
        gameLoop();
    };
    startInput() {
        const getXandY = e => ({
            x: e.clientX - this.ctx.canvas.getBoundingClientRect().left,
            y: e.clientY - this.ctx.canvas.getBoundingClientRect().top
        });
        
        this.ctx.canvas.addEventListener("mousemove", e => {
            if (this.options.debugging) {
                console.log("MOUSE_MOVE", getXandY(e));
            }
            this.mouse = getXandY(e);
        });

        this.ctx.canvas.addEventListener("click", e => {
            if (this.options.debugging) {
                console.log("CLICK", getXandY(e));
            }
            this.click = getXandY(e);
        });

        this.ctx.canvas.addEventListener("wheel", e => {
            if (this.options.debugging) {
                console.log("WHEEL", getXandY(e), e.wheelDelta);
            }
            e.preventDefault(); // Prevent Scrolling
            this.wheel = e;
        });

        this.ctx.canvas.addEventListener("contextmenu", e => {
            if (this.options.debugging) {
                console.log("RIGHT_CLICK", getXandY(e));
            }
            e.preventDefault(); // Prevent Context Menu
            this.rightclick = getXandY(e);
        });

        this.ctx.canvas.addEventListener("keydown", event => this.keys[event.key] = true);
        this.ctx.canvas.addEventListener("keyup", event => this.keys[event.key] = false);
        window.addEventListener("keydown", event => {
            if(event.key == "Escape") this.togglePause();
        });
    };

    addEntity(entity) {
        this.entities.push(entity);
    };
    clearEntities() {
        gameEngine.entities.forEach(e => e.removeFromWorld = true);
        this.clean();
    }
    draw() {
        const ctx = this.ctx;
        // Clear the whole canvas with transparent color (rgba(0, 0, 0, 0))
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        // fill background with black
        ctx.fillStyle = "#000";
        ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        
        for(const entity of this.entities) {
            entity.draw(this.ctx);
        }
    };
    clean() {
        this.entities = this.entities.filter(entity => !entity.removeFromWorld);
    }
    update() {
        for(const entity of this.entities) {
            if (!entity.removeFromWorld) {
                entity.update();
            }
        }
        this.clean();
    };

    loop() {
        if(this.running) {
            this.clockTick = this.timer.tick();
            this.update();
            this.draw();
        }
    };

// KV Le was here :)

///////////////////
/* HTML/CSS menu management code:
*/
togglePause() {
    const menu = document.getElementById("menuScreen");
    if(menu.style.display == "none") { // pause game.
        this.ctx.canvas.style.filter = "blur(4px) brightness(50%)";
        menu.style.display = "block";
        this.running = false;
    } else {
        this.ctx.canvas.style.filter = "";
        menu.style.display = "none";
        this.running=true;
        menu.focus();
    }
}

};
