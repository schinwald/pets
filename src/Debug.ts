import { Vector } from "matter";
import { Tile } from "./Room";

import Scene = Phaser.Scene;
import Graphics = Phaser.GameObjects.Graphics;
import Ellipse = Phaser.GameObjects.Ellipse;
import Path = Phaser.Curves.Path;
import PathFollower = Phaser.GameObjects.PathFollower;
import Vector2 = Phaser.Math.Vector2;
import List = Phaser.Structs.List;
import Line = Phaser.Geom.Line;
import Point = Phaser.Geom.Point;
import Intersects = Phaser.Geom.Intersects;


class PathDebugger {

	private scene: Scene;
	private pathFollower: PathFollower;
	private graphics: Graphics;
	private color: number;


	constructor(scene: Scene, color: number) {
		this.scene = scene;
		this.color = color;
		this.graphics = new Graphics(this.scene);
		this.graphics.setY(Tile.SIZE/2);
		this.scene.add.existing(this.graphics);
	}

	public setPathFollower(pathFollower: PathFollower) {
		this.pathFollower = pathFollower;
	}

	public pathFollowerUpdate() {
		this.graphics.clear();
		this.graphics.lineStyle(2, this.color);
		this.graphics.fillStyle(this.color);

		if (this.pathFollower != null) {
			if (this.pathFollower.isFollowing()) {
				let point = new Point(this.pathFollower.pathVector.x, this.pathFollower.pathVector.y);
				let points = this.pathFollower.path.getPoints();

				let index = 0;
				for (let i = 0; i+1 < points.length; i++) {
					let line = new Line(points[i].x, points[i].y, points[i+1].x, points[i+1].y);
					if (Intersects.PointToLineSegment(point, line)) {
						index = i;
						break;
					}
				}

				this.graphics.moveTo(point.x * Tile.SIZE + Tile.SIZE/2, point.y * Tile.SIZE + Tile.SIZE/2);
				let k = index;
				while (k < points.length) {
					this.graphics.lineTo(points[k].x * Tile.SIZE + Tile.SIZE/2, points[k].y * Tile.SIZE + Tile.SIZE/2);
					k++;
				}
				this.graphics.strokePath();
			}
		}
	}

	private difference(a: Vector2, b: Vector2): number {
		let differenceX = Math.abs(a.x - b.x);
		let differenceY = Math.abs(a.y - b.y);
		return differenceX + differenceY;
	}
}

export { PathDebugger };