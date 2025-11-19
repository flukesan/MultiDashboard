import { create } from 'zustand';
import { Dashboard, Widget, LayoutConfig, AutoRotateConfig } from '@/types';
import { storage } from '@/lib/utils';

interface DashboardStore {
  // State
  dashboards: Dashboard[];
  currentDashboardId: string | null;
  editMode: boolean;
  selectedWidgetId: string | null;
  autoRotate: AutoRotateConfig;

  // Dashboard Actions
  createDashboard: (name: string, description?: string) => Dashboard;
  deleteDashboard: (dashboardId: string) => void;
  switchDashboard: (dashboardId: string) => void;
  nextDashboard: () => void;
  previousDashboard: () => void;
  updateDashboard: (dashboardId: string, updates: Partial<Dashboard>) => void;

  // Widget Actions
  addWidget: (widget: Widget) => void;
  removeWidget: (widgetId: string) => void;
  updateWidget: (widgetId: string, updates: Partial<Widget>) => void;
  updateWidgetLayout: (widgetId: string, layout: LayoutConfig) => void;

  // UI Actions
  setEditMode: (editMode: boolean) => void;
  setSelectedWidget: (widgetId: string | null) => void;

  // Auto-rotate Actions
  setAutoRotate: (config: Partial<AutoRotateConfig>) => void;
  startAutoRotate: () => void;
  stopAutoRotate: () => void;

  // Storage Actions
  saveDashboards: () => void;
  loadDashboards: () => void;

  // Helpers
  getCurrentDashboard: () => Dashboard | null;
}

const STORAGE_KEY = 'multi-dashboard-collection';

export const useDashboardStore = create<DashboardStore>((set, get) => ({
  // Initial state
  dashboards: [],
  currentDashboardId: null,
  editMode: false,
  selectedWidgetId: null,
  autoRotate: {
    enabled: false,
    interval: 10, // 10 seconds default
    pauseOnHover: true,
  },

  // Create new dashboard
  createDashboard: (name, description) => {
    const newDashboard: Dashboard = {
      id: `dashboard-${Date.now()}`,
      name,
      description,
      widgets: [],
      layout: {
        cols: 12,
        rowHeight: 100,
        margin: [16, 16],
        containerPadding: [16, 16],
        compactType: 'vertical',
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    set((state) => ({
      dashboards: [...state.dashboards, newDashboard],
      currentDashboardId: newDashboard.id,
    }));

    get().saveDashboards();
    return newDashboard;
  },

  // Delete dashboard
  deleteDashboard: (dashboardId) => {
    const state = get();
    const newDashboards = state.dashboards.filter((d) => d.id !== dashboardId);

    let newCurrentId = state.currentDashboardId;
    if (state.currentDashboardId === dashboardId) {
      // If deleting current dashboard, switch to another one
      newCurrentId = newDashboards.length > 0 ? newDashboards[0].id : null;
    }

    set({
      dashboards: newDashboards,
      currentDashboardId: newCurrentId,
    });

    get().saveDashboards();
  },

  // Switch to a specific dashboard
  switchDashboard: (dashboardId) => {
    const dashboard = get().dashboards.find((d) => d.id === dashboardId);
    if (dashboard) {
      set({ currentDashboardId: dashboardId });
    }
  },

  // Switch to next dashboard
  nextDashboard: () => {
    const state = get();
    if (state.dashboards.length === 0) return;

    const currentIndex = state.dashboards.findIndex(
      (d) => d.id === state.currentDashboardId
    );
    const nextIndex = (currentIndex + 1) % state.dashboards.length;

    set({ currentDashboardId: state.dashboards[nextIndex].id });
  },

  // Switch to previous dashboard
  previousDashboard: () => {
    const state = get();
    if (state.dashboards.length === 0) return;

    const currentIndex = state.dashboards.findIndex(
      (d) => d.id === state.currentDashboardId
    );
    const prevIndex = currentIndex <= 0
      ? state.dashboards.length - 1
      : currentIndex - 1;

    set({ currentDashboardId: state.dashboards[prevIndex].id });
  },

  // Update dashboard properties
  updateDashboard: (dashboardId, updates) => {
    set((state) => ({
      dashboards: state.dashboards.map((d) =>
        d.id === dashboardId
          ? { ...d, ...updates, updatedAt: new Date() }
          : d
      ),
    }));

    get().saveDashboards();
  },

  // Add widget to current dashboard
  addWidget: (widget) => {
    const state = get();
    if (!state.currentDashboardId) return;

    set((s) => ({
      dashboards: s.dashboards.map((d) =>
        d.id === s.currentDashboardId
          ? { ...d, widgets: [...d.widgets, widget], updatedAt: new Date() }
          : d
      ),
    }));

    get().saveDashboards();
  },

  // Remove widget from current dashboard
  removeWidget: (widgetId) => {
    const state = get();
    if (!state.currentDashboardId) return;

    set((s) => ({
      dashboards: s.dashboards.map((d) =>
        d.id === s.currentDashboardId
          ? {
              ...d,
              widgets: d.widgets.filter((w) => w.id !== widgetId),
              updatedAt: new Date(),
            }
          : d
      ),
      selectedWidgetId: s.selectedWidgetId === widgetId ? null : s.selectedWidgetId,
    }));

    get().saveDashboards();
  },

  // Update widget
  updateWidget: (widgetId, updates) => {
    const state = get();
    if (!state.currentDashboardId) return;

    set((s) => ({
      dashboards: s.dashboards.map((d) =>
        d.id === s.currentDashboardId
          ? {
              ...d,
              widgets: d.widgets.map((w) =>
                w.id === widgetId ? { ...w, ...updates } : w
              ),
              updatedAt: new Date(),
            }
          : d
      ),
    }));

    get().saveDashboards();
  },

  // Update widget layout
  updateWidgetLayout: (widgetId, layout) => {
    const state = get();
    if (!state.currentDashboardId) return;

    set((s) => ({
      dashboards: s.dashboards.map((d) =>
        d.id === s.currentDashboardId
          ? {
              ...d,
              widgets: d.widgets.map((w) =>
                w.id === widgetId ? { ...w, layout } : w
              ),
              updatedAt: new Date(),
            }
          : d
      ),
    }));

    get().saveDashboards();
  },

  // Toggle edit mode
  setEditMode: (editMode) => {
    set({ editMode, selectedWidgetId: editMode ? get().selectedWidgetId : null });
  },

  // Select widget
  setSelectedWidget: (widgetId) => {
    set({ selectedWidgetId: widgetId });
  },

  // Set auto-rotate configuration
  setAutoRotate: (config) => {
    set((state) => ({
      autoRotate: { ...state.autoRotate, ...config },
    }));
    get().saveDashboards();
  },

  // Start auto-rotate (implementation in component with setInterval)
  startAutoRotate: () => {
    set((state) => ({
      autoRotate: { ...state.autoRotate, enabled: true },
    }));
  },

  // Stop auto-rotate
  stopAutoRotate: () => {
    set((state) => ({
      autoRotate: { ...state.autoRotate, enabled: false },
    }));
  },

  // Save all dashboards to localStorage
  saveDashboards: () => {
    const state = get();
    storage.set(STORAGE_KEY, {
      dashboards: state.dashboards,
      currentDashboardId: state.currentDashboardId,
      autoRotate: state.autoRotate,
    });
  },

  // Load dashboards from localStorage
  loadDashboards: () => {
    const saved = storage.get<{
      dashboards: Dashboard[];
      currentDashboardId: string | null;
      autoRotate?: AutoRotateConfig;
    }>(STORAGE_KEY, {
      dashboards: [],
      currentDashboardId: null,
    });

    if (saved) {
      set({
        dashboards: saved.dashboards || [],
        currentDashboardId: saved.currentDashboardId,
        autoRotate: saved.autoRotate || get().autoRotate,
      });
    }
  },

  // Get current dashboard
  getCurrentDashboard: () => {
    const state = get();
    return state.dashboards.find((d) => d.id === state.currentDashboardId) || null;
  },
}));
