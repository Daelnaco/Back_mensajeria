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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Disputa = void 0;
const typeorm_1 = require("typeorm");
let Disputa = class Disputa {
};
exports.Disputa = Disputa;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ name: 'id_disputa' }),
    __metadata("design:type", Number)
], Disputa.prototype, "idDisputa", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'id_comprador' }),
    __metadata("design:type", Number)
], Disputa.prototype, "idComprador", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'id_vendedor' }),
    __metadata("design:type", Number)
], Disputa.prototype, "idVendedor", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'id_pedido' }),
    __metadata("design:type", Number)
], Disputa.prototype, "idPedido", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', name: 'motivo' }),
    __metadata("design:type", String)
], Disputa.prototype, "motivo", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'estado_reclamo' }),
    __metadata("design:type", String)
], Disputa.prototype, "estadoReclamo", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date', name: 'fecha_reclamo' }),
    __metadata("design:type", String)
], Disputa.prototype, "fechaReclamo", void 0);
exports.Disputa = Disputa = __decorate([
    (0, typeorm_1.Entity)('disputa')
], Disputa);
//# sourceMappingURL=disputa.entity.js.map