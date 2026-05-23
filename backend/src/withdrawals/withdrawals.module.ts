import { Module } from '@nestjs/common';
import { WithdrawalsService } from './withdrawals.service';
import { WithdrawalsController } from './withdrawals.controller';
import { PrismaModule } from '../prisma.module';
import { MembersModule } from '../members/members.module';

@Module({
    imports: [PrismaModule, MembersModule],
    controllers: [WithdrawalsController],
    providers: [WithdrawalsService],
    exports: [WithdrawalsService],
})
export class WithdrawalsModule { }