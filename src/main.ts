import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as dotenv from 'dotenv'; 
dotenv.config(); 


async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(process.env.PORT||3000);
  app.useGlobalPipes(new ValidationPipe( {whitelist: true,forbidNonWhitelisted:true})); //withlist >>>proprites wish
  // app.useStaticAssets(join(__dirname, '..', 'public'));


}
bootstrap();
