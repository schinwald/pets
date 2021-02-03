import { Pet } from "../entities/pets/Pet";
import { Room, TileData } from "../Room";

import GameObject = Phaser.GameObjects.GameObject;
import Scene = Phaser.Scene;
import Sprite = Phaser.GameObjects.Sprite;
import Point = Phaser.Geom.Point;



export class Wall extends GameObject implements TileData {

	public room: Room;

	private sprite: Sprite;
	private bits: number;


	constructor(scene: Scene) {
		super(scene, 'wall');
	}


	interact(pet: Pet) {
		throw new Error("Method not implemented.");
	}


	public create(coordinate: Point) {
		this.sprite = new Sprite(this.scene, coordinate.x, coordinate.y, 'objects');
		this.sprite.setFrame('object-wall-05');
		this.sprite.setDisplayOrigin(16, 32);
		this.sprite.setDepth(coordinate.y);
		this.scene.add.existing(this.sprite);
	}


	public setRoom(room: Room) {
		this.room = room;
	}


	public place(position: Point) {
		if (this.room == null) return;
		if (this.room.getTile(position) == null) return; 
		if (this.room.getTile(position).getData() != null) return;

		// clockwise adjacent positions
		// binary number representation is read in this way too
		let adjacents = new Array<Point>();
		adjacents[0] = new Point(position.x + 0, position.y - 1);
		adjacents[1] = new Point(position.x + 1, position.y + 0);
		adjacents[2] = new Point(position.x + 0, position.y + 1);
		adjacents[3] = new Point(position.x - 1, position.y + 0);

		// calculate appropriate frame using marching squares
		let bits = 0;
		for (let i = 0; i < 4; i++) {
			let adjacent = adjacents[i];

			bits = bits << 1;

			if (this.room.getTile(adjacent) == null) continue;
			if (this.room.getTile(adjacent).getData() == null) continue;
			if (this.room.getTile(adjacent).getData().type != "wall") continue;

			let adjacentWall = this.room.getTile(adjacent).getData() as Wall;
			let adjacentBits = adjacentWall.getFrame();

			let mask = 0;
			if (i == 0) mask = Math.pow(2, 1);
			if (i == 1) mask = Math.pow(2, 0);
			if (i == 2) mask = Math.pow(2, 3);
			if (i == 3) mask = Math.pow(2, 2);

			adjacentBits = adjacentBits | mask;
			adjacentWall.setFrame(adjacentBits);

			bits += 1;
		}

		this.room.setTile(position, this, true);
		this.setFrame(bits);

		let tile = this.room.getTile(position);
		this.sprite.copyPosition(tile.getCoordinate());
		this.sprite.setDepth(tile.getCoordinate().y);
	}


	public setFrame(bits: number) {
		this.bits = bits;
		let padding = '0' + bits;
		let frame = padding.substr(padding.length-2);
		this.sprite.setFrame('object-wall-' + frame);
	}

	
	public getFrame(): number {
		return this.bits;
	}
}