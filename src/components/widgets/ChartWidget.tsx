import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { ChartWidgetConfig, ChartData } from '@/types';
import { BaseWidget } from './BaseWidget';
import { useDataSource } from '@/hooks';

interface ChartWidgetProps {
  id: string;
  config: ChartWidgetConfig;
  dataSource?: any;
  editMode?: boolean;
  onRemove?: () => void;
  onEdit?: () => void;
}

const DEFAULT_COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

export function ChartWidget({
  id,
  config,
  dataSource,
  editMode,
  onRemove,
  onEdit,
}: ChartWidgetProps) {
  const { data, isLoading, error } = useDataSource<ChartData>(id, dataSource);

  const colors = config.colors || DEFAULT_COLORS;
  const showLegend = config.showLegend !== false;
  const showGrid = config.showGrid !== false;

  const renderChart = () => {
    if (!data) return null;

    // Transform data for recharts
    const chartData = data.labels.map((label, index) => {
      const point: any = { name: label };
      data.datasets.forEach((dataset) => {
        point[dataset.label] = dataset.data[index];
      });
      return point;
    });

    const commonProps = {
      data: chartData,
      margin: { top: 5, right: 10, left: 0, bottom: 5 },
    };

    switch (config.chartType) {
      case 'line':
        return (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart {...commonProps}>
              {showGrid && <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />}
              <XAxis dataKey="name" className="text-xs" />
              <YAxis className="text-xs" label={config.yAxisLabel ? { value: config.yAxisLabel, angle: -90, position: 'insideLeft' } : undefined} />
              <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }} />
              {showLegend && <Legend />}
              {data.datasets.map((dataset, index) => (
                <Line
                  key={dataset.label}
                  type={config.smooth ? 'monotone' : 'linear'}
                  dataKey={dataset.label}
                  stroke={dataset.color || colors[index % colors.length]}
                  strokeWidth={2}
                  dot={{ r: 3 }}
                  activeDot={{ r: 5 }}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        );

      case 'bar':
        return (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart {...commonProps}>
              {showGrid && <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />}
              <XAxis dataKey="name" className="text-xs" />
              <YAxis className="text-xs" />
              <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }} />
              {showLegend && <Legend />}
              {data.datasets.map((dataset, index) => (
                <Bar
                  key={dataset.label}
                  dataKey={dataset.label}
                  fill={dataset.color || colors[index % colors.length]}
                  radius={[4, 4, 0, 0]}
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
        );

      case 'area':
        return (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart {...commonProps}>
              {showGrid && <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />}
              <XAxis dataKey="name" className="text-xs" />
              <YAxis className="text-xs" />
              <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }} />
              {showLegend && <Legend />}
              {data.datasets.map((dataset, index) => (
                <Area
                  key={dataset.label}
                  type={config.smooth ? 'monotone' : 'linear'}
                  dataKey={dataset.label}
                  fill={dataset.color || colors[index % colors.length]}
                  stroke={dataset.color || colors[index % colors.length]}
                  fillOpacity={0.6}
                />
              ))}
            </AreaChart>
          </ResponsiveContainer>
        );

      case 'pie':
        // For pie chart, use first dataset
        const pieData = data.labels.map((label, index) => ({
          name: label,
          value: data.datasets[0]?.data[index] || 0,
        }));

        return (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius="80%"
                fill="#8884d8"
                dataKey="value"
              >
                {pieData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }} />
              {showLegend && <Legend />}
            </PieChart>
          </ResponsiveContainer>
        );

      default:
        return <div className="flex h-full items-center justify-center text-muted-foreground">Unsupported chart type</div>;
    }
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
      {renderChart()}
    </BaseWidget>
  );
}
