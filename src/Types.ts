import { GameObjects } from 'phaser';
import { Dimensions } from './Grid'

import Point = Phaser.Geom.Point;
import GameObject = Phaser.GameObjects.GameObject;



type RoomConfig = {
	gridConfig: GridConfig;
}


type TileConfig = {
	coordinate: Point;
	occupier: GameObject;
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