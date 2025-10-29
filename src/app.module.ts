import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

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
