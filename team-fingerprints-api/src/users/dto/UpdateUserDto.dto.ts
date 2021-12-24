import { IsDefined, IsString } from 'class-validator';

export class UpdateUserDto {
  @IsString()
  @IsDefined()
  readonly firstName: string;

  @IsString()
  @IsDefined()
  readonly lastName: string;
}
