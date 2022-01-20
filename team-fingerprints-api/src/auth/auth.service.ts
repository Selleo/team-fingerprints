import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {
  async getProfile(userId: string) {
    return userId;
  }
}
