export class Progress {

	private current: number;
	private finish: number;

	constructor(current: number, finish: number) {
		this.current = current;
		this.finish = finish;
	}

	// 
	public increment(value: number) {
		if (this.isFinished()) return;
		this.current = Math.min(this.current + value, this.finish);
	}

	// 
	public decrement(value: number) {
		this.current = Math.max(this.current - value, 0);
	}

	// 
	public setCurrent(current: number) {
		this.current = current;
	}

	// 
	public setFinish(finish: number) {
		this.finish = finish;
	}

	// 
	public getCurrent() {
		return this.current;
	}

	// 
	public getFinish() {
		return this.finish;
	}

	// 
	public isFinished() {
		return this.current == this.finish;
	}

	// 
	public getPercentage(): number {
		return (this.current / this.finish) * 100;;
	}
}