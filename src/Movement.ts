import { Cell } from "./Cell";
import { Grid } from "./Grid";

import Point = Phaser.Geom.Point;



class Node {
	public heuristic: number;
	public cost: number;
	public data: any;
	public next: Node;
}


class Movement {
	
	private root: Node;
	private path: Array<Point>;


	constructor() {
		this.root = new Node(); 
		this.path = new Array<Point>();
	}


	public findPath(grid: Grid, start: Point, end: Point): Array<Point> {
		
		return this.path;
	}
}




export { Movement };