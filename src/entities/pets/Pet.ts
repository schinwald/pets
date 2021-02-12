import { Health } from "./Health";
import { Movement } from "./Movement";
import { StateMachine } from "../../states/StateMachine";
import { Room, Tile } from "../../Room";
import { Actions } from "./Actions";
import { Emotions } from "./Emotions";

import Scene = Phaser.Scene;
import Sprite = Phaser.GameObjects.Sprite;
import Point = Phaser.Geom.Point;
import Ellipse = Phaser.GameObjects.Ellipse;
import GameObject = Phaser.GameObjects.GameObject;
import Rectangle = Phaser.Geom.Rectangle;



class Pet extends GameObject {
	
	public room: Room;
	public alpha: number;

	public health: Health;
	public emotions: StateMachine;
	public actions: StateMachine;
	public movement: Movement;

	public emotes: Sprite;
	public sprite: Sprite;
	public shadow: Ellipse;

	private coordinate: Point;
	private position: Point;
	private target: Point;


	constructor(scene: Scene, type: string) {
		super(scene, type);
		this.init();
}


	private init() {
		this.health = new Health();

		this.health.setFactor('hunger', 50000);
		// this.health.setFactor('thirst', 100);
		// this.health.setFactor('exercise', 100);
		// this.health.setFactor('happiness',100);
		// this.health.setFactor('sickness', 100);
		// this.health.setFactor('bowel', 100);
		// this.health.setFactor('bladder', 100);

		this.emotions = new StateMachine(this);

		this.emotions.setState('neutral', new Emotions.NeutralState(this.emotions));
		this.emotions.setState('hunger', new Emotions.HungerState(this.emotions));

		this.actions = new StateMachine(this);

		this.actions.setState('idle', new Actions.IdleState(this.actions));
		this.actions.setState('explore', new Actions.ExploreState(this.actions));
		this.actions.setState('hunger', new Actions.HungerState(this.actions));
		this.actions.setState('eat', new Actions.EatState(this.actions));
		this.actions.setState('die', new Actions.DieState(this.actions));

		this.alpha = 1;
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

		this.sprite.setInteractive({
			cursor: 'url(./assets/cursors/grab.png) 5 5, grab',
			hitArea: new Rectangle(5*Tile.SIZE/8, Tile.SIZE, 3*Tile.SIZE/4, Tile.SIZE),
			hitAreaCallback: Rectangle.Contains
		});
	}


	public setRoom(room: Room) {
		this.room = room;
	}


	public place(position: Point): boolean {
		if (this.room == null) return false;

		let tile = this.room.getTile(position);
		if (tile == null) return false;

		this.create(position);

		this.movement = new Movement(this.scene, this);
		this.movement.setDebugger(true);
		this.movement.copyPosition(position);

		this.emotions.transition('neutral');
		this.actions.transition('idle');

		return true;
	}


	public getCoordinate() {
		return this.coordinate;
	}


	public getPosition() {
		return this.position;
	}


	public setTarget(target: Point) {
		this.target = target;
	}


	public setAlpha(alpha: number) {
		this.emotes.setAlpha(alpha * 0.8);
		this.sprite.setAlpha(alpha);
		this.shadow.setAlpha(alpha);
	}

	
	public getTarget() {
		return this.target;
	}


	public setFlipX(flip: boolean) {
		this.sprite.setFlipX(flip);
	}


	public play(key: string): Sprite {
		return this.sprite.play(this.type + '-' + key);
	}


	public emote(key: string): Sprite {
		return this.emotes.play('emote' + '-' + key);
	}

	
	public update(time: number, delta: number) {
		this.health.update(time, delta);
		this.emotions.update(time, delta);
		this.actions.update(time, delta);

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

		this.setAlpha(this.alpha);
	}


	public destroy() {
		super.destroy();
		this.sprite.destroy();
		this.shadow.destroy();
		this.emotes.destroy();
	}
}



export { Pet }