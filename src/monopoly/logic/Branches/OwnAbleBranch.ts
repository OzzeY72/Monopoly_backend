import { Branch } from "../Branches/Branch";
import { IOwnAble } from "../interface/BranchInterfaces";
import { IAction } from "../Action";
import {Player} from '../Player'
import {RankFee} from '../interface/IBranch'
import { Event } from "../Event";

export abstract class OwnAbleBranch extends Branch implements IOwnAble{
    owner: Player = null;
    inPledge: boolean = false;
    inPledgeDaysLeft: number = 0;
    
    constructor(
        id: number,
        name: string,
        icon: string,
        description:string,
        type: string,
        public rankfee: RankFee[],
    ){
        super(id,name,icon,description,type);
        this.update();
    }

    update(){
        this.setAction([
            {
                name: "ACTION_BUY_NAME",
                description: `ACTION_BUY_DESCRIPTION ${this.name} ?`, 
                player: null,
                buttons:[
                    [`ACTION_BUY_BUTTON ${this.getCurrentFee().cost}`,
                        (player)=>{
                            if(player.money >= this.getCurrentFee().cost){
                                player.money -= this.getCurrentFee().cost;
                                this.setOwner(player);
                                player.branch_manager.add(this);
                                Event.getInstance().invoke('playerBought',[player.id,this.id]);
                            }
                            /*else{
                                Event.getInstance().invoke('beginBargaining',this.id);
                            }*/
                        }
                    ],
                    [`ACTION_DECLINE_BUTTON`,
                        (player)=>{
                            Event.getInstance().invoke('beginBargaining',this.id);
                        }
                    ]
                ]
            },
            {
                name: "ACTION_PAYFEE_NAME",
                description: `ACTION_PAYFEE_DESCRIPTION ${this.name} ` 
                    + `ACTION_PAYFEE_DESCRIPTION_PLAYER ${this.owner?.nickname} ?`,
                player: null,
                buttons:[
                    [`ACTION_PAYFEE_BUTTON ${this.getCurrentFee().fee}`,
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
                            //if((player.getFullCapital() * 0.9) <= this.getCurrentFee().fee){
                                player.killPlayer();
                            //}
                        }   
                        player.money -= payed_money;
                        this.owner ? this.owner.money += payed_money : false;
                    }],
                    [`ACTION_SURRENDER_BUTTON`,
                    (player)=>{
                        player.killPlayer();
                    }],
                ]
            }
        ]);
    }

    setOwner(owner:Player){
        this.owner = owner;
        this.update();
    }

    getAction(player:Player){
        if(!this.inPledge){
            if(this.owner == null)
                return this.actions[0];
            else{
                if(this.owner == player)
                    return null;
                else
                    return this.actions[1];
            }
        }
        else{
            return null;
        }
    }
    getCurrentFee(){
        return this.rankfee[0];
    }
    pledge(){
        if(!this.inPledge){
            this.owner.money += this.rankfee[0].pledge;
            this.inPledge = true;
            this.inPledgeDaysLeft = 15;
            console.log([this]);
            return true;
        }
        return false;
    }
    ransom(){
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
    free(){
        this.inPledge = false;
        this.inPledgeDaysLeft = 0;
        this.setOwner(null);
    }
    tryDecreaseLeftDays(){
        if(this.inPledgeDaysLeft != 0){
            this.inPledgeDaysLeft--;
            if(this.inPledgeDaysLeft == 0){
                this.free();
                Event.getInstance().invoke('playerLost',this.id);
            }
        }
    }
    getClass(){
        return "OwnAbleBranch";
    }
}