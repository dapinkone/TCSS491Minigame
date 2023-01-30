class BoundingBox {
    constructor({ width, height, location, color = "green" }) {
        Object.assign(this, { width, height, location, color });
        this.left = location.x;
        this.top = location.y;
        this.right = this.left + width;
        this.bottom = this.top + height;
    }
    // collision(other) {
    //     if (other == undefined) return false
    //     // check if any of the 4 corners exist within the other shape
    //     if (!other.getCorners) console.log("unknown collision type: ", other.constructor.name)
    //     const corners = this.getCorners();
    //     for (const point of Object.keys(corners)) {
    //         if (other.contains(corners[point])) {
    //             //console.log("collision ", other.constructor.name, point);
    //             return true;//point; // conveniently, most strings evalutate to true.
    //         }
    //     }
    //     return false;
    // }
    collision(other) {
        return (this.right >= other.left // other is on the left?
            && this.left <= other.right // other is on the right?
            && this.top <= other.bottom // other is below
            && this.bottom >= other.top); // other is above
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