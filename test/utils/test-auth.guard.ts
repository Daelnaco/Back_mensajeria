import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Role } from '../../src/common/enums/role.enum';

@Injectable()
export class TestAuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const userId = request.headers['x-user-id'] || 'test-user';
    const role =
      (request.headers['x-user-role'] as Role) ?? Role.BUYER;

    request.user = {
      userId,
      role,
    };
    return true;
  }
}
