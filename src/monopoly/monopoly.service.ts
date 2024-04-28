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
      new Branch(0,'Steam','','',
      [
        new RankFee(1000,100,500),
        new RankFee(500,120,250)
      ]),
      new Branch(1,'Epicgames','','',
      [
        new RankFee(1200,120,600),
        new RankFee(500,140,250)
      ]),
      new Branch(2,'Epicgames','','',
      [
        new RankFee(1200,120,600),
        new RankFee(500,140,250)
      ]),
      new Branch(3,'Epicgames','','',
      [
        new RankFee(1200,120,600),
        new RankFee(500,140,250)
      ]),
      new Branch(4,'Epicgames','','',
      [
        new RankFee(1200,120,600),
        new RankFee(500,140,250)
      ]),
      new Branch(5,'Epicgames','','',
      [
        new RankFee(1200,120,600),
        new RankFee(500,140,250)
      ]),
      new Branch(6,'Epicgames','','',
      [
        new RankFee(1200,120,600),
        new RankFee(500,140,250)
      ]),
    ],GameState.inGame);
  playerAnswer(id:number,answer:boolean):dtoAction{
    //Event.getInstance().invoke('playerAnswer',[id,answer]);
    return actionToDTO(this.game.onPlayerAnswer(id,answer)!);
  }
  playerMove(id:number,step: number | null):dtoAction
  {
    console.log(this.game.getPlayer(0));
    return actionToDTO(this.game.movePlayer(id,step)!);
  }
}
