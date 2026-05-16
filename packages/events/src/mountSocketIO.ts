import { Server as SocketIOServer } from 'socket.io';
import type { FastifyInstance } from 'fastify';
import { XEvents } from './XEvents';

export interface SocketIOOptions {
  cors?: {
    origin?: string | string[] | boolean;
    credentials?: boolean;
    methods?: string[];
  };
  path?: string;
}

/**
 * Mount Socket.IO on the Fastify server.
 * Call this during server boot, before `server.listen()`.
 *
 * @example
 * await mountSocketIO(server.fastify, {
 *   cors: { origin: 'http://localhost:3000', credentials: true }
 * });
 */
export async function mountSocketIO(
  fastify: FastifyInstance,
  options: SocketIOOptions = {}
): Promise<XEvents> {
  const io = new SocketIOServer(fastify.server, {
    cors: options.cors as any,
    path: options.path ?? '/xacos-ws',
  });

  const events = new XEvents(io);
  XEvents._instance = events;

  io.on('connection', (socket) => {
    const isDev = process.env['APP_ENV'] !== 'production';
    if (isDev) {
      console.log(`[XAOCS Events] Client connected: ${socket.id}`);
    }

    socket.on('disconnect', () => {
      if (isDev) {
        console.log(`[XAOCS Events] Client disconnected: ${socket.id}`);
      }
    });
  });

  fastify.addHook('onClose', async () => {
    io.close();
    XEvents._reset();
  });

  return events;
}

