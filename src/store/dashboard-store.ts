import { create } from 'zustand';
import { Dashboard, Widget, LayoutConfig } from '@/types';
import { storage } from '@/lib/utils';

interface DashboardStore {
  // State
  currentDashboard: Dashboard | null;
  editMode: boolean;
  selectedWidgetId: string | null;

  // Actions
  setDashboard: (dashboard: Dashboard) => void;
  updateDashboard: (updates: Partial<Dashboard>) => void;
  addWidget: (widget: Widget) => void;
  removeWidget: (widgetId: string) => void;
  updateWidget: (widgetId: string, updates: Partial<Widget>) => void;
  updateWidgetLayout: (widgetId: string, layout: LayoutConfig) => void;
  setEditMode: (editMode: boolean) => void;
  setSelectedWidget: (widgetId: string | null) => void;
  saveDashboard: () => void;
  loadDashboard: (dashboardId: string) => void;
  resetDashboard: () => void;
}

const STORAGE_KEY = 'multi-dashboard';

export const useDashboardStore = create<DashboardStore>((set, get) => ({
  // Initial state
  currentDashboard: null,
  editMode: false,
  selectedWidgetId: null,

  // Set entire dashboard
  setDashboard: (dashboard) => {
    set({ currentDashboard: dashboard });
  },

  // Update dashboard properties
  updateDashboard: (updates) => {
    const current = get().currentDashboard;
    if (!current) return;

    set({
      currentDashboard: {
        ...current,
        ...updates,
        updatedAt: new Date(),
      },
    });
  },

  // Add new widget
  addWidget: (widget) => {
    const current = get().currentDashboard;
    if (!current) return;

    set({
      currentDashboard: {
        ...current,
        widgets: [...current.widgets, widget],
        updatedAt: new Date(),
      },
    });
  },

  // Remove widget
  removeWidget: (widgetId) => {
    const current = get().currentDashboard;
    if (!current) return;

    set({
      currentDashboard: {
        ...current,
        widgets: current.widgets.filter((w) => w.id !== widgetId),
        updatedAt: new Date(),
      },
      selectedWidgetId: get().selectedWidgetId === widgetId ? null : get().selectedWidgetId,
    });
  },

  // Update widget
  updateWidget: (widgetId, updates) => {
    const current = get().currentDashboard;
    if (!current) return;

    set({
      currentDashboard: {
        ...current,
        widgets: current.widgets.map((w) => (w.id === widgetId ? { ...w, ...updates } : w)),
        updatedAt: new Date(),
      },
    });
  },

  // Update widget layout
  updateWidgetLayout: (widgetId, layout) => {
    const current = get().currentDashboard;
    if (!current) return;

    set({
      currentDashboard: {
        ...current,
        widgets: current.widgets.map((w) => (w.id === widgetId ? { ...w, layout } : w)),
        updatedAt: new Date(),
      },
    });
  },

  // Toggle edit mode
  setEditMode: (editMode) => {
    set({ editMode, selectedWidgetId: editMode ? get().selectedWidgetId : null });
  },

  // Select widget
  setSelectedWidget: (widgetId) => {
    set({ selectedWidgetId: widgetId });
  },

  // Save dashboard to localStorage
  saveDashboard: () => {
    const dashboard = get().currentDashboard;
    if (!dashboard) return;

    const saved = storage.get<Record<string, Dashboard>>(STORAGE_KEY, {});
    saved[dashboard.id] = dashboard;
    storage.set(STORAGE_KEY, saved);
  },

  // Load dashboard from localStorage
  loadDashboard: (dashboardId) => {
    const saved = storage.get<Record<string, Dashboard>>(STORAGE_KEY, {});
    const dashboard = saved[dashboardId];

    if (dashboard) {
      set({ currentDashboard: dashboard });
    }
  },

  // Reset dashboard
  resetDashboard: () => {
    set({
      currentDashboard: null,
      editMode: false,
      selectedWidgetId: null,
    });
  },
}));
