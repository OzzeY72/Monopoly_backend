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
    public coupled: number = 0;
    public inPledge: boolean = false;
    public inPledgeDaysLeft: number = 0;
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
                    if(player.money >= this.getCurrentFee().fee){
                        payed_money = this.getCurrentFee().fee;
                        Event.getInstance().invoke('playerPayedFee',[player.id,this.id]);
                    }
                    else{
                        payed_money = player.money;
                        console.log(player);
                        if((player.getFullCapital() * 0.9) <= this.getCurrentFee().fee){
                            player.killPlayer();
                        }
                    }
                    player.money -= payed_money;
                    this.owner.money += payed_money;
                    
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
                            player.branch_manager.add(this);
                            //Event.getInstance().invoke('playerBought',[player.id,this.id]);
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
        public type: string,
        public coupling_max: number,
        public rankfee: IRankFee[],

    ){}

    getAction(player: IPlayer):IAction {
        //console.log(this.id +" "+ this.name);
        if(!this.inPledge){
            if(this.owner == null)
                return this.actions[1];
            else{
                if(this.owner == player)
                    return null;
                else
                    return this.actions[0];
            }
        }
        else{
            return null;
        }
    }
    getCurrentFee():IRankFee{
        if(this.star_count == 0){
            if(this.coupled)
                return this.rankfee[this.rankfee.length-1];
            else
                return this.rankfee[0];
        }
        return this.rankfee[this.star_count];
    }
    upgrade():boolean{
        if(this.star_count < 5 &&
            !this.inPledge
        ){
            if(this.owner.money >= this.rankfee[this.star_count+1].cost){
                this.owner.money -= this.rankfee[this.star_count+1].cost;
                this.star_count++;
                console.log([this]);
                return true;
            }
        }
        return false;
    }
    degrade():boolean{
        if(this.star_count > 0){
            this.owner.money += this.rankfee[this.star_count].pledge;
            this.star_count--;
            console.log([this]);
            return true;
        }
        return false;
    }
    pledge():boolean{
        if(this.star_count == 0 && 
            !this.inPledge
        ){
            this.owner.money += this.rankfee[0].pledge;
            this.inPledge = true;
            this.inPledgeDaysLeft = 15;
            console.log([this]);
            return true;
        }
        return false;
    }
    ransom():boolean{
        if(this.owner.money >= this.rankfee[0].pledge &&
            this.inPledge
        ){
            this.owner.money -= this.rankfee[0].pledge;
            this.inPledge = false;
            this.inPledgeDaysLeft = 0;
            console.log([this]);
            return true;
        }
        return false;
    }

}