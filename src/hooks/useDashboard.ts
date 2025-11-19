import { useDashboardStore } from '@/store/dashboard-store';
import { Widget } from '@/types';
import { generateId } from '@/lib/utils';
import { widgetRegistry } from '@/lib/widget-registry';

/**
 * Hook for dashboard operations
 */
export function useDashboard() {
  const store = useDashboardStore();

  const createWidget = (type: Widget['type']) => {
    console.log('createWidget called with type:', type);

    const definition = widgetRegistry.get(type);
    console.log('Widget definition found:', definition);

    if (!definition) {
      console.error(`Widget type "${type}" not found in registry`);
      console.log('Available widgets:', widgetRegistry.getAll().map(w => w.type));
      throw new Error(`Unknown widget type: ${type}`);
    }

    const defaultLayout = widgetRegistry.getDefaultLayout(type);
    const defaultConfig = widgetRegistry.getDefaultConfig(type);

    // Find next available position
    const currentDashboard = store.getCurrentDashboard();
    const widgets = currentDashboard?.widgets || [];
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

    console.log('Adding new widget:', newWidget);
    store.addWidget(newWidget);
    return newWidget;
  };

  return {
    ...store,
    createWidget,
    currentDashboard: store.getCurrentDashboard(),
  };
}
