import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsString, ValidateNested } from 'class-validator';
import { UserDetail, UserProfile } from 'team-fingerprints-common';
import { Privilege } from 'team-fingerprints-common';

export class ResponseAuthDto implements UserProfile {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  _id: string;

  @ApiProperty()
  @IsString()
  @IsEmail()
  @IsNotEmpty()
  @Transform(({ value }: { value: string }) => value.trim())
  email: string;

  @ApiProperty()
  @ValidateNested()
  privileges: Privilege[];

  @ApiProperty()
  @ValidateNested()
  userDetails: UserDetail[];
}
