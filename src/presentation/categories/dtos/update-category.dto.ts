import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class UpdateCategoryRequest {
  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsNumber()
  icon_id: number;
}
