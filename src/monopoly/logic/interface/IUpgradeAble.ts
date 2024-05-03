import {Player} from "../Player"
import {RankFee} from "./IBranch"

export interface IUpgradeAble{
    star_count: number;
    coupled_rankfee: RankFee;

    upgrade:()=>boolean;
    degrade:()=>boolean;
}