import { Pet } from "../entities/pet/Pet";
import { Progress } from "../Progress";
import { Room, Tile, TileData } from "../Room";

import GameObject = Phaser.GameObjects.GameObject;
import Sprite = Phaser.GameObjects.Sprite;
import Scene = Phaser.Scene;
import Point = Phaser.Geom.Point;



class Food extends GameObject implements TileData {

	public room: Room;

	private sprite: Sprite;
	private progress: Progress;


	constructor(scene: Scene, progress: Progress) {
		super(scene, 'food');
		this.progress = progress;
		this.init();
	}


	private init() {
		
	}


	public create(coordinate: Point) {
		this.sprite = new Sprite(this.scene, coordinate.x, coordinate.y, 'objects');
		this.sprite.setDisplayOrigin(16, 32);
		this.scene.add.existing(this.sprite);

		if (this.progress.getPercentage() > 50) {
			this.sprite.setFrame('object-food-full');
		} else if (this.progress.getPercentage() > 0) {
			this.sprite.setFrame('object-food-half');
		} else if (this.progress.getPercentage() == 0) {
			this.sprite.setFrame('object-food-empty');
		}
	}


	public interact(pet: Pet) {
		let progress = pet.health.getFactor('hunger');

		// account for overflow
		let remainder = this.progress.getCurrent() - progress.getCurrent();
		if (remainder >= 0) {
			// equal to the pets hunger
			this.progress.decrement(progress.getCurrent());
			progress.decrement(progress.getCurrent());
		} else {
			// less than the pets hunger
			this.progress.decrement(progress.getCurrent() + remainder);
			progress.decrement(progress.getCurrent() + remainder);
		}

		if (this.progress.getPercentage() > 66) {
			this.sprite.setFrame('object-food-full');
		} else if (this.progress.getPercentage() > 33) {
			this.sprite.setFrame('object-food-half');
		} else if (this.progress.getPercentage() > 0) {
			this.sprite.setFrame('object-food-empty');
		}
	}


	public setProgress(progress: Progress) {
		this.progress = progress;
	}


	public getProgress(): Progress {
		return this.progress;
	}
}



export { Food };