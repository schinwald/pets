import { State } from "../../../State";
import { Pet } from "../../../../entities/pets/Pet";
import { StateMachine } from '../../../StateMachine';
import { Food } from "../../../../objects/Food";

import Point = Phaser.Geom.Point;



export class HungerState extends State {

	private pet: Pet;

	constructor(machine: StateMachine) {
		super(machine);

		this.pet = this.machine.context;
	}


	public enter() {
		let foodTiles = this.pet.room.getTiles('food');
		let shortestDistance = null;
		let shortestIndex = null;

		// find closest food tile
		shortestDistance = -1;
		shortestIndex = -1;
		for (let i = 0; i < foodTiles.length; i++) {
			let tile = foodTiles[i];
			let food = tile.getData() as Food;
			if (food.getProgress().getPercentage() == 0) continue; // don't bother going to food tile if it empty
			let distance = this.pet.room.calculateDistance(this.pet.getPosition(), tile.getPosition());
			if (i == 0 || distance < shortestDistance) {
				shortestDistance = distance
				shortestIndex = i;
			}
		}

		if (shortestIndex == -1) {
			this.machine.transition('idle');
			return;
		}

		let tile = foodTiles[shortestIndex];
		let position = tile.getPosition();

		let adjacents = new Array<Point>(4);
		adjacents[0] = new Point(position.x + 0, position.y - 1);
		adjacents[1] = new Point(position.x + 1, position.y + 0);
		adjacents[2] = new Point(position.x + 0, position.y + 1);
		adjacents[3] = new Point(position.x - 1, position.y + 0);

		// find closest adjacent tile to food tile
		shortestDistance = -1;
		shortestIndex = -1;
		for (let i = 0; i < 4; i++) {
			let adjacent = adjacents[i];
			let tile = this.pet.room.getTile(adjacent);
			if (tile == null) continue; // don't bother going to adjacent tile if it is null (past grid)
			let distance = this.pet.room.calculateDistance(this.pet.getPosition(), tile.getPosition());
			if (i == 0 || distance < shortestDistance) {
				shortestDistance = distance;
				shortestIndex = i;
			}
		}

		if (shortestIndex == -1) {
			this.machine.transition('idle');
			return;
		}

		console.log(this.pet.getPosition(), adjacents[shortestIndex]);

		this.pet.movement.move(adjacents[shortestIndex]);
		this.pet.setTarget(position);
		this.pet.play('walk');
	}


	public exit() {
		
	}


	public update(time: number, delta: number) {
		this.pet.movement.update(time, delta);
		
		if (this.pet.movement.isDone()) {
			this.machine.transition('eat');
			return;
		}
	}
}