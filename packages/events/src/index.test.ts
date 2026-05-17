import { expect, test, describe, beforeAll, afterAll } from 'bun:test';
import Fastify, { type FastifyInstance } from 'fastify';
import { io, type Socket } from 'socket.io-client';
import { mountSocketIO } from './mountSocketIO';
import { XEvents } from './XEvents';

describe('@xacos/events', () => {
  let fastify: FastifyInstance;
  let clientSocket: Socket;
  let port: number;

  beforeAll(async () => {
    fastify = Fastify();
    await mountSocketIO(fastify, { path: '/test-ws' });
    await fastify.listen({ port: 0, host: '127.0.0.1' });
    port = (fastify.server.address() as any).port;

    clientSocket = io(`http://127.0.0.1:${port}`, {
      path: '/test-ws',
      autoConnect: true,
      transports: ['websocket', 'polling'],
    });

    await new Promise<void>((resolve, reject) => {
      clientSocket.on('connect', () => resolve());
      clientSocket.on('connect_error', (err) => reject(err));
    });
  });

  afterAll(async () => {
    clientSocket?.disconnect?.();
    await fastify.close();
  });

  test('should get singleton instance', () => {
    const events = XEvents.get();
    expect(events).toBeDefined();
    expect(events).toBeInstanceOf(XEvents);
  });

  test('should broadcast event to client', async () => {
    const events = XEvents.get();
    const promise = new Promise((resolve) => {
      clientSocket.on('test.event', (data) => {
        resolve(data);
      });
    });

    events.emit('test.event', { message: 'hello' });

    const result = await promise;
    expect(result).toEqual({ message: 'hello' });
  });

  test('should emit to specific room', () => {
    const events = XEvents.get();
    const roomRef = events.to('admin');
    expect(roomRef).toBeDefined();
    expect(typeof roomRef.emit).toBe('function');
  });
});

