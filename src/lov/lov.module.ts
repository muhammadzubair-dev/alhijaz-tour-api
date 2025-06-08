import { Module } from '@nestjs/common';
import { LovService } from './lov.service';
import { LovController } from './lov.controller';

@Module({
  providers: [LovService],
  controllers: [LovController],
})
export class LovModule {}
