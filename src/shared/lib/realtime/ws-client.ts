import { io, type Socket } from 'socket.io-client';

export function createWsClient(url?: string): Socket {
  return io(url ?? '', {
    autoConnect: false,
  });
}
