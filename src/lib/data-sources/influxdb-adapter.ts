import { BaseDataSourceAdapter } from './base-adapter';
import { InfluxDBDataSourceConfig } from '@/types';

/**
 * InfluxDB Data Source Adapter
 *
 * Supports InfluxDB 2.x with Flux query language
 *
 * Architecture:
 * Browser -> InfluxDB HTTP API (direct or via backend proxy)
 *
 * InfluxDB API Endpoint: POST {url}/api/v2/query
 * Headers: Authorization: Token {token}
 * Request Body: { org, query }
 */
export class InfluxDBDataSourceAdapter extends BaseDataSourceAdapter<InfluxDBDataSourceConfig> {
  constructor(config: InfluxDBDataSourceConfig) {
    super(config);
  }

  async fetch(): Promise<unknown> {
    try {
      const response = await fetch(`${this.config.url}/api/v2/query`, {
        method: 'POST',
        headers: {
          'Authorization': `Token ${this.config.token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          type: 'flux',
          org: this.config.org,
          query: this.config.query,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `InfluxDB query failed: ${response.statusText} - ${errorText}`
        );
      }

      const contentType = response.headers.get('content-type');

      // InfluxDB returns CSV by default, but we request JSON
      if (contentType?.includes('application/json')) {
        const result = await response.json();
        return this.transform(this.parseInfluxDBJSON(result));
      } else {
        // Parse CSV response
        const csvText = await response.text();
        return this.transform(this.parseInfluxDBCSV(csvText));
      }
    } catch (error) {
      console.error('InfluxDB Adapter Error:', error);
      throw error;
    }
  }

  /**
   * Parse InfluxDB JSON response
   */
  private parseInfluxDBJSON(response: any): unknown {
    // InfluxDB JSON format varies, extract data points
    if (Array.isArray(response)) {
      return response.flatMap((table) => {
        if (table.records) {
          return table.records.map((record: any) => record.values);
        }
        return [];
      });
    }
    return response;
  }

  /**
   * Parse InfluxDB CSV response to JSON
   */
  private parseInfluxDBCSV(csv: string): unknown {
    const lines = csv.trim().split('\n');
    if (lines.length < 2) return [];

    // First line is header
    const headers = lines[0].split(',').map((h) => h.trim());

    // Parse data lines
    const data = lines.slice(1).map((line) => {
      const values = line.split(',').map((v) => v.trim());
      const obj: Record<string, string> = {};

      headers.forEach((header, index) => {
        obj[header] = values[index];
      });

      return obj;
    });

    return data;
  }

  /**
   * Test InfluxDB connection
   */
  async testConnection(): Promise<boolean> {
    try {
      const response = await fetch(`${this.config.url}/health`, {
        method: 'GET',
        headers: {
          'Authorization': `Token ${this.config.token}`,
        },
      });

      if (response.ok) {
        const result = await response.json();
        return result.status === 'pass';
      }

      return false;
    } catch (error) {
      console.error('InfluxDB Connection Test Failed:', error);
      return false;
    }
  }

  /**
   * Get list of buckets
   */
  async getBuckets(): Promise<string[]> {
    try {
      const response = await fetch(`${this.config.url}/api/v2/buckets`, {
        method: 'GET',
        headers: {
          'Authorization': `Token ${this.config.token}`,
        },
      });

      if (response.ok) {
        const result = await response.json();
        return result.buckets?.map((b: any) => b.name) || [];
      }

      return [];
    } catch (error) {
      console.error('Failed to fetch buckets:', error);
      return [];
    }
  }

  /**
   * Get measurements (similar to tables)
   */
  async getMeasurements(): Promise<string[]> {
    try {
      const query = `
        import "influxdata/influxdb/schema"
        schema.measurements(bucket: "${this.config.bucket}")
      `;

      const response = await fetch(`${this.config.url}/api/v2/query`, {
        method: 'POST',
        headers: {
          'Authorization': `Token ${this.config.token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'flux',
          org: this.config.org,
          query,
        }),
      });

      if (response.ok) {
        const csvText = await response.text();
        const data = this.parseInfluxDBCSV(csvText);
        if (Array.isArray(data)) {
          return data.map((row: any) => row._value);
        }
      }

      return [];
    } catch (error) {
      console.error('Failed to fetch measurements:', error);
      return [];
    }
  }

  protected validateConfig(): void {
    if (!this.config.url) throw new Error('InfluxDB URL is required');
    if (!this.config.token) throw new Error('InfluxDB token is required');
    if (!this.config.org) throw new Error('InfluxDB organization is required');
    if (!this.config.bucket) throw new Error('InfluxDB bucket is required');
  }
}
