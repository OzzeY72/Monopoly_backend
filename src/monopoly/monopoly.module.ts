import { Module } from '@nestjs/common';
import { MonopolyController } from './monopoly.controller';
import { MonopolyService } from './monopoly.service';

@Module({
  imports: [],
  controllers: [MonopolyController],
  providers: [MonopolyService],
})
export class MonopolyModule {}
