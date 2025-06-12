import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Enable validation globally
  app.useGlobalPipes(new ValidationPipe());

  // Serve static files (for image access)
  app.useStaticAssets(join(__dirname, '..', 'uploads'));

  const port = process.env.PORT ?? 3000;
  await app.listen(port);

  console.log(`🚀 App running on: http://localhost:${port}`);
}
bootstrap();
