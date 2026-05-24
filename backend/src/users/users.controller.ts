import { Controller, Patch, Delete, Param, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UsersService } from './users.service';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Patch(':id/reset-password')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Reset a user password (Admin only)' })
  async resetPassword(
    @Param('id') id: string,
    @Body() body: { newPassword: string }
  ) {
    await this.usersService.resetPassword(id, body.newPassword);
    return { message: 'Password reset successfully' };
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Remove a user and their member profile (Admin only)' })
  async removeUser(@Param('id') id: string) {
    await this.usersService.removeUser(id);
    return { message: 'User removed successfully' };
  }
}
