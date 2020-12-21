import 'phaser';

import { GameScene } from "./GameScene";



const config = {
    width: 540,
    height: 540,
	zoom: 2,
    type: Phaser.AUTO,
    parent: 'content',
	scene: [GameScene],
	scale: {
		// mode: Phaser.Scale.FIT,
		// autoCentre: Phaser.Scale.CENTER_BOTH
	},
	render: {
		transparent: true,
		pixelArt: true
	},
	disableContextMenu: true,
};

new Phaser.Game(config);