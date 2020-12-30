import { Room } from './Room';
import { Pet } from './entities/pet/Pet';
import { Dimensions } from './Grid';

import Scene = Phaser.Scene;


class GameScene extends Scene {

	private room: Room;


	constructor(config: object) {
		super(config);
	}
	

	public preload() {		
		this.load.atlas('pets', './assets/sprites/pets.png', './assets/sprites/pets.json');
		this.load.atlas('emotes', './assets/sprites/emotes.png', './assets/sprites/emotes.json');
		this.load.atlas('objects', './assets/sprites/objects.png', './assets/sprites/objects.json');

		this.load.animation('dinosaur', './assets/animations/dinosaur.json');
		this.load.animation('bird', './assets/animations/bird.json');
		this.load.animation('emotes', './assets/animations/emotes.json');

		this.load.glsl('ground', './assets/shaders/ground.glsl.js');
	}


	public create() {
		this.input.setDefaultCursor('url(./assets/cursors/pointer.png) 32 64, pointer')


		this.room = new Room(this, {
			gridConfig: {
				dimensions: new Dimensions(5, 5)
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
