import { Module } from '@nestjs/common';
import { DepositsService } from './deposits.service';
import { DepositsController } from './deposits.controller';
import { PrismaModule } from '../prisma.module';
import { MembersModule } from '../members/members.module';

@Module({
    imports: [PrismaModule, MembersModule],
    controllers: [DepositsController],
    providers: [DepositsService],
    exports: [DepositsService],
})
export class DepositsModule { }