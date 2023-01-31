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
    gameEngine.addEntity(new VictoryBlock(...level.victory));
    // add player back at specified location
    gameEngine.mainCharacter = new MainCharacter({
        row: 2,
        mode: "RUN",
        location: level.entryPoint,
        scale: 2
    });
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
        // runOfBlocks(sxCol, syRow, row, col, runLength, horizontal = true, collision = false, canfall = false, heavy = false) 
        blocks: [
            ...frame(8, 2),
            [0, 0, 2, 3, 1, false, true, true, false],   // lone example block
            [0, 0, 3, 11, 3, true, true, true, false], // few blocks together for collision testing
        ],
        victory: [14, 2],
        entryPoint: { x: 64 * 4, y: 64 * 2 },
    },
    1: {
        background: [7, 0],
        blocks: [
            ...frame(8, 2),
            [0, 0, 3, 11, 4, true, true, true, false], // few blocks together for collision testing
        ],
        victory: [11, 9],
        entryPoint: { x: 64*4, y: 64 * 2}      
    },
    2: {
        background: [6, 0],
        blocks: [
            ...frame(0, 3),
            [0, 0, 3, 11, 4, true, true, true, false], // few blocks together for collision testing
        ],
        victory: [11, 8],
        entryPoint: { x: 64*1, y: 64 * 8}      
    },
    3: {
        background: [5, 0],
        blocks: [
            ...frame(0, 3),
            [0, 0, 3, 11, 4, true, true, true, false], // few blocks together for collision testing
        ],
        victory: [10, 10],
        entryPoint: { x: 64*4, y: 64 * 8}      
    },
    4: {
        background: [4, 0],
        blocks: [
            ...frame(0, 3),
            [0, 0, 3, 11, 4, true, true, true, false], // few blocks together for collision testing
        ],
        victory: [10, 10],
        entryPoint: { x: 64*4, y: 64 * 2}      
    },
    5: {
        background: [3, 0],
        blocks: [
            ...frame(0, 3),
            [0, 0, 3, 11, 4, true, true, true, false], // few blocks together for collision testing
        ],
        victory: [10, 10],
        entryPoint: { x: 64*4, y: 64 * 2}      
    }
}