import { WsRolesGuard } from '../auth/guards/ws.roles.guard';
import { Role } from '../auth/roles/roles.enum';
import { Logger, UseGuards } from '@nestjs/common';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Roles } from '../auth/roles/roles.decorator';

@WebSocketGateway({ namespace: 'rooms' })
export class RoomsGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  private logger = new Logger('RoomsGateway');

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

  @Roles(Role.ADMIN)
  @UseGuards(WsRolesGuard)
  @SubscribeMessage('msgToServer')
  handleMessage(client: Socket, { text }: { text: string }) {
    this.wss.emit('msgToClient', { text });
  }
}
