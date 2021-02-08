import { RoomsService } from '../rooms/rooms.service';
import { WsAuthGuard } from '../auth/guards/ws.guard';
import { WsRolesGuard } from '../auth/guards/ws.roles.guard';
import { Role } from '../auth/roles/roles.enum';
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
import { Roles } from '../auth/roles/roles.decorator';

interface IMessage {
  text: string;
  type: Role.ADMIN | Role.USER;
  date: Date;
  roomId: string;
}
@WebSocketGateway({ namespace: 'rooms', translators: ['websocket'] })
export class RoomsGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  private logger = new Logger('RoomsGateway');

  constructor(private readonly roomsService: RoomsService) {}
  @WebSocketServer() wss: Server;

  afterInit(server: Server) {
    this.logger.debug('after init');
  }

  handleConnection(client: Socket, ...args: any[]) {
    this.logger.debug('handleConnection: ' + client.id);
  }
  handleDisconnect(client: Socket) {
    this.logger.debug('handleDisconnect: ' + client.id);
  }

  @UseGuards(WsAuthGuard)
  @SubscribeMessage('join-room')
  async joiningRoom(
    @MessageBody() data: Partial<IMessage>,
    @ConnectedSocket() client: Socket,
  ) {
    try {
      const room = await this.roomsService.findById(data.roomId);
      this.wss.to(room._id).emit('member-joined-room');
    } catch (error) {
      client.emit('error', { error: error.message });
    }
  }

  @Roles(Role.ADMIN)
  @UseGuards(WsRolesGuard)
  @SubscribeMessage('admin-messages')
  handleMessage(@MessageBody() data: IMessage) {
    this.wss.emit('recieve-admin-messages', {
      text: data.text,
      type: 'admin',
      date: new Date(),
    } as IMessage);
  }
}
