import { State } from "../../../State";
import { StateMachine } from "../../../StateMachine";
import { Health } from "../Health";
import { Movement } from "../Movement";
import { Pet } from "../Pet";



export class IdleState extends State {

	private pet: Pet;


	constructor(machine: StateMachine) {
		super(machine);

		this.pet = this.machine.context;
	}


	public enter() {
		this.pet.play('idle');
	}


	public exit() {
		
	}

	
	public update(time: number, delta: number) {
		if (Math.random() * 100 < 0.2) this.machine.transition('explore');
	}
}