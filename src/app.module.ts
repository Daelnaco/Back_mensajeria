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
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    // Variables de entorno globales
    ConfigModule.forRoot({ isGlobal: true }),

    // Conexión a MongoDB
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        const mongoUri = configService.get<string>('MONGODB_URI') || 'mongodb://localhost:27017/mensajeria_disputas';
        console.log(`📦 Conectando a MongoDB: ${mongoUri}`);
        return {
          uri: mongoUri,
          retryAttempts: 5,
          retryDelay: 2000,
        };
      },
      inject: [ConfigService],
    }),

    // Conexión a MySQL
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        const host = configService.get<string>('MYSQL_HOST') || 'localhost';
        const port = Number(configService.get<string>('MYSQL_PORT') || 3306);
        const username = configService.get<string>('MYSQL_USER');
        const password = configService.get<string>('MYSQL_PASSWORD');
        const database = configService.get<string>('MYSQL_DATABASE') || 'disputasBD';
        
        console.log(`🗄️  Conectando a MySQL: ${host}:${port}/${database}`);

        return {
          type: 'mysql',
          host,
          port,
          username,
          password,
          database,
          autoLoadEntities: true,
          synchronize: false,
          retryAttempts: 10,
          retryDelay: 3000,
          extra: { ssl: { rejectUnauthorized: false } },
        };
      },
      inject: [ConfigService],
    }),

    //Modulos de la app
    AuthModule,
    UsersModule,
    MessagesModule,
    DisputesModule,
    ConversationsModule,
    AttachmentsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
