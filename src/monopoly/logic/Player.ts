import { IBranch } from "./IBranch";
import {IPlayer} from "./IPlayer"
import { Event } from "./Event";

export class Player implements IPlayer {
    public location: number = 0;
    public canMove: boolean = true;
    public branches: IBranch[] = [];
    public alive: boolean = true;

    constructor(
        public id: number,
        public nickname: string,
        public money: number,
    ){}

    killPlayer(){
        if(!this.alive){
            Event.getInstance().invoke('playerKilled',this.id);
        }
    }

    passOneTurn(){
        this.canMove = false;
    }

    isAbleToMove():boolean{
        if(!this.canMove) {
            this.canMove = true;
            return false;
        }
        return this.alive && this.canMove;
    }
}