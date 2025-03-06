import { Optional } from '@nestjs/common';
import { IsInt, IsNotEmpty, IsString, Max, Min } from 'class-validator';

export class CreateReviewDto {
  @Optional()
  @IsString()
  comment: string;

  @IsNotEmpty()
  @Min(1)
  @Max(5)
  rating: string;
}
