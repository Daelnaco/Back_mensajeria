import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { MessagesService } from './messages.service';
import { MessagesController } from './messages.controller';

import { Chat } from './entities/chat.entity';
import { Disputa } from './entities/disputa.entity';

@Module({
  // Repositorios TypeORM disponibles para inyección en el servicio
  imports: [TypeOrmModule.forFeature([Chat, Disputa]),],
  controllers: [MessagesController],
  providers: [MessagesService],
  exports: [MessagesService],
})
export class MessagesModule {}
