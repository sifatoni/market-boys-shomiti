import { Controller, Get, Post, Body, Param, Delete, Patch, UseGuards, Query, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { DepositsService } from './deposits.service';
import { CreateDepositDto } from './dto/create-deposit.dto';
import { UpdateDepositDto } from './dto/update-deposit.dto';
import { MembersService } from '../members/members.service';

@ApiTags('Deposits')
@ApiBearerAuth()
@Controller('deposits')
@UseGuards(RolesGuard)
export class DepositsController {
    constructor(
        private readonly depositsService: DepositsService,
        private readonly membersService: MembersService,
    ) { }

    @Post()
    @Roles('ADMIN')
    @ApiOperation({ summary: 'Record a new deposit' })
    async create(@Body() dto: CreateDepositDto) {
        return this.depositsService.create(dto);
    }

    @Get()
    @Roles('ADMIN', 'USER')
    @ApiQuery({ name: 'memberId', required: false })
    @ApiOperation({ summary: 'Get all deposits (optionally filter by member)' })
    async findAll(@Query('memberId') memberId: string, @Request() req) {
        if (req.user.role !== 'ADMIN') {
            const member = await this.membersService.findByUserId(req.user.id);
            return this.depositsService.findAll(member?.id);
        }
        return this.depositsService.findAll(memberId);
    }

    @Get('summary')
    @Roles('ADMIN')
    @ApiOperation({ summary: 'Get total deposits summary' })
    async getSummary() {
        return this.depositsService.getTotalDeposits();
    }

    @Get(':id')
    @Roles('ADMIN', 'USER')
    @ApiOperation({ summary: 'Get a single deposit' })
    async findOne(@Param('id') id: string) {
        return this.depositsService.findOne(id);
    }

    @Patch(':id')
    @Roles('ADMIN')
    @ApiOperation({ summary: 'Update a deposit record' })
    async update(@Param('id') id: string, @Body() dto: UpdateDepositDto) {
        return this.depositsService.update(id, dto);
    }

    @Delete(':id')
    @Roles('ADMIN')
    @ApiOperation({ summary: 'Delete a deposit record' })
    async remove(@Param('id') id: string) {
        return this.depositsService.remove(id);
    }
}