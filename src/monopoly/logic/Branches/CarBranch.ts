import { OwnAbleBranch } from "./OwnAbleBranch";
import {RankFee} from "../interface/IBranch"
import { IAction } from "../Action";
import { ICoupleAble } from "../interface/ICoupleAble";

export class CarBranch extends OwnAbleBranch implements ICoupleAble{
    readonly coupling_max: number = 4;
    couple_level: number = 0;

    constructor(
        id: number,
        name: string,
        icon: string,
        description:string,
        type: string,
        actions: IAction[],
        public coupled_level: number,
        rankfee: RankFee[],
    ){
        super(id,name,icon,description,type,rankfee);
    }

    getCurrentFee = () => {
        return this.rankfee[this.coupled_level-1];
    }
    setCoupleLevel = (cl:number)=>{
        this.couple_level = cl;
    }
    free = () => {
        super.free();
        this.couple_level = 0;
    }
    getClass(){
        return "CarBranch";
    }
}