import { Food } from "../../../objects/Food";
import { State } from "../../../State";
import { StateMachine } from '../../../StateMachine';
import { Pet } from "../Pet";



export class EatState extends State {

	private pet: Pet;

	private duration: number;


	constructor(machine: StateMachine) {
		super(machine);

		this.pet = this.machine.context;
		this.duration = 0;
	}


	public enter() {
		this.pet.play('eat');

		let position = this.pet.getTarget();
		let tile = this.pet.room.getTile(position);
		let food = tile.getData() as Food;
		food.interact(this.pet);
	}


	public exit() {
		
	}


	public update(time: number, delta: number) {
		this.duration += delta;

		if (this.duration >= 6000) {
			this.duration = 0;
			this.machine.transition('idle');
			return;
		}
	}
	
}