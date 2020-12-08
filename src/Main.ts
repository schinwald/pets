import 'phaser';

import { GameScene } from "./GameScene";



const config = {
    width: 380,
    height: 380,
	zoom: 4,
    resolution: 1,
    type: Phaser.AUTO,
    parent: 'content',
	scene: [GameScene],
	scale: {
		mode: Phaser.Scale.FIT,
		autoCentre: Phaser.Scale.CENTER_BOTH
	},
	render: {
		transparent: true,
		pixelArt: true
	},
	disableContextMenu: true,
};

new Phaser.Game(config);