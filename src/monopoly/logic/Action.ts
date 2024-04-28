import { IPlayer } from "./IPlayer"

export interface IAction {
    name: string,
    description: string,
    player: IPlayer,
    buttons: [string,(player:IPlayer)=>void][]
}

export class Action implements IAction{
    constructor(
        public name: string,
        public description: string,
        public player: IPlayer,
        public buttons : [string, (player:IPlayer)=>void][],
    ){}
}