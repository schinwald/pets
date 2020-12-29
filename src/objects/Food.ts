import { Room, Tile } from "../Room";

import GameObject = Phaser.GameObjects.GameObject;
import Sprite = Phaser.GameObjects.Sprite;
import Scene = Phaser.Scene;
import Point = Phaser.Geom.Point;



class Food extends GameObject {

	private sprite: Sprite;
	private value: number;
	private room: Room;

	
	constructor(scene: Scene, type: string) {
		super(scene, type);
		this.init();
	}


	private init() {
		this.value = 0;
	}


	public create(coordinate: Point) {
		this.sprite = new Sprite(this.scene, coordinate.x, coordinate.y, 'objects');
		this.sprite.setFrame('food-empty');
		this.sprite.setDisplayOrigin(16, 32);
		this.scene.add.existing(this.sprite);
	}


	public setValue(value: number) {
		this.value = value;

		if (this.value > 66) {
			this.sprite.setFrame('food-full');
		} else if (this.value > 33) {
			this.sprite.setFrame('food-half');
		} else if (this.value > 0) {
			this.sprite.setFrame('food-empty');
		}
	}


	public getValue(): number {
		return this.value;
	}
}



export { Food };