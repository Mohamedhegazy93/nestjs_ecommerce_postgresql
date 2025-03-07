import { BadRequestException, Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';

@Module({
  imports: [TypeOrmModule.forFeature([User]),MulterModule.register( {
    storage: diskStorage({
      destination: './images/users',
      filename: (req, file, cb) => {
        const prefix = `${Date.now()}-${Math.round(Math.random() * 1000000)}`;
        const filename = `${prefix}-${file.originalname}`;
        cb(null, filename);
      },
    }),
    fileFilter: (req, file, cb) => {
      if (file.mimetype.startsWith('image')) {
        cb(null, true);
      } else {
        cb(new BadRequestException('unsupported file format'), false);
      }
    },
    limits: { fileSize: 1024 * 1024 * 2 },
  })],
  controllers: [UserController],
  providers: [UserService],
  exports:[UserModule]
})
export class UserModule {}
