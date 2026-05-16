import { useEffect, useRef } from 'react';
import { io, type Socket } from 'socket.io-client';

let _socket: Socket | null = null;

export function getSocket(): Socket {
  if (!_socket) {
    const origin = typeof window !== 'undefined' ? window.location.origin : 'http://localhost';
    _socket = io(origin, {
      path: '/xacos-ws',
      autoConnect: true,
      reconnectionAttempts: 5,
    });
  }
  return _socket;
}

/**
 * Subscribe to a server-side XAOCS event.
 *
 * @example
 * useEvent('post.created', (post) => {
 *   setPosts(prev => [post, ...prev]);
 * });
 */
export function useEvent<T = unknown>(
  event: string,
  callback: (data: T) => void
): void {
  const callbackRef = useRef(callback);
  callbackRef.current = callback;

  useEffect(() => {
    const socket = getSocket();

    const handler = (data: T) => callbackRef.current(data);
    socket.on(event, handler);

    return () => {
      socket.off(event, handler);
    };
  }, [event]);
}

/**
 * Disconnect the WebSocket client manually.
 * Useful on logout.
 */
export function disconnectSocket(): void {
  if (_socket) {
    _socket.disconnect();
    _socket = null;
  }
}

