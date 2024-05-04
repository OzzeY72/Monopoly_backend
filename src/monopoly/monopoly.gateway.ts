import { MonopolyService } from './monopoly.service';
import {SubscribeMessage, MessageBody, WebSocketGateway,WebSocketServer,OnGatewayConnection} from '@nestjs/websockets';
import { PlayerToDTO } from './api/mappers/monopoly.mappers';
import { Server,Socket } from 'socket.io';

@WebSocketGateway(80, { namespace: 'events' })
export class MonopolyGateway implements OnGatewayConnection{
    constructor(
        private readonly monopolyService: MonopolyService,
    ) {
        this.subscribeEvents();
    }
    @WebSocketServer()
        server: Server;

    subscribeEvents(){
        const event = this.monopolyService.game.event;
        event.on('cubeThrowed',(data)=>this.onCubeThrowed(data[0],data[1]));
        event.on('playerBought',(...args)=>this.updateGameState(this.server));
        event.on('playerKilled',(...args)=>this.updateGameState(this.server));
        event.on('playerAgreeBargaining',(...args)=>this.updateGameState(this.server));
        event.on('bargainingFinish',(...args)=>this.updateGameState(this.server));
    }
    updateGameState(socket){
        socket.emit('updateGame',this.monopolyService.getGameInDto());
    }

    handleConnection(client: Socket, ...args: any[]) {
        console.log(`Client connected: ${client.id}`);
        this.updateGameState(client);
    }

    onCubeThrowed(cube1:number,cube2:number){
        this.server.emit('cubeThrowed',{cube1:cube1,cube2:cube2});
    }
    

    onPlayerConnected(player:any){
        this.server.emit('playerConnected',player);
    }

    @SubscribeMessage('createPlayer')
    handleEvent(@MessageBody() nickname:string): void {
        const player = this.monopolyService.addPlayer(nickname);
        console.log(`Player ${player.nickname} created with id ${player.id}`);
        this.onPlayerConnected(PlayerToDTO(player));
    }
    @SubscribeMessage('move')
    handleMove(@MessageBody() id:number): void {
        this.monopolyService.playerMove(id,null);
        this.server.emit('move',
            this.monopolyService.getPlayersInDto().find(player=>player.id == id)
        );
    }
}