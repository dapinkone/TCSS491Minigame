const gameEngine = new GameEngine();

const ASSET_MANAGER = new AssetManager();
ASSET_MANAGER.queueDownload("assets/characters.png");


ASSET_MANAGER.downloadAll(() => {
	const canvas = document.getElementById("gameWorld");
	const ctx = canvas.getContext("2d");


	document.getElementById('loc').textContent=document.URL;
	gameEngine.init(ctx);
	//gameEngine.addEntity(gameEngine.example = new Block(0, 0, 2*Block.blockwidth, 3*Block.blockwidth, true, true));
	loadLevel(0);

	//gameEngine.addEntity(new VictoryBlock(14, 2)); // victory present?
	//gameEngine.addEntity(gameEngine.mainCharacter);
	gameEngine.start();
});
