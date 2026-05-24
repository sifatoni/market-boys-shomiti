"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DuesModule = void 0;
const common_1 = require("@nestjs/common");
const schedule_1 = require("@nestjs/schedule");
const dues_service_1 = require("./dues.service");
const dues_controller_1 = require("./dues.controller");
const dues_scheduler_1 = require("./dues.scheduler");
const prisma_module_1 = require("../prisma.module");
const members_module_1 = require("../members/members.module");
const email_module_1 = require("../email/email.module");
let DuesModule = class DuesModule {
};
exports.DuesModule = DuesModule;
exports.DuesModule = DuesModule = __decorate([
    (0, common_1.Module)({
        imports: [prisma_module_1.PrismaModule, members_module_1.MembersModule, schedule_1.ScheduleModule.forRoot(), email_module_1.EmailModule],
        controllers: [dues_controller_1.DuesController],
        providers: [dues_service_1.DuesService, dues_scheduler_1.DuesScheduler],
        exports: [dues_service_1.DuesService],
    })
], DuesModule);
//# sourceMappingURL=dues.module.js.map