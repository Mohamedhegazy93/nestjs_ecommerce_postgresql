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
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  LoginDto,
  ResetPasswordCodeDto,
  SetNewPasswordDto,
  VerifiyEmailDto,
  VerifyResetPasswordCodeDto,
} from './dto/create-auth.dto';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { AuthGuard } from './guards/auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  // POST: ~/auth/register
  @Post('register')
  register(@Body(new ValidationPipe()) createUserDto: CreateUserDto) {
    return this.authService.register(createUserDto);
  }
  // POST: ~/auth/login
  @Post('login')
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }
  // POST: ~/auth/verifiyEmail
  @Post('verifiyEmail')
  verifiyEmail(@Body() verifiyEmailDto: VerifiyEmailDto, @Req() req) {
    return this.authService.verifiyEmail(verifiyEmailDto, req.user);
  }
  // POST: ~/auth/resetPassword
  @Post('resetPassword')
  // @UseGuards(AuthGuard)
  resetPassword(
    @Body() resetPasswordCodeDto: ResetPasswordCodeDto,
    @Req() req,
  ) {
    return this.authService.resetPassword(resetPasswordCodeDto, req.user);
  }
  // POST: ~/auth/verifiyResetPasswordCode
  @Post('verifiyResetPasswordCode')
  // @UseGuards(AuthGuard)
  verifiyResetPasswordCode(
    @Body() verifyResetPasswordCodeDto: VerifyResetPasswordCodeDto,
    @Req() req,
  ) {
    return this.authService.verifiyResetPasswordCode(
      verifyResetPasswordCodeDto,
      req.user,
    );
  }
  // POST: ~/auth/verifiyResetPasswordCode
  @Post('setNewPassword')
  // @UseGuards(AuthGuard)
  setNewPassword(@Body() setNewPasswordDto: SetNewPasswordDto) {
    return this.authService.setNewPassword(setNewPasswordDto);
  }
}
