import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface HeatmapDataPoint {
  x: string | number;
  y: string | number;
  value: number;
}

interface HeatmapChartProps {
  data: HeatmapDataPoint[];
  title?: string;
  description?: string;
  colorScale?: {
    min: string;
    mid: string;
    max: string;
  };
  showValues?: boolean;
}

export function HeatmapChart({
  data,
  title,
  description,
  colorScale = {
    min: '#10b981', // green
    mid: '#f59e0b', // yellow
    max: '#ef4444', // red
  },
  showValues = false,
}: HeatmapChartProps) {
  // Extract unique X and Y values
  const xValues = Array.from(new Set(data.map((d) => String(d.x)))).sort();
  const yValues = Array.from(new Set(data.map((d) => String(d.y)))).sort();

  // Find min/max values for color scaling
  const values = data.map((d) => d.value);
  const minValue = Math.min(...values);
  const maxValue = Math.max(...values);

  // Get color based on value
  const getColor = (value: number) => {
    if (maxValue === minValue) return colorScale.mid;

    const normalized = (value - minValue) / (maxValue - minValue);

    if (normalized < 0.5) {
      // Interpolate between min and mid
      const t = normalized * 2;
      return interpolateColor(colorScale.min, colorScale.mid, t);
    } else {
      // Interpolate between mid and max
      const t = (normalized - 0.5) * 2;
      return interpolateColor(colorScale.mid, colorScale.max, t);
    }
  };

  // Get cell data
  const getCellData = (x: string, y: string) => {
    return data.find((d) => String(d.x) === x && String(d.y) === y);
  };

  const cellWidth = 100 / xValues.length;
  const cellHeight = 100 / yValues.length;

  return (
    <Card className="h-full">
      {(title || description) && (
        <CardHeader className="pb-2">
          {title && <CardTitle className="text-lg">{title}</CardTitle>}
          {description && <CardDescription>{description}</CardDescription>}
        </CardHeader>
      )}
      <CardContent className="p-4">
        <div className="w-full overflow-x-auto">
          {/* Heatmap Grid */}
          <div className="min-w-[400px]">
            {/* Y-axis labels and cells */}
            <div className="flex">
              {/* Y-axis label column */}
              <div className="flex flex-col justify-between py-6">
                {yValues.map((y) => (
                  <div
                    key={y}
                    className="text-xs text-muted-foreground text-right pr-2"
                    style={{ height: `${cellHeight}%` }}
                  >
                    {y}
                  </div>
                ))}
              </div>

              {/* Cells grid */}
              <div className="flex-1">
                {/* X-axis labels */}
                <div className="flex mb-1">
                  {xValues.map((x) => (
                    <div
                      key={x}
                      className="text-xs text-muted-foreground text-center"
                      style={{ width: `${cellWidth}%` }}
                    >
                      {x}
                    </div>
                  ))}
                </div>

                {/* Cells */}
                {yValues.map((y) => (
                  <div key={y} className="flex gap-1">
                    {xValues.map((x) => {
                      const cellData = getCellData(x, y);
                      const value = cellData?.value ?? 0;
                      const color = getColor(value);

                      return (
                        <div
                          key={`${x}-${y}`}
                          className="relative rounded transition-all hover:scale-105 cursor-pointer group"
                          style={{
                            width: `${cellWidth}%`,
                            aspectRatio: '1',
                            backgroundColor: color,
                          }}
                          title={`${x}, ${y}: ${value.toFixed(2)}`}
                        >
                          {showValues && (
                            <div className="absolute inset-0 flex items-center justify-center text-xs font-medium text-white mix-blend-difference">
                              {value.toFixed(1)}
                            </div>
                          )}

                          {/* Tooltip */}
                          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-black text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10">
                            {x}, {y}: {value.toFixed(2)}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>

            {/* Color scale legend */}
            <div className="mt-4 flex items-center gap-2">
              <span className="text-xs text-muted-foreground">{minValue.toFixed(1)}</span>
              <div className="flex-1 h-4 rounded" style={{
                background: `linear-gradient(to right, ${colorScale.min}, ${colorScale.mid}, ${colorScale.max})`
              }} />
              <span className="text-xs text-muted-foreground">{maxValue.toFixed(1)}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Helper function to interpolate between two hex colors
function interpolateColor(color1: string, color2: string, factor: number): string {
  const c1 = hexToRgb(color1);
  const c2 = hexToRgb(color2);

  if (!c1 || !c2) return color1;

  const r = Math.round(c1.r + factor * (c2.r - c1.r));
  const g = Math.round(c1.g + factor * (c2.g - c1.g));
  const b = Math.round(c1.b + factor * (c2.b - c1.b));

  return `rgb(${r}, ${g}, ${b})`;
}

function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}
