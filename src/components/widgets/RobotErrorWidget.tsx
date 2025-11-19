import { useEffect, useState } from 'react';
import { BaseWidget } from './BaseWidget';
import { Widget, ErrorAlarm } from '@/types';
import { AlertCircle, AlertTriangle, Info, XCircle, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface RobotErrorWidgetProps {
  id: string;
  config: Widget['config'];
  dataSource?: any;
  editMode: boolean;
  onRemove: () => void;
  onEdit: () => void;
  onUpdateTitle: (title: string) => void;
}

export function RobotErrorWidget({
  id,
  config,
  dataSource,
  editMode,
  onRemove,
  onEdit,
  onUpdateTitle,
}: RobotErrorWidgetProps) {
  const [errors, setErrors] = useState<ErrorAlarm[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchErrors = async () => {
      try {
        setIsLoading(true);
        // Mock data
        const mockErrors: ErrorAlarm[] = [
          {
            code: 'E001',
            level: 'warning',
            message: 'Joint 3 temperature above normal',
            timestamp: new Date(Date.now() - 5000).toISOString(),
            acknowledged: false,
          },
          {
            code: 'W042',
            level: 'info',
            message: 'Scheduled maintenance due in 24 hours',
            timestamp: new Date(Date.now() - 60000).toISOString(),
            acknowledged: true,
          },
        ];

        setErrors(mockErrors);
        setError(null);
      } catch (err) {
        setError('Failed to fetch error data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchErrors();
    const interval = setInterval(fetchErrors, 2000);
    return () => clearInterval(interval);
  }, [dataSource]);

  const getIcon = (level: ErrorAlarm['level']) => {
    switch (level) {
      case 'critical':
        return XCircle;
      case 'error':
        return AlertCircle;
      case 'warning':
        return AlertTriangle;
      case 'info':
        return Info;
      default:
        return Info;
    }
  };

  const getColor = (level: ErrorAlarm['level']) => {
    switch (level) {
      case 'critical':
        return 'text-red-700 bg-red-100';
      case 'error':
        return 'text-red-600 bg-red-50';
      case 'warning':
        return 'text-yellow-600 bg-yellow-50';
      case 'info':
        return 'text-blue-600 bg-blue-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const ErrorItem = ({ alarm }: { alarm: ErrorAlarm }) => {
    const Icon = getIcon(alarm.level);
    const colorClass = getColor(alarm.level);

    return (
      <div className={cn(
        'p-3 rounded-lg border transition-all',
        colorClass,
        alarm.acknowledged && 'opacity-60'
      )}>
        <div className="flex items-start space-x-2">
          <Icon className="w-4 h-4 mt-0.5 flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-bold">{alarm.code}</span>
              <span className="text-xs uppercase">{alarm.level}</span>
            </div>
            <p className="text-xs font-medium break-words">{alarm.message}</p>
            <div className="flex items-center justify-between mt-2">
              <span className="text-xs opacity-75">
                {new Date(alarm.timestamp).toLocaleTimeString()}
              </span>
              {alarm.acknowledged && (
                <span className="text-xs flex items-center">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  ACK
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const activeErrors = errors.filter(e => !e.acknowledged);
  const criticalCount = errors.filter(e => e.level === 'critical' && !e.acknowledged).length;
  const errorCount = errors.filter(e => e.level === 'error' && !e.acknowledged).length;
  const warningCount = errors.filter(e => e.level === 'warning' && !e.acknowledged).length;

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

        {!isLoading && !error && (
          <div className="flex flex-col h-full space-y-3">
            {/* Header with status summary */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <AlertCircle className="w-5 h-5 mr-2 text-primary" />
                <h3 className="text-sm font-semibold">Errors & Alarms</h3>
              </div>
              {activeErrors.length > 0 && (
                <div className="text-xs font-bold text-red-600 bg-red-100 px-2 py-1 rounded">
                  {activeErrors.length} Active
                </div>
              )}
            </div>

            {/* Status counts */}
            <div className="grid grid-cols-3 gap-2">
              <div className="bg-red-50 rounded p-2 text-center">
                <div className="text-lg font-bold text-red-700">{criticalCount + errorCount}</div>
                <div className="text-xs text-red-600">Errors</div>
              </div>
              <div className="bg-yellow-50 rounded p-2 text-center">
                <div className="text-lg font-bold text-yellow-700">{warningCount}</div>
                <div className="text-xs text-yellow-600">Warnings</div>
              </div>
              <div className="bg-green-50 rounded p-2 text-center">
                <div className="text-lg font-bold text-green-700">{errors.length - activeErrors.length}</div>
                <div className="text-xs text-green-600">Cleared</div>
              </div>
            </div>

            {/* Error list */}
            <div className="flex-1 overflow-y-auto space-y-2 pr-1">
              {errors.length > 0 ? (
                errors.map((alarm, index) => (
                  <ErrorItem key={`${alarm.code}-${index}`} alarm={alarm} />
                ))
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                  <CheckCircle className="w-12 h-12 mb-2 text-green-500" />
                  <p className="text-sm">No errors or alarms</p>
                  <p className="text-xs">System operating normally</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </BaseWidget>
  );
}
