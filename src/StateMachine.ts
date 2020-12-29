import { State } from "./State";

import Map = Phaser.Structs.Map;



export class StateMachine {

	public context: any;

	protected current: State;
	protected states: Map<string, State>;


	constructor(context: any) {
		this.context = context;
		this.init();
	}


	private init() {
		this.current = null;
		this.states = new Map<string, State>(null);
	}


	public setState(name: string, state: State) {
		state.setName(name);
		this.states.set(name, state);
	}


	public getCurrent(): State {
		return this.current;
	}

	
	public transition(name: string) {
		if (this.current != null) this.current.exit();
		this.current = this.states.get(name);
		this.current.enter();
	}


	public update(time: number, delta: number) {
		if (this.current == null) return;
		this.current.update(time, delta);
	}
}