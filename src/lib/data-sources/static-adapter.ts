import { StaticDataSourceConfig, DataTransformer } from '@/types';
import { BaseDataSourceAdapter } from './base-adapter';

/**
 * Static Data Source Adapter
 * Returns static/mock data without external calls
 */
export class StaticDataSourceAdapter extends BaseDataSourceAdapter<StaticDataSourceConfig> {
  constructor(config: StaticDataSourceConfig, transformer?: DataTransformer) {
    super(config, transformer);
    this.validateConfig();
  }

  /**
   * Return static data
   */
  async fetch(): Promise<unknown> {
    try {
      // Simulate network delay for realistic behavior
      await new Promise((resolve) => setTimeout(resolve, 100));

      return this.transform(this.config.data);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Validate static data configuration
   */
  protected validateConfig(): void {
    if (this.config.data === undefined) {
      throw new Error('Static adapter requires data property');
    }
  }
}
