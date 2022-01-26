import { IsOptional, IsString, IsNotEmpty, IsDefined } from 'class-validator';

export class CreateTeamDto {
  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @IsString()
  @IsDefined()
  @IsOptional()
  readonly description?: string;
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
}
