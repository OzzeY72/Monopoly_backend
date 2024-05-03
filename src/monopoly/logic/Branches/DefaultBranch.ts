import { IUpgradeAble,IOwnAble,IBranch,ICoupleAble } from "../interface/BranchInterfaces";
import { IAction } from "../Action";
import { Player } from "../Player";
import {RankFee} from "../interface/IBranch"
import { OwnAbleBranch } from "./OwnAbleBranch";


export class DefaultBranch extends OwnAbleBranch implements IUpgradeAble, ICoupleAble{
    couple_level: number;
    star_count: number = 0;

    constructor(
        id: number,
        name: string,
        icon: string,
        description:string,
        type: string,
        public coupling_max: number,
        rankfee: RankFee[],
        public coupled_rankfee: RankFee,
        
    ){
        super(id,name,icon,description,type,rankfee);
    }
    getCurrentFee = () => {
        if(this.star_count == 0){
            if(this.isCoupled())
                return this.coupled_rankfee;
            else
                return super.getCurrentFee();
        }
        return this.rankfee[this.star_count];
    }
    pledge(){
        if(this.star_count == 0){
            return super.pledge();
        }
    }
    upgrade(){
        if(this.star_count < 5 &&
            !this.inPledge
        ){
            if(this.owner.money >= this.rankfee[this.star_count+1].cost){
                this.owner.money -= this.rankfee[this.star_count+1].cost;
                this.star_count++;
                console.log([this]);
                return true;
            }
        }
        return false;
    }
    degrade(){
        if(this.star_count > 0){
            this.owner.money += this.rankfee[this.star_count].pledge;
            this.star_count--;
            console.log([this]);
            return true;
        }
        return false;
    }
    free = () => {
        super.free();
        this.star_count = 0;
        this.couple_level = 0;
    }
    setCoupleLevel = (cl:number)=>{
        this.couple_level = cl;
    }
    isCoupled = ()=>{
        return this.couple_level == this.coupling_max;
    }
    getClass(){
        return "DefaultBranch";
    }
}