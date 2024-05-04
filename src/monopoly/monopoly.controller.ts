import { Body, Controller, Get,Param,Post } from '@nestjs/common';
import { MonopolyService } from './monopoly.service';
import { Player } from './logic/Player';

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

  @Get('debug')
  debug(){
    this.monopolyService.debug();
    //this.monopolyService.game.getPlayer(0).branch_manager.getBranches();
  }
  @Get('branches')
  branches(){
    return this.monopolyService.getBranchesInDto();
  }
  @Get('players')
  players(){
    return this.monopolyService.getPlayersInDto();
  }
  @Get('game')
  game(){
    return this.monopolyService.getGameInDto();
  }
  
  @Post('player')
  addPlayer(@Body() body: any):void{
    this.monopolyService.addPlayer(body.nickname);
  }
  @Post('action')
  branchAction(@Body() body: any):boolean{
    return this.monopolyService.branchAction(body.branch_id,body.action);
  }

}
