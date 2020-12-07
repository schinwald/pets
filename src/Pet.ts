import { Tilemaps } from "phaser";
import { Health } from "./Health";

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
		this.scene.add.existing(this.sprite);
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

	public move(path: Path) {
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