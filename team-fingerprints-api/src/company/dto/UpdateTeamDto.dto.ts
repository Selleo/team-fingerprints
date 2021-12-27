import { IsMongoId, IsOptional, IsString } from 'class-validator';

export class UpdateTeamDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsMongoId()
  @IsOptional()
  teamLeaderId?: string;
}
