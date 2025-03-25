import { Command } from "src/models/command"
import { Movable } from "src/models/movable"
import { Vector } from "src/models/vector"

export class MoveCommand implements Command {

	constructor(private obj: Movable) {}

	execute() {
			const newPosition = Vector.plus(this.obj.getPosition(), this.obj.getVelocity())

			this.obj.setPosition(newPosition)
	}
}