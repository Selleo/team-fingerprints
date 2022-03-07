import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class TestingAuthGuard implements CanActivate {
  constructor(private readonly usersService: UsersService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const users = await this.usersService.getUsersAll();
    const user = users[0];
    if (user) {
      request.user = user;
      return !!user;
    } else return true;
  }
}
