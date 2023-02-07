const gameEngine = new GameEngine();

const ASSET_MANAGER = new AssetManager();
ASSET_MANAGER.queueDownload("assets/characters.png");


ASSET_MANAGER.downloadAll(() => {
	const canvas = document.getElementById("gameWorld");
	const ctx = canvas.getContext("2d");


	document.getElementById('loc').textContent=document.URL;
	gameEngine.init(ctx);
	loadLevel(levels.current);
	gameEngine.start();
});
