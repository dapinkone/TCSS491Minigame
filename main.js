const gameEngine = new GameEngine();
let camera = {x: 0, y: 0};
const ASSET_MANAGER = new AssetManager();
let assetNames = [
	'characters.png',
	'basicLevelMapImage.png',
	'level0.png',
	'level1.png',
	'level2.png',
	//'level3.png',
	'level7.png',
];
for(const name of assetNames)
	ASSET_MANAGER.queueDownload("assets/" + name);

ASSET_MANAGER.downloadAll(() => {
	const canvas = document.getElementById("gameWorld");
	const ctx = canvas.getContext("2d");
	document.getElementById('loc').textContent=document.URL;
	gameEngine.init(ctx);
	loadLevel(levels.current);
	gameEngine.start();
});
