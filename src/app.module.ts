import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { TypeOrmModule } from '@nestjs/typeorm';

// Módulos propios
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { MessagesModule } from './messages/messages.module';

// Modulos para disputas
import { DisputesModule } from './disputes/disputes.module';
import { ConversationsModule } from './conversations/conversations.module';
import { AttachmentsModule } from './attachments/attachments.module';

@Module({
  imports: [
    // Variables de entorno globales
    ConfigModule.forRoot({ isGlobal: true }),

    // Conexión a MongoDB
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (cfg: ConfigService) => ({
        uri: cfg.get<string>('MONGODB_URI'),
      }),
    }),

    // Conexión a MySQL
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (cfg: ConfigService) => ({
        type: 'mysql' as const,
        host: cfg.get<string>('SQL_DB_HOST', 'localhost'),
        port: Number(cfg.get<string>('SQL_DB_PORT') ?? 3306),
        username: cfg.get<string>('SQL_DB_USER'),
        password: cfg.get<string>('SQL_DB_PASS'),
        database: cfg.get<string>('SQL_DB_NAME'),
        autoLoadEntities: true, // recoge entidades registradas con forFeature
        synchronize: false,
      }),
    }),

    //Modulos de la app
    AuthModule,
    UsersModule,
    MessagesModule,
    DisputesModule,
    ConversationsModule,
    AttachmentsModule,
  ],
})
export class AppModule {}
