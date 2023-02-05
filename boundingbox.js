class BoundingBox {

    constructor({ width, height, location, color = "green", isMainBox = true }) {
        Object.assign(this, { width, height, location, color });
        this.left = location.x;
        this.top = location.y;
        this.right = this.left + width;
        this.bottom = this.top + height;
        if (isMainBox) {
            this.children = {
                // if we are the master box for the object, we create child boxes
                // for each quadrant(top, bottom, left, right)
                top: new BoundingBox({ width: width, height: height / 2, location, color, isMainBox: false }),
                bottom: new BoundingBox({
                    width: width,
                    height: height / 2,
                    location: { x: this.location.x, y: this.top + height / 2 },
                    color,
                    isMainBox: false,
                }),
                left: new BoundingBox({ width: width / 2, height: height, location, color, isMainBox: false }),
                right: new BoundingBox({
                    width: width / 2, height,
                    location: { x: this.location.x + this.width / 2, y: this.top },
                    color,
                    isMainBox: false
                }),
            };
        }

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
        return (this.right > other.left // other is on the left?
            && this.left < other.right // other is on the right?
            && this.top < other.bottom // other is below
            && this.bottom > other.top); // other is above
    }
    collisionSide(other) {
        let sides = {};
        // if (this.top < other.bottom) sides.add("bottom"); // other is below
        // else if (this.bottom > other.top) sides.add("top"); // other is above

        // if (this.right > other.left) sides.add("left"); // other is on the left?
        // else if (this.left < other.right) sides.add("right"); // other is on the right?
        for(const child of Object.keys(this.children)) {
            if(this.children[child].collision(other)) {
                sides[child] = true;
            }
        }
        if(sides["bottom"] && sides["top"]) { // side hit. top and bottom are aligned.
            delete sides["bottom"];
            delete sides["top"];
        }
        if(sides["left"] && sides["right"]) { // vertical hit. left/right are aligned.
            delete sides["left"];
            delete sides["right"];
        }

        return Object.keys(sides);
    }
    // contains(point) {
    //     return (
    //         (this.location.y <= point.y && point.y <= this.location.y + this.height) && // y in bounds
    //         (this.location.x <= point.x && point.x <= this.location.x + this.width))  // x in bounds
    // }
    // getCorners() {
    //     // returns coordinates of the 4 corners of the bounding box
    //     return {
    //         topleft: this.location,                                                       // topleft
    //         topright: { x: this.location.x + this.width, y: this.location.y },             // topright
    //         bottomleft: { x: this.location.x, y: this.location.y + this.height },            // bottomleft
    //         bottomright: { x: this.location.x + this.width, y: this.location.y + this.height } // bottomright
    //     };
    // }
    updateLocation(location) {
        this.location = location;
    }
    draw() {
        const ctx = gameEngine.ctx;
        ctx.strokeStyle = this.color;
        ctx.strokeRect(this.location.x, this.location.y, this.width, this.height);
        if(this.isMainBox) {
        for(const child of Object.values(this.children)) {
            child.draw();
        }
    }
    }

}