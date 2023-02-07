class HUD {
    static instance;
    constructor() {
        this.upgrades  = {
            "doubleJump": 0,
            "dash": 0,
        };
        this.cooldowns = {
            "doubleJump": 0,
            "dash": 0,
        };
    }
    update() {

    }
    draw() {
        const ctx = gameEngine.ctx;
        ctx.fillStyle = "white";
        ctx.font = "12pt serif";
        const char = gameEngine.mainCharacter;
        const coords =  char.location;
        ctx.fillText(`${Math.floor(coords.x)}, ${Math.floor(coords.y)} ${char.falling}`, 0, 12);
    }
}