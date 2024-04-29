import { IBranch, IRankFee } from "./IBranch";
import { IPlayer } from "./IPlayer";
import { RankFee } from "./Branch";
import { Action, IAction } from "./Action";
import { Event } from "./Event";

export class QuestionBranch implements IBranch{
    public star_count: number = 0;
    public owner: IPlayer = null;
    public coupled: number = 0;
    public coupling_max: number = 0; 
    public inPledge: boolean = false;
    public inPledgeDaysLeft: number = 0;

    public actions: IAction[] = [
        {
            name: "ACTION_WIN_MONEY",
            description: `ACTION_WIN_MONEY_DESCRIPTION_1`,
            player: null,
            buttons:[
                [`ACTION_ACCEPT_BUTTON`,
                (player)=>{
                    const values=[1000,1500,2000];
                    const value = values[Math.floor(Math.random() * 3)];
                    player.money += value;
                    Event.getInstance().invoke('playerSurpize',[player.id,value])
                }],
            ]
        },
        {
            name: "ACTION_LOOSE_MONEY",
            description: `ACTION_LOOSE_MONEY_DESCRIPTION_1`,
            player: null,
            buttons:[
                [`ACTION_ACCEPT_BUTTON`,
                (player)=>{
                    const values=[500,1000,1500];
                    const value = values[Math.floor(Math.random() * 3)];
                    player.money -= value;
                    Event.getInstance().invoke('playerSurpize',[player.id,value])
                }],
            ]
        },
        {
            name: "ACTION_PLAYER_SLEEP",
            description: `ACTION_PLAYER_SLEEP_DESCRIPTION_1`,
            player: null,
            buttons:[
                [`ACTION_ACCEPT_BUTTON`,
                (player)=>{
                    player.passOneTurn();
                    Event.getInstance().invoke('playerSurpize',[player.id,0])
                }],
            ]
        },
    ]

    constructor(
        public id: number,
        public name: string,
        public icon: string,
        public description:string,
        public rankfee: IRankFee[],
        public type: string,
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
        return null;
    }

    upgrade(){return false;}
    degrade(){return false;}
    pledge(){return false;}
    ransom(){return false;}
}