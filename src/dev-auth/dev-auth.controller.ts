import { Body, Controller, HttpException, HttpStatus, Post } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Role } from '../common/enums/role.enum';

interface DevLoginDto {
  userId: string;
  role: Role;
}

@Controller('dev-auth')
export class DevAuthController {
  constructor(private readonly jwtService: JwtService) {}

  @Post('login')
  login(@Body() body: DevLoginDto) {
    if (!body.userId || !body.role) {
      throw new HttpException('userId y role son obligatorios', HttpStatus.BAD_REQUEST);
    }

    const payload = { userId: body.userId, role: body.role };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
