
const runOfBlocks = (sxCol, syRow, row, col, runLength, horizontal = true, collision = false, canfall = false, heavy = false) => {
    // use a run-length encoding to build the levels a row or column at a time
    for (const i of Array(runLength).keys()) { // draw some ground
        const colModifier = horizontal ? i : 0;
        const rowModifier = horizontal ? 0 : i;
        gameEngine.addEntity(new Block(
            sxCol * 16, syRow * 16,
            (col + colModifier) * Block.blockwidth,
            (row + rowModifier) * Block.blockwidth,
            collision, canfall, heavy));
    }
}
const buildBackground = (sxCol, syRow) => {
    // NOTE: canvas is 1024x768 pixes, 16x12 blocks in dimension
    const ctx = gameEngine.ctx;
    //ctx.save();
    //ctx.globalAlpha = 0.1; // 50% opacity to dim out blocks?
    
    for (const row of Array(12).keys()) {
        runOfBlocks(sxCol, syRow, row, 0, 16);
    }
    ctx.restore();
}
let courseMap;
function loadLevel(levelnum) {
    // clear entities
    gameEngine.clearEntities();

    const level = levels[levelnum];
    // background
    buildBackground(...level.background);
    if (level.levelMap) loadLevelFromMap(level.levelMap);
    else {
        // runs of blocks ( design is run-length-encoded)
        for (const run of level.blocks) {
            runOfBlocks(...run);
        }
        if (level.movers) for (const mover of level.movers) {
            gameEngine.addEntity(new Mover(...mover));
        }
        gameEngine.addEntity(new VictoryBlock(...level.victory));
    }
    // add player back at specified location
    gameEngine.mainCharacter = new MainCharacter({
        row: 2,
        mode: "RUN",
        location: level.entryPoint,
        scale: 2
    });
    gameEngine.addEntity(new HUD());
    gameEngine.addEntity(gameEngine.mainCharacter);
}

function loadLevelFromMap(levelMap) {
    // TODO: code cleanup, add "heavy", "phantom" blocks, as well as entry point
    console.log("loading level from ", levelMap);
    courseMap = new class {
        constructor() {
            this.img = ASSET_MANAGER.getAsset(levelMap);
            //ctx.drawImage(this.sheet, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight);
            gameEngine.ctx.drawImage(this.img, 0, 0);
            this.imgdata = gameEngine.ctx.getImageData(0, 0, this.img.width, this.img.height);
            this.width = this.img.width;
            this.height = this.img.height;
            this.pixels = this.chunk(
                this.chunk(this.imgdata.data, 4), // chunk data by pixel(rgba values)
                this.img.width // chunk pixels by row
            );
        }
        chunk(xs, chunkSize) {
            console.log("chunking ", xs.length, " by ", chunkSize);
            return [...Array(Math.ceil(xs.length / chunkSize)).keys()]
                .map(i => xs.slice(i * chunkSize, (i + 1) * chunkSize))
        }
        draw() { }
        update() { }
    }();
    const pixelEq = (a, b) => a && b && a.length == b.length && [...Array(a.length).keys()]
        .every(i => a[i] == b[i]);

    courseMap.draw();
    // some syntax sugar for looking for different blocks trying to separate data from logic.
    const isMover = p => pixelEq(p, [255, 255, 0, 255]); // movers are yellow
    const isFrame = p => pixelEq(p, [0, 0, 0, 255]);     // "frame" is black
    const isPlatform = p => pixelEq(p, [255, 0, 0, 255]); // platforms are red.
    const isVictory = p => pixelEq(p, [0, 255, 0, 255]); // victory block (green)
    const isNOP = p => pixelEq(p, [0,0,0,0] ) || pixelEq(p, [255,255,255,255]); // white/transparent is NOP
    
    for (let row = 0; row < courseMap.height; row++) {
        let runStart = 0;
        let runType = courseMap.pixels[row][0];
        for (let col = 1; col <= courseMap.width; col++) {
            const pixel = courseMap.pixels[row][col];
            // row, col
            if(!pixelEq(pixel, runType)) {
                let runStop = col;
                // build the run of blocks
                //runOfBlocks(sxCol, syRow, row, col, runLength, horizontal = true, collision = false, canfall = false, heavy = false) => {
                console.log("run of length", runStop, runStart, " type ", runType);
                if(isMover(runType)) {
                    gameEngine.addEntity(new Mover(row, runStart, col - 1));
                } else if (isFrame(runType)) { // frame (black)
                    runOfBlocks(8, 2, row, runStart, runStop - runStart, true, true);
                }
                else if (isPlatform(runType)) { // platform(red)
                    runOfBlocks(0, 1, row, runStart, runStop - runStart, true, true);
                } else if (isVictory(runType)) { 
                    gameEngine.addEntity(new VictoryBlock(row, col - 1));
                }  else {
                    //console.log("unknown pixel: ", pixel);
                }

                // starting a new run
                runStart = col;
                runType = pixel;
            }
        }
    }
}
const frame = (sxCol, syRow) => [
    [sxCol, syRow, 0, 0, 16, true, true, false, false], // building a frame around the sides:
    [sxCol, syRow, 11, 0, 16, true, true, false, false],
    [sxCol, syRow, 0, 0, 12, false, true, false, false],
    [sxCol, syRow, 0, 15, 12, false, true, false, false],
]; // end of frame

const levels = {
    current: 0,
    0: {
        background: [8, 0],
        /*blocks: [
            ...frame(8, 2),
            [0, 1, 3, 13, 8, false, true],// vertical bar
            [0, 1, 3, 11, 1, false, true],
            [0, 1, 5, 9, 1, false, true],
            [0, 1, 7, 7, 1, false, true], // floating steps
            [0, 1, 9, 5, 1, false, true],
        ],

        victory: [10, 14],*/
        levelMap: "./assets/level0.png",
        entryPoint: { x: 64 * 1, y: 64 * 10 }// entrypoint at bottom
    },
    1: {
        background: [6, 0],
        /*blocks: [
            ...frame(8, 2),

            [0, 1, 4, 11, 1, false, true],
            [0, 1, 4, 9, 1, false, true],
            [0, 1, 4, 7, 1, false, true],
            [0, 1, 4, 5, 1, false, true],
            [0, 1, 4, 3, 1, false, true],
            [0, 1, 5, 1, 1, false, true],
            [0, 1, 7, 3, 1, false, true],
            [0, 1, 9, 1, 1, false, true],

            [0, 1, 3, 13, 8, false, true], // vertical bar
        ],
        victory: [10, 14],*/
        levelMap: "./assets/level1.png",
        entryPoint: { x: 64 * 1, y: 64 * 8 }
    },
    2: {
        background: [7, 0],
        // runOfBlocks(sxCol, syRow, row, col, runLength, horizontal = true, collision = false, canfall = false, heavy = false) 
        /*blocks: [
            ...frame(8, 2),
            [0, 0, 2, 3, 1, false, true, true, false],   // lone example block
            [0, 0, 3, 11, 3, true, true, true, false], // few blocks together for collision testing
        ],
        movers: [
            [5, 5, 14],
            [7, 1, 10],
            [9, 3, 12],
        ],
        victory: [2, 14],*/
        levelMap: './assets/level2.png',
        entryPoint: { x: 64 * 1, y: 64 * 10 }// entrypoint at bottom
    },

    3: {
        background: [5, 0],
        blocks: [
            ...frame(8, 2),
            [0, 0, 3, 11, 4, true, true, true, false], // few blocks together for collision testing
        ],
        victory: [10, 10],
        entryPoint: { x: 64 * 4, y: 64 * 8 }
    },
    4: {
        background: [4, 0],
        blocks: [
            ...frame(8, 2),
            [0, 0, 3, 11, 4, true, true, true, false], // few blocks together for collision testing
        ],
        victory: [10, 10],
        entryPoint: { x: 64 * 4, y: 64 * 2 }
    },
    5: {
        background: [3, 0],
        blocks: [
            ...frame(8, 2),
            [0, 0, 3, 11, 4, true, true, true, false], // few blocks together for collision testing
        ],
        victory: [10, 10],
        entryPoint: { x: 64 * 4, y: 64 * 2 }
    },
    6: {
        background: [30, 2],
        blocks: [
            ...frame(8, 2),
            [0, 0, 3, 11, 4, true, true, true, false], // few blocks together for collision testing
        ],
        victory: [10, 10],
        entryPoint: { x: 64 * 4, y: 64 * 2 }
    },
    7: {
        background: [0, 0],
        entryPoint: { x: 64 * 4, y: 64 * 2 },
        levelMap: './assets/level7.png',
    },
    8: {
        background: [0, 0],
        entryPoint: {x: 64, y: 64},
        levelMap: './assets/level8.png',
    }
    

}