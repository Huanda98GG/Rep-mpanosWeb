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
exports.VictimsController = void 0;
const common_1 = require("@nestjs/common");
const victims_service_1 = require("./victims.service");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const roles_guard_1 = require("../auth/roles.guard");
const roles_decorator_1 = require("../auth/roles.decorator");
const create_victim_dto_1 = require("./dto/create-victim.dto");
const update_victim_dto_1 = require("./dto/update-victim.dto");
let VictimsController = class VictimsController {
    constructor(svc) {
        this.svc = svc;
    }
    create(body, req) {
        const user = req.user;
        return this.svc.create({ ...body, capturedBy: user.sub });
    }
    listAll() {
        return this.svc.findAll();
    }
    myVictims(req) {
        return this.svc.findByCapturer(req.user.sub);
    }
    get(id) {
        return this.svc.findOne(Number(id));
    }
    update(id, body) {
        return this.svc.update(Number(id), body);
    }
    remove(id) {
        return this.svc.remove(Number(id));
    }
};
exports.VictimsController = VictimsController;
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)('SLAVE'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_victim_dto_1.CreateVictimDto, Object]),
    __metadata("design:returntype", void 0)
], VictimsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, roles_decorator_1.Roles)('ADMIN'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], VictimsController.prototype, "listAll", null);
__decorate([
    (0, common_1.Get)('me'),
    (0, roles_decorator_1.Roles)('SLAVE'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], VictimsController.prototype, "myVictims", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], VictimsController.prototype, "get", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, roles_decorator_1.Roles)('ADMIN'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_victim_dto_1.UpdateVictimDto]),
    __metadata("design:returntype", void 0)
], VictimsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, roles_decorator_1.Roles)('ADMIN'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], VictimsController.prototype, "remove", null);
exports.VictimsController = VictimsController = __decorate([
    (0, common_1.Controller)('victims'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    __metadata("design:paramtypes", [victims_service_1.VictimsService])
], VictimsController);
//# sourceMappingURL=victims.controller.js.map