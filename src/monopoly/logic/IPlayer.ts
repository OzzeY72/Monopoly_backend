import { IBranch } from "./IBranch";

export interface IPlayer {
    id: number,
    nickname: string,
    money: number,
    location: number,
    branches: IBranch[],
    canMove: boolean,
    alive: boolean,

    isAbleToMove:()=>boolean;
    passOneTurn:()=>void;
    killPlayer:()=>void;
}