import { Pet } from "../entities/pets/Pet";
import { TileData } from "../Room";

import GameObject = Phaser.GameObjects.GameObject;
import Scene = Phaser.Scene;
import Sprite = Phaser.GameObjects.Sprite;
import Point = Phaser.Geom.Point;



export class Grave extends GameObject implements TileData {

	private sprite: Sprite;


	constructor(scene: Scene, type: string) {
		super(scene, type);
	}


	interact(pet: Pet) {
		throw new Error("Method not implemented.");
	}


	public create(coordinate: Point) {
		this.sprite = new Sprite(this.scene, coordinate.x, coordinate.y, 'objects');
		this.sprite.setFrame('object-grave-05');
		this.sprite.setDisplayOrigin(16, 32);
		this.sprite.setDepth(coordinate.y);
		this.scene.add.existing(this.sprite);
	}


	public play(key: string): Sprite {
		return this.sprite.play(this.type + '-' + key);
	}
}