import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const CurrentUserRole = createParamDecorator(
  async (data: unknown, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();
    return request?.roleDocument?.role;
  },
);
