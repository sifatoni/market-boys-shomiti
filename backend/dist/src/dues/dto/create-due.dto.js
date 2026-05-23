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
exports.UpdateDueStatusDto = exports.CreateDueDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
const client_1 = require("@prisma/client");
class CreateDueDto {
    amount;
    dueDate;
    memberId;
}
exports.CreateDueDto = CreateDueDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: '500.00' }),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateDueDto.prototype, "amount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2026-05-31' }),
    (0, class_validator_1.IsDateString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateDueDto.prototype, "dueDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'uuid-of-member' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateDueDto.prototype, "memberId", void 0);
class UpdateDueStatusDto {
    status;
    paidDate;
}
exports.UpdateDueStatusDto = UpdateDueStatusDto;
__decorate([
    (0, swagger_1.ApiProperty)({ enum: client_1.DueStatus }),
    (0, class_validator_1.IsEnum)(client_1.DueStatus),
    __metadata("design:type", String)
], UpdateDueStatusDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2026-05-20', required: false }),
    (0, class_validator_1.IsDateString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateDueStatusDto.prototype, "paidDate", void 0);
//# sourceMappingURL=create-due.dto.js.map