import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private readonly reflector: Reflector) {
    super();
  }

  canActivate(context) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    // 1) Si la ruta es pública, pasa.
    if (isPublic) return true;

    // 2) Si el modo demo está activado, pasa y pone un usuario demo.
    if (process.env.AUTH_DISABLED === 'true') {
      const req = context.switchToHttp().getRequest();
      if (!req.user) {
        req.user = {
          id: 101,                // 👈 buyer_id de tus seeds
          email: 'demo@demo',
          role: 'admin',
          name: 'Demo User',
        };
      }
      return true;
    }

    // 3) Normal: exige JWT
    return super.canActivate(context) as any;
  }

  handleRequest(err, user) {
    if (process.env.AUTH_DISABLED === 'true') {
      // En modo demo devolvemos el “user” demo aunque no haya token.
      return user ?? { id: 101, email: 'demo@demo', role: 'admin' };
    }
    if (err || !user) {
      throw err || new UnauthorizedException();
    }
    return user;
  }
}
