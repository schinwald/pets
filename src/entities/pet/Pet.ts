import { Health } from "./Health";
import { Movement } from "./Movement";
import { StateMachine } from "../../StateMachine";
import { Room, Tile } from "../../Room";
import { IdleState } from "./states/IdleState";
import { ExploreState } from "./states/ExploreState";

import Scene = Phaser.Scene;
import Sprite = Phaser.GameObjects.Sprite;
import Point = Phaser.Geom.Point;
import Ellipse = Phaser.GameObjects.Ellipse;
import GameObject = Phaser.GameObjects.GameObject;
import Rectangle = Phaser.Geom.Rectangle;
import HitAreaCallback = Phaser.Types.Input.HitAreaCallback;



class Pet extends GameObject {
	
	public room: Room;

	public health: Health;
	public machine: StateMachine;
	public movement: Movement;

	private emotes: Sprite;
	private sprite: Sprite;
	private shadow: Ellipse;

	private coordinate: Point;
	private position: Point;
	private target: Point;


	constructor(scene: Scene, type: string) {
		super(scene, type);
		this.init();
	}


	private init() {
		this.health = new Health();

		this.health.setFactor('hunger', 100);
		this.health.setFactor('thirst', 100);
		this.health.setFactor('exercise', 100);
		this.health.setFactor('happiness',100);
		this.health.setFactor('sickness', 100);
		this.health.setFactor('bowel', 100);
		this.health.setFactor('bladder', 100);

		this.machine = new StateMachine(this);

		this.machine.setState('idle', new IdleState(this.machine));
		this.machine.setState('explore', new ExploreState(this.machine));
	}


	public create(position: Point) {
		this.position = position;
		this.coordinate = new Point(position.x * Tile.SIZE + Tile.SIZE/2, position.y * Tile.SIZE + Tile.SIZE);

		this.emotes = new Sprite(this.scene, this.coordinate.x, this.coordinate.y, 'emotes');
		this.emotes.setVisible(false);
		this.emotes.setDisplayOrigin(16, 32);
		this.emotes.setAlpha(0.8);
		this.scene.add.existing(this.emotes);

		this.sprite = new Sprite(this.scene, this.coordinate.x, this.coordinate.y, 'pets');
		this.sprite.setDisplayOrigin(16, 32);
		this.scene.add.existing(this.sprite);

		this.shadow = new Ellipse(this.scene, this.coordinate.x, this.coordinate.y, 3*Tile.SIZE/4, 3*Tile.SIZE/8, 0x000000, 0.15);
		this.shadow.setOrigin(0.5, 0.5);
		this.scene.add.existing(this.shadow);
		// if (this.type == "dinosaur") this.debugger.setColor(0x67b66b);
		// if (this.type == "bird") this.debugger.setColor(0xffd300);

		this.sprite.setInteractive({
			cursor: 'url(./assets/cursors/grab.png) 32 64, grab',
			hitArea: new Rectangle(5*Tile.SIZE/8, Tile.SIZE, 3*Tile.SIZE/4, Tile.SIZE),
			hitAreaCallback: Rectangle.Contains
		});

		this.sprite.on('pointerdown', (pointer) => {
			
		})
	}


	public setRoom(room: Room) {
		this.room = room;

		let emptyTiles = this.room.getTiles('empty');

		if (emptyTiles.length > 0) {
			let random = Math.floor(Math.random() * emptyTiles.length);
			let tile = emptyTiles[random];
			this.create(tile.getPosition());

			this.movement = new Movement(this.scene, this);
			this.movement.copyPosition(tile.getPosition());
			this.machine.transition('idle');
		}
	}


	public getCoordinate() {
		return this.coordinate;
	}


	public getPosition() {
		return this.position;
	}

	
	public getTarget() {
		return this.target;
	}


	public setFlipX(flip: boolean) {
		this.sprite.setFlipX(flip);
	}


	public play(key: string) {
		switch (key) {
			case 'idle':
				this.sprite.play(this.type + '-idle');
				break;
			case 'walk':
				this.sprite.play(this.type + '-walk');
				break; 
			case 'sleep':
				this.sprite.play(this.type + '-sleep');
				break;
			case 'emote-hungry':
				this.emotes.play('emote-hungry');
				break;
			case 'emote-happy':
				this.emotes.play('emote-happy');
				break;
			default:
				break;
		}
	}

	
	public update(time: number, delta: number) {
		this.health.update(time, delta);
		this.machine.update(time, delta);

		this.position = this.movement.getPosition();
		this.coordinate = this.movement.getCoordinate();

		// update layers
		let layers = 3;

		this.emotes.copyPosition(this.coordinate);
		this.sprite.copyPosition(this.coordinate);
		this.shadow.copyPosition(this.coordinate);

		this.emotes.setDepth(this.coordinate.y + (2 / layers));
		this.sprite.setDepth(this.coordinate.y + (1 / layers));
		this.shadow.setDepth(this.coordinate.y + (0 / layers));
	}
}


export { Pet }