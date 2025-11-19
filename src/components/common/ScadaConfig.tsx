import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import {
  Droplet, Fan, Radio, Settings, Minus, Zap, Circle,
  Gauge, Thermometer, Wind, Filter, Box
} from 'lucide-react';

type EquipmentType =
  | 'tank' | 'pump' | 'valve' | 'motor' | 'sensor'
  | 'pipe-horizontal' | 'pipe-vertical' | 'pipe-elbow' | 'pipe-t-junction' | 'pipe-cross'
  | 'valve-gate' | 'valve-ball' | 'valve-check' | 'valve-butterfly'
  | 'button' | 'switch' | 'indicator' | 'led'
  | 'flow-meter' | 'pressure-gauge' | 'temperature-sensor'
  | 'compressor' | 'heat-exchanger' | 'filter';

interface ScadaConfigData {
  equipmentType: EquipmentType;
  size?: 'small' | 'medium' | 'large' | 'xlarge';
  rotation?: 0 | 90 | 180 | 270;
  thresholds?: {
    warning?: number;
    alarm?: number;
  };
  alarmConditions?: {
    highLevel?: number;
    lowLevel?: number;
    enabled: boolean;
  };
  unit?: string;
  label?: string;
}

interface ScadaConfigProps {
  value: ScadaConfigData | null;
  onChange: (value: ScadaConfigData) => void;
}

const EQUIPMENT_TYPES = [
  // Containers & Vessels
  { type: 'tank' as const, name: 'Tank', icon: Droplet, category: 'Vessels', description: 'Storage tank' },

  // Rotating Equipment
  { type: 'pump' as const, name: 'Pump', icon: Fan, category: 'Rotating', description: 'Centrifugal pump' },
  { type: 'motor' as const, name: 'Motor', icon: Zap, category: 'Rotating', description: 'Electric motor' },
  { type: 'compressor' as const, name: 'Compressor', icon: Wind, category: 'Rotating', description: 'Gas compressor' },

  // Pipes & Fittings
  { type: 'pipe-horizontal' as const, name: 'Pipe H', icon: Minus, category: 'Piping', description: 'Horizontal pipe' },
  { type: 'pipe-vertical' as const, name: 'Pipe V', icon: Minus, category: 'Piping', description: 'Vertical pipe' },
  { type: 'pipe-elbow' as const, name: 'Elbow', icon: Settings, category: 'Piping', description: '90° elbow' },
  { type: 'pipe-t-junction' as const, name: 'T-Junction', icon: Settings, category: 'Piping', description: 'T-junction' },
  { type: 'pipe-cross' as const, name: 'Cross', icon: Settings, category: 'Piping', description: 'Cross junction' },

  // Valves
  { type: 'valve' as const, name: 'Valve', icon: Settings, category: 'Valves', description: 'Standard valve' },
  { type: 'valve-gate' as const, name: 'Gate Valve', icon: Settings, category: 'Valves', description: 'Gate valve' },
  { type: 'valve-ball' as const, name: 'Ball Valve', icon: Circle, category: 'Valves', description: 'Ball valve' },
  { type: 'valve-check' as const, name: 'Check Valve', icon: Settings, category: 'Valves', description: 'Check valve' },
  { type: 'valve-butterfly' as const, name: 'Butterfly', icon: Settings, category: 'Valves', description: 'Butterfly valve' },

  // Instrumentation
  { type: 'sensor' as const, name: 'Sensor', icon: Radio, category: 'Instruments', description: 'Generic sensor' },
  { type: 'flow-meter' as const, name: 'Flow Meter', icon: Gauge, category: 'Instruments', description: 'Flow meter' },
  { type: 'pressure-gauge' as const, name: 'Pressure', icon: Gauge, category: 'Instruments', description: 'Pressure gauge' },
  { type: 'temperature-sensor' as const, name: 'Temperature', icon: Thermometer, category: 'Instruments', description: 'Temperature sensor' },

  // Controls
  { type: 'button' as const, name: 'Button', icon: Circle, category: 'Controls', description: 'Push button' },
  { type: 'switch' as const, name: 'Switch', icon: Settings, category: 'Controls', description: 'Toggle switch' },
  { type: 'indicator' as const, name: 'Indicator', icon: Circle, category: 'Controls', description: 'Status indicator' },
  { type: 'led' as const, name: 'LED', icon: Circle, category: 'Controls', description: 'LED indicator' },

  // Process Equipment
  { type: 'heat-exchanger' as const, name: 'Heat Exch.', icon: Box, category: 'Process', description: 'Heat exchanger' },
  { type: 'filter' as const, name: 'Filter', icon: Filter, category: 'Process', description: 'Filter' },
];

// Group by category
const categories = Array.from(new Set(EQUIPMENT_TYPES.map(e => e.category)));

export function ScadaConfig({ value, onChange }: ScadaConfigProps) {
  const currentConfig: ScadaConfigData = value || {
    equipmentType: 'tank',
    size: 'medium',
    rotation: 0,
    thresholds: { warning: 80, alarm: 90 },
    alarmConditions: { highLevel: 90, lowLevel: 10, enabled: true },
    unit: '%',
    label: '',
  };

  const handleEquipmentTypeChange = (type: EquipmentType) => {
    onChange({
      ...currentConfig,
      equipmentType: type,
    });
  };

  const handleSizeChange = (size: 'small' | 'medium' | 'large' | 'xlarge') => {
    onChange({
      ...currentConfig,
      size,
    });
  };

  const handleRotationChange = (rotation: 0 | 90 | 180 | 270) => {
    onChange({
      ...currentConfig,
      rotation,
    });
  };

  const handleLabelChange = (label: string) => {
    onChange({
      ...currentConfig,
      label,
    });
  };

  const handleThresholdChange = (key: 'warning' | 'alarm', value: number) => {
    onChange({
      ...currentConfig,
      thresholds: {
        ...currentConfig.thresholds,
        [key]: value,
      },
    });
  };

  const handleAlarmConditionChange = (key: 'highLevel' | 'lowLevel' | 'enabled', value: number | boolean) => {
    onChange({
      ...currentConfig,
      alarmConditions: {
        highLevel: currentConfig.alarmConditions?.highLevel || 90,
        lowLevel: currentConfig.alarmConditions?.lowLevel || 10,
        enabled: currentConfig.alarmConditions?.enabled ?? true,
        [key]: value,
      },
    });
  };

  const handleUnitChange = (unit: string) => {
    onChange({
      ...currentConfig,
      unit,
    });
  };

  return (
    <div className="space-y-6">
      {/* Equipment Type Selector - Organized by Category */}
      <div className="space-y-4">
        <Label className="text-sm font-semibold">Equipment Type</Label>

        {categories.map((category) => (
          <div key={category} className="space-y-2">
            <h4 className="text-xs font-medium text-muted-foreground">{category}</h4>
            <div className="grid grid-cols-3 md:grid-cols-4 gap-2">
              {EQUIPMENT_TYPES.filter(e => e.category === category).map(({ type, name, icon: Icon, description }) => (
                <Button
                  key={type}
                  variant={currentConfig.equipmentType === type ? 'default' : 'outline'}
                  className="h-auto flex flex-col items-center gap-1 p-2"
                  onClick={() => handleEquipmentTypeChange(type)}
                  title={description}
                >
                  <Icon className="h-4 w-4" />
                  <div className="text-xs font-semibold">{name}</div>
                </Button>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Label */}
      <div className="space-y-2">
        <Label htmlFor="label" className="text-sm font-semibold">
          Equipment Label
        </Label>
        <Input
          id="label"
          type="text"
          value={currentConfig.label || ''}
          onChange={(e) => handleLabelChange(e.target.value)}
          placeholder="e.g., P-101, Tank A, HX-201"
          className="max-w-xs"
        />
        <p className="text-xs text-muted-foreground">
          Equipment tag or identifier
        </p>
      </div>

      {/* Size Control */}
      <div className="space-y-3">
        <Label className="text-sm font-semibold">Icon Size</Label>
        <div className="grid grid-cols-4 gap-2">
          {(['small', 'medium', 'large', 'xlarge'] as const).map((size) => (
            <Button
              key={size}
              variant={currentConfig.size === size ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleSizeChange(size)}
              className="capitalize"
            >
              {size}
            </Button>
          ))}
        </div>
      </div>

      {/* Rotation Control */}
      <div className="space-y-3">
        <Label className="text-sm font-semibold">Rotation</Label>
        <div className="grid grid-cols-4 gap-2">
          {([0, 90, 180, 270] as const).map((rotation) => (
            <Button
              key={rotation}
              variant={currentConfig.rotation === rotation ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleRotationChange(rotation)}
            >
              {rotation}°
            </Button>
          ))}
        </div>
        <p className="text-xs text-muted-foreground">
          Rotate equipment icon for proper alignment
        </p>
      </div>

      {/* Measurement Unit */}
      <div className="space-y-2">
        <Label htmlFor="unit" className="text-sm font-semibold">
          Measurement Unit
        </Label>
        <Input
          id="unit"
          type="text"
          value={currentConfig.unit || ''}
          onChange={(e) => handleUnitChange(e.target.value)}
          placeholder="e.g., %, L, PSI, RPM, °C"
          className="max-w-xs"
        />
        <p className="text-xs text-muted-foreground">
          The unit will be displayed next to the value
        </p>
      </div>

      {/* Thresholds */}
      <div className="space-y-3">
        <Label className="text-sm font-semibold">Status Thresholds</Label>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="warning-threshold" className="text-xs text-yellow-600 dark:text-yellow-400">
              Warning Level
            </Label>
            <Input
              id="warning-threshold"
              type="number"
              value={currentConfig.thresholds?.warning || 80}
              onChange={(e) => handleThresholdChange('warning', Number(e.target.value))}
              placeholder="80"
              min="0"
              max="100"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="alarm-threshold" className="text-xs text-red-600 dark:text-red-400">
              Alarm Level
            </Label>
            <Input
              id="alarm-threshold"
              type="number"
              value={currentConfig.thresholds?.alarm || 90}
              onChange={(e) => handleThresholdChange('alarm', Number(e.target.value))}
              placeholder="90"
              min="0"
              max="100"
            />
          </div>
        </div>
        <p className="text-xs text-muted-foreground">
          Values above warning threshold show yellow status, above alarm threshold show red status
        </p>
      </div>

      {/* Alarm Conditions */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label className="text-sm font-semibold">Alarm Conditions</Label>
          <Button
            variant={currentConfig.alarmConditions?.enabled ? 'default' : 'outline'}
            size="sm"
            onClick={() =>
              handleAlarmConditionChange('enabled', !currentConfig.alarmConditions?.enabled)
            }
          >
            {currentConfig.alarmConditions?.enabled ? 'Enabled' : 'Disabled'}
          </Button>
        </div>

        {currentConfig.alarmConditions?.enabled && (
          <div className="border rounded-lg p-4 space-y-3 bg-muted/30">
            <div className="space-y-2">
              <Label htmlFor="high-level" className="text-xs">
                High Level Alarm (trigger above)
              </Label>
              <Input
                id="high-level"
                type="number"
                value={currentConfig.alarmConditions?.highLevel || 90}
                onChange={(e) => handleAlarmConditionChange('highLevel', Number(e.target.value))}
                placeholder="90"
                min="0"
                max="100"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="low-level" className="text-xs">
                Low Level Alarm (trigger below)
              </Label>
              <Input
                id="low-level"
                type="number"
                value={currentConfig.alarmConditions?.lowLevel || 10}
                onChange={(e) => handleAlarmConditionChange('lowLevel', Number(e.target.value))}
                placeholder="10"
                min="0"
                max="100"
              />
            </div>

            <p className="text-xs text-muted-foreground">
              Alarms will trigger when values exceed high level or fall below low level
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
