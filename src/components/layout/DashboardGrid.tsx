import { useMemo, useState, useEffect } from 'react';
import GridLayout, { Layout, WidthProvider } from 'react-grid-layout';
import 'react-grid-layout/css/styles.css';
import { Widget } from '@/types';
import { useDashboardStore } from '@/store/dashboard-store';
import { WidgetRenderer } from './WidgetRenderer';

const ResponsiveGridLayout = WidthProvider(GridLayout);

interface DashboardGridProps {
  widgets: Widget[];
  editMode: boolean;
}

export function DashboardGrid({ widgets, editMode }: DashboardGridProps) {
  const { getCurrentDashboard, updateWidgetLayout } = useDashboardStore();
  const currentDashboard = getCurrentDashboard();
  const [rowHeight, setRowHeight] = useState(100);

  // Calculate responsive row height based on screen size
  useEffect(() => {
    const calculateRowHeight = () => {
      const screenWidth = window.innerWidth;

      // For large screens (TV), increase row height
      if (screenWidth >= 3840) {
        // 4K and above
        setRowHeight(150);
      } else if (screenWidth >= 2560) {
        // 2K
        setRowHeight(120);
      } else if (screenWidth >= 1920) {
        // Full HD
        setRowHeight(100);
      } else if (screenWidth >= 1280) {
        // HD
        setRowHeight(80);
      } else {
        // Smaller screens
        setRowHeight(60);
      }
    };

    calculateRowHeight();
    window.addEventListener('resize', calculateRowHeight);

    return () => {
      window.removeEventListener('resize', calculateRowHeight);
    };
  }, []);

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

  // Use minimal padding in presentation mode for full-screen display
  const margin: [number, number] = editMode ? [12, 12] : [8, 8];
  const containerPadding: [number, number] = editMode ? [12, 12] : [0, 0];

  return (
    <ResponsiveGridLayout
      className="layout"
      layout={layout}
      cols={gridConfig.cols}
      rowHeight={rowHeight}
      margin={margin}
      containerPadding={containerPadding}
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
    </ResponsiveGridLayout>
  );
}
