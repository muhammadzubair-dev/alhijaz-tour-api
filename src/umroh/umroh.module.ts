import { Module } from '@nestjs/common';
import { UmrohService } from './umroh.service';
import { UmrohController } from './umroh.controller';

@Module({
  providers: [UmrohService],
  controllers: [UmrohController],
})
// eslint-disable-next-line prettier/prettier
export class UmrohModule { }
