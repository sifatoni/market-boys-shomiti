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
exports.DepositsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const roles_guard_1 = require("../auth/roles.guard");
const roles_decorator_1 = require("../auth/roles.decorator");
const deposits_service_1 = require("./deposits.service");
const create_deposit_dto_1 = require("./dto/create-deposit.dto");
const update_deposit_dto_1 = require("./dto/update-deposit.dto");
const members_service_1 = require("../members/members.service");
let DepositsController = class DepositsController {
    depositsService;
    membersService;
    constructor(depositsService, membersService) {
        this.depositsService = depositsService;
        this.membersService = membersService;
    }
    async create(dto) {
        return this.depositsService.create(dto);
    }
    async findAll(memberId, req) {
        if (req.user.role !== 'ADMIN') {
            const member = await this.membersService.findByUserId(req.user.id);
            return this.depositsService.findAll(member?.id);
        }
        return this.depositsService.findAll(memberId);
    }
    async getSummary() {
        return this.depositsService.getTotalDeposits();
    }
    async findOne(id) {
        return this.depositsService.findOne(id);
    }
    async update(id, dto) {
        return this.depositsService.update(id, dto);
    }
    async remove(id) {
        return this.depositsService.remove(id);
    }
};
exports.DepositsController = DepositsController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('ADMIN'),
    (0, swagger_1.ApiOperation)({ summary: 'Record a new deposit' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_deposit_dto_1.CreateDepositDto]),
    __metadata("design:returntype", Promise)
], DepositsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiQuery)({ name: 'memberId', required: false }),
    (0, swagger_1.ApiOperation)({ summary: 'Get all deposits (optionally filter by member)' }),
    __param(0, (0, common_1.Query)('memberId')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], DepositsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('summary'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('ADMIN'),
    (0, swagger_1.ApiOperation)({ summary: 'Get total deposits summary' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], DepositsController.prototype, "getSummary", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Get a single deposit' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], DepositsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('ADMIN'),
    (0, swagger_1.ApiOperation)({ summary: 'Update a deposit record' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_deposit_dto_1.UpdateDepositDto]),
    __metadata("design:returntype", Promise)
], DepositsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('ADMIN'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete a deposit record' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], DepositsController.prototype, "remove", null);
exports.DepositsController = DepositsController = __decorate([
    (0, swagger_1.ApiTags)('Deposits'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('deposits'),
    __metadata("design:paramtypes", [deposits_service_1.DepositsService,
        members_service_1.MembersService])
], DepositsController);
//# sourceMappingURL=deposits.controller.js.map