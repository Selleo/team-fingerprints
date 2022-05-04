import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { Trim } from 'src/common/decorators/trim.decorator';

export class TemplateFilterConfigDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Trim()
  name: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Trim()
  pointColor: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Trim()
  pointShape: string;
}
