import { IsInt, isInt, IsNotEmpty, IsOptional, IsString, isString, IsUrl, Length, Min } from 'class-validator';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  @Length(5,30)
  title: string;
  @IsString()
  @IsNotEmpty()
  @Length(10,300)
  description: string;
  @IsInt()
  @IsNotEmpty()
  @Min(1)
  price: number;
  @IsUrl()
  @IsOptional()
  image: string;
  @IsUrl()
  @IsOptional()
  public_id: string;

}
