import {
  BadRequestException,
  HttpException,
  Injectable,
  NotFoundException,
  RequestTimeoutException,
} from '@nestjs/common';
import {
  LoginDto,
  ResetPasswordCodeDto,
  SetNewPasswordDto,
  VerifiyEmailDto,
  VerifyResetPasswordCodeDto,
} from './dto/create-auth.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { MailerService } from '@nestjs-modules/mailer';
import { randomBytes } from 'node:crypto';
import * as dotenv from 'dotenv';
import { MailService } from 'src/mail/mail.service';
import { emitWarning } from 'node:process';
import { addAbortListener } from 'node:events';
dotenv.config();

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private jwtService: JwtService,
    private mailService: MailService,
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

    const emailVerfiyCode = await Math.floor(
      Math.random() * 1000000,
    ).toString();
    newUser.emailVerfiyCode = emailVerfiyCode.toString();

    console.log(emailVerfiyCode);

    await this.mailService.sendRegisterEmail(newUser.email, emailVerfiyCode);

    newUser.emailVerfiyCode = emailVerfiyCode.toString();
    console.log(newUser.emailVerfiyCode);

    await this.usersRepository.save(newUser);

    return {
      message: 'register scuessfully , code sent to your email to verifiy',
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
    const isMatch = await bcrypt.compare(loginDto.password, user.password);
    if (isMatch) {
      throw new HttpException('incorrect email or password', 400);
    }

    const payload = {
      id: user.id,
      role: user.role,
    };

    const token = this.jwtService.sign(payload);
    console.log(token);
    return {
      message: 'logged successfully',
      token,
      email: user.email,
      id: user.id,
    };
  }

  async verifiyEmail(verifiyEmailDto: VerifiyEmailDto, payload) {
    const { emailVerfiyCode } = verifiyEmailDto;
    const user = await this.usersRepository.findOne({
      where: { emailVerfiyCode: emailVerfiyCode },
    });
    if (!user) {
      throw new NotFoundException();
    }
    console.log(emailVerfiyCode);
    console.log(user.userName);

    if (emailVerfiyCode.toString() !== user.emailVerfiyCode) {
      throw new BadRequestException('incorrect reset password');
    }
    user.isAccountVerfied = true;
    user.emailVerfiyCode = '';
    await this.usersRepository.save(user);

    return {
      mesaage: 'account verfied sucessfully',
    };
  }

  async resetPassword(resetPasswordCodeDto: ResetPasswordCodeDto, payload) {
    const { email } = resetPasswordCodeDto;
    const user = await this.usersRepository.findOneBy({ email });
    if (!user) {
      throw new NotFoundException(
        'account not found , please try correct email',
      );
    }
    const passwordResetCode = await Math.floor(
      Math.random() * 1000000,
    ).toString();
    user.resetPasswordCode = passwordResetCode;
    await this.usersRepository.save(user);
    await this.mailService.sendResetPasswordCode(
      user!.email,
      passwordResetCode,
    );

    return { message: 'code sent to your email' };
  }
  async verifiyResetPasswordCode(
    verifyResetPasswordCodeDto: VerifyResetPasswordCodeDto,
    payload,
  ) {
    const { resetPasswordCode } = verifyResetPasswordCodeDto;
    const user = await this.usersRepository.findOne({
      where: { resetPasswordCode: resetPasswordCode },
    });
    if (!user) {
      throw new BadRequestException('incorrect reset code password');
    }
    user.resetPasswordCode = 'verify';
    await this.usersRepository.save(user);

    return { message: 'code verify sucessfully' };
  }

  async setNewPassword(setNewPasswordDto: SetNewPasswordDto) {
    const { email, setNewPassword } = setNewPasswordDto;
    const user = await this.usersRepository.findOne({
      where: { resetPasswordCode: 'verify', email: email },
    });
    if (!user) {
      throw new BadRequestException(
        'incorrect email or reset code not verified',
      );
    }

    user.password = setNewPassword;
    user.resetPasswordCode = '';
    await this.usersRepository.save(user);

    const payload = {
      id: user.id,
      role: user.role,
    };

    const token = this.jwtService.sign(payload);
    console.log(token);

    return {
      message: 'password updated sucessfully',
      token,
    };
  }
}
