import { Room, Tile } from "../../Room";
import { Pet } from "./Pet";

import PathFollower = Phaser.GameObjects.PathFollower;
import Path = Phaser.Curves.Path;
import Scene = Phaser.Scene;
import Point = Phaser.Geom.Point;
import Curves = Phaser.Curves;
import Vector2 = Phaser.Math.Vector2;
import Graphics = Phaser.GameObjects.Graphics;
import Geom = Phaser.Geom;
import Intersects = Phaser.Geom.Intersects;



export class Movement {

	private scene: Scene;
	private pet: Pet;

	private pathFollower: PathFollower;

	private coordinate: Point;
	private position: Point;
	private target: Point;
	private angle: number;

	private debug: boolean;
	private debugger: Debugger;


	constructor(scene: Scene, pet: Pet) {
		this.scene = scene;
		this.pet = pet;
		this.init();
	}


	private init() {
		this.pathFollower = new PathFollower(this.scene, null, 0, 0, null);
	}

	
	public setDebugger(debug: boolean) {
		this.debug = debug;
		// this.debugger = new Debugger(this.scene);
		// this.scene.add.existing(this.debugger);
	}


	public move(target: Point) {
		this.target = target;
		let path = this.pet.room.findPath(this.position, this.target);
		if (path == null || path.curves.length == 0) return;

		let adjustedPath = new Path();

		// set start of path
		if (this.pathFollower.isFollowing()) {
			adjustedPath.startPoint = new Vector2(this.pathFollower.pathVector);
		} else {
			adjustedPath.startPoint = path.curves[0].getStartPoint();
		}

		// set transitional curve
		if (this.pathFollower.isFollowing()) {
			let a = new Vector2(this.pathFollower.pathVector);
			let b = new Vector2(this.position);
			let line = new Curves.Line(a, b);
			adjustedPath.add(line);
		}
		
		// add all other curves
		for (let i = 0; i < path.curves.length; i++) {
			adjustedPath.add(path.curves[i]);
		}

		let speed = 15;
		this.pathFollower.setPath(adjustedPath);
		this.pathFollower.startFollow({
			positionOnPath: true,
			duration: 1000 * adjustedPath.getLength() * Tile.SIZE / speed,
			from: 0,
			to: 1,
			rotateToPath: true
		});
	}


	public copyPosition(position: Point) {
		this.position = new Point(position.x, position.y);
		let offset = this.pet.room.getTile(new Point(0, 0)).getCoordinate();
		this.coordinate = new Point(this.position.x * Tile.SIZE + (offset.x), this.position.y * Tile.SIZE + (offset.y));
	}


	public getPosition(): Point {
		return this.position;
	}


	public getCoordinate(): Point {
		return this.coordinate;
	}


	public getTarget(): Point {
		return this.target;
	}

	
	public getAngle(): number {
		return this.angle;
	}


	public isDone(): boolean {
		return !(this.pathFollower.isFollowing());
	}


	public update(time: number, delta: number) {
		this.pathFollower.pathUpdate();
		
		if (this.debug) this.debugger.update();
		
		if (this.pathFollower.isFollowing()) {
			let point = this.pathFollower.pathVector;
			this.angle = Math.round(this.pathFollower.angle) % 360;
			if (this.angle < 0) this.angle += 360;

			if (this.angle == 0) {
				this.pet.setFlipX(false);
				this.position.setTo(Math.ceil(point.x), Math.ceil(point.y));
			} else if (this.angle == 90) {
				this.position.setTo(Math.ceil(point.x), Math.ceil(point.y));
			} else if (this.angle == 180) {
				this.pet.setFlipX(true);
				this.position.setTo(Math.floor(point.x), Math.floor(point.y));
			} else if (this.angle == 270) {
				this.position.setTo(Math.floor(point.x), Math.floor(point.y));
			}

			let offset = this.pet.room.getTile(new Point(0, 0)).getCoordinate();
			this.coordinate.setTo(this.pathFollower.x * Tile.SIZE + offset.x, this.pathFollower.y * Tile.SIZE + offset.y);
		}
	}
}



class Debugger {

	private scene: Scene;

	private debug: boolean;
	private color: number;
	private movement: PathFollower;
	private graphics: Graphics;


	constructor(scene: Scene, debug: boolean) {
		this.scene = scene;
		this.debug = debug;
	}


	private init() {
		
	}


	public create() {
		this.graphics = new Graphics(this.scene);
		this.scene.add.existing(this.graphics);
	}


	public setDebug(debug: boolean) {
		this.debug = debug;
	}


	public setColor(color: number) {
		this.color = color;
	}


	public setMovement(movement: PathFollower) {
		this.movement = movement;
	}


	public update() {
		if (this.debug)
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

				// this.graphics.fillRect(coordinate.x * Tile.SIZE + Tile.SIZE/4, this.coordinate.y * Tile.SIZE + 3*Tile.SIZE/4, Tile.SIZE/2, Tile.SIZE/2);
			}
		}
	}
}