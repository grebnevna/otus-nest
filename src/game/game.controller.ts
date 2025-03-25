import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { GameService } from './game.service';
import { PerformCommandRequestDto } from 'src/models/dto/command/perform-command-request-dto';
import { GameRegistrationRequestDto } from 'src/models/dto/game/game-registration-request-dto';

@Controller('game')
export class GameController {

	constructor(private readonly gameService: GameService) {
	}

	@Post('register')
	@HttpCode(201)
	registerGame(@Body() gameRegistrationRequestDto: GameRegistrationRequestDto): string {
		return this.gameService.registerGame(gameRegistrationRequestDto)
	}

	@Post('/operation')
  performCommand(@Body() performCommandRequestDto: PerformCommandRequestDto): {[key: string]: any} {
    return this.gameService.performGameCommand(performCommandRequestDto);
  }
}
