"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DevAuthModule = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const config_1 = require("@nestjs/config");
const dev_auth_controller_1 = require("./dev-auth.controller");
let DevAuthModule = class DevAuthModule {
};
exports.DevAuthModule = DevAuthModule;
exports.DevAuthModule = DevAuthModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule,
            jwt_1.JwtModule.registerAsync({
                imports: [config_1.ConfigModule],
                useFactory: (config) => ({
                    secret: config.get('JWT_SECRET', 'dev_jwt_secret_local_please_change'),
                    signOptions: { expiresIn: config.get('JWT_EXPIRES_IN', '24h') },
                }),
                inject: [config_1.ConfigService],
            }),
        ],
        controllers: [dev_auth_controller_1.DevAuthController],
    })
], DevAuthModule);
//# sourceMappingURL=dev-auth.module.js.map