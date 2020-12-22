import 'phaser';

import { GameScene } from "./GameScene";



const config = {
    width: 508,
    height: 508,
	zoom: 4,
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