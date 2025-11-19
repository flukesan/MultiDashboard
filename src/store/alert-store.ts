import { create } from 'zustand';
import { Alert, AlertSeverity } from '@/components/common/AlertNotification';

interface AlertStore {
  alerts: Alert[];
  soundEnabled: boolean;

  // Actions
  addAlert: (alert: Omit<Alert, 'id' | 'timestamp'>) => void;
  removeAlert: (alertId: string) => void;
  acknowledgeAlert: (alertId: string) => void;
  clearAll: () => void;
  clearAcknowledged: () => void;
  setSoundEnabled: (enabled: boolean) => void;

  // Getters
  getUnacknowledgedCount: () => number;
  getCriticalCount: () => number;
  getAlertsBySeverity: (severity: AlertSeverity) => Alert[];
}

export const useAlertStore = create<AlertStore>((set, get) => ({
  alerts: [],
  soundEnabled: true,

  // Add new alert
  addAlert: (alert) => {
    const newAlert: Alert = {
      ...alert,
      id: `alert-${Date.now()}-${Math.random()}`,
      timestamp: new Date(),
      acknowledged: false,
    };

    set((state) => ({
      alerts: [newAlert, ...state.alerts],
    }));

    // Play sound for critical alerts
    const { soundEnabled } = get();
    if (soundEnabled && alert.severity === 'critical') {
      // In real implementation, play audio file:
      // const audio = new Audio('/sounds/alarm.mp3');
      // audio.play();
      console.log('🔔 CRITICAL ALARM:', alert.title);
    }

    // Auto-close if specified
    if (alert.autoClose) {
      setTimeout(() => {
        get().removeAlert(newAlert.id);
      }, alert.autoClose);
    }
  },

  // Remove alert
  removeAlert: (alertId) => {
    set((state) => ({
      alerts: state.alerts.filter((a) => a.id !== alertId),
    }));
  },

  // Acknowledge alert
  acknowledgeAlert: (alertId) => {
    set((state) => ({
      alerts: state.alerts.map((a) =>
        a.id === alertId ? { ...a, acknowledged: true } : a
      ),
    }));
  },

  // Clear all alerts
  clearAll: () => {
    set({ alerts: [] });
  },

  // Clear only acknowledged alerts
  clearAcknowledged: () => {
    set((state) => ({
      alerts: state.alerts.filter((a) => !a.acknowledged),
    }));
  },

  // Toggle sound
  setSoundEnabled: (enabled) => {
    set({ soundEnabled: enabled });
  },

  // Get unacknowledged count
  getUnacknowledgedCount: () => {
    return get().alerts.filter((a) => !a.acknowledged).length;
  },

  // Get critical count
  getCriticalCount: () => {
    return get().alerts.filter((a) => a.severity === 'critical' && !a.acknowledged)
      .length;
  },

  // Get alerts by severity
  getAlertsBySeverity: (severity) => {
    return get().alerts.filter((a) => a.severity === severity);
  },
}));

// Helper function to create alerts easily
export const createAlert = {
  info: (title: string, message: string, source?: string, autoClose?: number) =>
    useAlertStore.getState().addAlert({
      severity: 'info',
      title,
      message,
      source,
      autoClose,
    }),

  success: (title: string, message: string, source?: string, autoClose = 5000) =>
    useAlertStore.getState().addAlert({
      severity: 'success',
      title,
      message,
      source,
      autoClose,
    }),

  warning: (title: string, message: string, source?: string) =>
    useAlertStore.getState().addAlert({
      severity: 'warning',
      title,
      message,
      source,
    }),

  error: (title: string, message: string, source?: string) =>
    useAlertStore.getState().addAlert({
      severity: 'error',
      title,
      message,
      source,
    }),

  critical: (title: string, message: string, source?: string) =>
    useAlertStore.getState().addAlert({
      severity: 'critical',
      title,
      message,
      source,
    }),
};
