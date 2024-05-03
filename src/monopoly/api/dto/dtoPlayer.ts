import { dtoBranch } from "./dtoBranch";

export class dtoPlayer {
    constructor(
        public id: number,
        public nickname: string,
        public money: number,
        public location: number,
        public canMove: boolean,
        public alive: boolean,
        public capita:number,
        public inProperty: dtoBranch[],
    ){}
}