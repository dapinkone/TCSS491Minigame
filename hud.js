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
        //ctx.fillText(`${Math.floor(coords.x)}, ${Math.floor(coords.y)} ${char.falling}`, 0, 12);

        const gameTime = Math.floor(gameEngine.timer.gameTime);
        const seconds = String(gameTime % 60).padStart(2, '0');
        const mins = Math.floor(gameTime / 60);
        const canvasWidth = gameEngine.ctx.canvas.canvasWidth;
        ctx.fillText(`${mins}:${seconds}`, 0 , 12);

              // health bar.
              const maxHP = gameEngine.mainCharacter.maxHP;
              const missingHealth = maxHP - gameEngine.mainCharacter.HP;
              const barHeight = maxHP*20;
              const startY = Math.floor(gameEngine.ctx.canvas.height/2 - barHeight/2);
              ctx.fillStyle = "grey"; // grey border
              gameEngine.ctx.fillRect(10, startY, 36, barHeight);
              ctx.fillStyle = "red";
              // shift down by missing heatlh, so HP bar fills from bottom.
              gameEngine.ctx.fillRect(13, startY + 2 + (20*missingHealth), 30, 19*this.HP);
    }
}