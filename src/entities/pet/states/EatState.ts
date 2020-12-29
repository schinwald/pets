import { State } from "../../../State";
import { StateMachine } from '../../../StateMachine';
import { Pet } from "../Pet";



export class EatState extends State {

	private pet: Pet;


	constructor(machine: StateMachine) {
		super(machine);

		this.pet = this.machine.context;
	}


	public enter() {
		throw new Error("Method not implemented.");
	}


	public exit() {
		throw new Error("Method not implemented.");
	}


	public update(time: number, delta: number) {
		throw new Error("Method not implemented.");
	}
	
}