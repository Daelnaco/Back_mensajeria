"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DevAuthController = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
let DevAuthController = class DevAuthController {
    constructor(jwtService) {
        this.jwtService = jwtService;
    }
    login(body) {
        if (!body.userId || !body.role) {
            throw new common_1.HttpException('userId y role son obligatorios', common_1.HttpStatus.BAD_REQUEST);
        }
        const payload = { userId: body.userId, role: body.role };
        return {
            access_token: this.jwtService.sign(payload),
        };
    }
};
exports.DevAuthController = DevAuthController;
__decorate([
    (0, common_1.Post)('login'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], DevAuthController.prototype, "login", null);
exports.DevAuthController = DevAuthController = __decorate([
    (0, common_1.Controller)('dev-auth'),
    __metadata("design:paramtypes", [jwt_1.JwtService])
], DevAuthController);
//# sourceMappingURL=dev-auth.controller.js.map