import { Socket } from 'socket.io';
import { WsAuthGuard } from './ws-auth.guard';

export type SocketIOMiddleware = {
  (client: Socket, next: (err?: Error) => void),
}

export const SocketJwtMiddleware = (): SocketIOMiddleware => {
  return (client, next) => {
    try {
      const payload = WsAuthGuard.validateToken(client);

      if (!payload || !payload.sub) {
        client.disconnect();
        return next(new Error('Invalid JWT payload.'));
      }

      client.data = { ...client.data, userId: payload.sub };

      next();
    } catch (error) {
      client.disconnect();
      next(error);
    }
  }
}
