import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsNotEmpty, IsDefined } from 'class-validator';

export class CreateTeamDto {
  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @IsString()
  @IsDefined()
  @IsOptional()
  readonly description?: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  readonly pointShape: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  readonly pointColor: string;
}

export class UpdateTeamDto {
  @IsString()
  @IsDefined()
  @IsOptional()
  readonly name?: string;

  @IsString()
  @IsDefined()
  @IsOptional()
  readonly description?: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  readonly pointShape?: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  readonly pointColor?: string;
}
