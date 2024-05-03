import { Player } from "src/monopoly/logic/Player";
import { RankFee } from "src/monopoly/logic/interface/IBranch";

export class dtoBranch{
    constructor(
        public class_type:string,
        public id: number,
        public name: string,
        public icon: string,
        public description:string,
        public type: string,
        public owner: Player | null,
        public inPledge: boolean,
        public inPledgeDaysLeft: number,
        public current_rankfee: RankFee,
        public star_count: number = 0,
    ){}

}