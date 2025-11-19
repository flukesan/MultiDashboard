import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Droplet, Fan, Radio, Settings } from 'lucide-react';

type EquipmentType = 'tank' | 'pump' | 'valve' | 'motor' | 'sensor';

interface ScadaConfigData {
  equipmentType: EquipmentType;
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
}

interface ScadaConfigProps {
  value: ScadaConfigData | null;
  onChange: (value: ScadaConfigData) => void;
}

const EQUIPMENT_TYPES = [
  { type: 'tank' as const, name: 'Tank', icon: Droplet, description: 'Liquid storage tank with level indicator' },
  { type: 'pump' as const, name: 'Pump', icon: Fan, description: 'Rotating pump with flow indicator' },
  { type: 'valve' as const, name: 'Valve', icon: Settings, description: 'Control valve with open/close status' },
  { type: 'motor' as const, name: 'Motor', icon: Settings, description: 'Electric motor with rotation indicator' },
  { type: 'sensor' as const, name: 'Sensor', icon: Radio, description: 'Measurement sensor with signal waves' },
];

export function ScadaConfig({ value, onChange }: ScadaConfigProps) {
  const currentConfig: ScadaConfigData = value || {
    equipmentType: 'tank',
    thresholds: { warning: 80, alarm: 90 },
    alarmConditions: { highLevel: 90, lowLevel: 10, enabled: true },
    unit: '%',
  };

  const handleEquipmentTypeChange = (type: EquipmentType) => {
    onChange({
      ...currentConfig,
      equipmentType: type,
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
      {/* Equipment Type Selector */}
      <div className="space-y-3">
        <Label className="text-sm font-semibold">Equipment Type</Label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {EQUIPMENT_TYPES.map(({ type, name, icon: Icon, description }) => (
            <Button
              key={type}
              variant={currentConfig.equipmentType === type ? 'default' : 'outline'}
              className="h-auto flex flex-col items-center gap-2 p-3"
              onClick={() => handleEquipmentTypeChange(type)}
            >
              <Icon className="h-6 w-6" />
              <div className="text-xs font-semibold">{name}</div>
              <div className="text-xs text-muted-foreground text-center line-clamp-2">
                {description}
              </div>
            </Button>
          ))}
        </div>
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
          placeholder="e.g., %, L, PSI, RPM"
          className="max-w-xs"
        />
        <p className="text-xs text-muted-foreground">
          The unit will be displayed next to the value (e.g., 75%)
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
