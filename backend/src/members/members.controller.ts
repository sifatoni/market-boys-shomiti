import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, ForbiddenException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { MembersService } from './members.service';
import { CreateMemberDto } from './dto/create-member.dto';
import { UpdateMemberDto } from './dto/update-member.dto';
import { Member } from '@prisma/client';

@ApiTags('Members')
@ApiBearerAuth()
@Controller('members')
@UseGuards(RolesGuard)
export class MembersController {
  constructor(private readonly membersService: MembersService) {}

  @Post()
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Create a new member' })
  async create(@Body() createMemberDto: CreateMemberDto): Promise<Member> {
    return this.membersService.create(createMemberDto);
  }

  @Get()
  @Roles('ADMIN', 'USER')
  @ApiOperation({ summary: 'Get all members' })
  async findAll(@Request() req) {
    if (req.user.role === 'ADMIN') {
      return this.membersService.findAll();
    }
    const member = await this.membersService.findByUserId(req.user.id);
    return member ? [member] : [];
  }

  @Get(':id')
  @Roles('ADMIN', 'USER')
  @ApiOperation({ summary: 'Get member details' })
  async findOne(@Param('id') id: string, @Request() req) {
    const member = await this.membersService.findOne(id);
    if (req.user.role !== 'ADMIN' && member.userId !== req.user.id) {
      throw new ForbiddenException('You can only view your own profile');
    }
    return member;
  }

  @Patch(':id')
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Update member profile' })
  async update(@Param('id') id: string, @Body() updateMemberDto: UpdateMemberDto): Promise<Member> {
    return this.membersService.update(id, updateMemberDto);
  }

  @Delete(':id')
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Remove a member' })
  async remove(@Param('id') id: string): Promise<Member> {
    return this.membersService.remove(id);
  }

  @Get(':id/balance')
  @Roles('ADMIN', 'USER')
  @ApiOperation({ summary: 'Calculate current member balance' })
  async getBalance(@Param('id') id: string, @Request() req) {
    // Security check: User can only see their own balance
    const member = await this.membersService.findOne(id);
    if (req.user.role !== 'ADMIN' && member.userId !== req.user.id) {
       throw new ForbiddenException('You can only view your own balance');
    }
    return this.membersService.calculateBalance(id);
  }
}
