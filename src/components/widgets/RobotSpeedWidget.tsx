import { useEffect, useState } from 'react';
import { BaseWidget } from './BaseWidget';
import { Widget, SpeedData } from '@/types';
import { Gauge, TrendingUp, AlertTriangle } from 'lucide-react';

interface RobotSpeedWidgetProps {
  id: string;
  config: Widget['config'];
  dataSource?: any;
  editMode: boolean;
  onRemove: () => void;
  onEdit: () => void;
  onUpdateTitle: (title: string) => void;
}

export function RobotSpeedWidget({
  id,
  config,
  dataSource,
  editMode,
  onRemove,
  onEdit,
  onUpdateTitle,
}: RobotSpeedWidgetProps) {
  const [speed, setSpeed] = useState<SpeedData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSpeed = async () => {
      try {
        setIsLoading(true);
        // Mock data
        const mockSpeed: SpeedData = {
          linear: 850 + Math.random() * 150,
          angular: 45 + Math.random() * 15,
          acceleration: 120 + Math.random() * 30,
          timestamp: new Date().toISOString(),
        };

        setSpeed(mockSpeed);
        setError(null);
      } catch (err) {
        setError('Failed to fetch speed data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchSpeed();
    const interval = setInterval(fetchSpeed, 500);
    return () => clearInterval(interval);
  }, [dataSource]);

  const SpeedGauge = ({ value, max, label, unit }: {
    value: number;
    max: number;
    label: string;
    unit: string;
  }) => {
    const percentage = Math.min((value / max) * 100, 100);
    const rotation = (percentage / 100) * 180 - 90;

    return (
      <div className="bg-secondary/20 rounded-lg p-3">
        <div className="text-xs font-medium text-muted-foreground mb-2 text-center">{label}</div>
        <div className="relative w-full aspect-square max-w-[120px] mx-auto">
          {/* Gauge background */}
          <svg viewBox="0 0 100 100" className="w-full h-full">
            {/* Background arc */}
            <path
              d="M 10 90 A 40 40 0 0 1 90 90"
              fill="none"
              stroke="currentColor"
              strokeWidth="8"
              className="text-secondary"
              strokeLinecap="round"
            />
            {/* Value arc */}
            <path
              d="M 10 90 A 40 40 0 0 1 90 90"
              fill="none"
              stroke="currentColor"
              strokeWidth="8"
              className="text-primary"
              strokeLinecap="round"
              strokeDasharray={`${percentage * 1.26} 126`}
            />
          </svg>

          {/* Needle */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div
              className="absolute w-1 h-8 bg-foreground rounded-full origin-bottom transition-transform duration-300"
              style={{
                transform: `rotate(${rotation}deg) translateY(-50%)`,
                bottom: '50%',
              }}
            />
            <div className="w-3 h-3 bg-foreground rounded-full z-10" />
          </div>

          {/* Value display */}
          <div className="absolute bottom-4 left-0 right-0 text-center">
            <div className="text-lg font-bold">{value.toFixed(0)}</div>
            <div className="text-xs text-muted-foreground">{unit}</div>
          </div>
        </div>
      </div>
    );
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
      <div className="flex flex-col h-full p-4">
        {isLoading && (
          <div className="flex items-center justify-center h-full">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        )}

        {error && (
          <div className="flex items-center justify-center h-full text-destructive">
            <AlertTriangle className="w-5 h-5 mr-2" />
            {error}
          </div>
        )}

        {!isLoading && !error && speed && (
          <div className="space-y-4">
            <div className="flex items-center">
              <Gauge className="w-5 h-5 mr-2 text-primary" />
              <h3 className="text-sm font-semibold">Speed & Acceleration</h3>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <SpeedGauge
                value={speed.linear}
                max={2000}
                label="Linear Speed"
                unit="mm/s"
              />
              <SpeedGauge
                value={speed.angular}
                max={180}
                label="Angular Speed"
                unit="°/s"
              />
            </div>

            <div className="bg-secondary/20 rounded-lg p-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <TrendingUp className="w-4 h-4 mr-2 text-primary" />
                  <span className="text-xs font-medium">Acceleration</span>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold">{speed.acceleration.toFixed(0)}</div>
                  <div className="text-xs text-muted-foreground">mm/s²</div>
                </div>
              </div>
            </div>

            <div className="text-xs text-muted-foreground text-center">
              Updated: {speed.timestamp ? new Date(speed.timestamp).toLocaleTimeString() : 'N/A'}
            </div>
          </div>
        )}

        {!isLoading && !error && !speed && (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            No speed data available
          </div>
        )}
      </div>
    </BaseWidget>
  );
}
