import { IsNotEmpty, IsString } from 'class-validator';

export class TemplateFilterConfigDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  pointColor: string;

  @IsString()
  @IsNotEmpty()
  pointShape: string;
}
