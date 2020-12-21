import { Pet } from './Pet';
import { Room } from './Room';

import Scene = Phaser.Scene;
import { Dimensions } from './Grid';



class GameScene extends Scene {

	private room: Room;


	constructor(config: object) {
		super(config);
	}
	

	public preload() {
		this.load.atlas('pets', './assets/sprites/pets.png', './assets/sprites/pets.json');
		this.load.glsl('ground', './assets/shaders/ground.glsl.js');
	}


	public create() {
		this.anims.create({
			key: 'dino-idle',
			frames: this.anims.generateFrameNames('pets', { prefix: 'pet/dino/idle/', start: 0, end: 3, zeroPad: 1 }),
			frameRate: 4,
			repeat: -1
		});

		this.anims.create({
			key: 'dino-walk',
			frames: this.anims.generateFrameNames('pets', { prefix: 'pet/dino/walk/', start:0, end: 5, zeroPad: 1 }),
			frameRate: 8,
			repeat: -1
		});

		this.anims.create({
			key: 'dino-sleep',
			frames: this.anims.generateFrameNames('pets', { prefix: 'pet/dino/sleep/', start: 0, end: 3, zeroPad: 1 }),
			frameRate: 4,
			repeat: -1
		});

		this.anims.create({
			key: 'bird-idle',
			frames: this.anims.generateFrameNames('pets', { prefix: 'pet/bird/idle/', start: 0, end: 3, zeroPad: 1 }),
			frameRate: 4,
			repeat: -1
		});

		this.anims.create({
			key: 'bird-walk',
			frames: this.anims.generateFrameNames('pets', { prefix: 'pet/bird/walk/', start:0, end: 5, zeroPad: 1 }),
			frameRate: 8,
			repeat: -1
		});

		this.anims.create({
			key: 'bird-sleep',
			frames: this.anims.generateFrameNames('pets', { prefix: 'pet/bird/sleep/', start: 0, end: 3, zeroPad: 1 }),
			frameRate: 4,
			repeat: -1
		});

		this.room = new Room(this, {
			gridConfig: {
				dimensions: new Dimensions(10, 10)
			}
		});

		this.room.create();

		for (let i = 0; i < 10; i++) {
			let random = Math.random();

			if (random >= 0.50) {
				this.room.invite(new Pet(this, 'dino'));
			} else {
				this.room.invite(new Pet(this, 'bird'));
			}
		}
	}


	public update(time: number, delta: number) {
		this.room.update(time, delta);
	}
}



export { GameScene };
