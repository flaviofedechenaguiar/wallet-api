import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateCategoryRequest {
  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsNumber()
  icon_id: number;
}
