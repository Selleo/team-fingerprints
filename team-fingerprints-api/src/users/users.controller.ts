import { Controller, Get } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller({ path: 'users', version: '1' })
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Get()
  async hello() {
    return await this.userService.hello();
  }
}
