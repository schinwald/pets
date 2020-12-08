import 'phaser';

import { GameScene } from "./GameScene";



const config = {
    width: 380,
    height: 380,
    resolution: 1,
    type: Phaser.AUTO,
    parent: 'content',
	scene: [GameScene],
	scale: {
		mode: Phaser.Scale.FIT,
		autoCentre: Phaser.Scale.CENTER_BOTH,
		autoRound: true
	},
	render: {
		transparent: true,
		pixelArt: true
	},
	disableContextMenu: true,
};

new Phaser.Game(config);