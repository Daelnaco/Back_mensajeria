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
    // Conexión a MongoDB (usa MONGODB_URI desde .env)
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URI') || 'mongodb://localhost:27017/mensajeria_disputas',
      }),
      inject: [ConfigService],
    }),

    // Conexión a MySQL
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.MYSQL_HOST || 'gpi-mysql',
      port: Number(process.env.MYSQL_PORT || 3306),
      username: process.env.MYSQL_USER,
      password: process.env.MYSQL_PASSWORD,
      database: process.env.MYSQL_DATABASE ?? process.env.MYSQL_DB,
      autoLoadEntities: true,
      synchronize: true,
      retryAttempts: 10,
      retryDelay: 3000,
      extra: { ssl: { rejectUnauthorized: false } },
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
