import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';
import { ConversationsModule } from './conversations/conversations.module';
import { DisputesModule } from './disputes/disputes.module';
import { DevAuthModule } from './dev-auth/dev-auth.module';
import { JwtStrategy } from './auth/jwt.strategy';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    EventEmitterModule.forRoot(),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    TypeOrmModule.forRootAsync({
      useFactory: (config: ConfigService) => ({
        type: 'mysql',
        host: config.get<string>('DB_HOST', 'localhost'),
        port: parseInt(config.get('DB_PORT', '3306'), 10),
        username: config.get<string>('DB_USER', 'root'),
        password: config.get<string>('DB_PASSWORD', ''),
        database: config.get<string>('DB_NAME', 'pulgashop'),
        autoLoadEntities: true,
        synchronize: config.get('DB_SYNCHRONIZE', 'false') === 'true',
      }),
      inject: [ConfigService],
    }),
    DisputesModule,
    ConversationsModule,
    ...(process.env.ENABLE_DEV_AUTH === 'true' ? [DevAuthModule] : []),
  ],
  providers: [JwtStrategy],
})
export class AppModule {}
