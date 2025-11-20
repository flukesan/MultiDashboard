import { useEffect, useState } from 'react';
import { BaseWidget } from './BaseWidget';
import { Widget, RobotPosition } from '@/types';
import { Move, Navigation, AlertTriangle } from 'lucide-react';

interface RobotPositionWidgetProps {
  id: string;
  config: Widget['config'];
  dataSource?: any;
  editMode: boolean;
  onRemove: () => void;
  onEdit: () => void;
  onUpdateTitle: (title: string) => void;
}

export function RobotPositionWidget({
  id,
  config,
  dataSource,
  editMode,
  onRemove,
  onEdit,
  onUpdateTitle,
}: RobotPositionWidgetProps) {
  const [position, setPosition] = useState<RobotPosition | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPosition = async () => {
      try {
        setIsLoading(true);
        // Mock data - replace with actual API call
        const mockPosition: RobotPosition = {
          x: 1250.5,
          y: 850.2,
          z: 420.8,
          theta: 45.5,
          timestamp: new Date().toISOString(),
        };

        setPosition(mockPosition);
        setError(null);
      } catch (err) {
        setError('Failed to fetch position data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPosition();
    const interval = setInterval(fetchPosition, 1000);
    return () => clearInterval(interval);
  }, [dataSource]);

  const PositionCard = ({ label, value, unit, icon: Icon }: {
    label: string;
    value: number;
    unit: string;
    icon: any;
  }) => (
    <div className="bg-secondary/30 rounded-lg p-3">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center">
          <Icon className="w-4 h-4 mr-2 text-primary" />
          <span className="text-xs font-medium text-muted-foreground">{label}</span>
        </div>
      </div>
      <div className="flex items-baseline">
        <span className="text-2xl font-bold">{value.toFixed(1)}</span>
        <span className="ml-1 text-sm text-muted-foreground">{unit}</span>
      </div>
    </div>
  );

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

        {!isLoading && !error && position && (
          <div className="space-y-3">
            {/* Title */}
            <div className="flex items-center">
              <Move className="w-5 h-5 mr-2 text-primary" />
              <h3 className="text-sm font-semibold">Robot Position</h3>
            </div>

            {/* Position Grid */}
            <div className="grid grid-cols-2 gap-3">
              <PositionCard
                label="X-Axis"
                value={position.x}
                unit="mm"
                icon={() => <div className="w-4 h-4 flex items-center justify-center font-bold text-primary">X</div>}
              />
              <PositionCard
                label="Y-Axis"
                value={position.y}
                unit="mm"
                icon={() => <div className="w-4 h-4 flex items-center justify-center font-bold text-primary">Y</div>}
              />
              <PositionCard
                label="Z-Axis"
                value={position.z}
                unit="mm"
                icon={() => <div className="w-4 h-4 flex items-center justify-center font-bold text-primary">Z</div>}
              />
              <PositionCard
                label="Rotation"
                value={position.theta}
                unit="°"
                icon={Navigation}
              />
            </div>

            {/* Visual indicator */}
            <div className="bg-secondary/20 rounded-lg p-3 mt-3">
              <div className="text-xs text-muted-foreground mb-2 text-center">Position Visualizer</div>
              <div className="relative h-32 bg-background rounded border">
                {/* Grid */}
                <div className="absolute inset-0 grid grid-cols-4 grid-rows-4 opacity-10">
                  {Array.from({ length: 16 }).map((_, i) => (
                    <div key={i} className="border border-foreground"></div>
                  ))}
                </div>

                {/* Robot position indicator */}
                <div
                  className="absolute w-3 h-3 bg-primary rounded-full transform -translate-x-1/2 -translate-y-1/2 shadow-lg"
                  style={{
                    left: `${Math.min(100, Math.max(0, (position.x / 2000) * 100))}%`,
                    top: `${Math.min(100, Math.max(0, 100 - (position.y / 1500) * 100))}%`,
                    transform: `translate(-50%, -50%) rotate(${position.theta}deg)`,
                  }}
                >
                  <div className="absolute top-0 left-1/2 w-0.5 h-2 bg-primary transform -translate-x-1/2 -translate-y-full"></div>
                </div>

                {/* Coordinates display */}
                <div className="absolute bottom-1 right-1 text-xs text-muted-foreground bg-background/80 px-2 py-1 rounded">
                  ({position.x.toFixed(0)}, {position.y.toFixed(0)})
                </div>
              </div>
            </div>

            {/* Last Update */}
            <div className="text-xs text-muted-foreground text-center mt-2">
              Updated: {position.timestamp ? new Date(position.timestamp).toLocaleTimeString() : 'N/A'}
            </div>
          </div>
        )}

        {!isLoading && !error && !position && (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            No position data available
          </div>
        )}
      </div>
    </BaseWidget>
  );
}
