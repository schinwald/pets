import { Pet } from './Pet';
import { Grid } from './Grid';
import { RoomConfig, TileConfig } from './Types';
import { PathFinder } from './PathFinder';
import { GameObjects } from 'phaser';

import Scene = Phaser.Scene;
import Group = Phaser.GameObjects.Group;
import Shader = Phaser.GameObjects.Shader;
import Point = Phaser.Geom.Point;
import Rectangle = Phaser.GameObjects.Rectangle;
import GameObject = Phaser.GameObjects.GameObject;
import Path = Phaser.Curves.Path;



class Room extends Group {

	public grid: Grid;

	private pathFinder: PathFinder;
	private config: RoomConfig;
	private pets: Array<Pet>;


	constructor(scene: Scene, config: RoomConfig) {
		super(scene);
		this.configure(config);
		this.create();
	}


	public configure(config: RoomConfig) {
		this.config = config;

		this.grid = new Grid(config.gridConfig);
		this.pathFinder = new PathFinder(this.grid);
		this.pets = new Array<Pet>();
	}


	public create() {
		let width = this.config.gridConfig.dimensions.columns * Tile.SIZE;
		let height = this.config.gridConfig.dimensions.rows * Tile.SIZE;
		let background = new Shader(this.scene, 'ground', width/2, height/2 + Tile.SIZE/2, width, height);
		this.scene.add.existing(background);

		for(let i = 0; i < this.config.gridConfig.dimensions.rows; i++) {
			for(let j = 0; j < this.config.gridConfig.dimensions.columns; j++) {
				let position = new Point(i, j);
				let tile = new Tile({
					coordinate: new Point(Tile.SIZE * i + Tile.SIZE/2, Tile.SIZE * j + Tile.SIZE/2),
					occupier: null
				});
				this.grid.setCell(position, tile);
				let zone = new Phaser.GameObjects.Zone(this.scene, tile.getCoordinates().x, tile.getCoordinates().y + 12, 24, 24);
				zone.setInteractive();
				zone.on('pointerdown', function() {
					this.pets[1].move(new Point(i, j));
				}, this);
				this.scene.add.existing(zone);
			}
		}

		for (let i = 0; i < this.config.gridConfig.dimensions.rows; i++) {
			if (i < 5 && i != 2) {
				let position = new Point(1, i);
				let cell = this.grid.getCell(position);
				let tile = cell.getData();
				let rectangle = new Rectangle(this.scene, tile.getCoordinates().x, tile.getCoordinates().y + Tile.SIZE/2, Tile.SIZE, Tile.SIZE, 0x000000);
				this.scene.add.existing(rectangle);
				tile.setOccupier(rectangle);
			}
		}

		for (let i = 1; i < this.config.gridConfig.dimensions.rows; i++) {
			if (i != 7 && i != 5) {
				let position = new Point(3, i);
				let cell = this.grid.getCell(position);
				let tile = cell.getData();
				let rectangle = new Rectangle(this.scene, tile.getCoordinates().x, tile.getCoordinates().y + Tile.SIZE/2, Tile.SIZE, Tile.SIZE, 0x000000);
				this.scene.add.existing(rectangle);
				tile.setOccupier(rectangle);
			}
		}

		for (let i = 1; i < this.config.gridConfig.dimensions.rows; i++) {
			if (i != 2) {
				let position = new Point(6, i);
				let cell = this.grid.getCell(position);
				let tile = cell.getData();
				let rectangle = new Rectangle(this.scene, tile.getCoordinates().x, tile.getCoordinates().y + Tile.SIZE/2, Tile.SIZE, Tile.SIZE, 0x000000);
				this.scene.add.existing(rectangle);
				tile.setOccupier(rectangle);
			}
		}
	}


	public invite(pet: Pet) {
		pet.setRoom(this);
		this.pets.push(pet);
	}


	public findPath(start: Point, end: Point): Path {
		return this.pathFinder.findPath(start, end);
	}


	public update(time: number, delta: number) {
		this.pets.forEach(pet => pet.update(time, delta));
	}
}



class Tile {

	public static readonly SIZE: number = 24;
	private config: TileConfig;


	constructor(config: TileConfig) {
		this.configure(config);
	}


	public configure(config: TileConfig) {
		this.config = config;
	}

	public setOccupier(occupier: GameObject) {
		this.config.occupier = occupier;
	}

	public getOccupier(): GameObject {
		return this.config.occupier;
	}
	
	public getCoordinates(): Point {
		return this.config.coordinate;
	}
}



export { Room };
export { Tile };