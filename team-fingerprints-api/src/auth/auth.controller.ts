import { Controller, Get } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { CurrentUserId } from 'src/common/decorators/currentUserId.decorator';
import { ValidateObjectId } from 'src/common/pipes/ValidateObjectId.pipe';
import { AuthService } from './auth.service';
import { ResponseAuthDto } from './dto/auth.dto';

@ApiTags('auth')
@Controller({ path: 'auth', version: '1' })
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiResponse({ type: ResponseAuthDto })
  @Get('/profile')
  async getUserProfile(
    @CurrentUserId(ValidateObjectId) userId: string,
  ): Promise<ResponseAuthDto> {
    console.log(userId);
    return await this.authService.getUserProfile(userId);
  }
}
