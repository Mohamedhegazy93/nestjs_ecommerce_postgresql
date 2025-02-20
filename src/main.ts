import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as dotenv from 'dotenv'; // استيراد dotenv
dotenv.config(); // تكوين dotenv - يجب أن يكون هذا السطر في بداية الملف


async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(process.env.PORT||3000);
  app.useGlobalPipes(new ValidationPipe( {whitelist: true})); //withlist >>>proprites wish

}
bootstrap();
