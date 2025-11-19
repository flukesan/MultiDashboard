import { BaseDataSourceAdapter } from './base-adapter';
import { PostgreSQLDataSourceConfig } from '@/types';

/**
 * PostgreSQL Data Source Adapter
 *
 * Note: Browser cannot connect to PostgreSQL directly due to security restrictions.
 * This adapter requires a backend API server to proxy the database connection.
 *
 * Architecture:
 * Browser -> REST API -> Backend Server -> PostgreSQL
 *
 * Backend API Endpoint: POST /api/datasource/postgresql
 * Request Body: { host, port, database, username, password, query }
 * Response: { data: [...], error?: string }
 */
export class PostgreSQLDataSourceAdapter extends BaseDataSourceAdapter<PostgreSQLDataSourceConfig> {
  private apiEndpoint: string;

  constructor(config: PostgreSQLDataSourceConfig, apiEndpoint?: string) {
    super(config);
    // Default to local backend API, but allow configuration
    this.apiEndpoint = apiEndpoint || '/api/datasource/postgresql';
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
          port: this.config.port || 5432,
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
          errorData.error || `PostgreSQL query failed: ${response.statusText}`
        );
      }

      const result = await response.json();

      if (result.error) {
        throw new Error(`PostgreSQL Error: ${result.error}`);
      }

      // Transform the data if transformer is provided
      return this.transform(result.data);
    } catch (error) {
      console.error('PostgreSQL Adapter Error:', error);
      throw error;
    }
  }

  /**
   * Test connection to PostgreSQL
   */
  async testConnection(): Promise<boolean> {
    try {
      const response = await fetch(`${this.apiEndpoint}/test`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          host: this.config.host,
          port: this.config.port || 5432,
          database: this.config.database,
          username: this.config.username,
          password: this.config.password,
          ssl: this.config.ssl || false,
        }),
      });

      const result = await response.json();
      return result.success === true;
    } catch (error) {
      console.error('PostgreSQL Connection Test Failed:', error);
      return false;
    }
  }

  /**
   * Get table names from database (for UI helper)
   */
  async getTables(): Promise<string[]> {
    try {
      const response = await fetch(`${this.apiEndpoint}/tables`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          host: this.config.host,
          port: this.config.port || 5432,
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
    if (!this.config.host) throw new Error('PostgreSQL host is required');
    if (!this.config.database) throw new Error('PostgreSQL database is required');
    if (!this.config.username) throw new Error('PostgreSQL username is required');
  }
}
