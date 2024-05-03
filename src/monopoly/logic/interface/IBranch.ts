import { IAction } from "../Action";
import { Player } from "../Player";

export class RankFee
{
    constructor(
        public cost:number,
        public fee:number,
        public pledge:number
    ){}
}

export interface IBranch {
    id: number;
    name: string;
    icon: string;
    description:string;
    type: string;
    actions: IAction[];

    getAction:(player:Player)=>IAction;
    getClass:()=>string;
}