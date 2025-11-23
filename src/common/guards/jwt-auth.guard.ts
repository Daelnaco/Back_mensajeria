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

    // Ruta pública
    if (isPublic) return true;

    // Modo demo: fuerza usuario buyer para pruebas
    if (process.env.AUTH_DISABLED === 'true') {
      const req = context.switchToHttp().getRequest();
      if (!req.user) {
        req.user = {
          userId: 'buyer-demo',
          email: 'demo@demo',
          role: 'buyer',
          name: 'Demo Buyer',
        };
      }
      return true;
    }

    // Normal: exige JWT
    return super.canActivate(context) as any;
  }

  handleRequest(err, user) {
    if (process.env.AUTH_DISABLED === 'true') {
      return user ?? { userId: 'buyer-demo', email: 'demo@demo', role: 'buyer', name: 'Demo Buyer' };
    }
    if (err || !user) {
      throw err || new UnauthorizedException();
    }
    return user;
  }
}
