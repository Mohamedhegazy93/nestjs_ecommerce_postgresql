import {
  IsNotEmpty,
  IsString,
  Length,
  IsEmail,
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
