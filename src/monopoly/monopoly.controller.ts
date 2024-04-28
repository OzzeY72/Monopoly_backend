import { Body, Controller, Get,Param,Post } from '@nestjs/common';
import { MonopolyService } from './monopoly.service';

@Controller('monopoly')
export class MonopolyController {
  constructor(
    private readonly monopolyService: MonopolyService,
  ) {}
  
  @Post('move')
  playerMove(@Body() body: any): string{
    const response = this.monopolyService.playerMove(body.player_id,body.step);
    return JSON.stringify(response);
  }

  @Post('answer')
  playerAnswer(@Body() body: any):string{
    return JSON.stringify(this.monopolyService.playerAnswer(body.player_id,body.answer));
  }

}
