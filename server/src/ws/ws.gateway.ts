import {
  OnGatewayConnection,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from '@hocuspocus/server';
import WebSocket from 'ws';
import { IncomingMessage } from 'http';

@WebSocketGateway({ path: '/api/websocket' })
export class WsGateway implements OnGatewayConnection {
  server = Server.configure({});

  handleConnection(client: WebSocket, request: IncomingMessage) {
    console.log('client');
    // Todo : check if request can get session from real client
    // Todo : transfer all Hooks from JS to TS
    const document = request.headers.document
      ? (request.headers.document as string)
      : '';
    console.log(request);
    this.server.handleConnection(client, request, document);
  }
}
