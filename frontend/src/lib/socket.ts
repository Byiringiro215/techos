import { io, Socket } from 'socket.io-client';

const WS_URL = process.env.NEXT_PUBLIC_WS_URL || 'http://localhost:4000';

/** Realtime is opt-in — mock/frontend-only mode must not spam console errors. */
export const isRealtimeEnabled = () => process.env.NEXT_PUBLIC_ENABLE_WS === 'true';

class SocketClient {
  private socket: Socket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private gaveUpLogged = false;

  connect(userId?: string): Socket | null {
    if (!isRealtimeEnabled()) {
      return null;
    }

    if (this.socket?.connected) {
      return this.socket;
    }

    if (this.socket) {
      return this.socket;
    }

    this.socket = io(WS_URL, {
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: this.maxReconnectAttempts,
      query: userId ? { userId } : undefined,
    });

    this.setupEventListeners();
    return this.socket;
  }

  private setupEventListeners() {
    if (!this.socket) return;

    this.socket.on('connect', () => {
      this.reconnectAttempts = 0;
      this.gaveUpLogged = false;
    });

    this.socket.on('disconnect', () => {
      // no-op — callers use isConnected from context
    });

    this.socket.on('connect_error', () => {
      this.reconnectAttempts++;
      if (this.reconnectAttempts >= this.maxReconnectAttempts && !this.gaveUpLogged) {
        this.gaveUpLogged = true;
        console.warn(
          `[socket] Could not reach ${WS_URL}. Set NEXT_PUBLIC_ENABLE_WS=true when the server is running.`,
        );
      }
    });

    this.socket.on('reconnect', () => {
      this.reconnectAttempts = 0;
      this.gaveUpLogged = false;
    });
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  getSocket(): Socket | null {
    return this.socket;
  }

  emit(event: string, data?: any) {
    if (this.socket?.connected) {
      this.socket.emit(event, data);
    }
  }

  on(event: string, callback: (...args: any[]) => void) {
    this.socket?.on(event, callback);
  }

  off(event: string, callback?: (...args: any[]) => void) {
    this.socket?.off(event, callback);
  }

  // Channel methods
  joinChannel(channelId: string) {
    this.emit('joinChannel', { channelId });
  }

  leaveChannel(channelId: string) {
    this.emit('leaveChannel', { channelId });
  }

  // Typing indicators
  sendTyping(channelId: string, userId: string, userName: string) {
    this.emit('typing', { channelId, userId, userName });
  }

  stopTyping(channelId: string, userId: string) {
    this.emit('stopTyping', { channelId, userId });
  }
}

// Singleton instance
export const socketClient = new SocketClient();

export default socketClient;
