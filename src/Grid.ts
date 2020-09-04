import { GridConfig } from "./Types";
import { Cell } from "./Cell";

import GameObject = Phaser.GameObjects.GameObject;
import Point = Phaser.Geom.Point;



class Grid {
	private config: GridConfig;
	private cells: Array<Array<Cell>>;
	private MAX = 64;


	constructor(config: GridConfig) {
		this.init();
		this.configure(config)
		this.cells
	}


	public init() {
		this.cells = new Array<Array<Cell>>(this.MAX);
		for(let i = 0; i < this.MAX; i++) {
			this.cells[i] = new Array<Cell>(this.MAX);
			for(let j = 0; j < this.MAX; j++) {
				this.cells[i][j] = null;
			}
		}
	}


	public configure(config: GridConfig) {
		this.config = config;

		for(let i = 0; i < this.config.columns; i++) {
			for(let j = 0; j < this.config.rows; j++) {
				if(this.cells[i][j] == null) {
					this.cells[i][j] = new Cell({
						reserved: false,
						position: new Point(24 * j + 12, 24 * i + 12)
					});
				}
			}
		}
	}

	
	public getRowLength(): number {
		return this.config.rows;
	}


	public getColumnLength(): number {
		return this.config.columns;
	}


	public getCell(row: number, column: number): Cell {
		if(row >= this.config.rows) return null;
		if(column >= this.config.columns) return null;
		return this.cells[row][column];
	}
}



export { Grid }