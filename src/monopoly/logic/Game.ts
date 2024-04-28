import { IBranch, IRankFee } from "./IBranch";
import { Player } from "./Player";
import { Event } from "./Event";
import { IPlayer } from "./IPlayer";
import { IAction } from "./Action";

export enum GameState {
    Start,
    inGame,
    waitAnswer,
    bargaining,
    End,
}

export class Game {
    private playerTurn:number = 0;

    private bargaining: IPlayer[] = [];
    private bargaining_accepted: IPlayer[] = [];
    private bargaining_count = 0;
    private bargaining_branch: IBranch;
    private bargaining_turn: number = 0;

    private actionInOrder: IAction | null;
    public event: Event | null;

    constructor(
        private players:Player[] | null,
        private branches:IBranch[] | null,
        private gameState: GameState,
    ){
        this.event = Event.getInstance();
        this.event.on('playerReachStart',(player_id:number)=>this.onPlayerReachStart(player_id));
        this.event.on('cubeThrowed',(data)=>this.onCubeThrowed(data[0],data[1]));
        //this.event.on('playerAnswer',(data:[number,boolean])=>this.onPlayerAnswer(data[0],data[1]));
        this.event.on('playerBought',(data:[number,number])=>this.onPlayerBought(data[0],data[1]));
        this.event.on('playerPayedFee',(data:[number,number])=>this.onPlayerPayedFee(data[0],data[1]));
        this.event.on('playerKilled',(player_id:number)=>this.onPlayerKill(player_id));
        this.event.on('beginBargaining',(branch_id:number)=>this.onBeginBargaining(branch_id));
        this.event.on('playerAgreeBargaining',(player_id:number)=>this.onPlayerAgreeBargaining(player_id));
        this.event.on('playerDeclineBargaining',(player_id:number)=>this.onPlayerDeclineBargaining(player_id));
        this.event.on('bargainingFinish',(player_id:number)=>this.onBargainingFinish(player_id));
    }

    createTemplateAction(branch:IBranch):IAction
    {
        return ({
            name: "ACTION_BUY_NAME",
            description: `ACTION_BUY_DESCRIPTION ${branch.name} ?`, 
            player: null,
            buttons:[
                [`ACTION_BUY_BUTTON ${branch.getCurrentFee().cost + this.bargaining_count*100}`,
                (player)=>{
                    if(player.money >= branch.getCurrentFee().cost + this.bargaining_count*100){
                        Event.getInstance().invoke('playerAgreeBargaining',player.id);
                        this.bargaining_count++;
                    }
                    else{
                        Event.getInstance().invoke('playerDeclineBargaining',player.id);
                    }
                }],
                [`ACTION_DECLINE_BUTTON`,
                (player)=>{
                    Event.getInstance().invoke('playerDeclineBargaining',player.id);
                }],
            ]
        });
    }

    getPlayer(id:number):IPlayer{
        if(id < this.players.length)
            return this.players[id];
        else
            return null;
    }

    getPlayerBargaining(id:number):IPlayer{
        if(id < this.bargaining.length)
            return this.bargaining[id];
        else
            return null;
    }
    
    getBranch(id:number):IBranch{
        if(id < this.branches.length)
            return this.branches[id];
        else
            return null;
    }

    onBargainingFinish(data:number)
    {
        console.log("bargaining finish")
        if(this.bargaining_accepted.length == 1){
            const player = this.bargaining[0];
            if(player.money >= this.bargaining_branch.getCurrentFee().cost + this.bargaining_count*100){
                player.money -= this.bargaining_branch.getCurrentFee().cost + this.bargaining_count*100;
                this.bargaining_branch.owner = player;
                player.branches.push(this.bargaining_branch);
                Event.getInstance().invoke('playerBought',[player.id,this.bargaining_branch.id]);
            }
        }
        this.bargaining = [];
        this.bargaining_branch = null;
        this.bargaining_count = 0;
        this.bargaining_turn = 0;
        this.changeGameState(GameState.inGame);
        console.log("next step "+this.playerTurn);
    }

    onPlayerAgreeBargaining(id: number){
        console.log("Player agreed");
        this.actionInOrder = this.createTemplateAction(this.bargaining_branch);
        this.bargaining_accepted.push(this.getPlayer(id));
        this.bargainingTurn();
        this.actionInOrder.player = this.getPlayerBargaining(this.bargaining_turn);
        console.log("next turn " + this.bargaining_turn);
    }

    onPlayerDeclineBargaining(id: number)
    {
        console.log("Player decline");
        this.bargaining.splice(this.bargaining.indexOf(this.getPlayer(id)),1);
        this.bargaining_accepted.splice(this.bargaining_accepted.indexOf(this.getPlayer(id)),1);
        this.bargainingTurn();
        console.log("next turn " + this.bargaining_turn);
    }

    onBeginBargaining(branch_id:number)
    {
        console.log("Begin bargaining");
        if(this.gameState == GameState.inGame ||
            this.gameState == GameState.waitAnswer
        )
        {
            //BeginBargaining
            this.changeGameState(GameState.bargaining);
            this.bargaining_branch = this.getBranch(branch_id);
            this.players.forEach(
                (player)=>this.bargaining.push(player)
            )
            this.bargaining.forEach((player)=>console.log(player));
            console.log(this.bargaining_turn);
            this.actionInOrder = this.createTemplateAction(this.bargaining_branch);
            this.actionInOrder.player = this.getPlayerBargaining(this.bargaining_turn);
        }

    }

    onPlayerKill(player_id:number)
    {
        const player = this.getPlayer(player_id);
        console.log(player.nickname + " dead!");
    }

    onCubeThrowed(first_cube:number,second_cube:number)
    {
        console.log(`First cube: ${first_cube}`);
        console.log(`Second cube: ${second_cube}`);
        console.log(`Cube total: ${first_cube+second_cube}`);
    }

    onPlayerBought(player_id:number,branch_id:number)
    {
        const player = this.getPlayer(player_id);
        const branch = this.getBranch(branch_id);

        console.log(`Player ${player.nickname} bought ${branch.name} with id ${branch.id}`);
        console.log(player);
    }

    onPlayerPayedFee(player_id:number,branch_id:number)
    {
        const player = this.getPlayer(player_id);
        const branch = this.getBranch(branch_id);

        console.log(`Player ${player.nickname} payed ${branch.owner.nickname} rent ${branch.rankfee[branch.star_count].fee}`);
        console.log(player);
        console.log(branch.owner);
    }

    onPlayerReachStart(player_id:number)
    {
        const player = this.getPlayer(player_id);
        player.money += 2000;
        console.log(player.money);
    }

    onPlayerAnswer(player_id:number,answer:boolean): IAction
    {
        if(this.gameState == GameState.waitAnswer || 
            this.gameState == GameState.bargaining  &&
            this.actionInOrder != null
        ){
            if(player_id == this.actionInOrder.player.id){
                const player = this.getPlayer(player_id);
                if(answer){
                    this.actionInOrder.buttons[0][1](player);
                }
                else{
                    if(this.actionInOrder.buttons.length > 1){
                        this.actionInOrder.buttons[1][1](player);
                    }
                    else{
                        this.actionInOrder.buttons[0][1](player);
                    }
                }
                if(this.gameState != GameState.bargaining){
                    this.changeGameState(GameState.inGame);
                    this.actionInOrder = null;
                }
            }
            return this.actionInOrder;
        }
    }

    changeGameState(new_state: GameState){
        this.gameState = new_state;
    }

    throwCube():number{
        if(this.gameState == GameState.inGame)
        {
            let a = Math.floor(Math.random()*7)+1;
            let b = Math.floor(Math.random()*7)+1;

            Event.getInstance().invoke('cubeThrowed',[a,b]);
            return a+b;
        }
        return 0;
    }

    bargainingTurn(){
        if(this.bargaining.length <= 1){ this.event.invoke('bargainingFinish',0);return}
        /*if(this.bargaining_turn+1 == this.bargaining.length){
            this.bargaining_accepted = [];
        }*/
        this.bargaining_turn = (this.bargaining_turn+1) % this.bargaining.length; 
    }

    turn(){
        this.playerTurn = (this.playerTurn+1) % this.players.length; 
    }

    movePlayer(player_id:number,step: number | null):IAction | null{
        if(this.playerTurn == player_id &&
            this.gameState == GameState.inGame
        ){
            const player = this.getPlayer(player_id); 

            let cubePoints;
            if(step == null )
                cubePoints = this.throwCube();
            else
                cubePoints = step;

            if(player.isAbleToMove()){
                if(player.location + cubePoints >= this.branches.length){
                    Event.getInstance().invoke('playerReachStart',player.id);
                }
                player.location = (player.location + cubePoints) % this.branches.length;

                if(this.branches[player.location]?.getAction(player) != null){
                    this.changeGameState(GameState.waitAnswer);
                    this.actionInOrder = this.branches[player.location]?.getAction(player);
                    this.actionInOrder.player = player;
                }
                this.turn();
                return this.actionInOrder;
            }
        }
        return null;
    }
}