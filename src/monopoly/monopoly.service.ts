import { Injectable } from '@nestjs/common';
import {Game, GameState} from './logic/Game'
import { Player } from './logic/Player';
import { RankFee } from './logic/interface/IBranch';
import { DefaultBranch } from './logic/Branches/DefaultBranch';
import {BranchToDTO, GameToDTO, PlayerToDTO, actionToDTO} from './api/mappers/monopoly.mappers'
import { dtoAction } from './api/dto/dtoAction';
import { IUpgradeAble } from './logic/interface/BranchInterfaces';

@Injectable()
export class MonopolyService {
  private readonly default_money = 15000;

  constructor(){}
  public game:Game = new Game(
    [
      new Player(0,'OzzeY',12000),
      new Player(1,'wxczxo',12000),
      new Player(2,'redm00se',12000)
    ],
    [
      new DefaultBranch(0,'Steam','','','gameshop',2,
        [
          new RankFee(1000,100,500),
          new RankFee(500,120,250),
          new RankFee(500,140,250),
          new RankFee(500,180,250),
          new RankFee(500,240,250),
          new RankFee(500,5000,250),
        ],
        new RankFee(1000,110,500)
      ),
      new DefaultBranch(1,'Epicgames','','','gameshop',2,
        [
          new RankFee(1200,120,600),
          new RankFee(500,140,350),
          new RankFee(500,140,250),
          new RankFee(500,180,250),
          new RankFee(500,240,250),
          new RankFee(500,5000,250),
        ],
        new RankFee(1200,120,600)
      ),
      new DefaultBranch(2,'Coca Cola','','','drink',3,
        [
          new RankFee(2000,200,1000),
          new RankFee(700,220,350)
        ],
        new RankFee(2000,200,1000),
      ),
      new DefaultBranch(3,'Pepsi Cola','','','drink',3,
        [
          new RankFee(2100,300,1050),
          new RankFee(700,230,350)
        ],
        new RankFee(2200,500,1100)
      ),
      new DefaultBranch(4,'Dr Peper','','','drink',3,
        [
          new RankFee(2200,500,1100),
          new RankFee(700,240,350)
        ],
        new RankFee(2200,500,1100)
      )
    ],GameState.inGame);
  playerAnswer(id:number,answer:boolean):dtoAction{
    //Event.getInstance().invoke('playerAnswer',[id,answer]);
    return actionToDTO(this.game.onPlayerAnswer(id,answer)!);
  }
  playerMove(id:number,step: number | null):dtoAction{
    //console.log(this.game.getPlayer(id)?.nickname + " has " + this.game.getPlayer(id)?.money);
    return actionToDTO(this.game.movePlayer(id,step)!);
  }
  debug(){
    /*this.playerMove(0,0);
    this.playerAnswer(0,true);
    this.playerMove(1,2);
    this.playerAnswer(1,true);
    this.playerMove(2,2);
    this.playerAnswer(2,true);
    this.playerMove(0,1);
    this.playerAnswer(0,true);
    this.playerMove(1,0);
    this.playerAnswer(1,true);
    this.playerMove(2,0);
    this.playerAnswer(2,true);
    this.branchAction(0,'upgrade');
    this.branchAction(0,'upgrade');
    this.branchAction(0,'upgrade');
    this.branchAction(0,'upgrade');
    this.branchAction(0,'upgrade');
    this.branchAction(1,'upgrade');
    this.branchAction(1,'upgrade');
    this.branchAction(1,'upgrade');
    this.branchAction(1,'upgrade');
    this.branchAction(1,'upgrade');*/
    
    let a = 100;
    for(let i = 0;i < a;i++){
      const cur_player = this.game.getPlayerTurn();
      if(this.game.getPlayer(cur_player) != null){
        this.playerMove(cur_player,null);
        this.playerAnswer(cur_player,true);
      }
    }
    

    //console.log(this.game.getPlayer(1).getFullCapital())
    //this.playerAnswer(1,true);
    //this.branchAction(0,'upgrade');
    //console.log(this.game.getPlayer(0).getCapital());
  }
  branchAction(branch_id:number,action:string):boolean{
    const branch = (this.game.getBranch(branch_id) as any);

    if(this.game.getPlayerTurn() == branch.owner?.id){
      switch(action){
        case 'upgrade': return (branch as IUpgradeAble).upgrade();
        case 'degrade': return (branch as IUpgradeAble).degrade();
        case 'pledge': return branch.pledge();
        case 'ransom': return branch.ransom(); 
        default: break;
      }
    }
    else{
      console.warn('Not your turn');
    }

    //console.log(branch.owner?.nickname + " has " + branch.owner?.money);
  }
  addPlayer(nickname:string):boolean{
    if(!this.game.getPlayers().find(player=>player.nickname == nickname)){
      this.game.addPlayer(new Player(this.game.getPlayers().length,nickname,this.default_money));
      return true;
    }
    else{
      return false;
    }
  }

  getBranchesInDto(){
    const arr = [];
    this.game.getBranches().forEach(branch=>
      arr.push(BranchToDTO(branch))
    )
    return arr;
  }

  getPlayersInDto(){
    const arr = [];
    this.game.getPlayers().forEach(player=>
      arr.push(PlayerToDTO(player))
    )
    return arr;
  }

  getGameInDto(){
    return GameToDTO(this.game);
  }
}
