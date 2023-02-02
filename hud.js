class HUD {
    static instance;
    constructor() {
        if(HUD.instance !== undefined) return HUD.instance;
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
        
    }
}