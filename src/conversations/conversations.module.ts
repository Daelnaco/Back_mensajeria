import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RolesGuard } from '../common/guards/roles.guard';
import { ConversationsController } from './conversations.controller';
import { ConversationsService } from './conversations.service';
import {
  CONVERSATION_MESSAGE_REPOSITORY,
  CONVERSATION_REPOSITORY,
} from './repositories/conversation.repository';
import {
  ConversationMessageMysqlRepository,
  ConversationMysqlRepository,
} from './infrastructure/mysql/conversation.mysql.repository';
import { ConversationOrmEntity } from './infrastructure/mysql/conversation.orm-entity';
import { ConversationMessageOrmEntity } from './infrastructure/mysql/conversation-message.orm-entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([ConversationOrmEntity, ConversationMessageOrmEntity]),
  ],
  controllers: [ConversationsController],
  providers: [
    ConversationsService,
    RolesGuard,
    {
      provide: CONVERSATION_REPOSITORY,
      useClass: ConversationMysqlRepository,
    },
    {
      provide: CONVERSATION_MESSAGE_REPOSITORY,
      useClass: ConversationMessageMysqlRepository,
    },
  ],
  exports: [ConversationsService],
})
export class ConversationsModule {}
