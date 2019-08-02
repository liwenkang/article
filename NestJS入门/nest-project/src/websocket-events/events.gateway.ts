import { SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Client, Server } from 'socket.io';

@WebSocketGateway()
export class EventsGateway {
  @WebSocketServer()
  server: Server;

  @SubscribeMessage('NetworkConfMessage')
  handleEvent(client: Client, data: any): any {
    // 收到什么,就发送什么
    return data;
  }
}
