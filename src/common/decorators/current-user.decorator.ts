import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export interface AuthUser {
  userId: string;
  role: string;
}

export const CurrentUser = createParamDecorator(
  (_: unknown, context: ExecutionContext): AuthUser => {
    const request = context.switchToHttp().getRequest();
    return request.user;
  },
);
