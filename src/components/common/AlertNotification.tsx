import { useEffect, useState } from 'react';
import { AlertTriangle, AlertCircle, Info, CheckCircle, X, Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';

export type AlertSeverity = 'info' | 'success' | 'warning' | 'error' | 'critical';

export interface Alert {
  id: string;
  severity: AlertSeverity;
  title: string;
  message: string;
  timestamp: Date;
  source?: string; // Widget or equipment name
  acknowledged?: boolean;
  autoClose?: number; // milliseconds
}

interface AlertNotificationProps {
  alerts: Alert[];
  onAcknowledge: (alertId: string) => void;
  onDismiss: (alertId: string) => void;
}

export function AlertNotificationCenter({
  alerts,
  onAcknowledge,
  onDismiss,
}: AlertNotificationProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);

  const unacknowledgedCount = alerts.filter((a) => !a.acknowledged).length;
  const criticalCount = alerts.filter(
    (a) => a.severity === 'critical' && !a.acknowledged
  ).length;

  // Play alert sound for critical alarms
  useEffect(() => {
    if (soundEnabled && criticalCount > 0) {
      // In real implementation, play audio file
      console.log('🔔 CRITICAL ALARM!');
    }
  }, [criticalCount, soundEnabled]);

  return (
    <>
      {/* Alert Bell Button */}
      <div className="relative">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsOpen(!isOpen)}
          className="relative"
        >
          <Bell className="h-5 w-5" />
          {unacknowledgedCount > 0 && (
            <span
              className={`absolute -top-1 -right-1 h-5 w-5 rounded-full text-xs font-bold flex items-center justify-center ${
                criticalCount > 0
                  ? 'bg-red-500 text-white animate-pulse'
                  : 'bg-yellow-500 text-white'
              }`}
            >
              {unacknowledgedCount}
            </span>
          )}
        </Button>

        {/* Alert Panel */}
        {isOpen && (
          <div className="absolute right-0 top-12 w-96 max-h-[600px] bg-background border rounded-lg shadow-lg z-50 overflow-hidden flex flex-col">
            {/* Header */}
            <div className="p-4 border-b flex items-center justify-between">
              <div>
                <h3 className="font-semibold">Alerts ({alerts.length})</h3>
                {unacknowledgedCount > 0 && (
                  <p className="text-xs text-muted-foreground">
                    {unacknowledgedCount} unacknowledged
                  </p>
                )}
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSoundEnabled(!soundEnabled)}
                >
                  {soundEnabled ? '🔊' : '🔇'}
                </Button>
                <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Alert List */}
            <div className="flex-1 overflow-y-auto p-2">
              {alerts.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                  <CheckCircle className="h-12 w-12 mb-2 opacity-50" />
                  <p className="text-sm">No active alerts</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {alerts.map((alert) => (
                    <AlertCard
                      key={alert.id}
                      alert={alert}
                      onAcknowledge={onAcknowledge}
                      onDismiss={onDismiss}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
}

function AlertCard({
  alert,
  onAcknowledge,
  onDismiss,
}: {
  alert: Alert;
  onAcknowledge: (id: string) => void;
  onDismiss: (id: string) => void;
}) {
  const [blink, setBlink] = useState(false);
  const colors = getColors(alert.severity);

  const getIcon = (severity: AlertSeverity) => {
    switch (severity) {
      case 'critical':
      case 'error':
        return <AlertTriangle className="h-5 w-5" />;
      case 'warning':
        return <AlertCircle className="h-5 w-5" />;
      case 'success':
        return <CheckCircle className="h-5 w-5" />;
      default:
        return <Info className="h-5 w-5" />;
    }
  };

  // Blink for critical unacknowledged alerts
  useEffect(() => {
    if (alert.severity === 'critical' && !alert.acknowledged) {
      const interval = setInterval(() => {
        setBlink((prev) => !prev);
      }, 500);

      return () => clearInterval(interval);
    }
  }, [alert.severity, alert.acknowledged]);

  // Auto-close
  useEffect(() => {
    if (alert.autoClose) {
      const timeout = setTimeout(() => {
        onDismiss(alert.id);
      }, alert.autoClose);

      return () => clearTimeout(timeout);
    }
  }, [alert.autoClose, alert.id, onDismiss]);

  return (
    <div
      className={`border rounded-lg p-3 ${colors.bg} ${
        blink ? 'opacity-100' : alert.acknowledged ? 'opacity-60' : 'opacity-100'
      }`}
      style={{ transition: 'opacity 0.3s ease' }}
    >
      <div className="flex items-start gap-3">
        <div className={colors.icon}>{getIcon(alert.severity)}</div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1">
              <h4 className={`font-medium text-sm ${colors.text}`}>{alert.title}</h4>
              {alert.source && (
                <p className="text-xs text-muted-foreground mt-0.5">{alert.source}</p>
              )}
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 -mt-1"
              onClick={() => onDismiss(alert.id)}
            >
              <X className="h-3 w-3" />
            </Button>
          </div>

          <p className="text-xs mt-1 text-foreground/80">{alert.message}</p>

          <div className="flex items-center justify-between mt-2">
            <span className="text-xs text-muted-foreground">
              {new Date(alert.timestamp).toLocaleTimeString()}
            </span>

            {!alert.acknowledged && (
              <Button
                size="sm"
                variant="outline"
                className="h-6 text-xs"
                onClick={() => onAcknowledge(alert.id)}
              >
                Acknowledge
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function getColors(severity: AlertSeverity) {
  switch (severity) {
    case 'critical':
      return {
        bg: 'bg-red-500/10 border-red-500',
        text: 'text-red-500',
        icon: 'text-red-500',
      };
    case 'error':
      return {
        bg: 'bg-red-500/10 border-red-400',
        text: 'text-red-400',
        icon: 'text-red-400',
      };
    case 'warning':
      return {
        bg: 'bg-yellow-500/10 border-yellow-500',
        text: 'text-yellow-500',
        icon: 'text-yellow-500',
      };
    case 'success':
      return {
        bg: 'bg-green-500/10 border-green-500',
        text: 'text-green-500',
        icon: 'text-green-500',
      };
    default:
      return {
        bg: 'bg-blue-500/10 border-blue-500',
        text: 'text-blue-500',
        icon: 'text-blue-500',
      };
  }
}
