import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface GaugeChartProps {
  value: number;
  min?: number;
  max?: number;
  unit?: string;
  title?: string;
  description?: string;
  thresholds?: Array<{ value: number; color: string }>;
  showValue?: boolean;
}

export function GaugeChart({
  value,
  min = 0,
  max = 100,
  unit = '',
  title,
  description,
  thresholds = [
    { value: 0, color: '#10b981' },    // green
    { value: 70, color: '#f59e0b' },   // yellow
    { value: 90, color: '#ef4444' },   // red
  ],
  showValue = true,
}: GaugeChartProps) {
  const [animatedValue, setAnimatedValue] = useState(min);

  // Animate value change
  useEffect(() => {
    const duration = 1000; // 1 second
    const steps = 60;
    const stepValue = (value - animatedValue) / steps;
    let currentStep = 0;

    const interval = setInterval(() => {
      currentStep++;
      setAnimatedValue((prev) => {
        const newValue = prev + stepValue;
        if (currentStep >= steps) {
          clearInterval(interval);
          return value;
        }
        return newValue;
      });
    }, duration / steps);

    return () => clearInterval(interval);
  }, [value]);

  // Calculate angle (180 degrees arc)
  const percentage = Math.max(0, Math.min(100, ((animatedValue - min) / (max - min)) * 100));
  const angle = (percentage / 100) * 180 - 90; // -90 to 90 degrees

  // Get color based on thresholds
  const getColor = (val: number) => {
    const sorted = [...thresholds].sort((a, b) => b.value - a.value);
    const threshold = sorted.find((t) => val >= t.value);
    return threshold?.color || thresholds[0].color;
  };

  const color = getColor(animatedValue);

  const radius = 90;
  const circumference = Math.PI * radius; // Half circle
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <Card className="h-full">
      {(title || description) && (
        <CardHeader className="pb-2">
          {title && <CardTitle className="text-lg">{title}</CardTitle>}
          {description && <CardDescription>{description}</CardDescription>}
        </CardHeader>
      )}
      <CardContent className="flex items-center justify-center p-6">
        <div className="relative w-full max-w-[280px]">
          {/* SVG Gauge */}
          <svg viewBox="0 0 200 120" className="w-full">
            {/* Background arc */}
            <path
              d="M 20 100 A 80 80 0 0 1 180 100"
              fill="none"
              stroke="currentColor"
              strokeWidth="12"
              className="opacity-20"
            />

            {/* Value arc */}
            <path
              d="M 20 100 A 80 80 0 0 1 180 100"
              fill="none"
              stroke={color}
              strokeWidth="12"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              style={{
                transition: 'stroke-dashoffset 0.5s ease, stroke 0.3s ease',
              }}
            />

            {/* Needle */}
            <g transform="translate(100, 100)">
              <line
                x1="0"
                y1="0"
                x2="0"
                y2="-70"
                stroke={color}
                strokeWidth="3"
                strokeLinecap="round"
                transform={`rotate(${angle})`}
                style={{
                  transition: 'transform 0.5s ease',
                }}
              />
              <circle cx="0" cy="0" r="5" fill={color} />
            </g>

            {/* Min/Max labels */}
            <text x="25" y="110" className="text-xs fill-current opacity-60" textAnchor="middle">
              {min}
            </text>
            <text x="175" y="110" className="text-xs fill-current opacity-60" textAnchor="middle">
              {max}
            </text>
          </svg>

          {/* Value display */}
          {showValue && (
            <div className="absolute inset-x-0 bottom-0 text-center">
              <div className="text-3xl font-bold" style={{ color }}>
                {animatedValue.toFixed(1)}
                {unit && <span className="text-lg ml-1">{unit}</span>}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
