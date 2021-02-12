import { Pet } from "../entities/pets/Pet";
import { Room, Tile, TileData } from "../Room";

import GameObject = Phaser.GameObjects.GameObject;
import Scene = Phaser.Scene;
import Sprite = Phaser.GameObjects.Sprite;
import Point = Phaser.Geom.Point;



export class Wall extends GameObject implements TileData {

	public room: Room;

	private position: Point;
	private sprite: Sprite;


	constructor(scene: Scene, type: string) {
		super(scene, type);
		this.position = null;
	}


	interact(pet: Pet) {
		throw new Error("Method not implemented.");
	}


	public create(coordinate: Point) {
		this.sprite = new Sprite(this.scene, coordinate.x, coordinate.y, 'objects');
		this.sprite.setFrame('wall-' + this.type + '-00');
		this.sprite.setDisplayOrigin(16, 32);
		if (this.type == 'vertical') {
			this.sprite.setDepth(coordinate.y + Tile.SIZE/2);
		} else if (this.type == 'horizontal') {
			this.sprite.setDepth(coordinate.y);
		}
		this.scene.add.existing(this.sprite);
	}


	public setRoom(room: Room) {
		this.room = room;
	}


	public place(position: Point): boolean {
		this.position = position;

		let added = false;

		if (this.type == 'horizontal') {
			let below = this.room.getTile(new Point(position.x, position.y + 0.5));
			if (below != null && below.walls[0] == null) {
				below.walls[0] = this;
				added = true;
			}
	
			let above = this.room.getTile(new Point(position.x, position.y - 0.5));
			if (above != null && above.walls[2] == null) {
				above.walls[2] = this;
				added = true;
			}
		} else if (this.type == 'vertical') {
			let right = this.room.getTile(new Point(position.x + 0.5, position.y));
			if (right != null && right.walls[3] == null) {
				right.walls[3] = this;
				added = true;
			}

			let left = this.room.getTile(new Point(position.x - 0.5, position.y));
			if (left != null && left.walls[1] == null) {
				left.walls[1] = this;
				added = true;
			}
		}

		return added;
	}

	public destroy() {
		if (this.sprite != null) this.sprite.destroy();
	}
}