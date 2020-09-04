import { CellConfig } from "./Types";

import Point = Phaser.Geom.Point;



class Cell {

	private config: CellConfig;


	constructor(config: CellConfig) {
		this.configure(config);
	}


	public configure(config: CellConfig) {
		this.config = config;
	}


	public reserve() {
		this.config.reserved = true;
	}


	public unreserve() {
		this.config.reserved = false;
	}


	public isReserved(): boolean {
		return this.config.reserved;
	}


	public getPosition(): Point {
		return this.config.position;
	}
}



export { Cell };