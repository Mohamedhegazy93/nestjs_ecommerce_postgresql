import { HttpException, Injectable } from '@nestjs/common';
import { LoginDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private jwtService: JwtService, // حقن JwtService
  ) {}
  async register(createUserDto: CreateUserDto) {
    const user = await this.usersRepository.findOneBy({
      email: createUserDto.email,
    });
    if (user) {
      throw new HttpException('user already registred , please login', 400);
    }

    const newUser = this.usersRepository.create(createUserDto);
    await this.usersRepository.save(newUser);

    return {
      message: 'user register sucessfully , loign now',
      userName: newUser.userName,
      email: newUser.email,
    };
  }
  async login(loginDto: LoginDto) {
    const user = await this.usersRepository.findOneBy({
      email: loginDto.email,
    });
    if (!user) {
      throw new HttpException('please resgister first', 400);
    }
    const isMatch = await user.comparePassword(loginDto.password);
    if (!isMatch) {
      throw new HttpException('incorrect email or password', 400);
    }

    const payload = {
      _id: user.id,
      isAdmin: user.isAdmin,
      token: user.token,
    };

    if (user && isMatch) {
      const token = this.jwtService.sign(payload);
      console.log(token);
      return {
        message: 'logged successfully',
        token,
        email: user.email,
        id: user.id,
      };
    }
  }

  findAll() {
    return `This action returns all auth`;
  }

  findOne(id: number) {
    return `This action returns a #${id} auth`;
  }

  update(id: number, updateAuthDto: UpdateAuthDto) {
    return `This action updates a #${id} auth`;
  }

  remove(id: number) {
    return `This action removes a #${id} auth`;
  }
}
