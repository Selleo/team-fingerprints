import { IsOptional, IsString, IsNotEmpty } from 'class-validator';

export class CreateTeamDto {
  @IsString()
  @IsNotEmpty()
  readonly name?: string;

  @IsString()
  @IsNotEmpty()
  readonly description?: string;
}

export class UpdateTeamDto {
  @IsString()
  @IsNotEmpty()
  readonly name?: string;

  @IsString()
  @IsOptional()
  readonly description?: string;
}
