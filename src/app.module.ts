import { Module } from '@nestjs/common';
import { CommonModule } from './common/common.module';
import { UserModule } from './user/user.module';
import { MasterModule } from './master/master.module';

@Module({
  imports: [CommonModule, UserModule, MasterModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
