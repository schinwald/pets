import { Pet } from './Pet';
import { Grid } from './Grid';
import { RoomConfig, TileConfig } from './Types';
import { Movement } from './Movement';
import { GameObjects } from 'phaser';

import Scene = Phaser.Scene;
import Group = Phaser.GameObjects.Group;
import Shader = Phaser.GameObjects.Shader;
import Point = Phaser.Geom.Point;
import Rectangle = Phaser.GameObjects.Rectangle;
import GameObject = Phaser.GameObjects.GameObject;
import Graphics = Phaser.GameObjects.Graphics;
import Ellipse = Phaser.GameObjects.Ellipse;



class Room extends Group {

	private config: RoomConfig;
	private grid: Grid;
	private movement: Movement;
	private pets: Array<Pet>;

	private ellipse: Ellipse;
	private graphics: Graphics;


	constructor(scene: Scene, config: RoomConfig) {
		super(scene);
		this.configure(config);
		this.create();
	}


	public configure(config: RoomConfig) {
		this.config = config;

		this.grid = new Grid(config.gridConfig);
		this.movement = new Movement(this.grid);
		this.pets = new Array<Pet>();
		
		this.graphics = new Graphics(this.scene);
		this.ellipse = new Ellipse(this.scene, -100, -100, Tile.SIZE/4, Tile.SIZE/4, 0x00aa00);
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
					let path = this.movement.findPath(this.pets[0].getPosition(), position);
					this.graphics.clear();
					if (path != null) {
						path.draw(this.graphics);
						this.ellipse.setPosition(tile.getCoordinates().x, tile.getCoordinates().y + Tile.SIZE/2);
					} else {
						this.ellipse.setPosition(this.pets[0].getPosition().x + Tile.SIZE/2, this.pets[0].getPosition().y + Tile.SIZE);
					}
				}, this);
				this.scene.add.existing(zone);
			}
		}

		for (let i = 0; i < this.config.gridConfig.dimensions.rows; i++) {
			if (i < 5) {
				let position = new Point(1, i);
				let cell = this.grid.getCell(position);
				let tile = cell.getData();
				let rectangle = new Rectangle(this.scene, tile.getCoordinates().x, tile.getCoordinates().y + Tile.SIZE/2, Tile.SIZE, Tile.SIZE, 0x000000);
				this.scene.add.existing(rectangle);
				tile.setOccupier(rectangle);
			}
		}

		for (let i = 1; i < this.config.gridConfig.dimensions.rows; i++) {
			if (i != 7) {
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

		this.graphics.setY(12);
		this.graphics.lineStyle(2, 0x00aa00);
		this.scene.add.existing(this.graphics);
		this.scene.add.existing(this.ellipse);
	}


	public invite(pet: Pet) {
		this.pets.push(pet);
		this.ellipse.setPosition(this.pets[0].getPosition().x + Tile.SIZE/2, this.pets[0].getPosition().y + Tile.SIZE);
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