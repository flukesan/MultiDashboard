import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { DataSource } from '@/types';
import { fetchDataSource } from '@/lib/data-sources';

/**
 * Hook for fetching data from a data source
 * Uses React Query for caching and automatic refetching
 */
export function useDataSource<TData = unknown>(
  widgetId: string,
  dataSource: DataSource | undefined,
  options?: Omit<UseQueryOptions<TData>, 'queryKey' | 'queryFn'>
) {
  return useQuery<TData>({
    queryKey: ['widget-data', widgetId, dataSource?.config],
    queryFn: async () => {
      if (!dataSource) {
        throw new Error('No data source configured');
      }

      const data = await fetchDataSource(dataSource.config, dataSource.transformer);
      return data as TData;
    },
    enabled: !!dataSource,
    refetchInterval: dataSource?.config.refreshInterval,
    retry: 2,
    staleTime: 30000, // Consider data fresh for 30 seconds
    ...options,
  });
}
