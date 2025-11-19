import { RestDataSourceConfig, DataTransformer, ApiResponse } from '@/types';
import { BaseDataSourceAdapter } from './base-adapter';

/**
 * REST API Data Source Adapter
 */
export class RestDataSourceAdapter extends BaseDataSourceAdapter<RestDataSourceConfig> {
  constructor(config: RestDataSourceConfig, transformer?: DataTransformer) {
    super(config, transformer);
    this.validateConfig();
  }

  /**
   * Fetch data from REST API
   */
  async fetch(): Promise<unknown> {
    this.abortController = new AbortController();

    try {
      const url = this.buildUrl();
      const options = this.buildRequestOptions();

      const response = await fetch(url, {
        ...options,
        signal: this.abortController.signal,
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      return this.transform(data);
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        throw new Error('Request was cancelled');
      }
      throw this.handleError(error);
    } finally {
      this.abortController = undefined;
    }
  }

  /**
   * Build complete URL with query parameters
   */
  private buildUrl(): string {
    const url = new URL(this.config.url, window.location.origin);

    if (this.config.params) {
      Object.entries(this.config.params).forEach(([key, value]) => {
        url.searchParams.append(key, value);
      });
    }

    return url.toString();
  }

  /**
   * Build request options
   */
  private buildRequestOptions(): RequestInit {
    const options: RequestInit = {
      method: this.config.method || 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...this.config.headers,
      },
    };

    if (this.config.body && this.config.method !== 'GET') {
      options.body = JSON.stringify(this.config.body);
    }

    return options;
  }

  /**
   * Validate REST configuration
   */
  protected validateConfig(): void {
    if (!this.config.url) {
      throw new Error('REST adapter requires a URL');
    }

    try {
      new URL(this.config.url, window.location.origin);
    } catch {
      throw new Error('Invalid URL provided to REST adapter');
    }
  }
}
