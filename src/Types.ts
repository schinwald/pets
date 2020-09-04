import Point = Phaser.Geom.Point;



type RoomConfig = {
	gridConfig: GridConfig;
}


type GridConfig = {
	rows: number;
	columns: number;
}


type CellConfig = {
	reserved: boolean;
	position: Point;
}



export { RoomConfig };
export { GridConfig };
export { CellConfig };