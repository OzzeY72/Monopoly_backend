import { IAction } from "./Action";
import { IPlayer } from "./IPlayer";
import { Player } from "./Player";

export interface IRankFee{
    cost:number;
    fee:number;
    pledge:number;
}

export interface IBranch {
    id: number;
    name: string;
    icon: string;
    description:string;
    star_count: number;
    owner: Player;
    type: string;
    rankfee: IRankFee[];
    actions: IAction[];

    getAction:(player:IPlayer)=>IAction;
    getCurrentFee:()=>IRankFee;
}