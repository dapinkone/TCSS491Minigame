const buildBackground = (sxCol, syRow) => {
	// NOTE: canvas is 1024x768 pixes, 16x12 blocks in dimension
	const ctx = gameEngine.ctx;
	//ctx.save();
	//ctx.globalAlpha = 0.1; // 50% opacity to dim out blocks?
	for(const row of Array(12).keys()) {
		runOfBlocks(sxCol, syRow, row, 0, 16);
	}
	ctx.restore();
}
const runOfBlocks = (sxCol, syRow, row, col, runLength, horizontal=true, collision = false, canfall=false, heavy = false) => {
	for(const i of Array(runLength).keys()) { // draw some ground
		const colModifier = horizontal ? i : 0;
		const rowModifier = horizontal ? 0 : i;
		gameEngine.addEntity(new Block(
			sxCol*16, syRow*16,
			(col + colModifier) * Block.blockwidth,
			(row + rowModifier) *Block.blockwidth,
			collision, canfall, heavy));
	}
}
const levels = {
    0: () => {
        buildBackground(2,0);
        // building a frame around the sides:
        runOfBlocks(8,2, 0, 0, 16, true, true, false, false);
        runOfBlocks(8,2, 11, 0, 16, true, true, false, false);
        runOfBlocks(8,2, 0, 0, 12, false, true, false, false);
        runOfBlocks(8,2, 0, 15, 12, false, true, false, false);
        runOfBlocks(0, 0, 2, 3, 1, false, true, true, false);
        // steps
	    runOfBlocks(0, 0, 3, 11, 3, true, true, true, false);
        gameEngine.addEntity(new VictoryBlock(14, 2));
        gameEngine.addEntity(gameEngine.mainCharacter); // want MC to render last(in front);
    },
    1: () => {

    }
}
