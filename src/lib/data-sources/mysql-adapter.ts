import { BaseDataSourceAdapter } from './base-adapter';
import { MySQLDataSourceConfig } from '@/types';

/**
 * MySQL Data Source Adapter
 *
 * Note: Browser cannot connect to MySQL directly.
 * This adapter requires a backend API server.
 *
 * Architecture:
 * Browser -> REST API -> Backend Server -> MySQL
 *
 * Backend API Endpoint: POST /api/datasource/mysql
 * Request Body: { host, port, database, username, password, query }
 * Response: { data: [...], error?: string }
 */
export class MySQLDataSourceAdapter extends BaseDataSourceAdapter<MySQLDataSourceConfig> {
  private apiEndpoint: string;

  constructor(config: MySQLDataSourceConfig, apiEndpoint?: string) {
    super(config);
    this.apiEndpoint = apiEndpoint || '/api/datasource/mysql';
  }

  async fetch(): Promise<unknown> {
    try {
      const response = await fetch(this.apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          host: this.config.host,
          port: this.config.port || 3306,
          database: this.config.database,
          username: this.config.username,
          password: this.config.password,
          query: this.config.query,
          ssl: this.config.ssl || false,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.error || `MySQL query failed: ${response.statusText}`
        );
      }

      const result = await response.json();

      if (result.error) {
        throw new Error(`MySQL Error: ${result.error}`);
      }

      return this.transform(result.data);
    } catch (error) {
      console.error('MySQL Adapter Error:', error);
      throw error;
    }
  }

  async testConnection(): Promise<boolean> {
    try {
      const response = await fetch(`${this.apiEndpoint}/test`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          host: this.config.host,
          port: this.config.port || 3306,
          database: this.config.database,
          username: this.config.username,
          password: this.config.password,
          ssl: this.config.ssl || false,
        }),
      });

      const result = await response.json();
      return result.success === true;
    } catch (error) {
      console.error('MySQL Connection Test Failed:', error);
      return false;
    }
  }

  async getTables(): Promise<string[]> {
    try {
      const response = await fetch(`${this.apiEndpoint}/tables`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          host: this.config.host,
          port: this.config.port || 3306,
          database: this.config.database,
          username: this.config.username,
          password: this.config.password,
          ssl: this.config.ssl || false,
        }),
      });

      const result = await response.json();
      return result.tables || [];
    } catch (error) {
      console.error('Failed to fetch tables:', error);
      return [];
    }
  }

  protected validateConfig(): void {
    if (!this.config.host) throw new Error('MySQL host is required');
    if (!this.config.database) throw new Error('MySQL database is required');
    if (!this.config.username) throw new Error('MySQL username is required');
  }
}
