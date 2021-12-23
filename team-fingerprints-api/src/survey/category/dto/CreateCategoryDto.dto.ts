import { IsString } from 'class-validator';

export class CreateCategoryDto {
  @IsString()
  readonly title: string;
}
