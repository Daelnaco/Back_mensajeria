import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DevAuthController } from './dev-auth.controller';

@Module({
  imports: [
    ConfigModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => ({
        secret: config.get('JWT_SECRET', 'dev_jwt_secret_local_please_change'),
        signOptions: { expiresIn: config.get('JWT_EXPIRES_IN', '24h') },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [DevAuthController],
})
export class DevAuthModule {}
