/**
 * Widget Registration
 * Register all available widgets with the widget registry
 */

import { widgetRegistry } from './widget-registry';
import { ChartWidget, NumberWidget, TableWidget, ScadaWidget } from '@/components/widgets';

// Register Number Widget
widgetRegistry.register({
  type: 'number',
  name: 'Number Widget',
  description: 'Display KPI numbers with trend indicators',
  icon: 'Hash',
  component: NumberWidget,
  defaultConfig: {
    title: 'New Number Widget',
    format: 'number',
    decimals: 0,
    showTrend: false,
    size: 'md',
    showHeader: true,
    showBorder: true,
  },
  defaultLayout: {
    w: 3,
    h: 3,
    minW: 2,
    minH: 2,
    maxW: 6,
    maxH: 4,
  },
});

// Register Chart Widget
widgetRegistry.register({
  type: 'chart',
  name: 'Chart Widget',
  description: 'Display data in various chart types',
  icon: 'BarChart',
  component: ChartWidget,
  defaultConfig: {
    title: 'New Chart',
    chartType: 'line',
    showLegend: true,
    showGrid: true,
    smooth: false,
    colors: ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'],
    showHeader: true,
    showBorder: true,
  },
  defaultLayout: {
    w: 6,
    h: 5,
    minW: 4,
    minH: 4,
    maxW: 12,
    maxH: 8,
  },
});

// Register Table Widget
widgetRegistry.register({
  type: 'table',
  name: 'Table Widget',
  description: 'Display data in a sortable table',
  icon: 'Table',
  component: TableWidget,
  defaultConfig: {
    title: 'New Table',
    pagination: true,
    pageSize: 10,
    sortable: true,
    striped: true,
    showHeader: true,
    showBorder: true,
  },
  defaultLayout: {
    w: 8,
    h: 6,
    minW: 6,
    minH: 5,
    maxW: 12,
    maxH: 10,
  },
});

// Register Text Widget (placeholder)
widgetRegistry.register({
  type: 'text',
  name: 'Text Widget',
  description: 'Display static text or markdown content',
  icon: 'FileText',
  component: () => null, // Placeholder
  defaultConfig: {
    title: 'New Text Widget',
    content: 'Enter your text here...',
    markdown: false,
    align: 'left',
    showHeader: true,
    showBorder: true,
  },
  defaultLayout: {
    w: 4,
    h: 3,
    minW: 3,
    minH: 2,
    maxW: 12,
    maxH: 6,
  },
});

// Register Map Widget (placeholder)
widgetRegistry.register({
  type: 'map',
  name: 'Map Widget',
  description: 'Display geospatial data on a map',
  icon: 'Map',
  component: () => null, // Placeholder
  defaultConfig: {
    title: 'New Map',
    center: [13.7563, 100.5018], // Bangkok
    zoom: 12,
    markerColor: '#3b82f6',
    showHeader: true,
    showBorder: true,
  },
  defaultLayout: {
    w: 6,
    h: 6,
    minW: 4,
    minH: 4,
    maxW: 12,
    maxH: 10,
  },
});

// Register SCADA Widget
widgetRegistry.register({
  type: 'scada',
  name: 'SCADA Widget',
  description: 'Industrial equipment visualization with alarms',
  icon: 'Cpu',
  component: ScadaWidget,
  defaultConfig: {
    title: 'Equipment',
    showHeader: true,
    showBorder: true,
  },
  defaultLayout: {
    w: 4,
    h: 5,
    minW: 3,
    minH: 4,
    maxW: 6,
    maxH: 8,
  },
});

console.log('Widgets registered:', widgetRegistry.getAll().map((w) => w.type));
