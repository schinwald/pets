import { GridConfig, CellConfig } from "./Types";
import { Tile } from "./Room";

import Point = Phaser.Geom.Point;


class Grid {

	private dimensions: Dimensions;
	private cells: Array<Array<Cell>>;

	// creates a grid instance
	constructor(config: GridConfig) {
		this.init();
		this.configure(config);
	}

	// initialize grid
	public init() {
		this.dimensions = new Dimensions(0, 0);
		this.cells = new Array<Array<Cell>>();
	}

	// configure grid
	public configure(config: GridConfig) {
		if (config.dimensions.columns < this.dimensions.columns) return;
		if (config.dimensions.rows < this.dimensions.rows) return;

		for(let i = this.dimensions.rows; i < config.dimensions.rows; i++) {
			this.cells.push(new Array<Cell>());
			for(let j = this.dimensions.columns; j < config.dimensions.columns; j++) {
				this.cells[i].push(new Cell({
					position: new Point(i, j),
					data: null
				}));
			}
		}

		this.dimensions = config.dimensions;
	}


	public setCell(position: Point, data: any) {
		if (position.x < 0 || this.dimensions.columns <= position.x) return null;
		if (position.y < 0 || this.dimensions.rows <= position.y) return null;
		return this.cells[position.x][position.y].setData(data);
	}

	// get the dimensions of the grid
	public getDimensions(): Dimensions {
		return this.dimensions;
	}

	// get the cell at a specific position on the grid
	public getCell(position: Point): Cell {
		if (position.x < 0 || this.dimensions.columns <= position.x) return null;
		if (position.y < 0 || this.dimensions.rows <= position.y) return null;
		return this.cells[position.x][position.y];
	}
}



class Cell {

	private position: Point;
	private data: Tile;


	constructor(config: CellConfig) {
		this.configure(config);
	}


	public configure(config: CellConfig) {
		this.position = config.position;
		this.data = config.data;
	}


	public setData(data: Tile) {
		this.data = data;
	}


	public setPosition(x: number, y: number) {
		this.position.x = x;
		this.position.y = y;
	}


	public getData(): Tile {
		return this.data;
	}


	public getPosition(): Point {
		return this.position;
	}
}



class Dimensions {

	public rows: number;
	public columns: number;


	constructor(rows: number, columns: number) {
		this.rows = rows;
		this.columns = columns;
	}
}



export { Grid };
export { Cell };
export { Dimensions };