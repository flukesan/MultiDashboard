import { useEffect, useState } from 'react';
import { BaseWidget } from './BaseWidget';
import { Widget } from '@/types';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { AlertTriangle } from 'lucide-react';

interface PieChartWidgetProps {
  id: string;
  config: Widget['config'];
  dataSource?: any;
  editMode: boolean;
  onRemove: () => void;
  onEdit: () => void;
  onUpdateTitle: (title: string) => void;
}

interface PieDataItem {
  name: string;
  value: number;
  color?: string;
}

export function PieChartWidget({
  id,
  config,
  dataSource,
  editMode,
  onRemove,
  onEdit,
  onUpdateTitle,
}: PieChartWidgetProps) {
  const [data, setData] = useState<PieDataItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const colors = (config as any).colors || [
    '#3b82f6',
    '#10b981',
    '#f59e0b',
    '#ef4444',
    '#8b5cf6',
    '#ec4899',
    '#06b6d4',
    '#84cc16',
  ];

  const showLegend = (config as any).showLegend !== false;
  const showLabels = (config as any).showLabels !== false;
  const innerRadius = (config as any).innerRadius || 0; // 0 for pie, > 0 for donut

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);

        // Mock data - replace with actual data source
        const mockData: PieDataItem[] = [
          { name: 'Production', value: 450 },
          { name: 'Quality Control', value: 280 },
          { name: 'Packaging', value: 320 },
          { name: 'Shipping', value: 180 },
          { name: 'Maintenance', value: 150 },
        ];

        setData(mockData);
        setError(null);
      } catch (err) {
        setError('Failed to load data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();

    // Auto-refresh if configured
    const refreshInterval = (config as any).refreshInterval;
    if (refreshInterval && refreshInterval > 0) {
      const interval = setInterval(fetchData, refreshInterval);
      return () => clearInterval(interval);
    }
  }, [dataSource, config]);

  const renderCustomLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
  }: any) => {
    if (!showLabels) return null;

    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? 'start' : 'end'}
        dominantBaseline="central"
        className="text-xs font-semibold"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background border rounded-lg shadow-lg p-3">
          <p className="font-semibold">{payload[0].name}</p>
          <p className="text-sm text-muted-foreground">
            Value: <span className="font-bold text-foreground">{payload[0].value.toLocaleString()}</span>
          </p>
          <p className="text-sm text-muted-foreground">
            Percentage: <span className="font-bold text-foreground">
              {((payload[0].value / data.reduce((sum, item) => sum + item.value, 0)) * 100).toFixed(1)}%
            </span>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <BaseWidget
      id={id}
      config={config}
      editMode={editMode}
      onRemove={onRemove}
      onEdit={onEdit}
      onUpdateTitle={onUpdateTitle}
    >
      <div className="flex h-full w-full items-center justify-center p-4">
        {isLoading && (
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        )}

        {error && (
          <div className="flex items-center text-destructive">
            <AlertTriangle className="w-5 h-5 mr-2" />
            {error}
          </div>
        )}

        {!isLoading && !error && data.length > 0 && (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={renderCustomLabel}
                outerRadius="80%"
                innerRadius={`${innerRadius}%`}
                fill="#8884d8"
                dataKey="value"
                animationBegin={0}
                animationDuration={800}
              >
                {data.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.color || colors[index % colors.length]}
                  />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              {showLegend && (
                <Legend
                  verticalAlign="bottom"
                  height={36}
                  iconType="circle"
                  wrapperStyle={{
                    fontSize: '12px',
                  }}
                />
              )}
            </PieChart>
          </ResponsiveContainer>
        )}

        {!isLoading && !error && data.length === 0 && (
          <div className="text-center text-muted-foreground">
            <p>No data available</p>
            <p className="text-xs mt-2">Configure data source to display pie chart</p>
          </div>
        )}
      </div>
    </BaseWidget>
  );
}
