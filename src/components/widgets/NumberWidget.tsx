import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { cn, formatNumber, calculateTrend } from '@/lib/utils';
import { NumberWidgetConfig, NumberData } from '@/types';
import { BaseWidget } from './BaseWidget';
import { useDataSource } from '@/hooks';

interface NumberWidgetProps {
  id: string;
  config: NumberWidgetConfig;
  dataSource?: any;
  editMode?: boolean;
  onRemove?: () => void;
  onEdit?: () => void;
}

export function NumberWidget({
  id,
  config,
  dataSource,
  editMode,
  onRemove,
  onEdit,
}: NumberWidgetProps) {
  const { data, isLoading, error } = useDataSource<NumberData>(id, dataSource);

  const renderContent = () => {
    if (!data) return null;

    const formattedValue = formatNumber(data.value, {
      decimals: config.decimals || 0,
      prefix: config.prefix,
      suffix: config.suffix,
      format: config.format,
    });

    const trend = data.trend || (data.previousValue ? calculateTrend(data.value, data.previousValue).direction : 'neutral');
    const trendPercentage = data.trendPercentage || (data.previousValue ? calculateTrend(data.value, data.previousValue).percentage : 0);

    const sizeClasses = {
      sm: 'text-3xl',
      md: 'text-5xl',
      lg: 'text-7xl',
    };

    const trendColors = config.trendColor || {
      positive: 'text-green-500',
      negative: 'text-red-500',
    };

    const TrendIcon =
      trend === 'up' ? TrendingUp : trend === 'down' ? TrendingDown : Minus;
    const trendColor = trend === 'up' ? trendColors.positive : trend === 'down' ? trendColors.negative : 'text-muted-foreground';

    return (
      <div className="flex h-full flex-col items-center justify-center space-y-2">
        <div className={cn('font-bold tabular-nums', sizeClasses[config.size || 'md'])}>
          {formattedValue}
        </div>

        {config.showTrend && data.previousValue !== undefined && (
          <div className={cn('flex items-center space-x-1 text-sm font-medium', trendColor)}>
            <TrendIcon className="h-4 w-4" />
            <span>{trendPercentage.toFixed(1)}%</span>
          </div>
        )}
      </div>
    );
  };

  return (
    <BaseWidget
      id={id}
      config={config}
      isLoading={isLoading}
      error={error as Error}
      onRemove={onRemove}
      onEdit={onEdit}
      editMode={editMode}
    >
      {renderContent()}
    </BaseWidget>
  );
}
