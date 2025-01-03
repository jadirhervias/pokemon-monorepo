import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { JwtPayload, verify } from 'jsonwebtoken';
import { Socket } from 'socket.io';

@Injectable()
export class WsAuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    if (context.getType() !== 'ws') {
      return true;
    }

    const client: Socket = context.switchToWs().getClient<Socket>();
    const payload = WsAuthGuard.validateToken(client) as JwtPayload;

    if (!payload.sub) {
      return false;
    }

    client.data = { ...client.data, userId: payload.sub };

    return true;
  }

  static validateToken(client: Socket): JwtPayload {
    const authorization = client.handshake.auth?.token ?? client.handshake.headers?.authorization; // Bearer token
    const token = authorization?.split(' ')[1]; // Extract token

    if (!token) {
      throw new Error('Token not provided or invalid');
    }

    return verify(
      token,
      process.env.JWT_SECRET
    ) as JwtPayload;
  }
}
