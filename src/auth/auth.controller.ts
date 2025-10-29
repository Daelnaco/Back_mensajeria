import { Controller, Post, Body, Get, Req, } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiOkResponse, ApiCreatedResponse, } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { UseGuards } from '@nestjs/common';

@ApiTags('Auth (Squad 4 - Auth y Perfiles)')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @ApiOperation({
    summary: 'Iniciar sesión (Squad 4)',
    description:
      'Inicia sesión con email y password. ' +
      'Devuelve un access_token (JWT) que se usa en las demás historias de usuario (Disputas, Mensajes, etc.). ' +
      'Responsabilidad del Squad 4 (Auth y Perfiles).',
  })
  @ApiOkResponse({
    description:
      'Devuelve `access_token` (JWT). Este token se envía luego en `Authorization: Bearer <token>` en los endpoints protegidos.',
  })
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Post('register')
  @ApiOperation({
    summary: 'Registro de usuario (Squad 4)',
    description:
      'Crea un nuevo usuario en el sistema. ' +
      'Esta identidad es consumida por otros squads (por ejemplo Squad 9) para validar permisos en disputas, mensajes y conversaciones.',
  })
  @ApiCreatedResponse({
    description:
      'Usuario registrado correctamente. Esta información alimenta la identidad usada en HU-01/HU-02/HU-03.',
  })
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  @ApiOperation({
    summary: 'Datos del usuario autenticado (Squad 4)',
    description:
      'Devuelve el id/email/rol del usuario autenticado. ' +
      'Este endpoint provee el contexto de identidad que usan otros módulos (Disputas, Conversaciones, Mensajes) ' +
      'para autorizar acciones. Implementado por Squad 4.',
  })
  @ApiOkResponse({
    description:
      'Información básica del usuario autenticado (id, email, rol).',
  })
  async me(@Req() req: any) {
    return this.authService.me(req.user);
  }
}
