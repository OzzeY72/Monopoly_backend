import { Injectable } from '@nestjs/common';
import {Game, GameState} from './logic/Game'
import { Player } from './logic/Player';
import { Branch, RankFee } from './logic/Branch';
import { Action } from './logic/Action';
import { Event } from './logic/Event';
import {actionToDTO} from './api/mappers/monopoly.mappers'
import { dtoAction } from './api/dto/dtoAction';

@Injectable()
export class MonopolyService {
  constructor(){}
  public game:Game = new Game(
    [
      new Player(0,'OzzeY',10000),
      new Player(1,'wxczxo',12000)
    ],
    [
      new Branch(0,'Steam','','','gameshop',2,
      [
        new RankFee(1000,100,500),
        new RankFee(500,120,250),
        new RankFee(500,140,250),
        new RankFee(500,180,250),
        new RankFee(500,240,250),
        new RankFee(500,300,250),
      ]),
      new Branch(1,'Epicgames','','','gameshop',2,
      [
        new RankFee(1200,120,600),
        new RankFee(500,140,350)
      ]),
      new Branch(2,'Coca Cola','','','drink',3,
      [
        new RankFee(2000,200,1000),
        new RankFee(700,220,350)
      ]),
      new Branch(3,'Pepsi Cola','','','drink',3,
      [
        new RankFee(2100,210,1050),
        new RankFee(700,230,350)
      ]),
      new Branch(4,'Dr Peper','','','drink',3,
      [
        new RankFee(2200,220,1100),
        new RankFee(700,240,350)
      ])
    ],GameState.inGame);
  playerAnswer(id:number,answer:boolean):dtoAction{
    //Event.getInstance().invoke('playerAnswer',[id,answer]);
    return actionToDTO(this.game.onPlayerAnswer(id,answer)!);
  }
  playerMove(id:number,step: number | null):dtoAction{
    console.log(this.game.getPlayer(0));
    return actionToDTO(this.game.movePlayer(id,step)!);
  }
  debug(){
    this.playerMove(0,0);
    this.playerAnswer(0,true);
    this.playerMove(1,2);
    this.playerAnswer(1,true);
    this.playerMove(0,1);
    this.playerAnswer(0,true);
  }
  branchAction(branch_id:number,action:string):boolean{
    const branch = this.game.getBranch(branch_id);
    switch(action){
      case 'upgrade': return branch.upgrade();
      case 'degrade': return branch.degrade();
      case 'pledge': return branch.pledge();
      case 'ransom': return branch.ransom(); 
      default: break;
    }
  }
}
