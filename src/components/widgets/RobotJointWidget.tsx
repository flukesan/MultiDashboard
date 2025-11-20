import { useEffect, useState } from 'react';
import { BaseWidget } from './BaseWidget';
import { Widget, JointStatus } from '@/types';
import { Cog, AlertTriangle } from 'lucide-react';

interface RobotJointWidgetProps {
  id: string;
  config: Widget['config'];
  dataSource?: any;
  editMode: boolean;
  onRemove: () => void;
  onEdit: () => void;
  onUpdateTitle: (title: string) => void;
}

export function RobotJointWidget({
  id,
  config,
  dataSource,
  editMode,
  onRemove,
  onEdit,
  onUpdateTitle,
}: RobotJointWidgetProps) {
  const [joints, setJoints] = useState<JointStatus | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchJoints = async () => {
      try {
        setIsLoading(true);
        // Mock data
        const mockJoints: JointStatus = {
          joint1: 45.2,
          joint2: -30.5,
          joint3: 90.0,
          joint4: 15.8,
          joint5: -45.3,
          joint6: 180.0,
          timestamp: new Date().toISOString(),
        };

        setJoints(mockJoints);
        setError(null);
      } catch (err) {
        setError('Failed to fetch joint data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchJoints();
    const interval = setInterval(fetchJoints, 1000);
    return () => clearInterval(interval);
  }, [dataSource]);

  const JointBar = ({ label, value, max = 180, min = -180 }: {
    label: string;
    value: number;
    max?: number;
    min?: number;
  }) => {
    const percentage = ((value - min) / (max - min)) * 100;
    const isWarning = Math.abs(value) > 150;

    return (
      <div className="space-y-1">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium">{label}</span>
          <span className={`text-xs font-bold ${isWarning ? 'text-yellow-600' : ''}`}>
            {value.toFixed(1)}°
          </span>
        </div>
        <div className="h-2 bg-secondary rounded-full overflow-hidden">
          <div
            className={`h-full transition-all ${isWarning ? 'bg-yellow-500' : 'bg-primary'}`}
            style={{ width: `${percentage}%` }}
          />
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

        {!isLoading && !error && joints && (
          <div className="space-y-3">
            <div className="flex items-center mb-2">
              <Cog className="w-5 h-5 mr-2 text-primary" />
              <h3 className="text-sm font-semibold">Joint Angles</h3>
            </div>

            <div className="space-y-3">
              <JointBar label="Joint 1" value={joints.joint1} />
              <JointBar label="Joint 2" value={joints.joint2} />
              <JointBar label="Joint 3" value={joints.joint3} />
              <JointBar label="Joint 4" value={joints.joint4} />
              <JointBar label="Joint 5" value={joints.joint5} />
              <JointBar label="Joint 6" value={joints.joint6} />
            </div>

            <div className="text-xs text-muted-foreground text-center mt-3">
              Range: -180° to +180°
            </div>

            <div className="text-xs text-muted-foreground text-center">
              Updated: {joints.timestamp ? new Date(joints.timestamp).toLocaleTimeString() : 'N/A'}
            </div>
          </div>
        )}

        {!isLoading && !error && !joints && (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            No joint data available
          </div>
        )}
      </div>
    </BaseWidget>
  );
}
