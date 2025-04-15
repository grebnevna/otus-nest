export class Vector {
	constructor(public x: number, public y: number) { }

	static plus(firstVector: Vector, secondVector: Vector): Vector {
		return new Vector(
			firstVector.x + secondVector.x,
			firstVector.y + secondVector.y
		)
	}
}