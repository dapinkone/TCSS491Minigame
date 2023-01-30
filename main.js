const gameEngine = new GameEngine();

const ASSET_MANAGER = new AssetManager();
ASSET_MANAGER.queueDownload("assets/characters.png");

const buildBackground = (sx, sy) => {
	// NOTE: canvas is 1024x768 pixes, 16x12 blocks in dimension
	const ctx = gameEngine.ctx;
	//ctx.save();
	//ctx.globalAlpha = 0.1; // 50% opacity to dim out blocks?
	
	for(const col of Array(16).keys()) {
		for(const row of Array(12).keys()) {
			gameEngine.addEntity(new Block(sx, sy, col*Block.blockwidth, row*Block.blockwidth));
		}
	}
	ctx.restore();
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
	for(const col of Array(16).keys()) { // draw some ground
		gameEngine.addEntity(new Block(8*16, 2*16, col*Block.blockwidth, 0*Block.blockwidth, true, false)); // top row
		gameEngine.addEntity(new Block(8*16, 2*16, col*Block.blockwidth, 11*Block.blockwidth, true, false)); // bottom row
	}
	for(const row of Array(10).keys()) {
		gameEngine.addEntity(new Block(8*16, 2*16, 0*Block.blockwidth, (row+1)*Block.blockwidth, true, false)); // left col
		gameEngine.addEntity(new Block(8*16, 2*16, 15*Block.blockwidth, (row+1)*Block.blockwidth, true, false)); // right col
	}
	gameEngine.addEntity(gameEngine.mainCharacter);
	
	gameEngine.start();
});
