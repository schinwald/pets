import { Pet } from './Pet';
import { Grid } from './Grid';
import { RoomConfig } from './Types';
import { Movement } from './Movement';

import Scene = Phaser.Scene;
import Group = Phaser.GameObjects.Group;
import Shader = Phaser.GameObjects.Shader;
import Point = Phaser.Geom.Point;



class Room extends Group {

	private config: RoomConfig;
	private grid: Grid;
	private movement: Movement;
	private pets: Array<Pet>;


	constructor(scene: Scene, config: RoomConfig) {
		super(scene);
		this.configure(config);
		this.create();
	}


	public configure(config: RoomConfig) {
		this.config = config;

		this.grid = new Grid(config.gridConfig);
		this.movement = new Movement();
		this.pets = new Array<Pet>();
	}


	public create() {
		let width = this.config.gridConfig.rows * 24;
		let height = this.config.gridConfig.columns * 24;
		let background = new Shader(this.scene, 'ground', width / 2, height / 2 + 12, width, height);
		this.scene.add.existing(background);

		for(let i = 0; i < this.config.gridConfig.columns; i++) {
			for(let j = 0; j < this.config.gridConfig.rows; j++) {
				let position = this.grid.getCell(i, j).getPosition();
				let zone = new Phaser.GameObjects.Zone(this.scene, position.x, position.y + 12, 24, 24);
				zone.setInteractive();
				zone.on('pointerdown', function() {
					this.movement.findPath(this.grid, this.pets[0].getPosition(), )
					this.pets[0].move(position.x, position.y);
				}, this);
				this.scene.add.existing(zone);
			}
		}
	}


	public invite(pet: Pet) {
		this.pets.push(pet);
	}
}



export { Room };