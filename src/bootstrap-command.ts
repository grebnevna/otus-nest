import { MovableAdapter } from "./adapters/movable-adapter";
import { MoveCommand } from "./core/commands/game-object/move-command";
import { InitCommand } from "./core/commands/ioc/init-command";
import { IoC } from "./core/ioc";
import { Command } from "./models/command";

export class BootstrapCommand implements Command {
	execute(): void {
		this.initializeIoC();
		this.addGameCommandsToIoc();
	}

	private initializeIoC() {
		const initCommand = new InitCommand();
		IoC.currentScope = IoC.rootScope;
		initCommand.execute();
	}

	private addGameCommandsToIoc() {
		const gameCommands = new Map<string, (...args: any[]) => Command>();
		gameCommands.set('move', (...args) => new MoveCommand(new MovableAdapter(args[0])));

		IoC.resolve<Command>(
			'IoC.Register',
			'gameCommands',
			(commandName: string, ...args) => gameCommands.get(commandName)(...args)
		).execute();
	}
}