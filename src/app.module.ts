import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MonopolyModule } from './monopoly/monopoly.module';

@Module({
  imports: [MonopolyModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
