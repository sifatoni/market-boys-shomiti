import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { PrismaModule } from './prisma.module';
import { MembersModule } from './members/members.module';
import { DepositsModule } from './deposits/deposits.module';
import { WithdrawalsModule } from './withdrawals/withdrawals.module';
import { DuesModule } from './dues/dues.module';

@Module({
  imports: [
    AuthModule,
    UsersModule,
    PrismaModule,
    MembersModule,
    DepositsModule,
    WithdrawalsModule,
    DuesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }