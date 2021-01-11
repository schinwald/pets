import { Food } from "../../../../objects/Food";
import { State } from "../../../State";
import { StateMachine } from '../../../StateMachine';
import { Pet } from "../../../../entities/pets/Pet";
import { Scene, Tweens } from "phaser";
import { Grave } from "../../../../objects/Grave";
import { Room } from "../../../../Room";

import Timeline = Phaser.Tweens.Timeline;
import Tween = Phaser.Tweens.Tween;



export class DieState extends State {

	private pet: Pet;
	private scene: Scene;
	private room: Room;

	private duration: number;
	private timeline: Timeline;


	constructor(machine: StateMachine) {
		super(machine);

		this.pet = this.machine.context;
		this.duration = 0;
	}


	public enter() {
		this.scene = this.pet.scene;
		this.room = this.pet.room;

		this.pet.play('die').once('animationcomplete', () => {
			this.pet.scene.tweens.add({
				targets: this.pet,
				alpha: { from: 1, to: 0 },
				ease: 'Linear',
				duration: 1000,
				onComplete: () => {
					let position = this.pet.getPosition();
					let grave = new Grave(this.scene, 'grave');
					this.room.setTile(position, grave, false);

					let tile = this.room.getTile(position);
					grave.create(tile.getCoordinate());
					grave.play('show');

					this.room.uninvite(this.pet);
					this.pet.destroy();
				}
			})
		}, this);
	}


	public exit() {
		
	}


	public update(time: number, delta: number) {
		
	}
}