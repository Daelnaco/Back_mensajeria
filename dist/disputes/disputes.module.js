"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DisputesModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const roles_guard_1 = require("../common/guards/roles.guard");
const disputes_controller_1 = require("./disputes.controller");
const disputes_service_1 = require("./disputes.service");
const dispute_repository_1 = require("./repositories/dispute.repository");
const dispute_orm_entity_1 = require("./infrastructure/mysql/dispute.orm-entity");
const dispute_mysql_repository_1 = require("./infrastructure/mysql/dispute.mysql.repository");
let DisputesModule = class DisputesModule {
};
exports.DisputesModule = DisputesModule;
exports.DisputesModule = DisputesModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([
                dispute_orm_entity_1.DisputeOrmEntity,
            ]),
        ],
        controllers: [disputes_controller_1.DisputesController],
        providers: [
            disputes_service_1.DisputesService,
            roles_guard_1.RolesGuard,
            {
                provide: dispute_repository_1.DISPUTE_REPOSITORY,
                useClass: dispute_mysql_repository_1.DisputeMysqlRepository,
            },
        ],
        exports: [disputes_service_1.DisputesService],
    })
], DisputesModule);
//# sourceMappingURL=disputes.module.js.map