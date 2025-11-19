/**
 * Data Source Adapters
 * Factory pattern for creating appropriate data source adapters
 */

import { DataSourceConfig, DataTransformer } from '@/types';
import { BaseDataSourceAdapter } from './base-adapter';
import { RestDataSourceAdapter } from './rest-adapter';
import { StaticDataSourceAdapter } from './static-adapter';
import { WebSocketDataSourceAdapter } from './websocket-adapter';

export * from './base-adapter';
export * from './rest-adapter';
export * from './static-adapter';
export * from './websocket-adapter';

/**
 * Factory function to create appropriate data source adapter
 */
export function createDataSourceAdapter(
  config: DataSourceConfig,
  transformer?: DataTransformer
): BaseDataSourceAdapter {
  switch (config.type) {
    case 'rest':
      return new RestDataSourceAdapter(config, transformer);

    case 'static':
      return new StaticDataSourceAdapter(config, transformer);

    case 'websocket':
      return new WebSocketDataSourceAdapter(config, transformer);

    case 'graphql':
      // TODO: Implement GraphQL adapter
      throw new Error('GraphQL adapter not yet implemented');

    default:
      throw new Error(`Unknown data source type: ${(config as DataSourceConfig).type}`);
  }
}

/**
 * Hook for using data source (to be used with React Query)
 */
export async function fetchDataSource(
  config: DataSourceConfig,
  transformer?: DataTransformer
): Promise<unknown> {
  const adapter = createDataSourceAdapter(config, transformer);

  try {
    return await adapter.fetch();
  } finally {
    adapter.cleanup();
  }
}
