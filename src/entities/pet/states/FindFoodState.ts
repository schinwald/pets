import { State } from "../../../State";
import { Pet } from "../Pet";
import { StateMachine } from '../../../StateMachine';

export class FindFoodState extends State {

	private pet: Pet;


	constructor(machine: StateMachine) {
		super(machine);

		this.pet = this.machine.context;
	}


	public enter() {
		// move to food tile
		if (this.pet.health.getFactor('hunger').getPercentage() >= 50) {
			let foodTiles = this.pet.room.getTiles('food');

			let shortestDistance = -1;
			let shortestIndex = -1;
			for (let i = 0; i < foodTiles.length; i++) {
				let tile = foodTiles[i];
				let distance = this.pet.room.calculateDistance(this.pet.getPosition(), tile.getPosition());

				if (i == 0 || distance < shortestDistance) {
					shortestDistance = distance
					shortestIndex = i;
				}
			}

			if (shortestIndex != -1) {
				let tile = foodTiles[shortestIndex];
				this.pet.movement.move(tile.getPosition());
			}
		}
	}


	public exit() {
		
	}


	public update(time: number, delta: number) {
		
	}
	
}