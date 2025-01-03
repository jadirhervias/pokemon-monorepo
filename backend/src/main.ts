import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.enableCors();
  const configService = app.get(ConfigService);
  await app.listen(parseInt(configService.get('PORT'), 10) || 4000);
}

bootstrap();
