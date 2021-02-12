import { Pet } from "../entities/pets/Pet";
import { Tile, TileData, Room } from '../Room';
import { Egg } from "./Egg";

import GameObject = Phaser.GameObjects.GameObject;
import Scene = Phaser.Scene;
import Sprite = Phaser.GameObjects.Sprite;
import Point = Phaser.Geom.Point;
import Rectangle = Phaser.Geom.Rectangle;



export class Grave extends GameObject implements TileData {

	private sprite: Sprite;

	private room: Room;
	private position: Point;


	constructor(scene: Scene) {
		super(scene, 'grave');
	}


	interact(pet: Pet) {
		throw new Error("Method not implemented.");
	}


	public create(coordinate: Point) {
		this.sprite = new Sprite(this.scene, coordinate.x, coordinate.y, 'objects');
		this.sprite.setFrame('grave-enter-05');
		this.sprite.setDisplayOrigin(16, 32);
		this.sprite.setDepth(coordinate.y);
		this.scene.add.existing(this.sprite);

		this.sprite.setInteractive({
			cursor: 'url(./assets/cursors/pointer.png) 5 5, pointer',
			hitArea: new Rectangle(5*Tile.SIZE/8, Tile.SIZE, 3*Tile.SIZE/4, Tile.SIZE),
			hitAreaCallback: Rectangle.Contains
		});

		this.sprite.on('pointerdown', (pointer) => {
			this.scene.input.setDefaultCursor('url(./assets/cursors/grabbing.png) 5 5, grabbing');
		});

		this.sprite.on('pointerup', (pointer) => {
			this.scene.input.setDefaultCursor('url(./assets/cursors/pointer.png) 5 5, pointer');
			
			if (pointer.leftButtonReleased()) {				
				let egg = new Egg(this.scene);
				egg.setRoom(this.room);
				egg.place(this.position);
				let tile = this.room.getTile(this.position);
				egg.create(tile.getCoordinate());
				egg.play('enter');

				this.scene.tweens.add({
					targets: this.sprite,
					alpha: { from: 1, to: 0 },
					ease: 'Linear',
					duration: 1000,
					onComplete: () => {
						this.destroy();
					}
				});

				this.sprite.removeInteractive();
			}
		});
	}


	public play(key: string): Sprite {
		return this.sprite.play(this.type + '-' + key);
	}


	public setRoom(room: Room) {
		this.room = room;
	}


	public place(position: Point) {
		if (this.room == null) return;

		this.position = position;
		this.room.setTile(position, this, false);
	}


	public destroy() {
		this.sprite.destroy();
	}
}