import 'phaser';

import { GameScene } from "./scenes/GameScene";



const config = {
    type: Phaser.AUTO,
	disableContextMenu: true,
	scale: {
		mode: Phaser.Scale.FIT,
		autoCentre: Phaser.Scale.CENTER_BOTH,
		parent: 'phaser-game',
		width: 128,
		height: 128,
		max: {
			width: 512,
			height: 512
		}
	},
	render: {
		transparent: true,
		pixelArt: true
	},
	scene: [GameScene]
};

new Phaser.Game(config);