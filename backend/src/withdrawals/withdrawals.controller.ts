import { Controller, Get, Post, Body, Param, Delete, Patch, UseGuards, Query, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { WithdrawalsService } from './withdrawals.service';
import { CreateWithdrawalDto } from './dto/create-withdrawal.dto';
import { UpdateWithdrawalDto } from './dto/update-withdrawal.dto';
import { MembersService } from '../members/members.service';

@ApiTags('Withdrawals')
@ApiBearerAuth()
@Controller('withdrawals')
@UseGuards(RolesGuard)
export class WithdrawalsController {
    constructor(
        private readonly withdrawalsService: WithdrawalsService,
        private readonly membersService: MembersService,
    ) { }

    @Post()
    @Roles('ADMIN')
    @ApiOperation({ summary: 'Record a new withdrawal' })
    async create(@Body() dto: CreateWithdrawalDto) {
        return this.withdrawalsService.create(dto);
    }

    @Get()
    @Roles('ADMIN', 'USER')
    @ApiQuery({ name: 'memberId', required: false })
    @ApiOperation({ summary: 'Get all withdrawals' })
    async findAll(@Query('memberId') memberId: string, @Request() req) {
        if (req.user.role !== 'ADMIN') {
            const member = await this.membersService.findByUserId(req.user.id);
            return this.withdrawalsService.findAll(member?.id);
        }
        return this.withdrawalsService.findAll(memberId);
    }

    @Get('summary')
    @Roles('ADMIN')
    @ApiOperation({ summary: 'Get total withdrawals summary' })
    async getSummary() {
        return this.withdrawalsService.getTotalWithdrawals();
    }

    @Get(':id')
    @Roles('ADMIN', 'USER')
    async findOne(@Param('id') id: string) {
        return this.withdrawalsService.findOne(id);
    }

    @Patch(':id')
    @Roles('ADMIN')
    @ApiOperation({ summary: 'Update a withdrawal record' })
    async update(@Param('id') id: string, @Body() dto: UpdateWithdrawalDto) {
        return this.withdrawalsService.update(id, dto);
    }

    @Delete(':id')
    @Roles('ADMIN')
    async remove(@Param('id') id: string) {
        return this.withdrawalsService.remove(id);
    }
}