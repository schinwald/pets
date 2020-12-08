import { Health } from "./Health";
import { Room, Tile } from "./Room";
import { PathDebugger } from "./Debug";

import Scene = Phaser.Scene;
import Sprite = Phaser.GameObjects.Sprite;
import Point = Phaser.Geom.Point;
import PathFollower = Phaser.GameObjects.PathFollower;
import Ellipse = Phaser.GameObjects.Ellipse;
import Path = Phaser.Curves.Path;
import Map = Phaser.Structs.Map;



class Pet {
	private scene: Scene;
	private type: string;
	private sprite: Sprite;
	private shadow: Ellipse;
	private movement: PathFollower;
	private health: Health;
	private position: Point;
	private room: Room;

	private pathDebugger: PathDebugger;


	constructor(scene: Phaser.Scene, type: string) {
		this.scene = scene;
		this.type = type;
		this.init();
		this.create();
	}


	public init() {
		this.position = new Point(0, 0);
		this.movement = new PathFollower(this.scene, null, 0, 0, null);
	}


	public create() {
		this.sprite = new Sprite(this.scene, Tile.SIZE/2, Tile.SIZE, 'pet');
		this.sprite.play(this.type + '-idle');
		this.sprite.setOrigin(0.5, 1);
		this.sprite.setDepth(2);
		this.scene.add.existing(this.sprite);

		this.shadow = new Ellipse(this.scene, Tile.SIZE/2, Tile.SIZE, Tile.SIZE/2, Tile.SIZE/4, 0x000000, 0.15);
		this.shadow.setDepth(1);
		this.shadow.setOrigin(0.5, 0.5);
		this.scene.add.existing(this.shadow);

		if (this.type == 'dino') this.pathDebugger = new PathDebugger(this.scene, 0x67b66b);
		if (this.type == 'bird') this.pathDebugger = new PathDebugger(this.scene, 0xffd300);
		this.pathDebugger.setPathFollower(this.movement);
	}

	public setRoom(room: Room) {
		this.room = room;
	}

	public setPosition(position: Point) {
		this.position = position;
	}

	public getPosition(): Point {
		return this.position;
	}

	public getSprite(): Sprite {
		return this.sprite;
	}

	public move(position: Point) {
		let path = this.room.findPath(this.position, position);
		if (path == null || path.getPoints().length == 0) return;

		this.position = position;

		let speed = 15;
		this.movement.setPath(path);
		this.movement.startFollow({
			duration: 1000 * path.getLength() / speed,
			from: 0,
			to: 1,
			rotateToPath: true
		});
	}

	public update(time: number, delta: number) {
		this.movement.pathUpdate();
		this.pathDebugger.pathFollowerUpdate();

		if (this.movement.isFollowing()) {
			if (Math.abs(this.movement.angle) == 0) this.sprite.setFlipX(false);
			if (Math.abs(this.movement.angle) == 180) this.sprite.setFlipX(true);
			if (this.sprite.anims.getCurrentKey() != this.type + '-walk') {
				this.sprite.play(this.type + '-walk');
			}
		} else {
			if (this.sprite.anims.getCurrentKey() != this.type + '-idle') {
				this.sprite.play(this.type + '-idle');
			}
		}

		this.sprite.setPosition(this.movement.x + Tile.SIZE/2, this.movement.y + Tile.SIZE);
		this.shadow.setPosition(this.movement.x + Tile.SIZE/2, this.movement.y + Tile.SIZE);
	}
}



export { Pet }