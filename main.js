const gameEngine = new GameEngine();
window.addEventListener("keydown", event => {
	if(event.key == "Escape") gameEngine.togglePause();
});
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
	'level8.png',
	'levelX.png',
	'levelY.png',
];
for(const name of assetNames)
	ASSET_MANAGER.queueDownload("assets/" + name);

resizeCanvas = (event) => {
	const canvas = document.getElementById("gameWorld");
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
}

ASSET_MANAGER.downloadAll(() => {
	const canvas = document.getElementById("gameWorld");
	const ctx = canvas.getContext("2d");
	gameEngine.init(ctx);

	window.onresize = resizeCanvas;
	resizeCanvas();
	loadLevel(levels.current);
	gameEngine.start();
	gameEngine.pause(); // so we see the pause screen and controls on start.
});
