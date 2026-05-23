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
exports.WithdrawalsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const roles_guard_1 = require("../auth/roles.guard");
const roles_decorator_1 = require("../auth/roles.decorator");
const withdrawals_service_1 = require("./withdrawals.service");
const create_withdrawal_dto_1 = require("./dto/create-withdrawal.dto");
const update_withdrawal_dto_1 = require("./dto/update-withdrawal.dto");
const members_service_1 = require("../members/members.service");
let WithdrawalsController = class WithdrawalsController {
    withdrawalsService;
    membersService;
    constructor(withdrawalsService, membersService) {
        this.withdrawalsService = withdrawalsService;
        this.membersService = membersService;
    }
    async create(dto) {
        return this.withdrawalsService.create(dto);
    }
    async findAll(memberId, req) {
        if (req.user.role !== 'ADMIN') {
            const member = await this.membersService.findByUserId(req.user.id);
            return this.withdrawalsService.findAll(member?.id);
        }
        return this.withdrawalsService.findAll(memberId);
    }
    async getSummary() {
        return this.withdrawalsService.getTotalWithdrawals();
    }
    async findOne(id) {
        return this.withdrawalsService.findOne(id);
    }
    async update(id, dto) {
        return this.withdrawalsService.update(id, dto);
    }
    async remove(id) {
        return this.withdrawalsService.remove(id);
    }
};
exports.WithdrawalsController = WithdrawalsController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('ADMIN'),
    (0, swagger_1.ApiOperation)({ summary: 'Record a new withdrawal' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_withdrawal_dto_1.CreateWithdrawalDto]),
    __metadata("design:returntype", Promise)
], WithdrawalsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiQuery)({ name: 'memberId', required: false }),
    (0, swagger_1.ApiOperation)({ summary: 'Get all withdrawals' }),
    __param(0, (0, common_1.Query)('memberId')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], WithdrawalsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('summary'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('ADMIN'),
    (0, swagger_1.ApiOperation)({ summary: 'Get total withdrawals summary' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], WithdrawalsController.prototype, "getSummary", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Get a single withdrawal' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], WithdrawalsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('ADMIN'),
    (0, swagger_1.ApiOperation)({ summary: 'Update a withdrawal record' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_withdrawal_dto_1.UpdateWithdrawalDto]),
    __metadata("design:returntype", Promise)
], WithdrawalsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('ADMIN'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete a withdrawal record' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], WithdrawalsController.prototype, "remove", null);
exports.WithdrawalsController = WithdrawalsController = __decorate([
    (0, swagger_1.ApiTags)('Withdrawals'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('withdrawals'),
    __metadata("design:paramtypes", [withdrawals_service_1.WithdrawalsService,
        members_service_1.MembersService])
], WithdrawalsController);
//# sourceMappingURL=withdrawals.controller.js.map