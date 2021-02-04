import { Grid } from './Grid';
import { RoomConfig, TileConfig } from './Types';
import { PathFinder } from './PathFinder';
import { Food } from './objects/Food';
import { Pet } from './entities/pets/Pet';
import { Progress } from './Progress';
import { Wall } from './objects/Wall';

import Scene = Phaser.Scene;
import Group = Phaser.GameObjects.Group;
import Shader = Phaser.GameObjects.Shader;
import Point = Phaser.Geom.Point;
import GameObject = Phaser.GameObjects.GameObject;
import Path = Phaser.Curves.Path;
import Rectangle = Phaser.GameObjects.Rectangle;
import Zone = Phaser.GameObjects.Zone;
import List = Phaser.Structs.List;



export class Room extends Group {

	public grid: Grid;

	private pathFinder: PathFinder;
	private config: RoomConfig;
	private pets: List<Pet>;
	
	private tiles: Map<string, Array<Tile>>;
	private zones: Map<string, Array<Zone>>;


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
		this.zones = new Map<string, Array<Zone>>();
	}


	public create() {
		let width = this.config.gridConfig.dimensions.columns * Tile.SIZE;
		let height = this.config.gridConfig.dimensions.rows * Tile.SIZE;
		let background = new Shader(this.scene, 'ground', this.scene.cameras.main.centerX, this.scene.cameras.main.centerY, width, height);
		background.setDepth(-10);
		this.add(background);
		this.scene.add.existing(background);

		let offset = new Point(this.scene.cameras.main.centerX - width/2, this.scene.cameras.main.centerY - height/2)

		for(let i = 0; i < this.config.gridConfig.dimensions.rows; i++) {
			for(let j = 0; j < this.config.gridConfig.dimensions.columns; j++) {
				// creating the data to be stored in the cell
				let tile = new Tile({
					data: null,
					position: new Point(j, i),
					coordinate: new Point(Tile.SIZE * j + Tile.SIZE/2 + offset.x, Tile.SIZE * i + Tile.SIZE/2 + offset.y),
					blocked: false
				}, new Array<Wall>(null, null, null, null));

				let zone = new Zone(this.scene, tile.getCoordinate().x, tile.getCoordinate().y, Tile.SIZE, Tile.SIZE);
				zone.setInteractive();
				zone.on('pointerdown', (pointer) => {
					if (pointer.leftButtonDown()) {
						console.log(tile);
					}
				}, tile);
				this.scene.add.existing(zone);
				
				// storing the data in the cell and cache
				this.grid.setCell(tile.getPosition(), tile);
				this.setTile(tile.getPosition(), null, false);
			}
		}

		// setup walls
		for(let i = 0; i < this.config.gridConfig.dimensions.rows + 1; i++) {			
			for(let j = 0; j < this.config.gridConfig.dimensions.columns + 1; j++) {

				// setup horizontal walls
				if (j != this.config.gridConfig.dimensions.rows) {
					let position = new Point(j, i - 0.5);
					let coordinate = new Point(Tile.SIZE * position.x + Tile.SIZE/2 + offset.x, Tile.SIZE * position.y + Tile.SIZE/2 + offset.y);
					let zone = new Zone(this.scene, coordinate.x, coordinate.y, Tile.SIZE - Tile.SIZE/4, Tile.SIZE/4);

					zone.setInteractive();

					zone.on('pointerdown', (pointer) => {
						if (pointer.leftButtonDown()) {
							let wall = new Wall(this.scene, "horizontal");
							wall.setRoom(this);
							if (wall.place(position)) wall.create(coordinate);
							else wall.destroy();
						} else if (pointer.rightButtonDown()) {
							let below = this.getTile(new Point(position.x, position.y + 0.5));
							if (below != null && below.walls[0] != null) {
								below.walls[0].destroy();
								console.log(below.walls[0]);
								below.walls[0] = null;
							}

							let above = this.getTile(new Point(position.x, position.y - 0.5));
							if (above != null && above.walls[2] != null) {
								above.walls[2].destroy();
								console.log(above.walls[2]);
								above.walls[2] = null;
							}
						}
					});

					let rectangle = new Rectangle(this.scene, coordinate.x, coordinate.y, Tile.SIZE - Tile.SIZE/4, Tile.SIZE/4, 0x000000, 0.3);
					rectangle.setVisible(false);

					zone.on('pointerover', (pointer) => {
						rectangle.setVisible(true);
					});

					zone.on('pointerout', (pointer) => {
						rectangle.setVisible(false);
					});

					this.scene.add.existing(rectangle);
					this.scene.add.existing(zone);
				}

				// setup vertical walls
				if (i != this.config.gridConfig.dimensions.columns) {
					let position = new Point(j - 0.5, i);
					let coordinate = new Point(Tile.SIZE * position.x + Tile.SIZE/2 + offset.x, Tile.SIZE * position.y + Tile.SIZE/2 + offset.y);
					let zone = new Zone(this.scene, coordinate.x, coordinate.y, Tile.SIZE/4, Tile.SIZE - Tile.SIZE/4);

					zone.setInteractive();
					
					zone.on('pointerdown', (pointer) => {
						if (pointer.leftButtonDown()) {
							let wall = new Wall(this.scene, "vertical");
							wall.setRoom(this);
							if (wall.place(position)) wall.create(coordinate);
							else wall.destroy();
						} else if (pointer.rightButtonDown()) {
							let right = this.getTile(new Point(position.x + 0.5, position.y));
							if (right != null && right.walls[1] != null) {
								right.walls[3].destroy();
								right.walls[3] = null;
							}

							let left = this.getTile(new Point(position.x - 0.5, position.y));
							if (left != null && left.walls[1] != null) {
								left.walls[1].destroy();
								left.walls[1] = null;
							}
						}
					});

					let rectangle = new Rectangle(this.scene, coordinate.x, coordinate.y, Tile.SIZE/4, Tile.SIZE - Tile.SIZE/4, 0x000000, 0.3);
					rectangle.setVisible(false);

					zone.on('pointerover', (pointer) => {
						rectangle.setVisible(true);
					});

					zone.on('pointerout', (pointer) => {
						rectangle.setVisible(false);
					});

					this.scene.add.existing(rectangle);
					this.scene.add.existing(zone);
				}
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

		if (tile == null) return;

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
	public walls: Array<Wall>;
	private config: TileConfig;


	constructor(config: TileConfig, walls: Array<Wall>) {
		this.walls = walls;
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
