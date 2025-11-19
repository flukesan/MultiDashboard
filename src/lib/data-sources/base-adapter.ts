import { DataSourceConfig, DataTransformer, ApiError } from '@/types';

/**
 * Base Data Source Adapter
 * All data source adapters should extend this class
 */
export abstract class BaseDataSourceAdapter<TConfig extends DataSourceConfig = DataSourceConfig> {
  protected config: TConfig;
  protected transformer?: DataTransformer;
  protected abortController?: AbortController;

  constructor(config: TConfig, transformer?: DataTransformer) {
    this.config = config;
    this.transformer = transformer;
  }

  /**
   * Fetch data from the source
   */
  abstract fetch(): Promise<unknown>;

  /**
   * Transform raw data using the transformer function
   */
  protected transform(data: unknown): unknown {
    if (this.transformer) {
      try {
        return this.transformer(data);
      } catch (error) {
        console.error('Data transformation error:', error);
        throw new Error(`Failed to transform data: ${this.getErrorMessage(error)}`);
      }
    }
    return data;
  }

  /**
   * Cancel ongoing requests
   */
  cancel(): void {
    if (this.abortController) {
      this.abortController.abort();
      this.abortController = undefined;
    }
  }

  /**
   * Cleanup resources
   */
  cleanup(): void {
    this.cancel();
  }

  /**
   * Handle errors and convert to ApiError
   */
  protected handleError(error: unknown): ApiError {
    if (error instanceof Error) {
      return {
        message: error.message,
        code: 'FETCH_ERROR',
      };
    }
    return {
      message: 'An unknown error occurred',
      code: 'UNKNOWN_ERROR',
    };
  }

  /**
   * Get error message from unknown error type
   */
  protected getErrorMessage(error: unknown): string {
    if (error instanceof Error) return error.message;
    if (typeof error === 'string') return error;
    return 'Unknown error';
  }

  /**
   * Validate configuration
   */
  protected abstract validateConfig(): void;
}
