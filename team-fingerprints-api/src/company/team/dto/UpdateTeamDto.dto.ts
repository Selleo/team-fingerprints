import {
  ArrayMinSize,
  ArrayNotEmpty,
  IsArray,
  IsOptional,
  IsString,
} from 'class-validator';

export class UpdateTeamDto {
  @IsString()
  @IsOptional()
  readonly name?: string;

  @IsString()
  @IsOptional()
  readonly description?: string;

  @IsOptional()
  @IsArray({})
  @ArrayNotEmpty()
  @ArrayMinSize(1)
  readonly members?: string[];

  @IsOptional()
  @IsArray({})
  @ArrayNotEmpty()
  @ArrayMinSize(1)
  readonly emailWhitelist?: string[];

  @IsOptional()
  @IsArray({})
  @ArrayNotEmpty()
  @ArrayMinSize(1)
  readonly teamLeader?: string[];
}
