import { Grid, Cell } from "./Grid";

import Point = Phaser.Geom.Point;
import List = Phaser.Structs.List;
import Map = Phaser.Structs.Map;
import Path = Phaser.Curves.Path;



class Node {

	public parent: Node;
	public children: Array<Node>;
	public function: number;
	public heuristic: number;
	public cost: number;
	public data: any;


	constructor(parent: Node, data: any) {
		this.parent = parent;
		this.data = data;
	}
}



class Movement {

	private grid: Grid;


	constructor(grid: Grid) {
		this.grid = grid;
	}


	public findPath(start: Point, goal: Point): Path {
		let data = this.grid.getCell(start);
		let root = new Node(null, data);
		root.heuristic = this.calculateHeuristic(start, goal);
		root.cost = 0;
		root.function = root.heuristic + root.cost;

		let fringeMap = new Map<string, Node>(null);
		let key = "(" + start.x + "," + start.y + ")";
		fringeMap.set(key, root);

		// priority queue
		let fringeQueue = new List<Node>(null);
		fringeQueue.add(root);

		// search until there is nothing left to search
		while (fringeQueue.length != 0) {
			console.log("fringe:");
			fringeQueue.each(node => {
				let cell = node.data as Cell;
				let position = cell.getPosition();
				console.log("(" + position.x + "," + position.y + ") : " + node.heuristic + " : " + node.cost + " : " + node.function);
			});
			let current = fringeQueue.removeAt(0);
			let ccell = current.data as Cell;
			let cposition = ccell.getPosition();
			console.log("current: (" + cposition.x + "," + cposition.y + ")");
			// check if current node is the goal position
			let cell = current.data as Cell;
			let position = cell.getPosition();
			if (position.x == goal.x && position.y == goal.y) {
				// generate the path to return
				let points = new List<Point>(null);
				while (current) {
					let cell = current.data as Cell;
					let coordinates = cell.getData().getCoordinates();
					points.addAt(coordinates, 0);
					current = current.parent;
				}
				//
				let first = points.first;
				let path = new Path(first.x, first.y);
				let point = points.next;
				while (point != null) {
					path.lineTo(point.x, point.y);
					point = points.next;
				}
				return path;
			}

			// keep looking for the goal
			current.children = this.getSuccessors(current);
			for (let successor of current.children) {
				let cell = successor.data as Cell;
				let position = cell.getPosition();
				let key = "(" + position.x + "," + position.y + ")";

				successor.heuristic = this.calculateHeuristic(position, goal);
				successor.cost = current.cost + 1;
				successor.function = successor.heuristic + successor.cost;
				
				// check if successor is in the fringe
				if(fringeMap.get(key) == undefined) {
					// add successor to fringe
					fringeMap.set(key, successor);
					this.addSorted(fringeQueue, successor);
				} else {
					// update successor in fringe
					let node = fringeMap.get(key);
					node.heuristic = successor.heuristic;
					node.cost = successor.cost;
					node.function = successor.function;
				}
			}
		}

		return null;
	}


	private getSuccessors(parent: Node): Array<Node> {
		let successors = new Array<Node>();

		let cell = parent.data as Cell;
		let position = cell.getPosition();

		let positions = new Array<Point>(4);
		positions[0] = new Point(position.x, position.y - 1);
		positions[1] = new Point(position.x, position.y + 1);
		positions[2] = new Point(position.x - 1, position.y);
		positions[3] = new Point(position.x + 1, position.y);

		for(let i = 0; i < positions.length; i++) {
			let cell = this.grid.getCell(positions[i]);
			
			// check if positions are valid and add them to node children
			if (cell != null) {
				let data = cell.getData();
				if (data.getOccupier() == null) {
					successors.push(new Node(parent, cell));
				}
			}
		}

		return successors;
	}


	private addSorted(fringe: List<Node>, insert: Node) {
		let i = 0;
		while (i < fringe.length) {
			let node = fringe.getAt(i);
			if (insert.function < node.function) {
				fringe.addAt(insert, i);
				break;
			}
			i++;
		}

		if (i == fringe.length) fringe.addAt(insert, i);
	}


	private calculateHeuristic(position: Point, goal: Point): number {
		let row = Math.abs(goal.y - position.y);
		let column = Math.abs(goal.x - position.x);
		return row + column;
	}
}



export { Movement };