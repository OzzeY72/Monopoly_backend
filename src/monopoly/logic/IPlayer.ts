import { IBranch } from "./IBranch";
import { BranchManager } from "./BranchManager";

export interface IPlayer {
    id: number,
    nickname: string,
    money: number,
    location: number,
    branch_manager: BranchManager,
    canMove: boolean,
    alive: boolean,

    isAbleToMove:()=>boolean;
    passOneTurn:()=>void;
    killPlayer:()=>void;
}