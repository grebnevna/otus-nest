import { Vector } from "./vector"

export interface Movable {
	getPosition(): Vector;
	setPosition(value: Vector): void;
	getVelocity(): Vector;
}