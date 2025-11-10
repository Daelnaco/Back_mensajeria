import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { CreateUserDto } from 'src/users/schemas/dto/create-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  private buildPayload(user: any) {
    const userId = user.id || user._id?.toString();
    return {
      sub: userId,
      email: user.email,
      role: user.role,
    };
  }

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersService.findByEmail(email);
    if (!user) return null;

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) return null;

  const plain = user && (typeof (user as any).toObject === 'function' ? (user as any).toObject() : user);
  const { password: _, ...result } = plain || {};
  return result;
  }

  async login(loginDto: LoginDto) {
    const user = await this.validateUser(loginDto.email, loginDto.password);
    if (!user) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const payload = this.buildPayload(user);
    return { access_token: this.jwtService.sign(payload) };
  }

  async register(registerDto: RegisterDto) {
    const createUserDto: CreateUserDto = {
      name: registerDto.name,
      lastName: registerDto.lastName,
      email: registerDto.email,
      password: registerDto.password,
    };

  const newUser = await this.usersService.create(createUserDto);
  const user = newUser && (typeof (newUser as any).toObject === 'function' ? (newUser as any).toObject() : newUser);
    const payload = this.buildPayload(user);

    return {
      user: {
        id: payload.sub,
        email: user.email,
        name: user.name,
        lastName: user.lastName,
        role: user.role,
      },
      access_token: this.jwtService.sign(payload),
    };
  }

  async me(userId: string) {
    return this.usersService.findOne(userId);
  }
}
