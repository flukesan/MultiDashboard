import { useMemo } from 'react';
import GridLayout, { Layout } from 'react-grid-layout';
import 'react-grid-layout/css/styles.css';
import { Widget } from '@/types';
import { useDashboardStore } from '@/store/dashboard-store';
import { WidgetRenderer } from './WidgetRenderer';

interface DashboardGridProps {
  widgets: Widget[];
  editMode: boolean;
}

export function DashboardGrid({ widgets, editMode }: DashboardGridProps) {
  const { getCurrentDashboard, updateWidgetLayout } = useDashboardStore();
  const currentDashboard = getCurrentDashboard();

  const layout: Layout[] = useMemo(() => {
    return widgets.map((widget) => ({
      i: widget.id,
      x: widget.layout.x,
      y: widget.layout.y,
      w: widget.layout.w,
      h: widget.layout.h,
      minW: widget.layout.minW,
      minH: widget.layout.minH,
      maxW: widget.layout.maxW,
      maxH: widget.layout.maxH,
      static: !editMode || widget.layout.static,
    }));
  }, [widgets, editMode]);

  const handleLayoutChange = (newLayout: Layout[]) => {
    if (!editMode) return;

    newLayout.forEach((item) => {
      const widget = widgets.find((w) => w.id === item.i);
      if (widget) {
        const hasChanged =
          widget.layout.x !== item.x ||
          widget.layout.y !== item.y ||
          widget.layout.w !== item.w ||
          widget.layout.h !== item.h;

        if (hasChanged) {
          updateWidgetLayout(widget.id, {
            ...widget.layout,
            x: item.x,
            y: item.y,
            w: item.w,
            h: item.h,
          });
        }
      }
    });
  };

  const gridConfig = currentDashboard?.layout || {
    cols: 12,
    rowHeight: 50,
    margin: [16, 16],
    containerPadding: [16, 16],
  };

  return (
    <GridLayout
      className="layout"
      layout={layout}
      cols={gridConfig.cols}
      rowHeight={gridConfig.rowHeight}
      width={1200}
      margin={gridConfig.margin as [number, number]}
      containerPadding={gridConfig.containerPadding as [number, number]}
      compactType={gridConfig.compactType || 'vertical'}
      isDraggable={editMode}
      isResizable={editMode}
      onLayoutChange={handleLayoutChange}
      draggableHandle="[data-drag-handle]"
    >
      {widgets.map((widget) => (
        <div key={widget.id}>
          <WidgetRenderer widget={widget} editMode={editMode} />
        </div>
      ))}
    </GridLayout>
  );
}
