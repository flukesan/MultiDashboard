// SCADA Icon Components Library
// This file contains all equipment SVG icons for SCADA visualization

export interface IconProps {
  color: string;
  blink: boolean;
  size?: 'small' | 'medium' | 'large' | 'xlarge';
  rotation?: number;
}

// ===== PIPES & FITTINGS =====

export function PipeHorizontalIcon({ color, blink, rotation = 0 }: IconProps) {
  return (
    <svg viewBox="0 0 200 200" className="w-full" style={{ transform: `rotate(${rotation}deg)` }}>
      <rect
        x="0" y="80" width="200" height="40"
        fill={color}
        opacity={blink ? 0.6 : 0.9}
        style={{ transition: 'opacity 0.3s ease' }}
      />
      <rect x="0" y="80" width="200" height="5" fill="#000" opacity="0.2" />
      <rect x="0" y="115" width="200" height="5" fill="#fff" opacity="0.2" />
    </svg>
  );
}

export function PipeVerticalIcon({ color, blink, rotation = 0 }: IconProps) {
  return (
    <svg viewBox="0 0 200 200" className="w-full" style={{ transform: `rotate(${rotation}deg)` }}>
      <rect
        x="80" y="0" width="40" height="200"
        fill={color}
        opacity={blink ? 0.6 : 0.9}
        style={{ transition: 'opacity 0.3s ease' }}
      />
      <rect x="80" y="0" width="5" height="200" fill="#000" opacity="0.2" />
      <rect x="115" y="0" width="5" height="200" fill="#fff" opacity="0.2" />
    </svg>
  );
}

export function PipeElbowIcon({ color, blink, rotation = 0 }: IconProps) {
  return (
    <svg viewBox="0 0 200 200" className="w-full" style={{ transform: `rotate(${rotation}deg)` }}>
      <path
        d="M 80,200 L 80,120 Q 80,80 120,80 L 200,80 L 200,120 L 120,120 Q 120,120 120,120 L 120,200 Z"
        fill={color}
        opacity={blink ? 0.6 : 0.9}
      />
    </svg>
  );
}

export function PipeTJunctionIcon({ color, blink, rotation = 0 }: IconProps) {
  return (
    <svg viewBox="0 0 200 200" className="w-full" style={{ transform: `rotate(${rotation}deg)` }}>
      {/* Horizontal pipe */}
      <rect x="0" y="80" width="200" height="40" fill={color} opacity={blink ? 0.6 : 0.9} />
      {/* Vertical pipe */}
      <rect x="80" y="0" width="40" height="120" fill={color} opacity={blink ? 0.6 : 0.9} />
    </svg>
  );
}

export function PipeCrossIcon({ color, blink, rotation = 0 }: IconProps) {
  return (
    <svg viewBox="0 0 200 200" className="w-full" style={{ transform: `rotate(${rotation}deg)` }}>
      {/* Horizontal pipe */}
      <rect x="0" y="80" width="200" height="40" fill={color} opacity={blink ? 0.6 : 0.9} />
      {/* Vertical pipe */}
      <rect x="80" y="0" width="40" height="200" fill={color} opacity={blink ? 0.6 : 0.9} />
    </svg>
  );
}

// ===== VALVES =====

export function ValveGateIcon({ active, color, blink, rotation = 0 }: IconProps & { active: boolean }) {
  return (
    <svg viewBox="0 0 200 200" className="w-full" style={{ transform: `rotate(${rotation}deg)` }}>
      {/* Pipe */}
      <rect x="0" y="90" width="200" height="20" fill={color} opacity="0.5" />
      {/* Body */}
      <rect x="70" y="60" width="60" height="80" fill="none" stroke={color} strokeWidth="3" opacity={blink ? 0.7 : 1} />
      {/* Gate */}
      <rect x="80" y={active ? 120 : 70} width="40" height="10" fill={color} style={{ transition: 'y 0.5s ease' }} />
      {/* Handle */}
      <rect x="95" y="40" width="10" height="30" fill={color} />
      <circle cx="100" cy="35" r="8" fill={color} />
    </svg>
  );
}

export function ValveBallIcon({ active, color, blink, rotation = 0 }: IconProps & { active: boolean }) {
  return (
    <svg viewBox="0 0 200 200" className="w-full" style={{ transform: `rotate(${rotation}deg)` }}>
      {/* Pipe */}
      <rect x="0" y="90" width="200" height="20" fill={color} opacity="0.5" />
      {/* Body */}
      <circle cx="100" cy="100" r="35" fill="none" stroke={color} strokeWidth="3" opacity={blink ? 0.7 : 1} />
      {/* Ball */}
      <circle cx="100" cy="100" r="20" fill={color} opacity="0.3" />
      {/* Flow indicator */}
      <rect
        x="90" y="80" width="20" height="40"
        fill={color}
        opacity={active ? 0.8 : 0.2}
        transform={`rotate(${active ? 0 : 90}, 100, 100)`}
        style={{ transition: 'transform 0.3s ease, opacity 0.3s ease' }}
      />
    </svg>
  );
}

export function ValveCheckIcon({ color, blink, rotation = 0 }: IconProps) {
  return (
    <svg viewBox="0 0 200 200" className="w-full" style={{ transform: `rotate(${rotation}deg)` }}>
      {/* Pipe */}
      <rect x="0" y="90" width="200" height="20" fill={color} opacity="0.5" />
      {/* Body */}
      <path d="M 70,70 L 100,100 L 70,130 Z" fill="none" stroke={color} strokeWidth="3" opacity={blink ? 0.7 : 1} />
      <path d="M 130,70 L 100,100 L 130,130 Z" fill="none" stroke={color} strokeWidth="3" opacity={blink ? 0.7 : 1} />
      {/* Disc */}
      <circle cx="100" cy="100" r="15" fill={color} opacity="0.5" />
    </svg>
  );
}

export function ValveButterflyIcon({ active, color, blink, rotation = 0 }: IconProps & { active: boolean }) {
  return (
    <svg viewBox="0 0 200 200" className="w-full" style={{ transform: `rotate(${rotation}deg)` }}>
      {/* Pipe */}
      <rect x="0" y="85" width="200" height="30" fill={color} opacity="0.5" />
      {/* Body circle */}
      <circle cx="100" cy="100" r="40" fill="none" stroke={color} strokeWidth="3" opacity={blink ? 0.7 : 1} />
      {/* Disc */}
      <ellipse
        cx="100" cy="100"
        rx={active ? "5" : "35"} ry="35"
        fill={color}
        opacity="0.6"
        style={{ transition: 'rx 0.4s ease' }}
      />
    </svg>
  );
}

// ===== CONTROLS =====

export function ButtonIcon({ active, color, blink, rotation = 0 }: IconProps & { active: boolean }) {
  return (
    <svg viewBox="0 0 200 200" className="w-full" style={{ transform: `rotate(${rotation}deg)` }}>
      {/* Button body */}
      <rect x="50" y="60" width="100" height="80" rx="10" fill="none" stroke={color} strokeWidth="3" opacity={blink ? 0.7 : 1} />
      {/* Button cap */}
      <rect
        x="70" y={active ? "90" : "70"}
        width="60" height="30"
        rx="5"
        fill={color}
        opacity={active ? 1 : 0.5}
        style={{ transition: 'y 0.2s ease, opacity 0.2s ease' }}
      />
    </svg>
  );
}

export function SwitchIcon({ active, color, blink, rotation = 0 }: IconProps & { active: boolean }) {
  return (
    <svg viewBox="0 0 200 200" className="w-full" style={{ transform: `rotate(${rotation}deg)` }}>
      {/* Switch base */}
      <rect x="60" y="110" width="80" height="40" rx="20" fill={color} opacity="0.3" />
      {/* Switch toggle */}
      <circle
        cx={active ? "120" : "80"}
        cy="130"
        r="18"
        fill={color}
        opacity={blink ? 0.7 : 1}
        style={{ transition: 'cx 0.3s ease' }}
      />
      {/* Label */}
      <text x="100" y="90" textAnchor="middle" fill={color} fontSize="20">{active ? 'ON' : 'OFF'}</text>
    </svg>
  );
}

export function IndicatorIcon({ active, color, blink, rotation = 0 }: IconProps & { active: boolean }) {
  return (
    <svg viewBox="0 0 200 200" className="w-full" style={{ transform: `rotate(${rotation}deg)` }}>
      {/* Indicator body */}
      <circle cx="100" cy="100" r="40" fill="none" stroke={color} strokeWidth="3" opacity={blink ? 0.7 : 1} />
      {/* Light */}
      <circle
        cx="100" cy="100" r="30"
        fill={color}
        opacity={active ? (blink ? 0.9 : 0.6) : 0.1}
        style={{ transition: 'opacity 0.3s ease' }}
      />
      {/* Shine effect when active */}
      {active && (
        <circle cx="85" cy="85" r="10" fill="#fff" opacity="0.6" />
      )}
    </svg>
  );
}

export function LEDIcon({ active, color, blink, rotation = 0 }: IconProps & { active: boolean }) {
  return (
    <svg viewBox="0 0 200 200" className="w-full" style={{ transform: `rotate(${rotation}deg)` }}>
      {/* LED body */}
      <circle cx="100" cy="90" r="25" fill={color} opacity={active ? (blink ? 1 : 0.8) : 0.2} />
      {/* Legs */}
      <line x1="90" y1="115" x2="90" y2="150" stroke={color} strokeWidth="3" />
      <line x1="110" y1="115" x2="110" y2="150" stroke={color} strokeWidth="3" />
      {/* Glow effect */}
      {active && (
        <>
          <circle cx="100" cy="90" r="35" fill={color} opacity="0.3" />
          <circle cx="100" cy="90" r="45" fill={color} opacity="0.1" />
        </>
      )}
    </svg>
  );
}

// ===== INSTRUMENTS =====

export function FlowMeterIcon({ value, color, blink, rotation = 0 }: IconProps & { value: number }) {
  const flow = value / 100;
  return (
    <svg viewBox="0 0 200 200" className="w-full" style={{ transform: `rotate(${rotation}deg)` }}>
      {/* Pipe */}
      <rect x="0" y="85" width="200" height="30" fill={color} opacity="0.3" />
      {/* Body */}
      <circle cx="100" cy="100" r="45" fill="none" stroke={color} strokeWidth="3" opacity={blink ? 0.7 : 1} />
      {/* Dial */}
      <circle cx="100" cy="100" r="35" fill={color} opacity="0.1" />
      {/* Needle */}
      <line
        x1="100" y1="100"
        x2="100" y2="70"
        stroke={color}
        strokeWidth="2"
        transform={`rotate(${-90 + flow * 180}, 100, 100)`}
        style={{ transition: 'transform 1s ease' }}
      />
      {/* Flow particles */}
      {flow > 0.1 && (
        <>
          <circle cx="40" cy="100" r="3" fill={color} opacity="0.6">
            <animate attributeName="cx" from="40" to="160" dur="2s" repeatCount="indefinite" />
          </circle>
          <circle cx="20" cy="100" r="2" fill={color} opacity="0.4">
            <animate attributeName="cx" from="20" to="180" dur="3s" repeatCount="indefinite" />
          </circle>
        </>
      )}
    </svg>
  );
}

export function PressureGaugeIcon({ value, color, blink, rotation = 0 }: IconProps & { value: number }) {
  const angle = -90 + (value / 100) * 180;
  return (
    <svg viewBox="0 0 200 200" className="w-full" style={{ transform: `rotate(${rotation}deg)` }}>
      {/* Body */}
      <circle cx="100" cy="120" r="60" fill="none" stroke={color} strokeWidth="3" opacity={blink ? 0.7 : 1} />
      {/* Scale arc */}
      <path
        d="M 50 120 A 50 50 0 0 1 150 120"
        fill="none"
        stroke={color}
        strokeWidth="2"
        opacity="0.3"
      />
      {/* Scale marks */}
      {[0, 25, 50, 75, 100].map((val) => {
        const a = -90 + (val / 100) * 180;
        const rad = (a * Math.PI) / 180;
        const x1 = 100 + 45 * Math.cos(rad);
        const y1 = 120 + 45 * Math.sin(rad);
        const x2 = 100 + 50 * Math.cos(rad);
        const y2 = 120 + 50 * Math.sin(rad);
        return <line key={val} x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth="2" />;
      })}
      {/* Needle */}
      <line
        x1="100" y1="120"
        x2="100" y2="75"
        stroke={color}
        strokeWidth="3"
        strokeLinecap="round"
        transform={`rotate(${angle}, 100, 120)`}
        style={{ transition: 'transform 1s ease' }}
      />
      <circle cx="100" cy="120" r="8" fill={color} />
    </svg>
  );
}

export function TemperatureSensorIcon({ value, color, blink, rotation = 0 }: IconProps & { value: number }) {
  const mercuryHeight = (value / 100) * 80;
  return (
    <svg viewBox="0 0 200 200" className="w-full" style={{ transform: `rotate(${rotation}deg)` }}>
      {/* Tube */}
      <rect x="85" y="40" width="30" height="100" rx="15" fill="none" stroke={color} strokeWidth="3" opacity={blink ? 0.7 : 1} />
      {/* Bulb */}
      <circle cx="100" cy="150" r="25" fill="none" stroke={color} strokeWidth="3" opacity={blink ? 0.7 : 1} />
      {/* Mercury */}
      <rect
        x="90" y={140 - mercuryHeight}
        width="20" height={mercuryHeight}
        fill={color}
        opacity="0.7"
        style={{ transition: 'height 1s ease, y 1s ease' }}
      />
      <circle cx="100" cy="150" r="20" fill={color} opacity="0.7" />
    </svg>
  );
}

// ===== PROCESS EQUIPMENT =====

export function CompressorIcon({ active, color, blink, rotation = 0 }: IconProps & { active: boolean }) {
  return (
    <svg viewBox="0 0 200 200" className="w-full" style={{ transform: `rotate(${rotation}deg)` }}>
      {/* Body */}
      <rect x="60" y="70" width="80" height="60" fill="none" stroke={color} strokeWidth="3" rx="5" opacity={blink ? 0.7 : 1} />
      {/* Impeller */}
      <g
        transform="translate(100, 100)"
        style={{ animation: active ? 'spin 1s linear infinite' : 'none' }}
      >
        {[0, 60, 120, 180, 240, 300].map((angle) => (
          <line key={angle} x1="0" y1="0" x2="0" y2="-20" stroke={color} strokeWidth="2" transform={`rotate(${angle})`} />
        ))}
      </g>
      {/* Inlet/Outlet */}
      <rect x="30" y="95" width="30" height="10" fill={color} opacity="0.5" />
      <rect x="140" y="95" width="30" height="10" fill={color} opacity="0.5" />
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </svg>
  );
}

export function HeatExchangerIcon({ color, blink, rotation = 0 }: IconProps) {
  return (
    <svg viewBox="0 0 200 200" className="w-full" style={{ transform: `rotate(${rotation}deg)` }}>
      {/* Shell */}
      <rect x="50" y="60" width="100" height="80" rx="10" fill="none" stroke={color} strokeWidth="3" opacity={blink ? 0.7 : 1} />
      {/* Tubes */}
      {[75, 90, 105, 120].map((y) => (
        <line key={y} x1="50" y1={y} x2="150" y2={y} stroke={color} strokeWidth="1" opacity="0.3" />
      ))}
      {/* Inlet/Outlet hot */}
      <rect x="20" y="65" width="30" height="10" fill="#ef4444" opacity="0.6" />
      <rect x="150" y="65" width="30" height="10" fill="#f97316" opacity="0.6" />
      {/* Inlet/Outlet cold */}
      <rect x="20" y="125" width="30" height="10" fill="#3b82f6" opacity="0.6" />
      <rect x="150" y="125" width="30" height="10" fill="#60a5fa" opacity="0.6" />
    </svg>
  );
}

export function FilterIcon({ color, blink, rotation = 0 }: IconProps) {
  return (
    <svg viewBox="0 0 200 200" className="w-full" style={{ transform: `rotate(${rotation}deg)` }}>
      {/* Body */}
      <path d="M 70 60 L 130 60 L 110 120 L 90 120 Z" fill="none" stroke={color} strokeWidth="3" opacity={blink ? 0.7 : 1} />
      {/* Filter media */}
      {[75, 85, 95, 105].map((y) => (
        <line key={y} x1={70 + (y - 60) * 0.3} y1={y} x2={130 - (y - 60) * 0.3} y2={y} stroke={color} strokeWidth="1" opacity="0.4" />
      ))}
      {/* Outlet */}
      <rect x="95" y="120" width="10" height="30" fill={color} opacity="0.5" />
      {/* Inlet */}
      <rect x="95" y="30" width="10" height="30" fill={color} opacity="0.5" />
    </svg>
  );
}
