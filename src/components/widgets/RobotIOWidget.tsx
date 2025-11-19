import { useEffect, useState } from 'react';
import { BaseWidget } from './BaseWidget';
import { Widget, IOStatus } from '@/types';
import { ToggleLeft, ToggleRight, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface RobotIOWidgetProps {
  id: string;
  config: Widget['config'];
  dataSource?: any;
  editMode: boolean;
  onRemove: () => void;
  onEdit: () => void;
  onUpdateTitle: (title: string) => void;
}

export function RobotIOWidget({
  id,
  config,
  dataSource,
  editMode,
  onRemove,
  onEdit,
  onUpdateTitle,
}: RobotIOWidgetProps) {
  const [ioData, setIOData] = useState<IOStatus | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchIO = async () => {
      try {
        setIsLoading(true);
        // Mock data
        const mockIO: IOStatus = {
          inputs: [
            { id: 1, name: 'Emergency Stop', value: false, type: 'input' },
            { id: 2, name: 'Start Button', value: true, type: 'input' },
            { id: 3, name: 'Safety Door', value: true, type: 'input' },
            { id: 4, name: 'Sensor 1', value: false, type: 'input' },
            { id: 5, name: 'Sensor 2', value: true, type: 'input' },
            { id: 6, name: 'Sensor 3', value: false, type: 'input' },
          ],
          outputs: [
            { id: 1, name: 'Motor Power', value: true, type: 'output' },
            { id: 2, name: 'Brake Release', value: true, type: 'output' },
            { id: 3, name: 'Status LED', value: true, type: 'output' },
            { id: 4, name: 'Warning Light', value: false, type: 'output' },
            { id: 5, name: 'Valve 1', value: true, type: 'output' },
            { id: 6, name: 'Valve 2', value: false, type: 'output' },
          ],
          timestamp: new Date().toISOString(),
        };

        setIOData(mockIO);
        setError(null);
      } catch (err) {
        setError('Failed to fetch I/O data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchIO();
    const interval = setInterval(fetchIO, 500);
    return () => clearInterval(interval);
  }, [dataSource]);

  const IOSignal = ({ signal }: { signal: IOStatus['inputs'][0] }) => (
    <div className="flex items-center justify-between p-2 bg-secondary/20 rounded hover:bg-secondary/30 transition-colors">
      <div className="flex items-center space-x-2 flex-1">
        <div className={cn(
          'w-2 h-2 rounded-full',
          signal.value ? 'bg-green-500 animate-pulse' : 'bg-gray-400'
        )} />
        <span className="text-xs font-medium truncate">{signal.name}</span>
      </div>
      <div className="flex items-center space-x-2">
        <span className={cn(
          'text-xs font-bold',
          signal.value ? 'text-green-600' : 'text-gray-500'
        )}>
          {signal.value ? 'ON' : 'OFF'}
        </span>
        {signal.value ? (
          <ToggleRight className="w-4 h-4 text-green-600" />
        ) : (
          <ToggleLeft className="w-4 h-4 text-gray-400" />
        )}
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
      <div className="flex flex-col h-full p-4 overflow-hidden">
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

        {!isLoading && !error && ioData && (
          <div className="flex flex-col h-full space-y-3 overflow-hidden">
            {/* Digital Inputs */}
            <div className="flex-1 overflow-hidden">
              <h3 className="text-sm font-semibold mb-2 flex items-center">
                <div className="w-3 h-3 bg-blue-500 rounded mr-2"></div>
                Digital Inputs
              </h3>
              <div className="space-y-1 overflow-y-auto max-h-[200px] pr-1">
                {ioData.inputs.map((signal) => (
                  <IOSignal key={`input-${signal.id}`} signal={signal} />
                ))}
              </div>
            </div>

            {/* Digital Outputs */}
            <div className="flex-1 overflow-hidden">
              <h3 className="text-sm font-semibold mb-2 flex items-center">
                <div className="w-3 h-3 bg-orange-500 rounded mr-2"></div>
                Digital Outputs
              </h3>
              <div className="space-y-1 overflow-y-auto max-h-[200px] pr-1">
                {ioData.outputs.map((signal) => (
                  <IOSignal key={`output-${signal.id}`} signal={signal} />
                ))}
              </div>
            </div>

            {/* Summary */}
            <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t">
              <span>
                IN: {ioData.inputs.filter(i => i.value).length}/{ioData.inputs.length}
              </span>
              <span>
                OUT: {ioData.outputs.filter(o => o.value).length}/{ioData.outputs.length}
              </span>
              <span>
                {ioData.timestamp ? new Date(ioData.timestamp).toLocaleTimeString() : 'N/A'}
              </span>
            </div>
          </div>
        )}

        {!isLoading && !error && !ioData && (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            No I/O data available
          </div>
        )}
      </div>
    </BaseWidget>
  );
}
