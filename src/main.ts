import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { BootstrapCommand } from './bootstrap-command';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  new BootstrapCommand().execute();

  await app.listen(4000);
}
bootstrap();
