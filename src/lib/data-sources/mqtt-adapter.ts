import { BaseDataSourceAdapter } from './base-adapter';
import { MQTTDataSourceConfig } from '@/types';

/**
 * MQTT Data Source Adapter
 *
 * Note: Browser MQTT connections require WebSocket transport.
 * This adapter supports two modes:
 *
 * 1. MQTT over WebSocket (Direct):
 *    - Broker must support WebSocket (e.g., Mosquitto with WebSocket enabled)
 *    - URL format: ws://broker:9001 or wss://broker:9001
 *
 * 2. MQTT via Backend Proxy (Recommended for production):
 *    - Browser -> REST/WebSocket API -> Backend Server -> MQTT Broker
 *    - More secure, handles authentication better
 *    - Backend API Endpoint: /api/datasource/mqtt
 *
 * For this implementation, we use Backend Proxy mode for better security.
 */
export class MQTTDataSourceAdapter extends BaseDataSourceAdapter<MQTTDataSourceConfig> {
  private apiEndpoint: string;
  private websocket: WebSocket | null = null;
  private latestData: unknown = null;
  private listeners: Array<(data: unknown) => void> = [];

  constructor(config: MQTTDataSourceConfig, apiEndpoint?: string) {
    super(config);
    // Default to local backend WebSocket API
    this.apiEndpoint = apiEndpoint || '/api/datasource/mqtt/ws';
  }

  /**
   * Connect to MQTT broker via backend WebSocket proxy
   */
  async connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        // Convert http/https to ws/wss for WebSocket
        const wsUrl = this.apiEndpoint.replace(/^http/, 'ws');

        this.websocket = new WebSocket(wsUrl);

        this.websocket.onopen = () => {
          console.log('MQTT WebSocket connected');

          // Send subscription request to backend
          this.websocket?.send(
            JSON.stringify({
              action: 'subscribe',
              config: {
                brokerUrl: this.config.brokerUrl,
                port: this.config.port || 1883,
                topic: this.config.topic,
                clientId: this.config.clientId || `dashboard_${Date.now()}`,
                username: this.config.username,
                password: this.config.password,
                qos: this.config.qos || 0,
                clean: this.config.clean !== false,
              },
            })
          );

          resolve();
        };

        this.websocket.onmessage = (event) => {
          try {
            const message = JSON.parse(event.data);

            if (message.type === 'data') {
              // Store latest data
              this.latestData = message.payload;

              // Transform if transformer is provided
              const transformedData = this.transform(message.payload);

              // Notify all listeners
              this.listeners.forEach((listener) => listener(transformedData));
            } else if (message.type === 'error') {
              console.error('MQTT Error:', message.error);
            } else if (message.type === 'subscribed') {
              console.log('Subscribed to MQTT topic:', this.config.topic);
            }
          } catch (error) {
            console.error('Failed to parse MQTT message:', error);
          }
        };

        this.websocket.onerror = (error) => {
          console.error('MQTT WebSocket error:', error);
          reject(error);
        };

        this.websocket.onclose = () => {
          console.log('MQTT WebSocket closed');
          this.websocket = null;
        };
      } catch (error) {
        console.error('Failed to connect to MQTT:', error);
        reject(error);
      }
    });
  }

  /**
   * Disconnect from MQTT broker
   */
  disconnect(): void {
    if (this.websocket) {
      this.websocket.send(
        JSON.stringify({
          action: 'unsubscribe',
          topic: this.config.topic,
        })
      );

      this.websocket.close();
      this.websocket = null;
    }
  }

  /**
   * Fetch latest data (for compatibility with base adapter)
   */
  async fetch(): Promise<unknown> {
    // If not connected, connect first
    if (!this.websocket || this.websocket.readyState !== WebSocket.OPEN) {
      await this.connect();

      // Wait a bit for initial data
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }

    return this.transform(this.latestData);
  }

  /**
   * Subscribe to real-time data updates
   */
  subscribe(callback: (data: unknown) => void): () => void {
    this.listeners.push(callback);

    // Return unsubscribe function
    return () => {
      const index = this.listeners.indexOf(callback);
      if (index > -1) {
        this.listeners.splice(index, 1);
      }
    };
  }

  /**
   * Publish message to MQTT topic
   */
  async publish(message: unknown): Promise<void> {
    if (!this.websocket || this.websocket.readyState !== WebSocket.OPEN) {
      throw new Error('MQTT not connected');
    }

    this.websocket.send(
      JSON.stringify({
        action: 'publish',
        topic: this.config.topic,
        message: JSON.stringify(message),
        qos: this.config.qos || 0,
        retain: this.config.retain || false,
      })
    );
  }

  /**
   * Test MQTT connection
   */
  async testConnection(): Promise<boolean> {
    try {
      const response = await fetch('/api/datasource/mqtt/test', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          brokerUrl: this.config.brokerUrl,
          port: this.config.port || 1883,
          username: this.config.username,
          password: this.config.password,
        }),
      });

      const result = await response.json();
      return result.success === true;
    } catch (error) {
      console.error('MQTT Connection Test Failed:', error);
      return false;
    }
  }

  protected validateConfig(): void {
    if (!this.config.brokerUrl) throw new Error('MQTT broker URL is required');
    if (!this.config.topic) throw new Error('MQTT topic is required');
  }
}
