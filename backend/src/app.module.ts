import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { PrismaModule } from './prisma.module';
import { MembersModule } from './members/members.module';

@Module({
  imports: [AuthModule, UsersModule, PrismaModule, MembersModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
