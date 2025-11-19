import { useState, useEffect } from 'react';
import { Widget } from '@/types';
import { BaseWidget } from './BaseWidget';
import { AlertTriangle } from 'lucide-react';

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
  type: 'tank' | 'pump' | 'valve' | 'motor' | 'sensor';
  value: number; // 0-100 for level, 0/1 for on/off
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
  const [data, setData] = useState<ScadaData>({
    type: 'tank',
    value: 75,
    status: 'normal',
    label: 'Tank 1',
    unit: '%',
  });

  const [blink, setBlink] = useState(false);

  // Fetch data from dataSource
  useEffect(() => {
    // Mock data for demonstration
    // In real implementation, this would fetch from dataSource
    const mockData: ScadaData = {
      type: 'tank',
      value: Math.random() * 100,
      status: Math.random() > 0.7 ? 'alarm' : 'normal',
      label: config.title || 'Equipment',
      unit: '%',
      alarm:
        Math.random() > 0.7
          ? { active: true, message: 'High Level Warning!' }
          : undefined,
    };

    setData(mockData);
  }, [dataSource, config.title]);

  // Blinking animation for alarms
  useEffect(() => {
    if (data.status === 'alarm' || data.alarm?.active) {
      const interval = setInterval(() => {
        setBlink((prev) => !prev);
      }, 500); // Blink every 500ms

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

  const renderEquipment = () => {
    const statusColor = getStatusColor();
    const isActive = data.value > 0;

    switch (data.type) {
      case 'tank':
        return <TankIcon value={data.value} color={statusColor} blink={blink} />;

      case 'pump':
        return <PumpIcon active={isActive} color={statusColor} blink={blink} />;

      case 'valve':
        return <ValveIcon active={isActive} color={statusColor} blink={blink} />;

      case 'motor':
        return <MotorIcon active={isActive} color={statusColor} blink={blink} />;

      case 'sensor':
        return <SensorIcon value={data.value} color={statusColor} blink={blink} />;

      default:
        return null;
    }
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
      <div className="flex flex-col items-center justify-center h-full p-4">
        {/* Equipment SVG */}
        <div className="w-full max-w-[200px] mb-4">{renderEquipment()}</div>

        {/* Value Display */}
        <div className="text-center">
          <div className="text-3xl font-bold" style={{ color: getStatusColor() }}>
            {data.value.toFixed(1)}
            {data.unit && <span className="text-lg ml-1">{data.unit}</span>}
          </div>
          {data.label && (
            <div className="text-sm text-muted-foreground mt-1">{data.label}</div>
          )}
        </div>

        {/* Status Badge */}
        <div
          className="mt-3 px-3 py-1 rounded-full text-xs font-medium"
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
      </div>
    </BaseWidget>
  );
}

// ========== Equipment Icon Components ==========

interface IconProps {
  color: string;
  blink: boolean;
}

// Tank Icon with liquid level
function TankIcon({ value, color, blink }: IconProps & { value: number }) {
  const liquidHeight = (value / 100) * 100; // SVG height

  return (
    <svg viewBox="0 0 200 200" className="w-full">
      {/* Tank body */}
      <rect
        x="50"
        y="40"
        width="100"
        height="120"
        fill="none"
        stroke={color}
        strokeWidth="3"
        rx="5"
        opacity={blink ? 0.7 : 1}
        style={{ transition: 'opacity 0.3s ease' }}
      />

      {/* Liquid */}
      <rect
        x="50"
        y={160 - liquidHeight}
        width="100"
        height={liquidHeight}
        fill={color}
        opacity={blink ? 0.5 : 0.3}
        style={{ transition: 'height 1s ease, y 1s ease, opacity 0.3s ease' }}
      />

      {/* Level markers */}
      {[25, 50, 75].map((level) => (
        <line
          key={level}
          x1="50"
          x2="60"
          y1={160 - level}
          y2={160 - level}
          stroke={color}
          strokeWidth="1"
          opacity="0.5"
        />
      ))}

      {/* Bottom pipe */}
      <rect x="90" y="160" width="20" height="30" fill={color} opacity="0.5" />
    </svg>
  );
}

// Pump Icon with rotation animation
function PumpIcon({ active, color, blink }: IconProps & { active: boolean }) {
  return (
    <svg viewBox="0 0 200 200" className="w-full">
      {/* Pump body */}
      <circle
        cx="100"
        cy="100"
        r="40"
        fill="none"
        stroke={color}
        strokeWidth="3"
        opacity={blink ? 0.7 : 1}
        style={{ transition: 'opacity 0.3s ease' }}
      />

      {/* Impeller (rotating) */}
      <g
        transform="translate(100, 100)"
        style={{
          animation: active ? 'spin 2s linear infinite' : 'none',
        }}
      >
        {[0, 120, 240].map((angle) => (
          <line
            key={angle}
            x1="0"
            y1="0"
            x2="0"
            y2="-30"
            stroke={color}
            strokeWidth="3"
            strokeLinecap="round"
            transform={`rotate(${angle})`}
          />
        ))}
      </g>

      {/* Inlet pipe */}
      <rect x="20" y="90" width="40" height="20" fill={color} opacity="0.5" />

      {/* Outlet pipe */}
      <rect x="140" y="90" width="40" height="20" fill={color} opacity="0.5" />

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </svg>
  );
}

// Valve Icon with open/close animation
function ValveIcon({ active, color, blink }: IconProps & { active: boolean }) {
  return (
    <svg viewBox="0 0 200 200" className="w-full">
      {/* Pipe horizontal */}
      <rect x="20" y="90" width="160" height="20" fill={color} opacity="0.5" />

      {/* Valve body */}
      <rect
        x="80"
        y="70"
        width="40"
        height="60"
        fill="none"
        stroke={color}
        strokeWidth="3"
        opacity={blink ? 0.7 : 1}
        style={{ transition: 'opacity 0.3s ease' }}
      />

      {/* Valve disc (rotates when opening/closing) */}
      <ellipse
        cx="100"
        cy="100"
        rx={active ? '2' : '18'}
        ry="18"
        fill={color}
        opacity="0.7"
        style={{ transition: 'rx 0.5s ease' }}
      />

      {/* Handle */}
      <line
        x1="100"
        y1="70"
        x2="100"
        y2={active ? '40' : '50'}
        stroke={color}
        strokeWidth="3"
        strokeLinecap="round"
        style={{ transition: 'y2 0.5s ease' }}
      />
      <circle cx="100" cy={active ? '40' : '50'} r="5" fill={color} />
    </svg>
  );
}

// Motor Icon with rotation
function MotorIcon({ active, color, blink }: IconProps & { active: boolean }) {
  return (
    <svg viewBox="0 0 200 200" className="w-full">
      {/* Motor housing */}
      <rect
        x="60"
        y="70"
        width="80"
        height="60"
        fill="none"
        stroke={color}
        strokeWidth="3"
        rx="5"
        opacity={blink ? 0.7 : 1}
        style={{ transition: 'opacity 0.3s ease' }}
      />

      {/* Cooling fins */}
      {[75, 85, 95, 105, 115, 125].map((y) => (
        <line
          key={y}
          x1="60"
          x2="140"
          y1={y}
          y2={y}
          stroke={color}
          strokeWidth="1"
          opacity="0.3"
        />
      ))}

      {/* Shaft */}
      <rect x="140" y="95" width="30" height="10" fill={color} opacity="0.7" />

      {/* Rotation indicator */}
      <g
        transform="translate(155, 100)"
        style={{
          animation: active ? 'spin 1s linear infinite' : 'none',
        }}
      >
        <circle cx="0" cy="0" r="8" fill="none" stroke={color} strokeWidth="2" />
        <line x1="0" y1="0" x2="0" y2="-8" stroke={color} strokeWidth="2" />
      </g>

      {/* Terminal box */}
      <rect x="85" y="50" width="30" height="20" fill={color} opacity="0.3" />
    </svg>
  );
}

// Sensor Icon with pulse animation
function SensorIcon({ value, color, blink }: IconProps & { value: number }) {
  const intensity = value / 100;

  return (
    <svg viewBox="0 0 200 200" className="w-full">
      {/* Sensor body */}
      <rect
        x="80"
        y="60"
        width="40"
        height="80"
        fill="none"
        stroke={color}
        strokeWidth="3"
        rx="20"
        opacity={blink ? 0.7 : 1}
        style={{ transition: 'opacity 0.3s ease' }}
      />

      {/* Sensing element */}
      <circle
        cx="100"
        cy="100"
        r={12}
        fill={color}
        opacity={0.3 + intensity * 0.7}
        style={{
          animation: value > 80 ? 'pulse 1s ease-in-out infinite' : 'none',
        }}
      />

      {/* Signal waves */}
      {[1, 2, 3].map((i) => (
        <circle
          key={i}
          cx="100"
          cy="100"
          r={15 + i * 10}
          fill="none"
          stroke={color}
          strokeWidth="2"
          opacity={Math.max(0, intensity - i * 0.2)}
          style={{
            animation: value > 50 ? `ripple 2s ease-out infinite ${i * 0.3}s` : 'none',
          }}
        />
      ))}

      {/* Cable */}
      <line x1="100" y1="140" x2="100" y2="170" stroke={color} strokeWidth="2" />

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 1; }
        }
        @keyframes ripple {
          0% { r: 15; opacity: 0.6; }
          100% { r: 45; opacity: 0; }
        }
      `}</style>
    </svg>
  );
}
