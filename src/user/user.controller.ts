import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UsePipes,
  ValidationPipe,
  UseGuards,
  ParseIntPipe,
  Req,
  UseInterceptors,
  ClassSerializerInterceptor,
  UseFilters,
  ForbiddenException,
  BadRequestException,
  UploadedFile,
  UploadedFiles,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/auth/guards/roles.enum';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @UseGuards(AuthGuard)
  @Roles(Role.Admin)
  create(@Body(new ValidationPipe()) createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }
  @UseGuards(AuthGuard)
  @Roles(Role.Admin)
  @Get()
  findAll() {
    return this.userService.findAll();
  }
  @UseGuards(AuthGuard)
  @Roles(Role.User)
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: string, @Req() req) {
    return this.userService.findOne(+id, req.user);
  }
  @UseGuards(AuthGuard)
  @Roles(Role.User)
  @Patch(':id')
  update(
    @Param('id', new ParseIntPipe()) id: string,
    @Body() updateUserDto: UpdateUserDto,
    @Req() req,
  ) {
    return this.userService.update(+id, updateUserDto, req.user);
  }
  @UseGuards(AuthGuard)
  @Roles(Role.Admin,Role.User)
  @Delete(':id')
  remove(@Param('id') id: string, @Req() req) {
    return this.userService.remove(+id, req.user);
  }

  @Post('upload-image')
  @UseGuards(AuthGuard)
  @UseInterceptors(
    FileInterceptor('user-image'),
  )
  uploadProfileImage(@UploadedFile() file: Express.Multer.File,@Req() req) {
    if (!file) {
      throw new BadRequestException('no image provided');
    }

    return this.userService.setProfileImage(req.user.id,file.filename)

  }

  @Post('upload-files')
  @UseGuards(AuthGuard)
  @UseInterceptors(
    FilesInterceptor('files'),
  )
  uploadFiles(@UploadedFiles() files: Array<Express.Multer.File>,@Req() req) {
    if (!files||files.length==0) {
      throw new BadRequestException('no files provided');
    }
    console.log(files)

    return {message:'files uploded sucessfully'}
  }
}
