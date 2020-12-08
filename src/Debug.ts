import { Tile } from "./Room";

import Scene = Phaser.Scene;
import Graphics = Phaser.GameObjects.Graphics;
import Ellipse = Phaser.GameObjects.Ellipse;
import Path = Phaser.Curves.Path;
import PathFollower = Phaser.GameObjects.PathFollower;
import Vector2 = Phaser.Math.Vector2;
import List = Phaser.Structs.List;


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
				let current = this.pathFollower.pathVector;
				current.add(new Vector2(Tile.SIZE/2, Tile.SIZE/2));
				let points = this.pathFollower.path.getPoints();

				let shortest;
				let index = 0;
				for (let i = 0; i < points.length; i++) {
					let difference = this.difference(current, points[i]);
					if (i == 0) shortest = difference;
					if (difference < shortest) {
						index = i;
						shortest = difference;
					}
				}

				this.graphics.moveTo(current.x, current.y);
				let k = index;
				while (k < points.length) {
					this.graphics.lineTo(points[k].x, points[k].y);
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