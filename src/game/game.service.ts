import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { IoC } from 'src/core/ioc';
import { Command } from 'src/models/command';
import { PerformCommandRequestDto } from 'src/models/dto/command/perform-command-request-dto';
import { GameRegistrationRequestDto } from 'src/models/dto/game/game-registration-request-dto';

@Injectable()
export class GameService {

	registerGame(gameRegistrationRequestDto: GameRegistrationRequestDto): string {
		const gameId = randomUUID();
		const gameScope = IoC.resolve<Map<string, (...args: any[]) => any>>('IoC.Scope.Create');
		IoC.currentScope = gameScope;
		IoC.scopeMap.set(gameId, gameScope);

		IoC.resolve<Command>('IoC.Register', 'gameConfig', () => gameRegistrationRequestDto.config).execute();
		gameRegistrationRequestDto.players.forEach(player => {
			IoC.resolve<Command>('IoC.Register', player.name, () => player.initialParameters).execute();
		});

		return gameId;
	}

	performGameCommand({ gameId, gameObjectName, operationName, params }: PerformCommandRequestDto): { [key: string]: any } {
		IoC.currentScope = IoC.scopeMap.get(gameId);
		const gameObject = IoC.resolve(gameObjectName);
		const gameCommand = IoC.resolve<Command>(
			'gameCommands',
			operationName,
			gameObject,
			params
		);
		gameCommand.execute()

		return gameObject;
	}
}
