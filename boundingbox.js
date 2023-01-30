class BoundingBox {
    constructor({ width, height, location, color = "green" }) {
        Object.assign(this, { width, height, location, color });
    }
    collision(other) {
        if (other == undefined) return false
        // check if any of the 4 corners exist within the other shape
        if (!other.getCorners) console.log("unknown collision type: ", other.constructor.name)
        const corners = other.getCorners();
        for (const point of Object.keys(corners)) {
            if (this.contains(corners[point])) {
                //console.log("collision ", other.constructor.name, point);
                return true;
            }
        }
        return false;
    }
    contains(point) {
        return (
            (this.location.y <= point.y && point.y <= this.location.y + this.height) && // y in bounds
            (this.location.x <= point.x && point.x <= this.location.x + this.width))  // x in bounds
    }
    getCorners() {
        // returns coordinates of the 4 corners of the bounding box
        return {
            topleft:this.location,                                                       // topleft
            topright:{ x: this.location.x + this.width, y: this.location.y },             // topright
            bottomleft:{ x: this.location.x, y: this.location.y + this.height },            // bottomleft
            bottomright:{ x: this.location.x + this.width, y: this.location.y + this.height } // bottomright
        };
    }
    updateLocation(location) {
        this.location = location;
    }
    draw() {
        const ctx = gameEngine.ctx;
        ctx.strokeStyle = this.color;
        ctx.strokeRect(this.location.x, this.location.y, this.width, this.height);
    }
}