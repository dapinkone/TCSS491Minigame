const gameEngine = new GameEngine();

const ASSET_MANAGER = new AssetManager();
ASSET_MANAGER.queueDownload("assets/characters.png");

const buildBackground = (sx, sy) => {
	// NOTE: canvas is 1024x768 pixes, 16x12 blocks in dimension
	const ctx = gameEngine.ctx;
	//ctx.save();
	//ctx.globalAlpha = 0.1; // 50% opacity to dim out blocks?
	for(const row of Array(12).keys()) {
		runOfBlocks(sx, sy, row, 0, 16);
	}
	ctx.restore();
}
const runOfBlocks = (sx, sy, row, col, runLength, horizontal=true, collision = false, canfall=false, heavy = false) => {
	for(const i of Array(runLength).keys()) { // draw some ground
		const colModifier = horizontal ? i : 0;
		const rowModifier = horizontal ? 0 : i;
		gameEngine.addEntity(new Block(
			sx, sy,
			(col + colModifier) * Block.blockwidth,
			(row + rowModifier) *Block.blockwidth,
			collision, canfall, heavy)); // top row
	}
}
ASSET_MANAGER.downloadAll(() => {
	const canvas = document.getElementById("gameWorld");
	const ctx = canvas.getContext("2d");

	gameEngine.mainCharacter = new MainCharacter({
			row: 2,
			mode: "RUN",
			location: { x: 0, y: 64*2 },
			scale: 2
		});
	
	gameEngine.init(ctx);
	buildBackground(2*16, 0*16);	// NOTE: canvas is 16x12 blocks in dimension
	gameEngine.addEntity(gameEngine.example = new Block(0, 0, 2*Block.blockwidth, 3*Block.blockwidth, true, true));
	// building a frame around the sides:
	runOfBlocks(8*16,2*16, 0, 0, 16, true, true, false, false);
	runOfBlocks(8*16,2*16, 11, 0, 16, true, true, false, false);
	runOfBlocks(8*16,2*16, 0, 0, 12, false, true, false, false);
	runOfBlocks(8*16,2*16, 0, 15, 12, false, true, false, false);
	gameEngine.addEntity(gameEngine.mainCharacter);
	
	gameEngine.start();
});
