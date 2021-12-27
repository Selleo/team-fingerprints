import { IsDefined, IsMongoId, IsOptional, IsString } from 'class-validator';

export class CreateTeamDto {
  @IsString()
  @IsDefined()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsMongoId()
  @IsDefined()
  teamLeaderId: string;
}
