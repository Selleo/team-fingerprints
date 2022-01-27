import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CurrentUserId } from 'src/common/decorators/currentUserId.decorator';
import { ValidateObjectId } from 'src/common/pipes/ValidateObjectId.pipe';
import { AuthService, UserProfileI } from './auth.service';

@ApiTags('auth')
@Controller({ path: 'auth', version: '1' })
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('/profile')
  async getUserProfile(
    @CurrentUserId(ValidateObjectId) userId: string,
  ): Promise<UserProfileI> {
    return await this.authService.getUserProfile(userId);
  }
}
