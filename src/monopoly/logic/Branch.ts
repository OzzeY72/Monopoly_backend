import { IBranch, IRankFee } from "./IBranch";
import { IPlayer } from "./IPlayer";
import { Action, IAction } from "./Action";
import { Event } from "./Event";

export class RankFee implements IRankFee
{
    constructor(
        public cost:number,
        public fee:number,
        public pledge:number
    ){}
}

export class Branch implements IBranch{
    public star_count: number = 0;
    public owner: IPlayer = null;
    public actions: IAction[] = [
        {
            name: "ACTION_PAYFEE_NAME",
            description: `ACTION_PAYFEE_DESCRIPTION ${this.name} 
                            ACTION_PAYFEE_DESCRIPTION_PLAYER ${this.owner?.nickname} ?`,
            player: null,
            buttons:[
                [`ACTION_PAYFEE_BUTTON ${this.rankfee[this.star_count].fee}`,
                //POSSIBLY BAGGY
                (player)=>{
                    let payed_money;
                    if(player.money >= this.rankfee[this.star_count].fee){
                        payed_money = this.rankfee[this.star_count].fee;
                    }
                    else{
                        payed_money = player.money;
                        //Player looses
                        player.killPlayer();
                    }
                    player.money -= payed_money;
                    this.owner.money += payed_money;
                    Event.getInstance().invoke('playerPayedFee',[player.id,this.id]);
                }],
            ]
        },
        {
            name: "ACTION_BUY_NAME",
            description: `ACTION_BUY_DESCRIPTION ${this.name} ?`, 
            player: null,
            buttons:[
                [`ACTION_BUY_BUTTON ${this.getCurrentFee().cost}`,
                    (player)=>{
                        if(player.money >= this.getCurrentFee().cost){
                            player.money -= this.getCurrentFee().cost;
                            this.owner = player;
                            player.branches.push(this);
                            Event.getInstance().invoke('playerBought',[player.id,this.id]);
                        }
                        else{
                            Event.getInstance().invoke('beginBargaining',this.id);
                        }
                    }
                ],
                [`ACTION_DECLINE_BUTTON`,
                    (player)=>{
                        Event.getInstance().invoke('beginBargaining',this.id);
                    }
                ]
            ]
        },
    ]

    constructor(
        public id: number,
        public name: string,
        public icon: string,
        public description:string,
        public rankfee: IRankFee[],
    ){}

    getAction(player: IPlayer):IAction {
        console.log(this.id +" "+ this.name);
        if(this.owner == null)
            return this.actions[1];
        else{
            if(this.owner == player)
                return null;
            else
                return this.actions[0];
        }
    }
    getCurrentFee():IRankFee{
        return this.rankfee[this.star_count];
    }
}