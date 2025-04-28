import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { throwError } from 'rxjs';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('root', () => {

    it('Для уравнения x^2+1 = 0 корней нет (возвращается пустой массив)', () => {
      expect(appController.solve(1, 0, 1)).toEqual([]);
    });

    it('Для уравнения x^2-1 = 0 есть два корня кратности 1 (x1=1, x2=-1)', () => {
      expect(appController.solve(1, 0, -1)).toEqual([1, -1]);
    });

    it('Для уравнения x^2+2x+1 = 0 есть один корень кратности 2 (x1= x2 = -1)', () => {
      expect(appController.solve(1, 2, 1)).toEqual([-1, -1]);
    });

    it('Коэффициент a не может быть равен 0, в этом случае solve выбрасывает исключение.', () => {

      const a = Number.EPSILON / 2;
      const b = 1;
      const c = 1;
      const incorrectSolveInvocation = appController.solve.bind(this, a, b, c);

      expect(incorrectSolveInvocation).toThrow(Error("Коэффициент a не может быть равен 0"))
    });

    it('дискриминант отличный от нуля, но меньше заданного эпсилон', () => {

      const a = 1;
      const b = 2;
      const c = 1 + Number.EPSILON / 2;

      expect(appController.solve(a, b, c)).toEqual([-1, -1]);
    });
  });
});
