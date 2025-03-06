import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as dotenv from 'dotenv'; 
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
dotenv.config(); 


async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe( {whitelist: true,forbidNonWhitelisted:true})); //withlist >>>proprites wish
  // app.useStaticAssets(join(__dirname, '..', 'public'));
  app.enableCors({
    origin:'http://localhost:3000'
  })
  

  //Swagger Docs
  const swagger=new DocumentBuilder().setTitle('Nestjs_project').addServer('http://localhost:3000').setVersion('1.0').build()
  const documentation=SwaggerModule.createDocument(app,swagger)
  SwaggerModule.setup('swagger',app,documentation)
  await app.listen(process.env.PORT||3000);


}
bootstrap();
