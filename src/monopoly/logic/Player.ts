import { IBranch, IUpgradeAble } from "./interface/BranchInterfaces";
import { Event } from "./Event";
import {BranchManager} from "./BranchManager"
import { get } from "http";

export class Player {
    public location: number = 0;
    public canMove: boolean = true;
    public branch_manager: BranchManager;
    public alive: boolean = true;

    constructor(
        public id: number,
        public nickname: string,
        public money: number,
    ){
        this.branch_manager = new BranchManager();
    }

    killPlayer(){
        if(this.alive){
            this.alive = false;
            this.branch_manager = new BranchManager();
            Event.getInstance().invoke('playerKilled',this.id);
        }
        else{
            console.log('already dead');
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
    getCapital():number{
        let capital = 0;
        const branches = this.branch_manager.getBranches();
        
        branches.forEach((branch:any)=>{
            if((branch as IUpgradeAble).star_count !== undefined){
                for(let i = 0;i <= branch.star_count;i++){
                    capital += branch.rankfee[i].pledge;
                }
            }
            else{
                capital += branch.rankfee[0].pledge;
            }
        });
        return capital;
    }
    getFullCapital():number{
        return this.getCapital() + this.money;
    }
}