import { State } from "../../../State";
import { StateMachine } from "../../../StateMachine";
import { Health } from "../../../../entities/pets/Health";
import { Movement } from "../../../../entities/pets/Movement";
import { Pet } from "../../../../entities/pets/Pet";

import List = Phaser.Structs.List;



export class IdleState extends State {

	private pet: Pet;

	private interval: number;
	private monitor: List<string>;


	constructor(machine: StateMachine) {
		super(machine);

		this.pet = this.machine.context;
		this.interval = 0;
		this.monitor = new List<string>(null);
	}


	public enter() {
		this.pet.play('idle');
	}


	public exit() {
		
	}

	
	public update(time: number, delta: number) {
		this.interval += delta;

		if (this.interval >= 5000) {
			this.interval -= 5000;
			for (let name of this.pet.health.getFactorNames()) {
				let factor = this.pet.health.getFactor(name);
				
				if (factor.getPercentage() == 100) {
					this.machine.transition('die');
				} else if (factor.getPercentage() >= 50) {
					this.pet.emotions.transition(name);
					this.machine.transition(name);
					return;
				}
			}
		}

		if (Math.random() * 100 < 0.2) {
			this.machine.transition('explore');
			return;
		}
	}
}