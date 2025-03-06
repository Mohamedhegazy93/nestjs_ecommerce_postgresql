import { HttpException, Injectable, RequestTimeoutException } from '@nestjs/common';
import { LoginDto } from './dto/create-auth.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private jwtService: JwtService,
    private mailerService: MailerService,
  ) {}
  //Register
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
      message: `${newUser.userName} registered sucessfully , login now`,
      userName:newUser.userName,
      email:newUser.email,
      role:newUser.role,
    };
  }
  //Login
  async login(loginDto: LoginDto) {
    const user = await this.usersRepository.findOneBy({
      email: loginDto.email,
    });
    if (!user) {
      throw new HttpException('please resgister first', 400);
    }
    const isMatch = await user.comparePassword(loginDto.password);
    if (isMatch) {
      throw new HttpException('incorrect email or password', 400);
    }

    const payload = {
      id: user.id,
      role: user.role,
    };

    const token = this.jwtService.sign(payload);
    try {
      await this.mailerService.sendMail({
        to:user.email,
        from:'nestjs_project',
        subject:'login',
        html:`hello ${user.userName}`


      })

      
    } catch (error) {
      console.log(error)
      throw new RequestTimeoutException()
      
    }
    console.log(token);
    return {
      message:'logged successfully',
      token,
      email: user.email,
      id: user.id,
    };

  }
}
