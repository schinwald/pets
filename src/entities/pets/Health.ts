import { Progress } from "../../Progress";

import Map = Phaser.Structs.Map;



class Health {

	private factors: Map<string, Progress>;


	constructor() {
		this.factors = new Map<string, Progress>(null);
	}

	// 
	public setFactor(name: string, finish: number) {
		let progress = null;

		// checks if initialized already
		if (this.factors.get(name) == undefined) {
			progress = new Progress(0, finish);
		} else {
			progress = this.factors.get(name);
			progress.setFinish(finish);
		}

		this.factors.set(name, progress);
	}

	//
	public getFactor(name: string): Progress {
		return this.factors.get(name);
	}

	//
	public getFactorNames(): Array<string> {
		return this.factors.keys();
	}

	// 
	public update(time: number, delta: number) {
		for (let key of this.factors.keys()) {
			this.factors.get(key).increment(delta);
		}
	}
}



export { Health };