import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor() { }

  @Get()
  solve(a: number, b: number, c: number): number[] {

    if (!isFinite(a) || !isFinite(b) || !isFinite(c)) {
      throw new Error("Коэффициенты должны быть конечными числами");
    }
    
    if (Math.abs(a) <= Number.EPSILON) {
      throw new Error("Коэффициент a не может быть равен 0");
    }

    const discriminant = b * b - 4 * a * c;

    // Если дискриминант меньше нуля (с учетом погрешности) - нет корней
    if (discriminant < -Number.EPSILON) {
      return [];
    }

    // Если дискриминант очень близок к нулю - один корень кратности 2
    if (Math.abs(discriminant) <= Number.EPSILON) {
      const root = -b / (2 * a);
      return [root, root];
    }

    // Два различных корня
    const sqrtDiscriminant = Math.sqrt(discriminant);
    const root1 = (-b + sqrtDiscriminant) / (2 * a);
    const root2 = (-b - sqrtDiscriminant) / (2 * a);
    return [root1, root2];
  }
}
