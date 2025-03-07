import {
  IsNotEmpty,
  IsString,
  IsBoolean,
  IsOptional,
  Length,
  IsEmail,
  IsEnum,
} from 'class-validator';
import { BeforeInsert, BeforeUpdate, Unique } from 'typeorm';
import { Transform } from 'class-transformer';
import { Role } from 'src/auth/guards/roles.enum';
export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  @Length(3, 50)
  userName: string;

  @IsNotEmpty()
  @IsEmail()
  @IsString()
  @Length(10, 50)
  email: string;
  @IsNotEmpty()
  @IsString()
  @Length(6, 100)
  password: string;
  @IsOptional()
  @IsString()
  profilePhotoUrl: string;

  @IsOptional()
  @IsString()
  public_id: string;

  @IsEnum(Role)
  @IsOptional()
  role: Role;

  @IsOptional()
  @IsBoolean()
  isAccountVerfied: boolean;

  @IsOptional()
  @IsString()
  bio: string;

  @IsNotEmpty()
  @IsString()
  @Length(3, 100)
  nationality: string;
}
