import { useMemo } from 'react';
import { Widget } from '@/types';
import { useDashboardStore } from '@/store/dashboard-store';
import { widgetRegistry } from '@/lib/widget-registry';

/**
 * Hook for working with widgets
 */
export function useWidget(widgetId: string) {
  const { currentDashboard, updateWidget, removeWidget, updateWidgetLayout, setSelectedWidget } =
    useDashboardStore();

  const widget = useMemo(() => {
    return currentDashboard?.widgets.find((w) => w.id === widgetId);
  }, [currentDashboard, widgetId]);

  const widgetDefinition = useMemo(() => {
    return widget ? widgetRegistry.get(widget.type) : undefined;
  }, [widget]);

  const update = (updates: Partial<Widget>) => {
    updateWidget(widgetId, updates);
  };

  const remove = () => {
    removeWidget(widgetId);
  };

  const updateLayout = (layout: Widget['layout']) => {
    updateWidgetLayout(widgetId, layout);
  };

  const select = () => {
    setSelectedWidget(widgetId);
  };

  return {
    widget,
    widgetDefinition,
    update,
    remove,
    updateLayout,
    select,
  };
}
