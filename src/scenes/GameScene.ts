import { Room } from '../Room';
import { Pet } from '../entities/pets/Pet';
import { Dimensions } from '../Grid';
import { Food } from '../objects/Food';
import { Progress } from '../Progress';

import Scene = Phaser.Scene;
import Point = Phaser.Geom.Point;


class GameScene extends Scene {

	private room: Room;


	constructor(config: object) {
		super(config);
	}
	

	public preload() {
		this.load.atlas('pets', './assets/sprites/pets.png', './assets/sprites/pets.json');
		this.load.atlas('emotes', './assets/sprites/emotes.png', './assets/sprites/emotes.json');
		this.load.atlas('objects', './assets/sprites/objects.png', './assets/sprites/objects.json');
		this.load.atlas('particles', './assets/sprites/particles.png', './assets/sprites/particles.json');

		this.load.animation('dinosaur', './assets/animations/dinosaur.json');
		this.load.animation('bird', './assets/animations/bird.json');
		this.load.animation('emotes', './assets/animations/emotes.json');
		this.load.animation('grave', './assets/animations/grave.json');

		this.load.glsl('ground', './assets/shaders/ground.glsl.js');
	}


	public create() {
		this.input.setDefaultCursor('url(./assets/cursors/pointer.png) 5 5, pointer')


		this.room = new Room(this, {
			gridConfig: {
				dimensions: new Dimensions(5, 5)
			}
		});
		
		this.room.create();

		let position = new Point(2, 2);
		let food = new Food(this, new Progress(100000, 100000));
		food.create(this.room.getTile(position).getCoordinate());
		this.add.existing(food);
		this.room.setTile(position, food, true);

		this.room.invite(new Pet(this, 'bird'));
		this.room.invite(new Pet(this, 'dinosaur'));
	}


	public update(time: number, delta: number) {
		this.room.update(time, delta);
	}
}



export { GameScene };
