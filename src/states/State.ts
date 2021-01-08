import { StateMachine } from './StateMachine';



export abstract class State {

	private name: string;
	public machine: StateMachine;


	constructor(machine: StateMachine) {
		this.machine = machine;
	}

	
	public setName(name: string) {
		this.name = name;
	}


	public getName(): string {
		return this.name;
	}


	public abstract enter();


	public abstract exit();

	
	public abstract update(time: number, delta: number);
}