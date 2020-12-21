import { Health } from "./Health";
import { Room, Tile } from "./Room";
import { GameObjects, Tilemaps } from 'phaser';

import Scene = Phaser.Scene;
import Sprite = Phaser.GameObjects.Sprite;
import Point = Phaser.Geom.Point;
import PathFollower = Phaser.GameObjects.PathFollower;
import Ellipse = Phaser.GameObjects.Ellipse;
import Path = Phaser.Curves.Path;
import Map = Phaser.Structs.Map;
import Graphics = Phaser.GameObjects.Graphics;
import Curves = Phaser.Curves;
import Geom = Phaser.Geom;
import Vector2 = Phaser.Math.Vector2;
import GameObject = Phaser.GameObjects.GameObject;
import Intersects = Phaser.Geom.Intersects;



class Pet extends GameObject {
	
	private sprite: Sprite;
	private shadow: Ellipse;
	private movement: PathFollower;
	private health: Health;
	private room: Room;
	private urges: Map<string, number>;

	private position: Point;
	private shortTermTarget: Point;
	private longTermTarget: Point;

	private debugger: Debugger;


	constructor(scene: Phaser.Scene, type: string) {
		super(scene, type);
		this.init();
	}


	private init() {
		this.movement = new PathFollower(this.scene, null, 0, 0, null);
		this.urges = new Map<string, number>(null);
		this.urges.set('walk', Math.random() * 150);
		this.urges.set('eat', 0);
		this.urges.set('poop', 0);
	}


	public create(position: Point) {
		this.shortTermTarget = position;
		this.position = new Point(position.x * Tile.SIZE + Tile.SIZE/2, position.y * Tile.SIZE + Tile.SIZE);

		this.sprite = new Sprite(this.scene, this.position.x, this.position.y, 'pet');
		this.sprite.play({key: this.type + '-idle', startFrame: 0});
		this.sprite.setOrigin(0.5, 1);
		this.scene.add.existing(this.sprite);

		this.shadow = new Ellipse(this.scene, this.position.x, this.position.y, Tile.SIZE/4, 0x000000, 0.15);
		this.shadow.setOrigin(0.5, 0.5);
		this.scene.add.existing(this.shadow);

		this.debugger = new Debugger(this.scene);
		this.debugger.setMovement(this.movement)
		if (this.type == "dino") this.debugger.setColor(0x67b66b);
		if (this.type == "bird") this.debugger.setColor(0xffd300);
	}

	public setRoom(room: Room) {
		this.room = room;

		let cell, tile;
		let columns = this.room.grid.getDimensions().columns;
		let rows = this.room.grid.getDimensions().rows;
		let random = null;

		do {
			random = new Point(Math.floor(Math.random() * columns), Math.floor(Math.random() * rows));
			cell = this.room.grid.getCell(random);
			tile = cell.getData() as Tile;
		} while (tile.isBlocked())
		
		this.create(random);
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

	public move(target: Point) {
		this.longTermTarget = target;
		let path = this.room.findPath(this.shortTermTarget, this.longTermTarget);
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
			let b = new Vector2(this.shortTermTarget);
			let line = new Curves.Line(a, b);
			adjustedPath.add(line);
		}
		
		// add all other curves
		for (let i = 0; i < path.curves.length; i++) {
			adjustedPath.add(path.curves[i]);
		}

		let speed = 15;
		this.movement.setPath(adjustedPath);
		this.movement.startFollow({
			positionOnPath: true,
			duration: 1000 * adjustedPath.getLength() * Tile.SIZE / speed,
			from: 0,
			to: 1,
			rotateToPath: true
		});
	}

	public update(time: number, delta: number) {
		this.movement.pathUpdate();
		this.debugger.update();

		if (this.movement.isFollowing()) {
			let point = this.movement.pathVector;
			let angle = Math.round(this.movement.angle) % 360;
			if (angle < 0) angle += 360;

			if (angle == 0) {
				this.sprite.setFlipX(false);
				this.shortTermTarget.setTo(Math.ceil(point.x), Math.ceil(point.y));
			} else if (angle == 90) {
				this.shortTermTarget.setTo(Math.ceil(point.x), Math.ceil(point.y));
			} else if (angle == 180) {
				this.sprite.setFlipX(true);
				this.shortTermTarget.setTo(Math.floor(point.x), Math.floor(point.y));
			} else if (angle == 270) {
				this.shortTermTarget.setTo(Math.floor(point.x), Math.floor(point.y));
			}

			if (this.sprite.anims.getName() != this.type + '-walk') {
				this.sprite.play(this.type + '-walk');
				this.urges.set('walk', 0);
			}

			this.position.setTo(this.movement.x * Tile.SIZE + Tile.SIZE/2, this.movement.y * Tile.SIZE + Tile.SIZE);
		} else {
			if (this.sprite.anims.getName() != this.type + '-idle') {
				this.sprite.play(this.type + '-idle');
			}

			let cell, tile;
			let columns = this.room.grid.getDimensions().columns;
			let rows = this.room.grid.getDimensions().rows;
			let random = new Point(Math.floor(Math.random() * columns), Math.floor(Math.random() * rows));

			this.urges.set('walk', this.urges.get('walk') + Math.random());
			if (this.urges.get('walk') > 100) {
				cell = this.room.grid.getCell(random);
				tile = cell.getData() as Tile;
				this.move(random);
			}
		}

		this.sprite.copyPosition(this.position);
		this.shadow.copyPosition(this.position);

		let layers = 3;
		this.sprite.setDepth(this.position.y * layers + 2);
		this.shadow.setDepth(this.position.y * layers + 1);
	}
}


class Debugger {

	private scene: Scene;
	private color: number;
	private movement: PathFollower;
	private graphics: Graphics;


	constructor(scene: Scene) {
		this.scene = scene;
		this.graphics = new Graphics(this.scene);
		this.scene.add.existing(this.graphics);
	}

	public setColor(color: number) {
		this.color = color;
	}

	public setMovement(movement: PathFollower) {
		this.movement = movement;
	}

	public update() {
		this.graphics.clear();
		this.graphics.lineStyle(2, this.color);
		this.graphics.fillStyle(this.color);
		this.graphics.setDepth(-5);

		if (this.movement != null) {
			if (this.movement.isFollowing()) {
				let point = new Point(this.movement.pathVector.x, this.movement.pathVector.y);
				let points = this.movement.path.getPoints();

				let index = 0;
				for (let i = 0; i+1 < points.length; i++) {
					let line = new Geom.Line(points[i].x, points[i].y, points[i+1].x, points[i+1].y);
					if (Intersects.PointToLineSegment(point, line)) {
						index = i;
						break;
					}
				}

				this.graphics.moveTo(point.x * Tile.SIZE + Tile.SIZE/2, point.y * Tile.SIZE + Tile.SIZE);
				let k = index;
				while (k < points.length) {
					this.graphics.lineTo(points[k].x * Tile.SIZE + Tile.SIZE/2, points[k].y * Tile.SIZE + Tile.SIZE);
					k++;
				}
				this.graphics.strokePath();

				// this.graphics.fillRect(position.x * Tile.SIZE + Tile.SIZE/4, this.position.y * Tile.SIZE + 3*Tile.SIZE/4, Tile.SIZE/2, Tile.SIZE/2);
			}
		}
	}
}


export { Pet }