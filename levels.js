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
function loadLevel(levelnum) {
    // clear entities
    gameEngine.clearEntities();
    const level = levels[levelnum];
    // background
    buildBackground(...level.background);
    // runs of blocks ( design is run-length-encoded)
    for (const run of level.blocks) {
        runOfBlocks(...run);
    }
    if(level.movers) for(const mover of level.movers) {
        gameEngine.addEntity(new Mover(...mover));
    }
    gameEngine.addEntity(new VictoryBlock(...level.victory));
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
        blocks: [
            ...frame(8, 2),
            [0, 1, 3, 13, 8, false, true],
            [0, 1, 3, 11, 1, false, true],
            [0, 1, 5, 9, 1, false, true],
            [0, 1, 7, 7, 1, false, true], // floating steps
            [0, 1, 9, 5, 1, false, true],
        ],

        victory: [10, 14],
        entryPoint: { x: 64 * 1, y: 64 * 10 }// entrypoint at bottom
    },
    1: {
        background: [7, 0],
        // runOfBlocks(sxCol, syRow, row, col, runLength, horizontal = true, collision = false, canfall = false, heavy = false) 
        blocks: [
            ...frame(8, 2),
            [0, 0, 2, 3, 1, false, true, true, false],   // lone example block
            [0, 0, 3, 11, 3, true, true, true, false], // few blocks together for collision testing
        ],
        movers: [
            [5, 5, 14],
            [7, 1, 10],
            [9, 3, 12],
        ],
        victory: [ 2, 14],
        entryPoint: { x: 64 * 1, y: 64 * 10 }// entrypoint at bottom
    },
    2: {
        background: [6, 0],
        blocks: [
            ...frame(8, 2),
            [0, 0, 3, 11, 4, true, true, true, false], // few blocks together for collision testing
        ],
        victory: [8,11],
        entryPoint: { x: 64 * 1, y: 64 * 8 }
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
    }
}