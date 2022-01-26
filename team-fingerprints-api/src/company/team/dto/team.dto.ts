import { IsOptional, IsString, IsNotEmpty, IsDefined } from 'class-validator';

export class CreateTeamDto {
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  readonly name?: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  readonly description?: string;
}

export class UpdateTeamDto {
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  readonly name?: string;

  @IsString()
  @IsDefined()
  @IsOptional()
  readonly description?: string;
}
