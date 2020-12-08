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



class PathFinder {

	private grid: Grid;


	constructor(grid: Grid) {
		this.grid = grid;
	}


	public findPath(start: Point, end: Point): Path {
		let data = this.grid.getCell(start);
		let root = new Node(null, data);
		root.heuristic = this.calculateHeuristic(start, end);
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
			let current = this.selectFromFringe(fringeQueue);

			// check if current node is the end position
			let cell = current.data as Cell;
			let position = cell.getPosition();
			if (position.x == end.x && position.y == end.y) {
				// generate the path to return
				let points = new List<Point>(null);
				while (current) {
					let cell = current.data as Cell;
					let position = cell.getPosition();
					points.addAt(position, 0);
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

				successor.heuristic = this.calculateHeuristic(position, end);
				successor.cost = current.cost + 1;
				successor.function = successor.heuristic + successor.cost;
				
				// check if successor is in the fringe
				if (fringeMap.get(key) == undefined) {
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

		for (let i = 0; i < positions.length; i++) {
			let cell = this.grid.getCell(positions[i]);
			
			// check if positions are valid and add them to node children
			if (cell != null) {
				let data = cell.getData();
				if (data.getGameObject() == null) {
					successors.push(new Node(parent, cell));
				}
			}
		}

		return successors;
	}


	private selectFromFringe(fringeQueue: List<Node>): Node {
		let first = fringeQueue.first;

		let node = fringeQueue.next;
		let i = 0;
		while (node != null && first.function == node.function) {
			node = fringeQueue.next;
			i++;
		}

		let k = Math.floor(Math.random() * (i+1));
		let selected = fringeQueue.removeAt(k);
		
		return selected;
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


	private calculateHeuristic(a: Point, b: Point): number {
		let row = Math.abs(a.y - b.y);
		let column = Math.abs(a.x - b.x);
		return row + column;
	}
}



export { PathFinder };