import { IsDefined, IsOptional, IsString } from 'class-validator';

export class CreateTeamDto {
  @IsString()
  @IsDefined()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;
}
