import { Controller, Get, Post, Body, Patch, Param, Delete, UsePipes, ValidationPipe, UseGuards, ParseIntPipe, Req, UseInterceptors, ClassSerializerInterceptor, UseFilters, ForbiddenException } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/auth/guards/roles.enum';
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
  findOne(@Param('id',ParseIntPipe) id: string,@Req() req) {
    return this.userService.findOne(+id,req.user);
  }
  @UseGuards(AuthGuard)
  @Roles(Role.User)
  @Patch(':id')
  update(@Param('id',new ParseIntPipe()) id: string, @Body() updateUserDto: UpdateUserDto,@Req() req) {
    return this.userService.update(+id, updateUserDto,req.user);
  }
  @UseGuards(AuthGuard)
  @Roles(Role.User)
  @Delete(':id')
  remove(@Param('id') id: string,@Req() req) {
    return this.userService.remove(+id,req.user);
  }
}
