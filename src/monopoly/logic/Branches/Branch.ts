import { IAction } from "../Action";
import { IBranch } from "../interface/BranchInterfaces";
import { RankFee } from "../interface/IBranch";
import { Player } from "../Player";

export abstract class Branch implements IBranch{
    public actions: IAction[];

    constructor(
        public id: number,
        public name: string,
        public icon: string,
        public description:string,
        public type: string,
        
    ){}

    setAction(actions:IAction[]){
        this.actions = actions;
    }
    getAction(player:Player){
        return this.actions[0];
    }
    getClass(){
        return "Branch";
    }
}