import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { DuesService } from './dues.service';
import { DuesController } from './dues.controller';
import { DuesScheduler } from './dues.scheduler';
import { PrismaModule } from '../prisma.module';
import { MembersModule } from '../members/members.module';
import { EmailModule } from '../email/email.module';

@Module({
    imports: [PrismaModule, MembersModule, ScheduleModule.forRoot(), EmailModule],
    controllers: [DuesController],
    providers: [DuesService, DuesScheduler],
    exports: [DuesService],
})
export class DuesModule { }

