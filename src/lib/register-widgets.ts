/**
 * Widget Registration
 * Register all available widgets with the widget registry
 */

import { widgetRegistry } from './widget-registry';
import {
  ChartWidget,
  NumberWidget,
  TableWidget,
  ScadaWidget,
  SankeyWidget,
  PieChartWidget,
  RobotStatusWidget,
  RobotPositionWidget,
  RobotJointWidget,
  RobotIOWidget,
  RobotSpeedWidget,
  RobotErrorWidget,
} from '@/components/widgets';

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

// ============== Chart Widgets ==============

// Register Sankey Diagram Widget
widgetRegistry.register({
  type: 'sankey',
  name: 'Sankey Diagram',
  description: 'Visualize flow and relationships between data points',
  icon: 'GitBranch',
  component: SankeyWidget,
  defaultConfig: {
    title: 'Flow Diagram',
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

// Register Pie Chart Widget
widgetRegistry.register({
  type: 'piechart',
  name: 'Pie Chart',
  description: 'Display proportional data in a circular chart',
  icon: 'PieChart',
  component: PieChartWidget,
  defaultConfig: {
    title: 'Distribution',
    showLegend: true,
    showLabels: true,
    innerRadius: 0, // 0 for pie, 50 for donut
    colors: ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4', '#84cc16'],
    showHeader: true,
    showBorder: true,
  },
  defaultLayout: {
    w: 4,
    h: 5,
    minW: 3,
    minH: 4,
    maxW: 8,
    maxH: 8,
  },
});

// ============== Robot Controller Widgets ==============

// Register Robot Status Widget
widgetRegistry.register({
  type: 'robot-status',
  name: 'Robot Status',
  description: 'Display robot controller overall status and mode',
  icon: 'Activity',
  component: RobotStatusWidget,
  defaultConfig: {
    title: 'Robot Status',
    showHeader: true,
    showBorder: true,
  },
  defaultLayout: {
    w: 3,
    h: 4,
    minW: 3,
    minH: 4,
    maxW: 5,
    maxH: 6,
  },
});

// Register Robot Position Widget
widgetRegistry.register({
  type: 'robot-position',
  name: 'Robot Position',
  description: 'Display robot X, Y, Z position and rotation',
  icon: 'Move',
  component: RobotPositionWidget,
  defaultConfig: {
    title: 'Robot Position',
    showHeader: true,
    showBorder: true,
  },
  defaultLayout: {
    w: 4,
    h: 6,
    minW: 4,
    minH: 5,
    maxW: 6,
    maxH: 8,
  },
});

// Register Robot Joint Widget
widgetRegistry.register({
  type: 'robot-joint',
  name: 'Joint Status',
  description: 'Display robot joint angles with visual indicators',
  icon: 'Cog',
  component: RobotJointWidget,
  defaultConfig: {
    title: 'Joint Angles',
    showHeader: true,
    showBorder: true,
  },
  defaultLayout: {
    w: 4,
    h: 6,
    minW: 3,
    minH: 5,
    maxW: 6,
    maxH: 8,
  },
});

// Register Robot I/O Widget
widgetRegistry.register({
  type: 'robot-io',
  name: 'Digital I/O',
  description: 'Monitor digital inputs and outputs status',
  icon: 'ToggleRight',
  component: RobotIOWidget,
  defaultConfig: {
    title: 'I/O Signals',
    showHeader: true,
    showBorder: true,
  },
  defaultLayout: {
    w: 4,
    h: 7,
    minW: 3,
    minH: 6,
    maxW: 6,
    maxH: 10,
  },
});

// Register Robot Speed Widget
widgetRegistry.register({
  type: 'robot-speed',
  name: 'Speed Monitor',
  description: 'Display linear/angular speed and acceleration',
  icon: 'Gauge',
  component: RobotSpeedWidget,
  defaultConfig: {
    title: 'Speed & Acceleration',
    showHeader: true,
    showBorder: true,
  },
  defaultLayout: {
    w: 4,
    h: 5,
    minW: 3,
    minH: 4,
    maxW: 6,
    maxH: 7,
  },
});

// Register Robot Error Widget
widgetRegistry.register({
  type: 'robot-error',
  name: 'Error & Alarms',
  description: 'Display robot errors, warnings and alarms',
  icon: 'AlertCircle',
  component: RobotErrorWidget,
  defaultConfig: {
    title: 'Errors & Alarms',
    showHeader: true,
    showBorder: true,
  },
  defaultLayout: {
    w: 5,
    h: 6,
    minW: 4,
    minH: 5,
    maxW: 8,
    maxH: 10,
  },
});

console.log('Widgets registered:', widgetRegistry.getAll().map((w) => w.type));
