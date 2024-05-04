import { Module } from '@nestjs/common';
import { MonopolyController } from './monopoly.controller';
import { MonopolyGateway } from './monopoly.gateway';
import { MonopolyService } from './monopoly.service';

@Module({
  imports: [],
  controllers: [MonopolyController],
  providers: [MonopolyService,MonopolyGateway],
})
export class MonopolyModule {}
