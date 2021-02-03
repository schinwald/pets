import { Dimensions } from './Grid'
import { Wall } from './objects/Wall';
import { TileData } from './Room';

import Point = Phaser.Geom.Point;
import GameObject = Phaser.GameObjects.GameObject;



type RoomConfig = {
	gridConfig: GridConfig;
}


type TileConfig = {
	position: Point;
	coordinate: Point;
	data: TileData;
	walls: Array<Wall>;
	blocked: boolean;
}


type GridConfig = {
	dimensions: Dimensions;
}


type CellConfig = {
	position: Point;
	data: any;
}



export { RoomConfig };
export { TileConfig };
export { GridConfig };
export { CellConfig };