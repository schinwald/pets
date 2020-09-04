import 'phaser';

import { GameScene } from "./GameScene";



const config = {
    width: 780,
    height: 780,
    resolution: 1,
    type: Phaser.AUTO,
    parent: 'content',
	scene: [GameScene],
	render: {
		transparent: true,
		pixelArt: true
	}
};

new Phaser.Game(config);