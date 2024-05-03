import { IBranch, IOwnAble } from "./interface/BranchInterfaces";
import {RankFee} from "./interface/IBranch";
import { Player } from "./Player";
import { Event } from "./Event";
import { IAction } from "./Action";
import { DefaultBranch } from "./Branches/DefaultBranch";
import { OwnAbleBranch } from "./Branches/OwnAbleBranch";

export enum GameState {
    Start = "Start",
    inGame = "inGame",
    waitAnswer = "waitAnswer",
    bargaining = "bargaining",
    End = "End",
}
/* 
    Event List
    playerBought - player earns branch
    playerReachStart
    cubeThrowed
    
    удалить у всех филиалов владельца после смерти
*/

export class Game {
    private playerTurn:number = 0;

    private bargaining: Player[] = []; 
    private bargaining_accepted: Player[] = [];
    private bargaining_count = 0;
    private bargaining_branch: OwnAbleBranch;
    private bargaining_turn: number = 0;

    private current_cube = [];

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
        this.event.on('duplicate',(player_id)=>this.onDuplicate(player_id));

        //Debug
        this.event.on('changedCoupling',(coupling:number)=>{
            console.debug(coupling ? "Become coupled" : "Become uncoupled");
        });
        //Init
        setTimeout(()=>this.initGame(),0);
    }
    getTurn(){
        if(this.gameState == GameState.bargaining) return this.bargaining_turn;
        else return this.playerTurn;
    }
    getCurrentCube(){
        return this.current_cube;
    }
    getAction(){
        return this.actionInOrder;
    }
    getGameState(){
        return this.gameState;
    }
    initGame(){
        console.log("Game began !");
        this.bargainingReset();
        this.gameState = GameState.inGame;
        console.log("Next turn " + this.getPlayer(this.playerTurn)?.nickname);
    }

    onDuplicate(player_id:number){
        console.log("Player " + this.getPlayer(player_id).nickname + " get duplicate");
    }

    createTemplateAction(branch:OwnAbleBranch):IAction
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

    getPlayer(id:number):Player{
        return this.players.find(player=>player.id == id);
    }

    getPlayerBargaining(id:number):Player{
        return this.bargaining.find(player=>player.id == id);
    }
    
    getBranch(id:number):IBranch{
        return this.branches.find(branch=>branch.id == id); 
    }

    bargainingReset()
    {
        this.bargaining = [];
        this.bargaining_branch = null;
        this.bargaining_count = 0;
        this.bargaining_turn = 0;
    }

    onBargainingFinish(data:number)
    {
        console.log("bargaining finish")
        if(this.bargaining_accepted.length == 1){
            const player = this.bargaining[0];
            if(player.money >= this.bargaining_branch.getCurrentFee().cost + this.bargaining_count*100){
                player.money -= this.bargaining_branch.getCurrentFee().cost + this.bargaining_count*100;
                this.bargaining_branch.setOwner(player);
                player.branch_manager.add(this.bargaining_branch);
                Event.getInstance().invoke('playerBought',[player.id,this.bargaining_branch.id]);
            }
        }
        this.bargainingReset();
        this.changeGameState(GameState.inGame);
        console.log("Next step bargaining "+this.playerTurn);
    }

    onPlayerAgreeBargaining(id: number){
        const player = this.getPlayer(id);
        console.log(`Player agreed ${player.nickname}`);
        this.actionInOrder = this.createTemplateAction(this.bargaining_branch);
        this.bargaining_accepted.push(player);
        this.bargainingTurn();
        this.actionInOrder.player = this.getPlayerBargaining(this.bargaining_turn);
        console.log("Next step bargaining "+this.bargaining_turn);
    }

    onPlayerDeclineBargaining(id: number)
    {  
        const player = this.getPlayer(id);
        console.log(`Player decline ${player.nickname}`);
        this.bargaining.splice(this.bargaining.indexOf(player),1);
        this.bargaining_accepted.splice(this.bargaining_accepted.indexOf(player),1);
        this.bargainingTurn();
        console.log("Next step bargaining "+this.bargaining_turn);
    }

    onBeginBargaining(branch_id:number)
    {
        if(this.gameState == GameState.End) return;
        console.log("Begin bargaining");
        if(this.gameState == GameState.inGame ||
            this.gameState == GameState.waitAnswer
        )
        {
            //BeginBargaining
            this.changeGameState(GameState.bargaining);
            this.bargaining_branch = (this.getBranch(branch_id) as OwnAbleBranch);
            this.players.forEach(
                (player)=>this.bargaining.push(player)
            )
            //this.bargaining.forEach((player)=>console.log(player));
            console.log("Next step bargaining "+this.bargaining_turn);
            this.actionInOrder = this.createTemplateAction(this.bargaining_branch);
            this.actionInOrder.player = this.getPlayerBargaining(this.bargaining_turn);
        }

    }

    onPlayerKill(player_id:number)
    {
        const player = this.getPlayer(player_id);
        this.getOwnAbleBranches().forEach((branch:OwnAbleBranch)=>branch.free());
        //this.players.splice(this.players.indexOf(player),1);
        console.log(player.nickname + " dead!");
        this.checkWin();
    }

    onCubeThrowed(first_cube:number,second_cube:number)
    {
        console.log(`First cube: ${first_cube} Second cube: ${second_cube} Cube total: ${first_cube+second_cube}`);
    }

    onPlayerBought(player_id:number,branch_id:number)
    {
        const player = this.getPlayer(player_id);
        const branch = this.getBranch(branch_id);

        console.log(`Player ${player.nickname} bought ${branch.name} with id ${branch.id}`);
        //console.log(player);
    }

    onPlayerPayedFee(player_id:number,branch_id:number)
    {
        const player = this.getPlayer(player_id);
        const branch = (this.getBranch(branch_id) as OwnAbleBranch);

        console.log(`Player ${player.nickname} payed ${branch.owner?.nickname} rent ${branch.getCurrentFee().fee} for ${branch.name}`);
        //console.log(player);
        //console.log(branch.owner);
    }

    onPlayerReachStart(player_id:number)
    {
        const player = this.getPlayer(player_id);
        //player.money += 2000;
        //console.log(player.money);
    }

    onPlayerAnswer(player_id:number,answer:boolean): IAction
    {
        if((this.gameState == GameState.waitAnswer || 
            this.gameState == GameState.bargaining)
        ){
            if(this.actionInOrder != undefined){
                console.log(this.actionInOrder?.description + " " + this.actionInOrder?.player.location);
                if(player_id == this.actionInOrder.player.id){
                    const player = this.getPlayer(player_id);
                    //GameSate changed here
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
                    if(this.current_cube[0] != this.current_cube[1]) this.turn();
                    if(this.gameState == GameState.waitAnswer){
                        this.changeGameState(GameState.inGame);
                        this.actionInOrder = null;
                    }
                }
            }
            else{
                console.log("BLYAT");
                if(this.current_cube[0] != this.current_cube[1]) this.turn();
            }
            return this.actionInOrder;
        }
    }

    changeGameState(new_state: GameState){
        if(this.gameState != GameState.End)
            this.gameState = new_state;
        else
            console.trace();
    }

    throwCube():[number,number,number]{
        if(this.gameState == GameState.inGame)
        {
            let a = Math.floor(Math.random()*7)+1;
            let b = Math.floor(Math.random()*7)+1;

            Event.getInstance().invoke('cubeThrowed',[a,b]);
            return [a,b,a+b];
        }
        return [0,0,0];
    }

    bargainingTurn(){
        if(this.bargaining.length <= 1){ this.event.invoke('bargainingFinish',0);return}
        /*if(this.bargaining_turn+1 == this.bargaining.length){
            this.bargaining_accepted = [];
        }*/
        this.bargaining_turn = (this.bargaining_turn+1) % this.bargaining.length; 
    }

    turn(){
        do{
            this.playerTurn = this.players[(this.playerTurn+1) % this.players.length].id; 
        }
        while(!this.getPlayer(this.playerTurn).alive);
        console.log("Next turn " + this.getPlayer(this.playerTurn)?.nickname);
    }

    movePlayer(player_id:number,step: number | null):IAction | null{
        if(this.playerTurn == player_id &&
            this.gameState == GameState.inGame
        ){
            const player = this.getPlayer(player_id); 
            const cube = this.throwCube();
            this.current_cube = cube;

            let cubePoints;
            if(step == null )
                cubePoints = cube[2];
            else
                cubePoints = step;

            if(player != null){
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
                    else{
                        this.turn();
                    }

                    if(cube[0] == cube[1]){
                        this.event.invoke("duplicate",(player.id));
                    }

                    return this.actionInOrder;
                }
                else{
                    this.turn();
                }
            }
            else{
                console.log(player.nickname + " Does not exist");
            }
        }
        return null;
    }
    checkWin(){
        if(this.players.filter(player=>player.alive).length == 1){
            this.changeGameState(GameState.End);
            console.log(this.players.find(player=>player.alive).nickname + " Wins !");
            this.event.invoke('win',this.players[0].id);
        }
    }
    getPlayerTurn(){
        return this.playerTurn;
    }
    getOwnAbleBranches(){
        return this.branches.filter(branch=>branch instanceof OwnAbleBranch);
    }
    getBranches(){
        return this.branches;
    }
    getPlayers(){
        return this.players;
    }
    addPlayer(player:Player){
        this.players.push(player);  
    }
}