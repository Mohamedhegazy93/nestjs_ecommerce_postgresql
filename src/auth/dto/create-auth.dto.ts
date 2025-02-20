import { IsNotEmpty, IsString, IsBoolean, IsOptional, Length, IsEmail } from 'class-validator';
import { BeforeInsert, BeforeUpdate, Unique } from 'typeorm';
import { Transform } from 'class-transformer';
export class LoginDto {

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
    
}
