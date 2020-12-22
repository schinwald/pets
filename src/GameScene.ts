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
			key: 'dinosaur-idle',
			frames: this.anims.generateFrameNames('pets', { prefix: 'dinosaur-idle-', start: 0, end: 3, zeroPad: 2 }),
			frameRate: 4,
			repeat: -1
		});

		this.anims.create({
			key: 'dinosaur-walk',
			frames: this.anims.generateFrameNames('pets', { prefix: 'dinosaur-walk-', start:0, end: 5, zeroPad: 2 }),
			frameRate: 8,
			repeat: -1
		});

		this.anims.create({
			key: 'dinosaur-sleep',
			frames: this.anims.generateFrameNames('pets', { prefix: 'dinosaur-sleep-', start: 0, end: 3, zeroPad: 2 }),
			frameRate: 4,
			repeat: -1
		});

		this.anims.create({
			key: 'bird-idle',
			frames: this.anims.generateFrameNames('pets', { prefix: 'bird-idle-', start: 0, end: 3, zeroPad: 2 }),
			frameRate: 4,
			repeat: -1
		});

		this.anims.create({
			key: 'bird-walk',
			frames: this.anims.generateFrameNames('pets', { prefix: 'bird-walk-', start:0, end: 5, zeroPad: 2 }),
			frameRate: 8,
			repeat: -1
		});

		this.anims.create({
			key: 'bird-sleep',
			frames: this.anims.generateFrameNames('pets', { prefix: 'bird-sleep-', start: 0, end: 3, zeroPad: 2 }),
			frameRate: 4,
			repeat: -1
		});

		this.room = new Room(this, {
			gridConfig: {
				dimensions: new Dimensions(10, 10)
			}
		});

		this.room.create();

		for (let i = 0; i < 2; i++) {
			let random = Math.random();

			if (random >= 0.50) {
				this.room.invite(new Pet(this, 'dinosaur'));
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
