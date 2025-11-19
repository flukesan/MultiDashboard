/**
 * Core Type Definitions for MultiDashboard
 */

// ============== Widget Types ==============

export type WidgetType = 'chart' | 'number' | 'map' | 'table' | 'text' | 'custom' | 'scada' | 'gauge' | 'bargauge' | 'heatmap';

export type ChartType = 'line' | 'bar' | 'pie' | 'area' | 'scatter' | 'radar';

export type ScadaEquipmentType =
  | 'tank' | 'pump' | 'valve' | 'motor' | 'sensor'
  | 'pipe-horizontal' | 'pipe-vertical' | 'pipe-elbow' | 'pipe-t-junction' | 'pipe-cross'
  | 'valve-gate' | 'valve-ball' | 'valve-check' | 'valve-butterfly'
  | 'button' | 'switch' | 'indicator' | 'led'
  | 'flow-meter' | 'pressure-gauge' | 'temperature-sensor'
  | 'compressor' | 'heat-exchanger' | 'filter';

export interface BaseWidgetConfig {
  title?: string;
  description?: string;
  refreshInterval?: number; // in milliseconds
  showHeader?: boolean;
  showBorder?: boolean;
}

export interface ChartWidgetConfig extends BaseWidgetConfig {
  chartType: ChartType;
  colors?: string[];
  showLegend?: boolean;
  showGrid?: boolean;
  xAxisLabel?: string;
  yAxisLabel?: string;
  smooth?: boolean;
}

export interface NumberWidgetConfig extends BaseWidgetConfig {
  format?: 'number' | 'currency' | 'percentage';
  prefix?: string;
  suffix?: string;
  decimals?: number;
  showTrend?: boolean;
  trendColor?: {
    positive: string;
    negative: string;
  };
  size?: 'sm' | 'md' | 'lg';
}

export interface MapWidgetConfig extends BaseWidgetConfig {
  center?: [number, number]; // [lat, lng]
  zoom?: number;
  markerColor?: string;
  clusterMarkers?: boolean;
}

export interface TableWidgetConfig extends BaseWidgetConfig {
  pagination?: boolean;
  pageSize?: number;
  sortable?: boolean;
  filterable?: boolean;
  striped?: boolean;
  compact?: boolean;
}

export interface TextWidgetConfig extends BaseWidgetConfig {
  content: string;
  markdown?: boolean;
  align?: 'left' | 'center' | 'right';
}

export interface ScadaWidgetConfig extends BaseWidgetConfig {
  scadaConfig?: {
    equipmentType: ScadaEquipmentType;
    size?: 'small' | 'medium' | 'large' | 'xlarge';
    rotation?: 0 | 90 | 180 | 270;
    thresholds?: {
      warning?: number;
      alarm?: number;
    };
    alarmConditions?: {
      highLevel?: number;
      lowLevel?: number;
      enabled: boolean;
    };
    unit?: string;
    label?: string;
  };
}

export type WidgetConfig =
  | ChartWidgetConfig
  | NumberWidgetConfig
  | MapWidgetConfig
  | TableWidgetConfig
  | TextWidgetConfig
  | ScadaWidgetConfig
  | BaseWidgetConfig;

// ============== Data Source Types ==============

export type DataSourceType = 'rest' | 'graphql' | 'websocket' | 'static' | 'postgresql' | 'mqtt' | 'mysql' | 'influxdb';

export interface BaseDataSourceConfig {
  type: DataSourceType;
  refreshInterval?: number;
}

export interface RestDataSourceConfig extends BaseDataSourceConfig {
  type: 'rest';
  url: string;
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  headers?: Record<string, string>;
  body?: unknown;
  params?: Record<string, string>;
}

export interface GraphQLDataSourceConfig extends BaseDataSourceConfig {
  type: 'graphql';
  endpoint: string;
  query: string;
  variables?: Record<string, unknown>;
  headers?: Record<string, string>;
}

export interface WebSocketDataSourceConfig extends BaseDataSourceConfig {
  type: 'websocket';
  url: string;
  protocols?: string[];
  reconnect?: boolean;
  reconnectInterval?: number;
}

export interface StaticDataSourceConfig extends BaseDataSourceConfig {
  type: 'static';
  data: unknown;
}

export interface PostgreSQLDataSourceConfig extends BaseDataSourceConfig {
  type: 'postgresql';
  host: string;
  port?: number;
  database: string;
  username: string;
  password: string;
  query: string;
  ssl?: boolean;
}

export interface MySQLDataSourceConfig extends BaseDataSourceConfig {
  type: 'mysql';
  host: string;
  port?: number;
  database: string;
  username: string;
  password: string;
  query: string;
  ssl?: boolean;
}

export interface MQTTDataSourceConfig extends BaseDataSourceConfig {
  type: 'mqtt';
  brokerUrl: string;
  port?: number;
  topic: string;
  clientId?: string;
  username?: string;
  password?: string;
  qos?: 0 | 1 | 2;
  retain?: boolean;
  clean?: boolean;
}

export interface InfluxDBDataSourceConfig extends BaseDataSourceConfig {
  type: 'influxdb';
  url: string;
  token: string;
  org: string;
  bucket: string;
  query: string; // Flux query
}

export type DataSourceConfig =
  | RestDataSourceConfig
  | GraphQLDataSourceConfig
  | WebSocketDataSourceConfig
  | StaticDataSourceConfig
  | PostgreSQLDataSourceConfig
  | MySQLDataSourceConfig
  | MQTTDataSourceConfig
  | InfluxDBDataSourceConfig;

// Data transformer function type
export type DataTransformer<TInput = unknown, TOutput = unknown> = (
  data: TInput
) => TOutput;

export interface DataSource {
  config: DataSourceConfig;
  transformer?: DataTransformer;
}

// ============== Layout Types ==============

export interface LayoutConfig {
  x: number;
  y: number;
  w: number; // width in grid units
  h: number; // height in grid units
  minW?: number;
  minH?: number;
  maxW?: number;
  maxH?: number;
  static?: boolean; // prevent dragging/resizing
}

export interface GridLayout {
  cols: number;
  rowHeight: number;
  breakpoints?: {
    lg?: number;
    md?: number;
    sm?: number;
    xs?: number;
  };
  margin?: [number, number];
  containerPadding?: [number, number];
  compactType?: 'vertical' | 'horizontal' | null;
}

// ============== Widget Definition ==============

export interface Widget {
  id: string;
  type: WidgetType;
  config: WidgetConfig;
  dataSource?: DataSource;
  layout: LayoutConfig;
}

// ============== Dashboard Types ==============

export interface Dashboard {
  id: string;
  name: string;
  description?: string;
  widgets: Widget[];
  layout: GridLayout;
  theme?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface AutoRotateConfig {
  enabled: boolean;
  interval: number; // in seconds
  pauseOnHover?: boolean;
}

export interface DashboardCollection {
  dashboards: Dashboard[];
  currentDashboardId: string | null;
  autoRotate: AutoRotateConfig;
}

// ============== Theme Types ==============

export interface ThemeColors {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  foreground: string;
  muted: string;
  border: string;
}

export interface Theme {
  id: string;
  name: string;
  colors: ThemeColors;
  darkMode: boolean;
}

// ============== Error Types ==============

export interface WidgetError {
  widgetId: string;
  message: string;
  code?: string;
  timestamp: Date;
}

// ============== State Types ==============

export interface WidgetState {
  id: string;
  loading: boolean;
  error: WidgetError | null;
  data: unknown;
  lastUpdated?: Date;
}

export interface DashboardState {
  dashboards: Dashboard[];
  currentDashboardId: string | null;
  widgets: Map<string, WidgetState>;
  editMode: boolean;
  selectedWidgetId: string | null;
  autoRotate: AutoRotateConfig;
}

// ============== API Response Types ==============

export interface ApiResponse<T = unknown> {
  data: T;
  status: number;
  message?: string;
}

export interface ApiError {
  message: string;
  code?: string;
  status?: number;
}

// ============== Chart Data Types ==============

export interface ChartDataPoint {
  label: string;
  value: number;
  [key: string]: unknown;
}

export interface ChartDataset {
  label: string;
  data: number[];
  color?: string;
  fill?: boolean;
}

export interface ChartData {
  labels: string[];
  datasets: ChartDataset[];
}

// ============== Table Data Types ==============

export interface TableColumn {
  id: string;
  header: string;
  accessor?: string;
  cell?: (row: unknown) => React.ReactNode;
  sortable?: boolean;
  filterable?: boolean;
  width?: number;
}

export interface TableData {
  columns: TableColumn[];
  rows: unknown[];
}

// ============== Map Data Types ==============

export interface MapMarker {
  id: string;
  position: [number, number]; // [lat, lng]
  title?: string;
  description?: string;
  icon?: string;
  data?: unknown;
}

export interface MapData {
  markers: MapMarker[];
  center?: [number, number];
  zoom?: number;
}

// ============== Number Widget Data Types ==============

export interface NumberData {
  value: number;
  previousValue?: number;
  trend?: 'up' | 'down' | 'neutral';
  trendPercentage?: number;
}
