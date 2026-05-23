import { Module } from '@nestjs/common';
import { DuesService } from './dues.service';
import { DuesController } from './dues.controller';
import { PrismaModule } from '../prisma.module';
import { MembersModule } from '../members/members.module';

@Module({
    imports: [PrismaModule, MembersModule],
    controllers: [DuesController],
    providers: [DuesService],
    exports: [DuesService],
})
export class DuesModule { }