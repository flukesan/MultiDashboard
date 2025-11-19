import { useEffect, useState } from 'react';
import { BaseWidget } from './BaseWidget';
import { Widget } from '@/types';
import { RobotStatus } from '@/types';
import { Activity, Circle, Clock, Cpu, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface RobotStatusWidgetProps {
  id: string;
  config: Widget['config'];
  dataSource?: any;
  editMode: boolean;
  onRemove: () => void;
  onEdit: () => void;
  onUpdateTitle: (title: string) => void;
}

export function RobotStatusWidget({
  id,
  config,
  dataSource,
  editMode,
  onRemove,
  onEdit,
  onUpdateTitle,
}: RobotStatusWidgetProps) {
  const [robotData, setRobotData] = useState<RobotStatus | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Simulate API call - replace with actual API integration
    const fetchRobotStatus = async () => {
      try {
        setIsLoading(true);
        // Mock data - replace with actual API call
        const mockData: RobotStatus = {
          id: 'robot-001',
          name: 'SRC-2000-I(S)',
          status: 'running',
          mode: 'auto',
          uptime: 86400, // 24 hours in seconds
          timestamp: new Date().toISOString(),
        };

        setRobotData(mockData);
        setError(null);
      } catch (err) {
        setError('Failed to fetch robot status');
      } finally {
        setIsLoading(false);
      }
    };

    fetchRobotStatus();

    // Refresh interval
    const interval = setInterval(fetchRobotStatus, 2000);
    return () => clearInterval(interval);
  }, [dataSource]);

  const getStatusColor = (status: RobotStatus['status']) => {
    const colors = {
      idle: 'text-gray-500',
      running: 'text-green-500',
      paused: 'text-yellow-500',
      error: 'text-red-500',
      emergency: 'text-red-700',
      offline: 'text-gray-400',
    };
    return colors[status] || 'text-gray-500';
  };

  const getStatusBgColor = (status: RobotStatus['status']) => {
    const colors = {
      idle: 'bg-gray-100',
      running: 'bg-green-100',
      paused: 'bg-yellow-100',
      error: 'bg-red-100',
      emergency: 'bg-red-200',
      offline: 'bg-gray-50',
    };
    return colors[status] || 'bg-gray-100';
  };

  const getStatusLabel = (status: RobotStatus['status']) => {
    const labels = {
      idle: 'Idle',
      running: 'Running',
      paused: 'Paused',
      error: 'Error',
      emergency: 'Emergency Stop',
      offline: 'Offline',
    };
    return labels[status] || 'Unknown';
  };

  const formatUptime = (seconds: number) => {
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const mins = Math.floor((seconds % 3600) / 60);

    if (days > 0) return `${days}d ${hours}h`;
    if (hours > 0) return `${hours}h ${mins}m`;
    return `${mins}m`;
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

        {!isLoading && !error && robotData && (
          <div className="space-y-4">
            {/* Robot Name & ID */}
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold">{robotData.name}</h3>
                <p className="text-sm text-muted-foreground">ID: {robotData.id}</p>
              </div>
              <Cpu className="w-8 h-8 text-primary" />
            </div>

            {/* Status Badge */}
            <div className="flex items-center space-x-3">
              <div className={cn(
                'flex items-center px-4 py-2 rounded-lg flex-1',
                getStatusBgColor(robotData.status)
              )}>
                <Circle className={cn('w-3 h-3 mr-2 fill-current', getStatusColor(robotData.status))} />
                <span className={cn('font-semibold', getStatusColor(robotData.status))}>
                  {getStatusLabel(robotData.status)}
                </span>
              </div>
            </div>

            {/* Mode & Uptime */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-secondary/30 rounded-lg p-3">
                <div className="flex items-center mb-1">
                  <Activity className="w-4 h-4 mr-2 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">Mode</span>
                </div>
                <p className="text-sm font-semibold uppercase">{robotData.mode}</p>
              </div>

              <div className="bg-secondary/30 rounded-lg p-3">
                <div className="flex items-center mb-1">
                  <Clock className="w-4 h-4 mr-2 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">Uptime</span>
                </div>
                <p className="text-sm font-semibold">
                  {robotData.uptime ? formatUptime(robotData.uptime) : 'N/A'}
                </p>
              </div>
            </div>

            {/* Status Indicator Animation */}
            {robotData.status === 'running' && (
              <div className="flex items-center justify-center space-x-1 text-green-500">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
              </div>
            )}

            {/* Last Update */}
            <div className="text-xs text-muted-foreground text-center">
              Last update: {robotData.timestamp ? new Date(robotData.timestamp).toLocaleTimeString() : 'N/A'}
            </div>
          </div>
        )}

        {!isLoading && !error && !robotData && (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            No robot data available
          </div>
        )}
      </div>
    </BaseWidget>
  );
}
