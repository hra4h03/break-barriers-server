import { RoomsService } from './../rooms.service';
import { WsAuthGuard } from './../../auth/guards/ws.guard';
import { WsRolesGuard } from '../../auth/guards/ws.roles.guard';
import { Role } from '../../auth/roles/roles.enum';
import { Logger, UseGuards } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Roles } from '../../auth/roles/roles.decorator';

interface IMessage {
  text: string,
  type: Role.ADMIN | Role.USER,
  date: Date,
  roomId: string
}
@WebSocketGateway({ namespace: 'rooms' })
export class RoomsGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  private logger = new Logger('RoomsGateway');

  constructor(
    private readonly roomsService: RoomsService
  ) {}
  @WebSocketServer() wss: Server;

  afterInit(server: Server) {
    this.logger.log('after init');
  }

  handleConnection(client: Socket, ...args: any[]) {
    this.logger.log('handleConnection: ' + client.id);
  }
  handleDisconnect(client: Socket) {
    this.logger.log('handleDisconnect: ' + client.id);
  }

  @UseGuards(WsAuthGuard)
  @SubscribeMessage('join-room')
  async joiningRoom(@MessageBody() data: Partial<IMessage>, @ConnectedSocket() client: Socket) {
    try {
      await this.roomsService.findById(data.roomId)      
    } catch (error) {
      client.emit('error')
    }
    this.wss.to(data.roomId)

  }

  @Roles(Role.ADMIN)
  @UseGuards(WsRolesGuard)
  @SubscribeMessage('admin-messages')
  handleMessage(@MessageBody() data: IMessage) {
    this.wss.emit('recieve-admin-messages', { text: data.text, type: 'admin', date: new Date() } as IMessage);
  }
}
