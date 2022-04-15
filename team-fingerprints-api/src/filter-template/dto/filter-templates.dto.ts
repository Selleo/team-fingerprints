import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class TemplateFilterConfigDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  pointColor: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  pointShape: string;
}
