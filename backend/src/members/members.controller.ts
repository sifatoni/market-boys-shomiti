import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, ForbiddenException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { MembersService } from './members.service';
import { CreateMemberDto } from './dto/create-member.dto';
import { UpdateMemberDto } from './dto/update-member.dto';
import { Member } from '@prisma/client';

@ApiTags('Members')
@ApiBearerAuth()
@Controller('members')
export class MembersController {
  constructor(private readonly membersService: MembersService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Create a new member' })
  async create(@Body() createMemberDto: CreateMemberDto): Promise<Member> {
    return this.membersService.create(createMemberDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get all members' })
  async findAll(@Request() req) {
    if (req.user.role === 'ADMIN') {
      return this.membersService.findAll();
    }
    const member = await this.membersService.findByUserId(req.user.id);
    return member ? [member] : [];
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get member details' })
  async findOne(@Param('id') id: string, @Request() req) {
    const member = await this.membersService.findOne(id);
    if (req.user.role !== 'ADMIN' && member.userId !== req.user.id) {
      throw new ForbiddenException('You can only view your own profile');
    }
    return member;
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Update member profile' })
  async update(@Param('id') id: string, @Body() updateMemberDto: UpdateMemberDto): Promise<Member> {
    return this.membersService.update(id, updateMemberDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Remove a member' })
  async remove(@Param('id') id: string): Promise<Member> {
    return this.membersService.remove(id);
  }

  @Get(':id/balance')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Calculate current member balance' })
  async getBalance(@Param('id') id: string, @Request() req: Express.Request & { user: { id: string; role: string } }) {
    const member = await this.membersService.findOne(id);
    if (req.user.role !== 'ADMIN' && member.userId !== req.user.id) {
      throw new ForbiddenException('You can only view your own balance');
    }
    return this.membersService.calculateBalance(id);
  }
}
