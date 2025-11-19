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
    console.log('addWidget called with:', widget);
    const current = get().currentDashboard;
    if (!current) {
      console.error('No current dashboard!');
      return;
    }

    const newWidgets = [...current.widgets, widget];
    console.log('New widgets array:', newWidgets);

    set({
      currentDashboard: {
        ...current,
        widgets: newWidgets,
        updatedAt: new Date(),
      },
    });
    console.log('Widget added successfully');
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
    console.log('setEditMode called:', editMode);
    set({ editMode, selectedWidgetId: editMode ? get().selectedWidgetId : null });
    console.log('Edit mode set to:', editMode);
  },

  // Select widget
  setSelectedWidget: (widgetId) => {
    set({ selectedWidgetId: widgetId });
  },

  // Save dashboard to localStorage
  saveDashboard: () => {
    console.log('saveDashboard called');
    const dashboard = get().currentDashboard;
    if (!dashboard) {
      console.error('No dashboard to save!');
      return;
    }

    const saved = storage.get<Record<string, Dashboard>>(STORAGE_KEY, {});
    saved[dashboard.id] = dashboard;
    storage.set(STORAGE_KEY, saved);
    console.log('Dashboard saved successfully:', dashboard.id);
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
