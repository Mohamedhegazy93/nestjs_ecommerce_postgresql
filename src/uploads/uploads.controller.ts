import {
  BadRequestException,
  Controller,
  Get,
  Param,
  Post,  
  Res,  
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response,Express } from 'express';
import { diskStorage } from 'multer';

@Controller('uploads')
export class UploadsController {
  // POST: ~/uploads/file
  @Post()
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './images',
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
    }),
  )
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('no file provided');
    }

    console.log(file);
    return { messgae: 'file uploaded sucessfully' };
  }

// GET: ~/uploads/:image
  @Get(":image")
  showImage(@Param('image') image:string,@Res() res:Response){
    return res.sendFile(image,{root:'images'})
  }
}
