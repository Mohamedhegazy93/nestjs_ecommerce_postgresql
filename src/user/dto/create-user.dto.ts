import { IsNotEmpty, IsString, IsBoolean, IsOptional, Length, IsEmail } from 'class-validator';
import { BeforeInsert, BeforeUpdate, Unique } from 'typeorm';
import { Transform } from 'class-transformer';
@Unique(['email,userName'])
export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  @Transform(({ value }) => value.trim())
  @Length(3, 50)
  userName: string;

  @IsNotEmpty()
  @IsEmail()
  @IsString()
  @Transform(({ value }) => value.trim())
  @Length(10, 50)
  email: string;

  @IsNotEmpty()
  @IsString()
  @Transform(({ value }) => value.trim()) // إزالة المسافات الزائدة هنا
  @Length(6, 100)
  password: string;
  @IsNotEmpty()
  @IsString()
  @Transform(({ value }) => value.trim()) // إزالة المسافات الزائدة هنا

  @Length(3, 100)
  nationality: string;

  @IsOptional() 
  @IsString()
  profilePhotoUrl: string;

  @IsOptional()
  @IsString()
  public_id: string;

  @IsOptional()
  @IsBoolean()
  isAdmin: boolean;

  @IsOptional()
  @IsBoolean()
  isAccountVerfied: boolean;

  @IsOptional()
  @Transform(({ value }) => value.trim()) // إزالة المسافات الزائدة هنا
  @IsString()
  bio: string;




}

