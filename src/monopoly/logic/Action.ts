import { Player } from "./Player"

export interface IAction {
    name: string,
    description: string,
    player: Player,
    buttons: [string,(player:Player)=>void][]
}

export class Action implements IAction{
    constructor(
        public name: string,
        public description: string,
        public player: Player,
        public buttons : [string, (player:Player)=>void][],
    ){}
}