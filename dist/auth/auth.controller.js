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
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const auth_service_1 = require("./auth.service");
const login_dto_1 = require("./dto/login.dto");
const register_dto_1 = require("./dto/register.dto");
const jwt_auth_guard_1 = require("../common/guards/jwt-auth.guard");
const common_2 = require("@nestjs/common");
let AuthController = class AuthController {
    constructor(authService) {
        this.authService = authService;
    }
    async login(loginDto) {
        return this.authService.login(loginDto);
    }
    async register(registerDto) {
        return this.authService.register(registerDto);
    }
    async me(req) {
        return this.authService.me(req.user);
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, common_1.Post)('login'),
    (0, swagger_1.ApiOperation)({
        summary: 'Iniciar sesión (Squad 4)',
        description: 'Inicia sesión con email y password. ' +
            'Devuelve un access_token (JWT) que se usa en las demás historias de usuario (Disputas, Mensajes, etc.). ' +
            'Responsabilidad del Squad 4 (Auth y Perfiles).',
    }),
    (0, swagger_1.ApiOkResponse)({
        description: 'Devuelve `access_token` (JWT). Este token se envía luego en `Authorization: Bearer <token>` en los endpoints protegidos.',
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [login_dto_1.LoginDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "login", null);
__decorate([
    (0, common_1.Post)('register'),
    (0, swagger_1.ApiOperation)({
        summary: 'Registro de usuario (Squad 4)',
        description: 'Crea un nuevo usuario en el sistema. ' +
            'Esta identidad es consumida por otros squads (por ejemplo Squad 9) para validar permisos en disputas, mensajes y conversaciones.',
    }),
    (0, swagger_1.ApiCreatedResponse)({
        description: 'Usuario registrado correctamente. Esta información alimenta la identidad usada en HU-01/HU-02/HU-03.',
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [register_dto_1.RegisterDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "register", null);
__decorate([
    (0, common_2.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('me'),
    (0, swagger_1.ApiOperation)({
        summary: 'Datos del usuario autenticado (Squad 4)',
        description: 'Devuelve el id/email/rol del usuario autenticado. ' +
            'Este endpoint provee el contexto de identidad que usan otros módulos (Disputas, Conversaciones, Mensajes) ' +
            'para autorizar acciones. Implementado por Squad 4.',
    }),
    (0, swagger_1.ApiOkResponse)({
        description: 'Información básica del usuario autenticado (id, email, rol).',
    }),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "me", null);
exports.AuthController = AuthController = __decorate([
    (0, swagger_1.ApiTags)('Auth (Squad 4 - Auth y Perfiles)'),
    (0, common_1.Controller)('auth'),
    __metadata("design:paramtypes", [auth_service_1.AuthService])
], AuthController);
//# sourceMappingURL=auth.controller.js.map