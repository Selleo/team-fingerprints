import { Controller, forwardRef, Get, Inject } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { CurrentUserId } from 'src/common/decorators/currentUserId.decorator';
import { ValidateObjectId } from 'src/common/pipes/ValidateObjectId.pipe';
import { UsersService } from 'src/users/users.service';
import { UserProfile } from 'team-fingerprints-common';
import { ResponseAuthDto } from './dto/auth.dto';

@ApiTags('auth')
@Controller({ path: 'auth', version: '1' })
export class AuthController {
  constructor(
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,
  ) {}

  @ApiResponse({ type: ResponseAuthDto })
  @Get('/profile')
  async getUserProfile(
    @CurrentUserId(ValidateObjectId) userId: string,
  ): Promise<UserProfile> {
    return await this.usersService.getUserProfile(userId);
  }
}
