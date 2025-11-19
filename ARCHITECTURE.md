# MultiDashboard - Architecture Design

## ภาพรวมระบบ

MultiDashboard เป็นระบบแสดงผล Dashboard แบบ Modular ที่ยืดหยุ่น รองรับการแสดงข้อมูลหลายรูปแบบ ดึงข้อมูลจากแหล่งต่างๆ และปรับแต่ง Layout ได้อย่างอิสระ

## เป้าหมายหลัก

1. **Modularity** - Widget แบบ Plug-and-Play
2. **Flexibility** - รองรับ Data Source หลากหลาย
3. **Stability** - Type-safe, Error handling ที่ดี
4. **Modern UI** - ใช้งานง่าย ดูทันสมัย
5. **Performance** - Caching, Lazy loading, Optimized rendering

## Technology Stack

### Frontend Core
- **React 18** - UI Framework พร้อม Concurrent Features
- **TypeScript** - Type safety เพื่อความเสถียร
- **Vite** - Build tool ที่รวดเร็ว

### UI & Styling
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - High-quality React components
- **Framer Motion** - Animation library

### Data Visualization
- **Recharts** - React-based charting library (เสถียรและใช้งานง่าย)
- **React-Leaflet** - Map component
- **@tanstack/react-table** - Powerful table component

### Layout & State
- **react-grid-layout** - Drag-and-drop grid layout
- **Zustand** - Lightweight state management
- **@tanstack/react-query** - Data fetching & caching

## โครงสร้างสถาปัตยกรรม

```
┌─────────────────────────────────────────────────────────┐
│                    Dashboard UI Layer                    │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌─────────┐ │
│  │  Chart   │  │  Number  │  │   Map    │  │  Table  │ │
│  │  Widget  │  │  Widget  │  │  Widget  │  │ Widget  │ │
│  └──────────┘  └──────────┘  └──────────┘  └─────────┘ │
└──────────────────────┬──────────────────────────────────┘
                       │
┌──────────────────────▼──────────────────────────────────┐
│              Widget Abstraction Layer                    │
│  - Widget Registry                                       │
│  - Widget Lifecycle Management                          │
│  - Props Validation                                      │
└──────────────────────┬──────────────────────────────────┘
                       │
┌──────────────────────▼──────────────────────────────────┐
│              Data Abstraction Layer                      │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐        │
│  │ REST API   │  │  GraphQL   │  │ WebSocket  │        │
│  │ Adapter    │  │  Adapter   │  │  Adapter   │        │
│  └────────────┘  └────────────┘  └────────────┘        │
└──────────────────────┬──────────────────────────────────┘
                       │
┌──────────────────────▼──────────────────────────────────┐
│              State Management Layer                      │
│  - Dashboard Configuration                               │
│  - Widget States                                         │
│  - Data Cache (React Query)                             │
│  - Theme & UI State                                      │
└─────────────────────────────────────────────────────────┘
```

## Core Components

### 1. Widget System

#### Widget Interface
```typescript
interface Widget {
  id: string;
  type: WidgetType;
  config: WidgetConfig;
  dataSource: DataSourceConfig;
  layout: LayoutConfig;
}
```

#### Widget Types
- **ChartWidget** - Line, Bar, Pie, Area charts
- **NumberWidget** - KPI, Metrics, Statistics
- **MapWidget** - Geospatial data visualization
- **TableWidget** - Tabular data display
- **TextWidget** - Static text/markdown content
- **CustomWidget** - Extensible for future widgets

### 2. Data Source System

#### Data Source Abstraction
```typescript
interface DataSource {
  type: 'rest' | 'graphql' | 'websocket' | 'static';
  config: DataSourceConfig;
  transformer?: DataTransformer;
  refreshInterval?: number;
}
```

#### Features
- **Adapter Pattern** - แต่ละ data source มี adapter ของตัวเอง
- **Data Transformation** - แปลงข้อมูลก่อนส่งให้ widget
- **Caching** - ใช้ React Query cache data
- **Error Handling** - Retry logic และ fallback data
- **Real-time Support** - WebSocket สำหรับ real-time updates

### 3. Layout System

#### Grid-based Layout
- ใช้ `react-grid-layout`
- Drag-and-drop widgets
- Responsive breakpoints
- Save/Load layout configurations

#### Layout Configuration
```typescript
interface LayoutConfig {
  x: number;
  y: number;
  w: number;  // width in grid units
  h: number;  // height in grid units
  minW?: number;
  minH?: number;
  maxW?: number;
  maxH?: number;
}
```

### 4. Theme System

#### Design Tokens
- Colors (primary, secondary, accent)
- Typography scales
- Spacing system
- Border radius
- Shadows

#### Dark/Light Mode
- System preference detection
- Manual toggle
- Persistent storage

## Directory Structure

```
src/
├── components/
│   ├── ui/                    # shadcn/ui components
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   └── ...
│   ├── widgets/               # Widget components
│   │   ├── ChartWidget/
│   │   ├── NumberWidget/
│   │   ├── MapWidget/
│   │   ├── TableWidget/
│   │   └── BaseWidget.tsx
│   ├── layout/                # Layout components
│   │   ├── DashboardGrid.tsx
│   │   ├── WidgetContainer.tsx
│   │   └── Toolbar.tsx
│   └── common/                # Shared components
│       ├── ErrorBoundary.tsx
│       ├── LoadingSpinner.tsx
│       └── ...
├── lib/
│   ├── data-sources/          # Data source adapters
│   │   ├── rest-adapter.ts
│   │   ├── graphql-adapter.ts
│   │   ├── websocket-adapter.ts
│   │   └── base-adapter.ts
│   ├── widget-registry.ts     # Widget registration system
│   ├── config-validator.ts    # Configuration validation
│   └── utils.ts               # Utility functions
├── store/
│   ├── dashboard-store.ts     # Dashboard state (Zustand)
│   ├── widget-store.ts        # Widget states
│   └── theme-store.ts         # Theme state
├── hooks/
│   ├── useWidget.ts
│   ├── useDataSource.ts
│   ├── useDashboard.ts
│   └── useTheme.ts
├── types/
│   ├── widget.types.ts
│   ├── datasource.types.ts
│   ├── layout.types.ts
│   └── index.ts
├── config/
│   ├── widgets.config.ts      # Default widget configs
│   ├── theme.config.ts        # Theme configuration
│   └── app.config.ts          # App-wide settings
├── pages/
│   ├── Dashboard.tsx          # Main dashboard page
│   ├── WidgetEditor.tsx       # Widget configuration editor
│   └── Settings.tsx           # App settings
├── App.tsx
└── main.tsx
```

## Key Features

### 1. Widget Lifecycle
1. **Registration** - Widget ลงทะเบียนใน registry
2. **Configuration** - กำหนดค่า widget และ data source
3. **Initialization** - โหลดข้อมูลและ setup
4. **Rendering** - แสดงผล widget
5. **Update** - รับข้อมูลใหม่และ re-render
6. **Cleanup** - ทำความสะอาดเมื่อ unmount

### 2. Error Handling Strategy
- **Error Boundaries** - จับ error แต่ละ widget
- **Fallback UI** - แสดง error state ที่เป็นมิตร
- **Retry Logic** - ลองดึงข้อมูลใหม่อัตโนมัติ
- **Logging** - บันทึก error สำหรับ debugging

### 3. Performance Optimization
- **Code Splitting** - Lazy load widgets
- **Memoization** - React.memo สำหรับ widgets
- **Virtual Scrolling** - สำหรับ large tables
- **Debouncing** - สำหรับ real-time data
- **Service Workers** - Cache static assets

### 4. Security
- **Input Validation** - Validate ทุก configuration
- **API Key Management** - เก็บ API keys ปลอดภัย
- **CORS Handling** - จัดการ cross-origin requests
- **XSS Prevention** - Sanitize user inputs

## Data Flow

```
User Interaction
      ↓
Dashboard Component
      ↓
Widget Component
      ↓
useDataSource Hook
      ↓
React Query (Cache Check)
      ↓
Data Adapter
      ↓
External Data Source
      ↓
Data Transformer
      ↓
Widget Rendering
```

## Configuration Example

```typescript
const dashboardConfig = {
  id: 'sales-dashboard',
  name: 'Sales Overview',
  widgets: [
    {
      id: 'revenue-chart',
      type: 'chart',
      config: {
        chartType: 'line',
        title: 'Monthly Revenue',
        colors: ['#3b82f6', '#10b981']
      },
      dataSource: {
        type: 'rest',
        config: {
          url: '/api/sales/revenue',
          method: 'GET',
          refreshInterval: 60000
        },
        transformer: (data) => ({
          labels: data.months,
          datasets: [{
            label: 'Revenue',
            data: data.values
          }]
        })
      },
      layout: { x: 0, y: 0, w: 8, h: 4 }
    },
    {
      id: 'total-sales',
      type: 'number',
      config: {
        title: 'Total Sales',
        format: 'currency',
        prefix: '$',
        trend: true
      },
      dataSource: {
        type: 'rest',
        config: {
          url: '/api/sales/total',
          refreshInterval: 30000
        }
      },
      layout: { x: 8, y: 0, w: 4, h: 2 }
    }
  ]
};
```

## Development Phases

### Phase 1: Foundation (Week 1-2)
- ✅ Setup project structure
- ✅ Install dependencies
- ✅ Configure TypeScript, ESLint, Prettier
- ✅ Setup Tailwind CSS & shadcn/ui
- ✅ Create basic component structure

### Phase 2: Core Systems (Week 3-4)
- Widget registration system
- Data source abstraction layer
- State management setup
- Layout management

### Phase 3: Widget Development (Week 5-6)
- Chart widget implementation
- Number widget implementation
- Table widget implementation
- Map widget implementation

### Phase 4: Integration (Week 7-8)
- Dashboard composition
- Configuration editor
- Theme system
- Error handling

### Phase 5: Polish & Testing (Week 9-10)
- Performance optimization
- Testing (unit & integration)
- Documentation
- Demo examples

## Testing Strategy

- **Unit Tests** - Jest + React Testing Library
- **Integration Tests** - Test widget interactions
- **E2E Tests** - Playwright หรือ Cypress
- **Performance Tests** - Lighthouse CI

## Deployment

- **Build** - Vite production build
- **Hosting** - Vercel, Netlify, or AWS S3+CloudFront
- **CI/CD** - GitHub Actions
- **Monitoring** - Sentry for error tracking

## Future Enhancements

1. **Widget Marketplace** - ให้ผู้ใช้สร้าง custom widgets
2. **Collaboration** - Share dashboards กับทีม
3. **Export/Import** - Dashboard configurations
4. **Mobile App** - React Native version
5. **AI-powered Insights** - Automated data analysis
6. **Advanced Filters** - Cross-widget filtering
7. **Scheduled Reports** - Email/PDF reports
8. **Multi-tenancy** - Support multiple organizations

## Conclusion

สถาปัตยกรรมนี้ออกแบบมาเพื่อความ:
- **Stable** - Type-safe, error handling ที่ดี
- **Scalable** - เพิ่ม widgets และ data sources ได้ง่าย
- **Maintainable** - Code organization ที่ชัดเจน
- **Modern** - ใช้ technology ล่าสุด
- **Performant** - Optimized rendering และ caching
