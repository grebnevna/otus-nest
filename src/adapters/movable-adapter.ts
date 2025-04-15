import { Movable } from "src/models/movable";
import { Vector } from "src/models/vector";

export class MovableAdapter implements Movable {
	constructor(private obj: {[key: string]: any}) {}

	getPosition(): Vector {
		return new Vector(
			this.obj.position.x, 
			this.obj.position.y
		);
	}

	setPosition(value: Vector): void {
		this.obj.position.x = value.x;
		this.obj.position.y = value.y;
	}

	getVelocity(): Vector {
		return new Vector(
			this.obj.velocity.x, 
			this.obj.velocity.y
		);
	}
}