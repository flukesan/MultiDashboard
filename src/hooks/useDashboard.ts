import { useDashboardStore } from '@/store/dashboard-store';
import { Widget, Dashboard } from '@/types';
import { generateId } from '@/lib/utils';
import { widgetRegistry } from '@/lib/widget-registry';

/**
 * Hook for dashboard operations
 */
export function useDashboard() {
  const store = useDashboardStore();

  const createWidget = (type: Widget['type']) => {
    const definition = widgetRegistry.get(type);
    if (!definition) {
      throw new Error(`Unknown widget type: ${type}`);
    }

    const defaultLayout = widgetRegistry.getDefaultLayout(type);
    const defaultConfig = widgetRegistry.getDefaultConfig(type);

    // Find next available position
    const widgets = store.currentDashboard?.widgets || [];
    const maxY = widgets.reduce((max, w) => Math.max(max, w.layout.y + w.layout.h), 0);

    const newWidget: Widget = {
      id: generateId(),
      type,
      config: defaultConfig as Widget['config'],
      layout: {
        x: 0,
        y: maxY,
        ...defaultLayout,
      },
    };

    store.addWidget(newWidget);
    return newWidget;
  };

  const createDashboard = (name: string, description?: string): Dashboard => {
    const dashboard: Dashboard = {
      id: generateId(),
      name,
      description,
      widgets: [],
      layout: {
        cols: 12,
        rowHeight: 50,
        breakpoints: {
          lg: 1200,
          md: 996,
          sm: 768,
          xs: 480,
        },
        margin: [16, 16],
        containerPadding: [16, 16],
        compactType: 'vertical',
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    store.setDashboard(dashboard);
    return dashboard;
  };

  return {
    ...store,
    createWidget,
    createDashboard,
  };
}
