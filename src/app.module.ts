import { ClassSerializerInterceptor, Module, ValidationPipe } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { ProductModule } from './product/product.module';
import { ReviewModule } from './review/review.module';
import * as dotenv from 'dotenv'; 
import { UploadsModule } from './uploads/uploads.module';
import { MailModule } from './mail/mail.module';
dotenv.config(); 



@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: '127.0.0.1',
      port: 5432,
      username: process.env.DB_USERNAME,
      database: process.env.DB_NAME,
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
    }),
    AuthModule,
    UserModule,
    MailModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      ignoreEnvFile:true
      
    }),
    ProductModule,
    ReviewModule,
    UploadsModule
  ],

  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_PIPE,
      useClass: ValidationPipe,
    },
    {
      provide:APP_INTERCEPTOR,
      useClass:ClassSerializerInterceptor  //Exclude()
    }
  ],
})
export class AppModule {}
