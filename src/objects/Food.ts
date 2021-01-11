import { Tilemaps } from "phaser";
import { Pet } from "../entities/pets/Pet";
import { Progress } from "../Progress";
import { Room, Tile, TileData } from "../Room";

import GameObject = Phaser.GameObjects.GameObject;
import Sprite = Phaser.GameObjects.Sprite;
import Scene = Phaser.Scene;
import Point = Phaser.Geom.Point;
import ParticleEmitter = Phaser.GameObjects.Particles.ParticleEmitter;
import ParticleEmitterManager = Phaser.GameObjects.Particles.ParticleEmitterManager;
import Line = Phaser.Geom.Line;
import Rectangle = Phaser.Geom.Rectangle;


class Food extends GameObject implements TileData {

	public room: Room;

	private sprite: Sprite;
	private particles: ParticleEmitterManager;
	private emitter: ParticleEmitter;
	private progress: Progress;
	private numEaters: number; 


	constructor(scene: Scene, progress: Progress) {
		super(scene, 'food');
		this.progress = progress;
		this.init();
	}


	private init() {
		this.numEaters = 0;
	}


	public create(coordinate: Point) {
		this.sprite = new Sprite(this.scene, coordinate.x, coordinate.y, 'objects');
		this.sprite.setDisplayOrigin(16, 32);
		this.sprite.setDepth(coordinate.y);
		this.scene.add.existing(this.sprite);

		this.particles = new ParticleEmitterManager(this.scene, 'particles');
		
		this.emitter = new ParticleEmitter(this.particles, {
			alpha: { start: 1, end: 0, ease: 'Sin.easeOut' },
			lifespan: 500,
			angle: { min: 240, max: 300 },
			speed: { min: 20, max: 40 },
			quantity: 30,
			gravityY: 100,
			emitZone: { type: 'random', source: new Rectangle(-4, 0, 8, 0) },
			frame: ['particles-food-00', 'particles-food-01', 'particles-food-02'],
			followOffset: { x: 0, y: -5 },
			follow: this.sprite
		});

		this.particles.addEmitter(this.emitter);
		this.emitter.setFrequency(-1);
		this.scene.add.existing(this.particles);

		if (this.progress.getPercentage() > 50) {
			this.sprite.setFrame('object-food-full');
		} else if (this.progress.getPercentage() > 0) {
			this.sprite.setFrame('object-food-half');
		} else if (this.progress.getPercentage() == 0) {
			this.sprite.setFrame('object-food-empty');
		}
	}

 
	public interact(pet: Pet) {
		let progress = pet.health.getFactor('hunger');

		// account for overflow
		let remainder = this.progress.getCurrent() - progress.getCurrent();
		if (remainder >= 0) {
			// equal to the pets hunger
			this.progress.decrement(progress.getCurrent());
			progress.decrement(progress.getCurrent());
		} else {
			// less than the pets hunger
			this.progress.decrement(progress.getCurrent() + remainder);
			progress.decrement(progress.getCurrent() + remainder);
		}

		if (this.progress.getPercentage() > 70) {
			this.sprite.setFrame('object-food-full');
		} else if (this.progress.getPercentage() > 0) {
			this.sprite.setFrame('object-food-half');
		} else if (this.progress.getPercentage() == 0) {
			this.sprite.setFrame('object-food-empty');
		}
	}


	public eat(eat: boolean) {
		if (eat) {
			this.numEaters++;
			if (this.numEaters == 1) this.emitter.setFrequency(400);
		} else {
			this.numEaters--;
			if (this.numEaters == 0) this.emitter.setFrequency(-1);
		}
	}


	public play(key: string) {
		// switch (key) {
		// 	case 'eat':
		// 		this.
		// 		break;
		// 	default:
		// 		break;
		// }
	}


	public setProgress(progress: Progress) {
		this.progress = progress;
	}


	public getProgress(): Progress {
		return this.progress;
	}
}



export { Food };