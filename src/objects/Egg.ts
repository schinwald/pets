import { Tilemaps } from "phaser";
import { Pet } from "../entities/pets/Pet";
import { Progress } from "../Progress";
import { Room, Tile, TileData } from "../Room";

import GameObject = Phaser.GameObjects.GameObject;
import Sprite = Phaser.GameObjects.Sprite;
import Scene = Phaser.Scene;
import Point = Phaser.Geom.Point;
import Rectangle = Phaser.Geom.Rectangle;
import TimerEvent = Phaser.Time.TimerEvent;


class Egg extends GameObject implements TileData {

	public room: Room;

	private sprite: Sprite;
	private explosion: Sprite;

	private position: Point;


	constructor(scene: Scene) {
		super(scene, 'egg');
		this.init();
	}


	interact(pet: Pet) {
		throw new Error("Method not implemented.");
	}


	private init() {

	}


	public create(coordinate: Point) {
		let layers = 2;

		this.sprite = new Sprite(this.scene, coordinate.x, coordinate.y, 'objects');
		this.sprite.setFrame('egg-enter-05');
		this.sprite.setDisplayOrigin(16, 32);
		this.sprite.setDepth(coordinate.y + 1 / layers);
		this.scene.add.existing(this.sprite);

		this.explosion = new Sprite(this.scene, coordinate.x, coordinate.y, 'objects');
		this.explosion.setDisplayOrigin(16, 32);
		this.explosion.setDepth(coordinate.y + 0 / layers);
		// this.explosion.setFrame('explosion-01-00');
		this.explosion.setVisible(false);
		this.explosion.setAlpha(0.5);
		this.scene.add.existing(this.explosion);

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
				if (!this.sprite.anims.isPlaying) {
					this.play('shake');
				}
			}
		});

		let timer = new TimerEvent({
			delay: 10000,
			callback: () => {
				this.play('crack');
				let pet = new Pet(this.scene, 'dinosaur');
				this.room.invite(pet);
				pet.place(this.position);
				this.sprite.once('animationcomplete', () => {
					this.scene.tweens.add({
						targets: this.sprite,
						alpha: { from: 1, to: 0 },
						ease: 'Linear',
						duration: 500,
						onComplete: () => {
							this.destroy();
						}
					});
				})
			}
		})

		this.scene.time.addEvent(timer);
	}


	public play(key: string) {
		switch (key) {
			case 'enter':
				this.sprite.play(this.type + '-enter');
				break;
			case 'shake':
				this.sprite.play(this.type + '-shake');
				break;
			case 'crack':
				this.explosion.play('explosion-01');
				this.sprite.play(this.type + '-crack');
				break;
		}
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
		this.explosion.destroy();
	}
}



export { Egg };