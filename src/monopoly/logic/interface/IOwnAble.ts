import {Player} from "../Player"
import {RankFee} from "./IBranch"

export interface IOwnAble{
    owner: Player;
    rankfee: RankFee[];
    inPledge: boolean;
    inPledgeDaysLeft: number;

    getCurrentFee:()=>RankFee;
    pledge:()=>boolean;
    ransom:()=>boolean;
    free:()=>void;
    setOwner:(owner:Player)=>void;
    tryDecreaseLeftDays:()=>void;
}