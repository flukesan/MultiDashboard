import { WebSocketDataSourceConfig, DataTransformer } from '@/types';
import { BaseDataSourceAdapter } from './base-adapter';

/**
 * WebSocket Data Source Adapter
 * Handles real-time data streaming
 */
export class WebSocketDataSourceAdapter extends BaseDataSourceAdapter<WebSocketDataSourceConfig> {
  private socket?: WebSocket;
  private messageQueue: unknown[] = [];
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectTimer?: ReturnType<typeof setTimeout>;

  constructor(config: WebSocketDataSourceConfig, transformer?: DataTransformer) {
    super(config, transformer);
    this.validateConfig();
  }

  /**
   * Connect to WebSocket and return latest data
   */
  async fetch(): Promise<unknown> {
    return new Promise((resolve, reject) => {
      try {
        this.connect();

        // Return first message or timeout
        const timeout = setTimeout(() => {
          reject(new Error('WebSocket connection timeout'));
        }, 10000);

        const originalOnMessage = this.socket?.onmessage;
        if (this.socket) {
          this.socket.onmessage = (event) => {
            clearTimeout(timeout);
            originalOnMessage?.call(this.socket!, event);

            try {
              const data = JSON.parse(event.data);
              const transformed = this.transform(data);
              resolve(transformed);
            } catch (error) {
              reject(this.handleError(error));
            }
          };
        }
      } catch (error) {
        reject(this.handleError(error));
      }
    });
  }

  /**
   * Connect to WebSocket
   */
  private connect(): void {
    if (this.socket?.readyState === WebSocket.OPEN) {
      return;
    }

    try {
      this.socket = new WebSocket(this.config.url, this.config.protocols);

      this.socket.onopen = () => {
        console.log('WebSocket connected:', this.config.url);
        this.reconnectAttempts = 0;
      };

      this.socket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          const transformed = this.transform(data);
          this.messageQueue.push(transformed);

          // Keep only last 10 messages
          if (this.messageQueue.length > 10) {
            this.messageQueue.shift();
          }
        } catch (error) {
          console.error('WebSocket message parsing error:', error);
        }
      };

      this.socket.onerror = (error) => {
        console.error('WebSocket error:', error);
      };

      this.socket.onclose = () => {
        console.log('WebSocket disconnected');
        this.handleReconnect();
      };
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Handle reconnection logic
   */
  private handleReconnect(): void {
    if (!this.config.reconnect || this.reconnectAttempts >= this.maxReconnectAttempts) {
      return;
    }

    this.reconnectAttempts++;
    const delay = this.config.reconnectInterval || 3000;

    console.log(`Reconnecting in ${delay}ms (attempt ${this.reconnectAttempts})`);

    this.reconnectTimer = setTimeout(() => {
      this.connect();
    }, delay);
  }

  /**
   * Get latest message from queue
   */
  getLatestMessage(): unknown {
    return this.messageQueue[this.messageQueue.length - 1];
  }

  /**
   * Send message through WebSocket
   */
  send(data: unknown): void {
    if (this.socket?.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify(data));
    } else {
      throw new Error('WebSocket is not connected');
    }
  }

  /**
   * Cleanup WebSocket connection
   */
  cleanup(): void {
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
    }

    if (this.socket) {
      this.socket.close();
      this.socket = undefined;
    }

    this.messageQueue = [];
    this.reconnectAttempts = 0;
  }

  /**
   * Validate WebSocket configuration
   */
  protected validateConfig(): void {
    if (!this.config.url) {
      throw new Error('WebSocket adapter requires a URL');
    }

    if (!this.config.url.startsWith('ws://') && !this.config.url.startsWith('wss://')) {
      throw new Error('WebSocket URL must start with ws:// or wss://');
    }
  }
}
