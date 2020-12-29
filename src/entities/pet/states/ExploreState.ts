import { State } from "../../../State";
import { StateMachine } from "../../../StateMachine";
import { Health } from "../Health";
import { Movement } from '../Movement';
import { Pet } from "../Pet";



export class ExploreState extends State {

	private pet: Pet;


	constructor(machine: StateMachine) {
		super(machine);
		
		this.pet = this.machine.context;
	}


	public enter() {
		this.pet.play('walk');
		
		let maxDistance = 3;
		let emptyTiles = this.pet.room.getTiles('empty');
		let tiles = emptyTiles.filter((value, index, array) => {
			let distance = this.pet.room.calculateDistance(this.pet.getPosition(), value.getPosition());
			return distance <= maxDistance;
		});

		if (emptyTiles.length > 0) {
			let random = Math.floor(Math.random() * tiles.length);
			let tile = tiles[random];
			this.pet.movement.move(tile.getPosition());
		}
	}


	public exit() {
		
	}
	
	
	public update(time: number, delta: number) {
		this.pet.movement.update(time, delta);

		if (this.pet.movement.isDone()) this.machine.transition('idle');
	}
}