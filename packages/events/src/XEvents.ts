import type { Server as SocketIOServer } from 'socket.io';

export class XEvents {
  static _instance: XEvents | null = null;

  constructor(public readonly io: SocketIOServer) {}

  /**
   * Broadcast an event to all connected clients.
   *
   * @example
   * events.emit('user.created', { id: 1, name: 'John' });
   */
  emit<T = unknown>(event: string, data?: T): void {
    this.io.emit(event, data);
  }

  /**
   * Emit to a specific room/channel.
   *
   * @example
   * events.to('admin').emit('alert', { message: 'New user registered' });
   */
  to(room: string): { emit: <T = unknown>(event: string, data?: T) => void } {
    const roomRef = this.io.to(room);
    return {
      emit: <T = unknown>(event: string, data?: T) => roomRef.emit(event, data),
    };
  }

  /**
   * Get the singleton XEvents instance.
   * Only available after mountSocketIO() has been called.
   */
  static get(): XEvents {
    if (!XEvents._instance) {
      throw new Error('[XAOCS Events] mountSocketIO() has not been called yet.');
    }
    return XEvents._instance;
  }

  /**
   * Reset the singleton instance (useful for testing cleanup).
   */
  static _reset(): void {
    XEvents._instance = null;
  }
}

