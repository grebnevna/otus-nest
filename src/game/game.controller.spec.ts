import { Test, TestingModule } from '@nestjs/testing';
import { GameController } from './game.controller';
import { GameService } from './game.service';
import { GameRegistrationRequestDto } from 'src/models/dto/game/game-registration-request-dto';
import { IoC } from 'src/core/ioc';
import { BootstrapCommand } from 'src/bootstrap-command';

describe('GameController', () => {
  let gameController: GameController;

  let gameRegistrationRequestDto: GameRegistrationRequestDto;
  const xVelocity = 15;
  const yVelocity = 30;
  const xPosition = 1;
  const yPosition = 1;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GameController],
      providers: [GameService],
    }).compile();

    new BootstrapCommand().execute();

    gameRegistrationRequestDto = {
      "players": [
        {
          "name": "blue",
          "initialParameters": {
            "velocity": { "x": xVelocity, "y": yVelocity },
            "position": { "x": xPosition, "y": yPosition }
          }
        }
      ],
      "config": { "gameTime": 20000 }
    }

    gameController = module.get<GameController>(GameController);
  });

  it('should be defined', () => {
    expect(gameController).toBeDefined();
  });

  it('метод регистрации игры должен возвращать идентификатор созданной игры', () => {
    const gameId = gameController.registerGame(gameRegistrationRequestDto);
    expect(gameId).not.toBeUndefined();
  });

  it('метод регистрации игры должен создавать отдельный скоуп для созданной игры',  () => {
    const gameId = gameController.registerGame(gameRegistrationRequestDto);
    const gameScope = IoC.scopeMap.get(gameId);

    const savedPlayerData = gameScope.get(gameRegistrationRequestDto.players[0].name)();
    const savedGameConfig = gameScope.get('gameConfig')();

    expect(gameScope).not.toBeNull();
    expect(savedPlayerData).toEqual(gameRegistrationRequestDto.players[0].initialParameters);
    expect(savedGameConfig).toEqual(gameRegistrationRequestDto.config);
  });

  it('game commands должны проинициализироваться внутри IoC контейнера при бутстрапе приложения', () => {
    const gameCommands = IoC.rootScope.get('gameCommands');
    expect(gameCommands).not.toBeNull();
  });

  it('при вызове move command для определенного игрового объекта определенной игры должны возвращаться измененные параметры этого объекта', () => {
    const gameId = gameController.registerGame(gameRegistrationRequestDto);

    const bluePlayer = gameRegistrationRequestDto.players[0];

    const performCommandDto = {
      gameId,
      gameObjectName: bluePlayer.name,
      operationName: "move",
      params: {}
    };

    const result = gameController.performCommand(performCommandDto);

    expect(result.position).toEqual({ x: xPosition + xVelocity, y: yPosition + yVelocity});
  });

  it('при вызове move command для определенного игрового объекта определенной игры должно меняться состояние этого объекта в игровом скоупе', () => {
    const gameId = gameController.registerGame(gameRegistrationRequestDto);

    const bluePlayer = gameRegistrationRequestDto.players[0];

    const performCommandDto = {
      gameId,
      gameObjectName: bluePlayer.name,
      operationName: "move",
      params: {}
    };

    const gameScope = IoC.scopeMap.get(gameId);
    gameController.performCommand(performCommandDto);

    IoC.currentScope = gameScope;
    const gameObject = IoC.resolve<any>(gameRegistrationRequestDto.players[0].name);

    expect(gameObject.position).toEqual({ x: xPosition + xVelocity, y: yPosition + yVelocity});
  });
});
