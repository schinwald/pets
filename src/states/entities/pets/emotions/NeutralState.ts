import { State } from "../../../../states/State";
import { StateMachine } from "../../../StateMachine";
import { Pet } from "../../../../entities/pets/Pet";

import List = Phaser.Structs.List;



export class NeutralState extends State {

	private pet: Pet;
	
	private duration: number;


	constructor(machine: StateMachine) {
		super(machine);

		this.pet = this.machine.context;
		this.duration = 0;
	}


	public enter() {
		
	}


	public exit() {
		
	}

	
	public update(time: number, delta: number) {
		
	}
}