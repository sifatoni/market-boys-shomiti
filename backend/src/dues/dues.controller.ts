import { Controller, Get, Post, Body, Param, Patch, UseGuards, Query, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { DuesService } from './dues.service';
import { CreateDueDto, UpdateDueStatusDto } from './dto/create-due.dto';
import { MembersService } from '../members/members.service';

@ApiTags('Dues')
@ApiBearerAuth()
@Controller('dues')
@UseGuards(RolesGuard)
export class DuesController {
    constructor(
        private readonly duesService: DuesService,
        private readonly membersService: MembersService,
    ) { }

    @Post()
    @Roles('ADMIN')
    @ApiOperation({ summary: 'Create a due record manually' })
    async create(@Body() dto: CreateDueDto) {
        return this.duesService.create(dto);
    }

    @Post('generate-monthly')
    @Roles('ADMIN')
    @ApiOperation({ summary: 'Generate monthly dues for all active members' })
    async generateMonthly(@Body() body: { amount: string; month: number; year: number }) {
        return this.duesService.generateMonthlyDues(body.amount, body.month, body.year);
    }

    @Get()
    @Roles('ADMIN', 'USER')
    @ApiQuery({ name: 'memberId', required: false })
    @ApiOperation({ summary: 'Get all due records' })
    async findAll(@Query('memberId') memberId: string, @Request() req) {
        if (req.user.role !== 'ADMIN') {
            const member = await this.membersService.findByUserId(req.user.id);
            return this.duesService.findAll(member?.id);
        }
        return this.duesService.findAll(memberId);
    }

    @Get('overdue')
    @Roles('ADMIN')
    @ApiOperation({ summary: 'Get all overdue records' })
    async findOverdue() {
        return this.duesService.findOverdue();
    }

    @Get('summary')
    @Roles('ADMIN')
    @ApiOperation({ summary: 'Get dues summary statistics' })
    async getSummary() {
        return this.duesService.getSummary();
    }

    @Patch(':id/status')
    @Roles('ADMIN')
    @ApiOperation({ summary: 'Update due record status (PAID/PARTIAL/UNPAID)' })
    async updateStatus(@Param('id') id: string, @Body() dto: UpdateDueStatusDto) {
        return this.duesService.updateStatus(id, dto);
    }
}