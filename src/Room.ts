import { Grid } from './Grid';
import { RoomConfig, TileConfig } from './Types';
import { PathFinder } from './PathFinder';
import { Food } from './objects/Food';
import { Pet } from './entities/pets/Pet';
import { Progress } from './Progress';

import Scene = Phaser.Scene;
import Group = Phaser.GameObjects.Group;
import Shader = Phaser.GameObjects.Shader;
import Point = Phaser.Geom.Point;
import GameObject = Phaser.GameObjects.GameObject;
import Path = Phaser.Curves.Path;
import Zone = Phaser.GameObjects.Zone;
import Rectangle = Phaser.GameObjects.Rectangle;
import List = Phaser.Structs.List;



export class Room extends Group {

	public grid: Grid;

	private pathFinder: PathFinder;
	private config: RoomConfig;
	private pets: List<Pet>;
	
	private tiles: Map<string, Array<Tile>>;


	constructor(scene: Scene, config: RoomConfig) {
		super(scene);
		this.configure(config);
	}


	public configure(config: RoomConfig) {
		this.config = config;

		this.grid = new Grid(config.gridConfig);
		this.pathFinder = new PathFinder(this.grid);
		this.pets = new List<Pet>(null);

		this.tiles = new Map<string, Array<Tile>>();
	}


	public create() {
		let width = this.config.gridConfig.dimensions.columns * Tile.SIZE;
		let height = this.config.gridConfig.dimensions.rows * Tile.SIZE;
		let background = new Shader(this.scene, 'ground', this.scene.cameras.main.centerX, this.scene.cameras.main.centerY, width, height);
		background.setDepth(-10);
		this.add(background);
		this.scene.add.existing(background);

		for(let i = 0; i < this.config.gridConfig.dimensions.rows; i++) {
			for(let j = 0; j < this.config.gridConfig.dimensions.columns; j++) {
				// creating the data to be stored in the cell
				let tile = new Tile({
					data: null,
					position: new Point(i, j),
					coordinate: new Point(Tile.SIZE * i + Tile.SIZE/2 + background.x - background.width/2, Tile.SIZE * j + Tile.SIZE/2 + background.y - background.height/2),
					blocked: false
				});

				// // setup interactive zones
				// let zone = new Zone(this.scene, tile.getCoordinate().x, tile.getCoordinate().y, Tile.SIZE, Tile.SIZE);
				// let rectangle = new Rectangle(this.scene, tile.getCoordinate().x, tile.getCoordinate().y, Tile.SIZE, Tile.SIZE);
				// zone.setInteractive();
				// zone.on('pointerdown', (pointer) => {
				// 	if (pointer.leftButtonDown()) {
				// 		rectangle.setVisible(true);
				// 	}
				// });
				
				// storing the data in the cell and cache
				this.grid.setCell(tile.getPosition(), tile);
				this.setTile(tile.getPosition(), null, false);
			}
		}

		let position = new Point(2, 2);
		let food = new Food(this.scene, new Progress(100000, 100000));
		food.create(this.getTile(position).getCoordinate());
		this.scene.add.existing(food);
		this.setTile(position, food, true);
	}


	public invite(pet: Pet) {
		pet.setRoom(this);
		this.add(pet);
		this.pets.add(pet);
	}


	public uninvite(pet: Pet) {
		pet.setRoom(null);
		this.remove(pet);
		this.pets.remove(pet);
	}


	public setTile(position: Point, data: TileData, blocked: boolean) {
		let tile = this.getTile(position);
		let key = 'empty';
		let tiles = null;
		let index = null;

		// removes the tile from its corresponding cached tile list
		if (tile.getData() != null) {
			key = tile.getData().type;
			tiles = this.getTiles(key);
			index = tiles.indexOf(tile);
			if (index != -1) {
				tiles.splice(index, 1);
			}
		}

		// update tile information
		tile.setData(data);
		tile.setBlocked(blocked);
	
		// add the tile to its corresponding cached tile list
		if (data != null) key = tile.getData().type;
		tiles = this.getTiles(key);
		if (tiles == null) {
			this.tiles.set(key, new Array<Tile>());
			tiles = this.getTiles(key);
		}
		tiles.push(tile);
	}
	

	public getTile(position: Point): Tile {
		if (this.grid.getCell(position) == null) return null;
		return this.grid.getCell(position).getData();
	}


	public getTiles(key: string): Array<Tile> {
		return this.tiles.get(key);
	}


	public findPath(start: Point, end: Point): Path {
		return this.pathFinder.findPath(start, end);
	}


	public calculateDistance(a: Point, b: Point) {
		return this.pathFinder.calculateDistance(a, b);
	}


	public update(time: number, delta: number) {
		this.pets.each(pet => pet.update(time, delta));
	}
}



export class Tile {

	public static readonly SIZE: number = 16;
	private config: TileConfig;


	constructor(config: TileConfig) {
		this.configure(config);
	}


	public configure(config: TileConfig) {
		this.config = config;
	}


	public interact(gameObject: GameObject) {
		let pet = gameObject as Pet;
		this.config.data.interact(pet);
	}


	public setData(data: TileData) {
		this.config.data = data;
		return this;
	}


	public setBlocked(blocked: boolean) {
		this.config.blocked = blocked;
	}


	public isBlocked(): boolean {
		return this.config.blocked;
	}


	public getData(): TileData {
		return this.config.data;
	}


	public getPosition(): Point {
		return this.config.position;
	}
	
	
	public getCoordinate(): Point {
		return this.config.coordinate;
	}
}



export interface TileData {
	type: string;
	interact(pet: Pet);
}