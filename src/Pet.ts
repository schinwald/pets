import { Health } from "./Health";
import { Room } from "./Room";
import { PathDebugger } from "./Debug";

import Scene = Phaser.Scene;
import Sprite = Phaser.GameObjects.Sprite;
import Point = Phaser.Geom.Point;
import PathFollower = Phaser.GameObjects.PathFollower;
import Path = Phaser.Curves.Path;
import Map = Phaser.Structs.Map;



class Pet {
	private scene: Scene;
	private type: string;
	private sprite: Sprite;
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
		this.sprite = new Sprite(this.scene, 12, 12, 'pet');
		this.sprite.play(this.type + '-idle');
		this.sprite.setOrigin(0, 0);
		this.sprite.setDepth(2);
		this.scene.add.existing(this.sprite);

		if (this.type == 'dino') this.pathDebugger = new PathDebugger(this.scene, 0x67b66b);
		if (this.type == 'bird') this.pathDebugger = new PathDebugger(this.scene, 0xffd300);
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
		if (path == null || path.getLength() == 0) return;

		this.position = position;
		this.pathDebugger.setPathFollower(this.movement);

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

		this.sprite.setPosition(this.movement.x, this.movement.y);
	}
}



export { Pet }