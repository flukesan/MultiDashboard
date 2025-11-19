import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface BarGaugeDataPoint {
  label: string;
  value: number;
  max?: number;
  color?: string;
}

interface BarGaugeChartProps {
  data: BarGaugeDataPoint[];
  title?: string;
  description?: string;
  orientation?: 'horizontal' | 'vertical';
  showValues?: boolean;
  thresholds?: Array<{ value: number; color: string }>;
}

export function BarGaugeChart({
  data,
  title,
  description,
  orientation = 'horizontal',
  showValues = true,
  thresholds = [
    { value: 0, color: '#10b981' },    // green
    { value: 70, color: '#f59e0b' },   // yellow
    { value: 90, color: '#ef4444' },   // red
  ],
}: BarGaugeChartProps) {
  const getColor = (value: number, max: number, customColor?: string) => {
    if (customColor) return customColor;

    const percentage = (value / max) * 100;
    const sorted = [...thresholds].sort((a, b) => b.value - a.value);
    const threshold = sorted.find((t) => percentage >= t.value);
    return threshold?.color || thresholds[0].color;
  };

  if (orientation === 'horizontal') {
    return (
      <Card className="h-full">
        {(title || description) && (
          <CardHeader className="pb-2">
            {title && <CardTitle className="text-lg">{title}</CardTitle>}
            {description && <CardDescription>{description}</CardDescription>}
          </CardHeader>
        )}
        <CardContent className="p-4">
          <div className="space-y-4">
            {data.map((item, index) => {
              const max = item.max || 100;
              const percentage = Math.min(100, (item.value / max) * 100);
              const color = getColor(item.value, max, item.color);

              return (
                <div key={index} className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">{item.label}</span>
                    {showValues && (
                      <span className="text-muted-foreground">
                        {item.value.toFixed(1)} / {max}
                      </span>
                    )}
                  </div>

                  <div className="relative h-8 bg-muted rounded-lg overflow-hidden">
                    {/* Background grid lines */}
                    <div className="absolute inset-0 flex">
                      {[25, 50, 75].map((pos) => (
                        <div
                          key={pos}
                          className="border-r border-background/50"
                          style={{ width: `${pos}%` }}
                        />
                      ))}
                    </div>

                    {/* Value bar */}
                    <div
                      className="absolute inset-y-0 left-0 rounded-r-lg transition-all duration-1000 ease-out"
                      style={{
                        width: `${percentage}%`,
                        backgroundColor: color,
                      }}
                    >
                      {/* Animated shine effect */}
                      <div
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                        style={{
                          animation: percentage > 0 ? 'shine 2s infinite' : 'none',
                        }}
                      />
                    </div>

                    {/* Value text overlay */}
                    {showValues && percentage > 10 && (
                      <div className="absolute inset-0 flex items-center px-3">
                        <span className="text-sm font-bold text-white mix-blend-difference">
                          {percentage.toFixed(0)}%
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <style>{`
            @keyframes shine {
              0% { transform: translateX(-100%); }
              100% { transform: translateX(100%); }
            }
          `}</style>
        </CardContent>
      </Card>
    );
  }

  // Vertical orientation
  return (
    <Card className="h-full">
      {(title || description) && (
        <CardHeader className="pb-2">
          {title && <CardTitle className="text-lg">{title}</CardTitle>}
          {description && <CardDescription>{description}</CardDescription>}
        </CardHeader>
      )}
      <CardContent className="p-4 h-full">
        <div className="flex items-end justify-around gap-2 h-full min-h-[200px]">
          {data.map((item, index) => {
            const max = item.max || 100;
            const percentage = Math.min(100, (item.value / max) * 100);
            const color = getColor(item.value, max, item.color);

            return (
              <div
                key={index}
                className="flex flex-col items-center gap-2 flex-1 max-w-[80px]"
              >
                {/* Value display */}
                {showValues && (
                  <div className="text-sm font-medium" style={{ color }}>
                    {item.value.toFixed(1)}
                  </div>
                )}

                {/* Vertical bar */}
                <div className="relative w-full bg-muted rounded-lg overflow-hidden flex-1">
                  {/* Background grid lines */}
                  <div className="absolute inset-0 flex flex-col-reverse">
                    {[25, 50, 75].map((pos) => (
                      <div
                        key={pos}
                        className="border-t border-background/50"
                        style={{ height: `${pos}%` }}
                      />
                    ))}
                  </div>

                  {/* Value bar */}
                  <div
                    className="absolute inset-x-0 bottom-0 rounded-t-lg transition-all duration-1000 ease-out"
                    style={{
                      height: `${percentage}%`,
                      backgroundColor: color,
                    }}
                  >
                    {/* Animated shine effect */}
                    <div
                      className="absolute inset-0 bg-gradient-to-t from-transparent via-white/20 to-transparent"
                      style={{
                        animation: percentage > 0 ? 'shine-vertical 2s infinite' : 'none',
                      }}
                    />

                    {/* Percentage text */}
                    {showValues && percentage > 15 && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-xs font-bold text-white mix-blend-difference">
                          {percentage.toFixed(0)}%
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Label */}
                <div className="text-xs text-center text-muted-foreground truncate w-full">
                  {item.label}
                </div>
              </div>
            );
          })}
        </div>

        <style>{`
          @keyframes shine-vertical {
            0% { transform: translateY(100%); }
            100% { transform: translateY(-100%); }
          }
        `}</style>
      </CardContent>
    </Card>
  );
}
