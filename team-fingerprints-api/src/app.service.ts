import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    const message = 'root path';
    return message;
  }
}
