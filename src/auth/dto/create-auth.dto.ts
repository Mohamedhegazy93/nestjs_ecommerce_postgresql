import {
  IsNotEmpty,
  IsString,
  Length,
  IsEmail,
  isNotEmpty,
  MIN,
  Min,
} from 'class-validator';
export class LoginDto {
  @IsNotEmpty()
  @IsEmail()
  @IsString()
  @Length(10, 50)
  email: string;

  @IsNotEmpty()
  @IsString()
  @Length(6, 100)
  password: string;
}
export class VerifiyEmailDto {
  @IsNotEmpty()
  @IsString()
  emailVerfiyCode: string;
}
export class ResetPasswordCodeDto {
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email: string;
}
export class VerifyResetPasswordCodeDto {
  @IsNotEmpty()
  @IsString()
  resetPasswordCode: string;
}
export class SetNewPasswordDto {
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email: string;
  @IsNotEmpty()
  @IsString()
  setNewPassword: string;
}
