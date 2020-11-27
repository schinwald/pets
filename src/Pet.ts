import { Health } from "./Health";

import Scene = Phaser.Scene;
import Sprite = Phaser.GameObjects.Sprite;
import Point = Phaser.Geom.Point;



class Pet {
	private scene: Scene;
	private type: string;
	private sprite: Sprite;
	private health: Health;
	private direction: number;
	private position: Point;


	constructor(scene: Phaser.Scene, type: string) {
		this.scene = scene;
		this.type = type;
		this.init();
		this.create();
	}


	public init() {
		this.direction = 1;
		this.position = new Point(0, 0);
	}


	public create() {
		this.sprite = new Sprite(this.scene, 12, 12, 'pet');
		this.sprite.play(this.type + '-idle');
		this.scene.add.existing(this.sprite);
	}

	public getPosition() {
		return this.position;
	}

	public getSprite(): Sprite {
		return this.sprite;
	}

	public move(x: number, y: number) {
		let a = x - this.sprite.x; 
		let b = y - this.sprite.y;
		if(a == 0 && b == 0) return;

		let distance = Math.sqrt(Math.pow(a, 2) + Math.pow(b, 2));
		let speed = 15;

		let direction = this.direction;
		if (a < 0) {
			direction = -1;
		} else if (a > 0) {
			direction = 1;
		}

		if(direction != this.direction) this.sprite.toggleFlipX();
		this.direction = direction;
		this.sprite.play(this.type + '-walk');

		this.scene.tweens.add({
			targets: this.sprite,
			x: x,
			y: y,
			duration: (distance / speed) * 1000,
			onCompleteScope: this,
			onComplete: function() {
				this.sprite.play(this.type + '-idle');
			}
		});

		this.position.x = x;
		this.position.y = y;
	}
}



export { Pet }