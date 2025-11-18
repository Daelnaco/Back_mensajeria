"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConversationsModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const roles_guard_1 = require("../common/guards/roles.guard");
const conversations_controller_1 = require("./conversations.controller");
const conversations_service_1 = require("./conversations.service");
const conversation_repository_1 = require("./repositories/conversation.repository");
const conversation_mysql_repository_1 = require("./infrastructure/mysql/conversation.mysql.repository");
const conversation_orm_entity_1 = require("./infrastructure/mysql/conversation.orm-entity");
const conversation_message_orm_entity_1 = require("./infrastructure/mysql/conversation-message.orm-entity");
let ConversationsModule = class ConversationsModule {
};
exports.ConversationsModule = ConversationsModule;
exports.ConversationsModule = ConversationsModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([conversation_orm_entity_1.ConversationOrmEntity, conversation_message_orm_entity_1.ConversationMessageOrmEntity]),
        ],
        controllers: [conversations_controller_1.ConversationsController],
        providers: [
            conversations_service_1.ConversationsService,
            roles_guard_1.RolesGuard,
            {
                provide: conversation_repository_1.CONVERSATION_REPOSITORY,
                useClass: conversation_mysql_repository_1.ConversationMysqlRepository,
            },
            {
                provide: conversation_repository_1.CONVERSATION_MESSAGE_REPOSITORY,
                useClass: conversation_mysql_repository_1.ConversationMessageMysqlRepository,
            },
        ],
        exports: [conversations_service_1.ConversationsService],
    })
], ConversationsModule);
//# sourceMappingURL=conversations.module.js.map