import { dtoAction } from "./dtoAction";
import { dtoBranch } from "./dtoBranch";
import { dtoPlayer } from "./dtoPlayer";

export class dtoGame{
    constructor(
        public turn: number,
        public current_cube: number[],
        public action: dtoAction,
        public players : dtoPlayer[],
        public branches : dtoBranch[],
        public game_state: string,
    ){}

}