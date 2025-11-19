import { useState, useEffect } from 'react';
import { Widget, ScadaEquipmentType } from '@/types';
import { BaseWidget } from './BaseWidget';
import { AlertTriangle } from 'lucide-react';
import * as Icons from './scada-icons';

interface ScadaWidgetProps {
  id: string;
  config: Widget['config'];
  dataSource?: Widget['dataSource'];
  editMode: boolean;
  onRemove?: () => void;
  onEdit?: () => void;
  onUpdateTitle?: (title: string) => void;
}

interface ScadaData {
  equipmentType: ScadaEquipmentType;
  value: number; // 0-100 for level, 0/1 for on/off
  active?: boolean; // for boolean equipment
  status: 'normal' | 'warning' | 'alarm' | 'offline';
  label?: string;
  unit?: string;
  alarm?: {
    active: boolean;
    message: string;
  };
}

export function ScadaWidget({
  id,
  config,
  dataSource,
  editMode,
  onRemove,
  onEdit,
  onUpdateTitle,
}: ScadaWidgetProps) {
  const scadaConfig = (config as any).scadaConfig || {};
  const equipmentType = scadaConfig.equipmentType || 'tank';
  const size = scadaConfig.size || 'medium';
  const rotation = scadaConfig.rotation || 0;
  const unit = scadaConfig.unit || '%';
  const label = scadaConfig.label || config.title || 'Equipment';

  const [data, setData] = useState<ScadaData>({
    equipmentType,
    value: 75,
    active: true,
    status: 'normal',
    label,
    unit,
  });

  const [blink, setBlink] = useState(false);

  // Fetch data from dataSource or use mock data
  useEffect(() => {
    if (dataSource) {
      // Real implementation would fetch from dataSource
      // For now, use mock data
    }

    // Mock data for demonstration
    const mockData: ScadaData = {
      equipmentType,
      value: 50 + Math.random() * 40,
      active: Math.random() > 0.3,
      status: Math.random() > 0.8 ? 'alarm' : Math.random() > 0.6 ? 'warning' : 'normal',
      label,
      unit,
    };

    setData(mockData);
  }, [dataSource, equipmentType, label, unit]);

  // Blinking animation for alarms
  useEffect(() => {
    if (data.status === 'alarm' || data.alarm?.active) {
      const interval = setInterval(() => {
        setBlink((prev) => !prev);
      }, 500);

      return () => clearInterval(interval);
    } else {
      setBlink(false);
    }
  }, [data.status, data.alarm]);

  const getStatusColor = () => {
    switch (data.status) {
      case 'alarm':
        return '#ef4444'; // red
      case 'warning':
        return '#f59e0b'; // yellow
      case 'offline':
        return '#6b7280'; // gray
      default:
        return '#10b981'; // green
    }
  };

  const getSizeClass = () => {
    const sizeMap: Record<'small' | 'medium' | 'large' | 'xlarge', string> = {
      small: 'max-w-[150px]',
      medium: 'max-w-[250px]',
      large: 'max-w-[350px]',
      xlarge: 'max-w-[450px]',
    };
    return sizeMap[size as keyof typeof sizeMap] || sizeMap.medium;
  };

  const renderEquipment = () => {
    const statusColor = getStatusColor();
    const isActive = data.active ?? data.value > 50;
    const iconProps = {
      color: statusColor,
      blink,
      rotation,
    };

    // Map equipment type to icon component
    const iconMap: Record<string, any> = {
      // Vessels & Tanks (use value for level)
      'tank': () => <Icons.TankIcon {...iconProps} value={data.value} />,

      // Rotating Equipment (use active state)
      'pump': () => <Icons.PumpIcon {...iconProps} active={isActive} />,
      'motor': () => <Icons.MotorIcon {...iconProps} active={isActive} />,
      'compressor': () => <Icons.CompressorIcon {...iconProps} active={isActive} />,

      // Pipes & Fittings
      'pipe-horizontal': () => <Icons.PipeHorizontalIcon {...iconProps} />,
      'pipe-vertical': () => <Icons.PipeVerticalIcon {...iconProps} />,
      'pipe-elbow': () => <Icons.PipeElbowIcon {...iconProps} />,
      'pipe-t-junction': () => <Icons.PipeTJunctionIcon {...iconProps} />,
      'pipe-cross': () => <Icons.PipeCrossIcon {...iconProps} />,

      // Valves (use active for open/close state)
      'valve': () => <Icons.ValveIcon {...iconProps} active={isActive} />,
      'valve-gate': () => <Icons.ValveGateIcon {...iconProps} active={isActive} />,
      'valve-ball': () => <Icons.ValveBallIcon {...iconProps} active={isActive} />,
      'valve-check': () => <Icons.ValveCheckIcon {...iconProps} />,
      'valve-butterfly': () => <Icons.ValveButterflyIcon {...iconProps} active={isActive} />,

      // Controls
      'button': () => <Icons.ButtonIcon {...iconProps} active={isActive} />,
      'switch': () => <Icons.SwitchIcon {...iconProps} active={isActive} />,
      'indicator': () => <Icons.IndicatorIcon {...iconProps} active={isActive} />,
      'led': () => <Icons.LEDIcon {...iconProps} active={isActive} />,

      // Instruments (use value for readings)
      'sensor': () => <Icons.SensorIcon {...iconProps} value={data.value} />,
      'flow-meter': () => <Icons.FlowMeterIcon {...iconProps} value={data.value} />,
      'pressure-gauge': () => <Icons.PressureGaugeIcon {...iconProps} value={data.value} />,
      'temperature-sensor': () => <Icons.TemperatureSensorIcon {...iconProps} value={data.value} />,

      // Process Equipment
      'heat-exchanger': () => <Icons.HeatExchangerIcon {...iconProps} />,
      'filter': () => <Icons.FilterIcon {...iconProps} />,
    };

    const IconComponent = iconMap[equipmentType];
    return IconComponent ? IconComponent() : (
      <div className="text-muted-foreground text-sm">Unknown equipment type: {equipmentType}</div>
    );
  };

  // Check if equipment shows numeric value
  const showsValue = () => {
    const valueTypes = ['tank', 'sensor', 'flow-meter', 'pressure-gauge', 'temperature-sensor'];
    return valueTypes.includes(equipmentType);
  };

  // Check if equipment shows active state
  const showsActiveState = () => {
    const activeTypes = ['pump', 'motor', 'compressor', 'valve', 'valve-gate', 'valve-ball',
                         'valve-butterfly', 'button', 'switch', 'indicator', 'led'];
    return activeTypes.includes(equipmentType);
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
      <div className="flex flex-col items-center justify-center h-full p-4 w-full">
        {/* Equipment SVG - full width with size control */}
        <div className={`w-full ${getSizeClass()} mx-auto mb-4`}>
          {renderEquipment()}
        </div>

        {/* Equipment Label */}
        {label && (
          <div className="text-lg font-semibold text-center mb-2" style={{ color: getStatusColor() }}>
            {label}
          </div>
        )}

        {/* Value Display - only for equipment with numeric values */}
        {showsValue() && (
          <div className="text-center mb-2">
            <div className="text-3xl font-bold" style={{ color: getStatusColor() }}>
              {data.value.toFixed(1)}
              {unit && <span className="text-lg ml-1">{unit}</span>}
            </div>
          </div>
        )}

        {/* Active State Display - only for equipment with on/off states */}
        {showsActiveState() && (
          <div className="text-center mb-2">
            <div
              className="inline-block px-4 py-1 rounded-full text-sm font-medium"
              style={{
                backgroundColor: `${getStatusColor()}20`,
                color: getStatusColor(),
              }}
            >
              {data.active ? 'ACTIVE' : 'INACTIVE'}
            </div>
          </div>
        )}

        {/* Status Badge */}
        <div
          className="px-3 py-1 rounded-full text-xs font-medium"
          style={{
            backgroundColor: `${getStatusColor()}20`,
            color: getStatusColor(),
          }}
        >
          {data.status.toUpperCase()}
        </div>

        {/* Alarm Alert */}
        {data.alarm?.active && (
          <div
            className={`mt-3 flex items-center gap-2 px-3 py-2 rounded-lg bg-red-500/10 border border-red-500/30 ${
              blink ? 'opacity-100' : 'opacity-60'
            }`}
            style={{ transition: 'opacity 0.3s ease' }}
          >
            <AlertTriangle className="h-4 w-4 text-red-500" />
            <span className="text-xs text-red-500 font-medium">{data.alarm.message}</span>
          </div>
        )}

        {/* Help text in edit mode */}
        {editMode && (
          <div className="mt-4 text-xs text-muted-foreground text-center max-w-xs">
            Click settings to change equipment type, size, and rotation
          </div>
        )}
      </div>
    </BaseWidget>
  );
}
