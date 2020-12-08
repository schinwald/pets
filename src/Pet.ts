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
import Graphics = Phaser.GameObjects.Graphics;
import Line = Phaser.Curves.Line;
import Vector2 = Phaser.Math.Vector2;



class Pet {
	private scene: Scene;
	private type: string;
	private sprite: Sprite;
	private shadow: Ellipse;
	private movement: PathFollower;
	private health: Health;
	private position: Point;
	private room: Room;

	private graphics: Graphics;
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
		this.scene.add.existing(this.sprite);

		this.shadow = new Ellipse(this.scene, Tile.SIZE/2, Tile.SIZE, Tile.SIZE/2, Tile.SIZE/4, 0x000000, 0.15);
		this.shadow.setOrigin(0.5, 0.5);
		this.scene.add.existing(this.shadow);

		if (this.type == 'dino') this.pathDebugger = new PathDebugger(this.scene, 0x67b66b);
		if (this.type == 'bird') this.pathDebugger = new PathDebugger(this.scene, 0xffd300);
		this.pathDebugger.setPathFollower(this.movement);
		this.graphics = new Graphics(this.scene);
		this.scene.add.existing(this.graphics);
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
		if (path == null || path.curves.length == 0) return;

		let adjustedPath = new Path();

		// set start of path
		if (this.movement.isFollowing()) {
			adjustedPath.startPoint = new Vector2(this.movement.pathVector);
		} else {
			adjustedPath.startPoint = path.curves[0].getStartPoint();
		}

		// set transitional curve
		if (this.movement.isFollowing()) {
			let a = new Vector2(this.movement.pathVector);
			let b = new Vector2(this.position);
			let line = new Line(a, b);
			adjustedPath.add(line);
		}
		
		// add all other curves
		for (let i = 0; i < path.curves.length; i++) {
			adjustedPath.add(path.curves[i]);
		}

		let speed = 15;
		this.movement.setPath(adjustedPath);
		this.movement.startFollow({
			duration: 1000 * path.getLength() * Tile.SIZE / speed,
			from: 0,
			to: 1,
			rotateToPath: true
		});
	}

	public update(time: number, delta: number) {
		this.movement.pathUpdate();
		this.pathDebugger.pathFollowerUpdate();
		this.graphics.clear();

		if (this.movement.isFollowing()) {
			let point = this.movement.pathVector;
			let angle = Math.round(this.movement.angle) % 360;
			if (angle < 0) angle += 360;

			if (angle == 0) {
				this.sprite.setFlipX(false);
				this.position.setTo(Math.ceil(point.x), Math.ceil(point.y));
			} else if (angle == 90) {
				this.position.setTo(Math.ceil(point.x), Math.ceil(point.y));
			} else if (angle == 180) {
				this.sprite.setFlipX(true);
				this.position.setTo(Math.floor(point.x), Math.floor(point.y));
			} else if (angle == 270) {
				this.position.setTo(Math.floor(point.x), Math.floor(point.y));
			}


			if (this.sprite.anims.getCurrentKey() != this.type + '-walk') {
				this.sprite.play(this.type + '-walk');
			}

			this.graphics.fillRect(this.position.x * Tile.SIZE + Tile.SIZE/4, this.position.y * Tile.SIZE + 3*Tile.SIZE/4, Tile.SIZE/2, Tile.SIZE/2);
		} else {
			if (this.sprite.anims.getCurrentKey() != this.type + '-idle') {
				this.sprite.play(this.type + '-idle');
			}
		}

		this.sprite.setPosition(this.movement.x * Tile.SIZE + Tile.SIZE/2, this.movement.y * Tile.SIZE + Tile.SIZE);
		this.shadow.setPosition(this.movement.x * Tile.SIZE + Tile.SIZE/2, this.movement.y * Tile.SIZE + Tile.SIZE);

		this.sprite.setDepth(this.position.y * 10 + 10);
		this.shadow.setDepth(this.position.y * 10 + 1);
	}
}



export { Pet }