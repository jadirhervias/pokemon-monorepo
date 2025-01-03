import { WebSocketGateway as WsGateway, WebSocketServer } from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { SocketJwtMiddleware } from '../common/authorization/socket-jwt.middleware';

// @UseGuards(WsAuthGuard)
@WsGateway({
  cors: {
    origin: '*',
  },
  namespace: '/ws/io',
})
export class WebSocketGateway {
  private static userSockets: Record<string, string> = {};

  @WebSocketServer()
  server: Server;

  // Why the middleware approach to authenticate WebSocket connections?
  // See:
  // - https://docs.nestjs.com/guards#binding-guards
  // - https://github.com/nestjs/nest/issues/882
  afterInit(client: Server) {
    console.log('WebSocket server initialized');
    client.use(SocketJwtMiddleware());
  }

  handleConnection(client: Socket) {
    const userId = client.data?.userId;

    if (!userId) {
      console.error(`User ID missing in connection for socket ID ${client.id}`);
      client.disconnect();
      return;
    }

    WebSocketGateway.registerUserSocket(userId, client.id);

    console.log(`Client <${client.id}> connected for user with ID <${userId}>`);
  }

  handleDisconnect(client: Socket) {
    let userId = client.data?.userId;

    if (userId) {
      WebSocketGateway.removeUserSocket(userId);
      console.log(`Disconnected user ${userId} with socket ID ${client.id}`);
    } else {
      console.warn(`UserId not found for socket ${client.id}. Possible authentication failure.`);

      const socketId = client.id;
      for (const key in WebSocketGateway.userSockets) {
        if (WebSocketGateway.userSockets[key] === socketId) {
          userId = key;
          WebSocketGateway.removeUserSocket(key);
          console.log(`Removed user with socket ID ${socketId} due to failed authentication`);
        }
      }
    }

    console.log(`Client <${client.id}> disconnected for user with ID <${userId}>`);
  }

  emitEvent(eventName: string, data: Record<string, unknown>, config: {
    message: string;
    userIds?: string | string[];
  }) {
    if (config.userIds) {
      if (Array.isArray(config.userIds)) {
        config.userIds = config.userIds.filter(userId => WebSocketGateway.userSockets[userId]);
      } else {
        config.userIds = WebSocketGateway.userSockets[config.userIds] ? [config.userIds] : [];
      }

      const socketIds = config.userIds.map(userId => WebSocketGateway.userSockets[userId]);
      this.server.to(socketIds).emit(eventName, data, config.message);

      return;
    }

    this.server.emit(eventName, data, config.message);
  }

  static registerUserSocket(userId: string, socketId: string) {
    WebSocketGateway.userSockets[userId] = socketId;
  }

  static getUserSocket(userId: string) {
    return WebSocketGateway.userSockets[userId];
  }

  static removeUserSocket(userId: string) {
    delete WebSocketGateway.userSockets[userId];
  }
}