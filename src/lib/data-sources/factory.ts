import { DataSourceConfig } from '@/types';
import { BaseDataSourceAdapter } from './base-adapter';
import { RestDataSourceAdapter } from './rest-adapter';
import { WebSocketDataSourceAdapter } from './websocket-adapter';
import { StaticDataSourceAdapter } from './static-adapter';
import { PostgreSQLDataSourceAdapter } from './postgresql-adapter';
import { MySQLDataSourceAdapter } from './mysql-adapter';
import { MQTTDataSourceAdapter } from './mqtt-adapter';
import { InfluxDBDataSourceAdapter } from './influxdb-adapter';

/**
 * Data Source Factory
 *
 * Creates appropriate adapter based on data source type
 */
export class DataSourceFactory {
  /**
   * Create data source adapter from configuration
   */
  static createAdapter(
    config: DataSourceConfig
  ): BaseDataSourceAdapter<DataSourceConfig> {
    switch (config.type) {
      case 'rest':
        return new RestDataSourceAdapter(config);

      case 'websocket':
        return new WebSocketDataSourceAdapter(config);

      case 'static':
        return new StaticDataSourceAdapter(config);

      case 'postgresql':
        return new PostgreSQLDataSourceAdapter(config);

      case 'mysql':
        return new MySQLDataSourceAdapter(config);

      case 'mqtt':
        return new MQTTDataSourceAdapter(config);

      case 'influxdb':
        return new InfluxDBDataSourceAdapter(config);

      default:
        throw new Error(`Unsupported data source type: ${(config as any).type}`);
    }
  }

  /**
   * Get display name for data source type
   */
  static getTypeName(type: DataSourceConfig['type']): string {
    const names: Record<string, string> = {
      rest: 'REST API',
      graphql: 'GraphQL',
      websocket: 'WebSocket',
      static: 'Static Data',
      postgresql: 'PostgreSQL',
      mysql: 'MySQL',
      mqtt: 'MQTT',
      influxdb: 'InfluxDB',
    };

    return names[type] || type;
  }

  /**
   * Get icon name for data source type (for UI)
   */
  static getTypeIcon(type: DataSourceConfig['type']): string {
    const icons: Record<string, string> = {
      rest: 'Globe',
      graphql: 'Code',
      websocket: 'Radio',
      static: 'Database',
      postgresql: 'Database',
      mysql: 'Database',
      mqtt: 'Radio',
      influxdb: 'TrendingUp',
    };

    return icons[type] || 'Database';
  }

  /**
   * Get list of all available data source types
   */
  static getAvailableTypes(): Array<{
    type: DataSourceConfig['type'];
    name: string;
    icon: string;
    description: string;
    requiresBackend: boolean;
  }> {
    return [
      {
        type: 'rest',
        name: 'REST API',
        icon: 'Globe',
        description: 'Fetch data from REST endpoints',
        requiresBackend: false,
      },
      {
        type: 'websocket',
        name: 'WebSocket',
        icon: 'Radio',
        description: 'Real-time data via WebSocket',
        requiresBackend: false,
      },
      {
        type: 'postgresql',
        name: 'PostgreSQL',
        icon: 'Database',
        description: 'Connect to PostgreSQL database',
        requiresBackend: true,
      },
      {
        type: 'mysql',
        name: 'MySQL',
        icon: 'Database',
        description: 'Connect to MySQL database',
        requiresBackend: true,
      },
      {
        type: 'mqtt',
        name: 'MQTT',
        icon: 'Radio',
        description: 'Subscribe to MQTT topics',
        requiresBackend: true,
      },
      {
        type: 'influxdb',
        name: 'InfluxDB',
        icon: 'TrendingUp',
        description: 'Time-series data from InfluxDB',
        requiresBackend: false,
      },
      {
        type: 'static',
        name: 'Static Data',
        icon: 'FileJson',
        description: 'Use hardcoded JSON data',
        requiresBackend: false,
      },
    ];
  }
}
