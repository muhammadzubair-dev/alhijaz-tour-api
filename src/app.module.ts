import { Module } from '@nestjs/common';
import { CommonModule } from './common/common.module';
import { UserModule } from './user/user.module';
import { MasterModule } from './master/master.module';
import { TicketModule } from './ticket/ticket.module';
import { LovModule } from './lov/lov.module';

@Module({
  imports: [CommonModule, UserModule, MasterModule, TicketModule, LovModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
