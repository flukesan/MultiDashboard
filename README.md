# MultiDashboard

**Dashboard แบบ Modular ที่ยืดหยุ่น รองรับการแสดงข้อมูลหลายรูปแบบ**

## ✨ Features

- 📊 **Multiple Widget Types**: Chart, Number, Table, Map, Text
- 🔄 **Flexible Data Sources**: REST API, GraphQL, WebSocket, Static data
- 🎨 **Modern UI**: ใช้ Tailwind CSS และ shadcn/ui
- 📱 **Responsive Layout**: Drag-and-drop grid layout ที่ปรับขนาดได้
- 🌗 **Dark/Light Mode**: รองรับทั้ง dark และ light theme
- 💾 **State Management**: ใช้ Zustand สำหรับ state management
- 🔍 **Type-Safe**: เขียนด้วย TypeScript 100%
- ⚡ **Fast**: ใช้ Vite เป็น build tool
- 🎯 **Stable**: Error boundaries, retry logic, และ caching

## 🚀 Quick Start

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 📦 Project Structure

```
src/
├── components/
│   ├── ui/                 # Basic UI components
│   ├── widgets/            # Widget components
│   ├── layout/             # Layout components
│   └── common/             # Shared components
├── lib/
│   ├── data-sources/       # Data source adapters
│   ├── widget-registry.ts  # Widget registration
│   └── utils.ts            # Utility functions
├── store/                  # Zustand stores
├── hooks/                  # Custom React hooks
├── types/                  # TypeScript types
├── config/                 # Configuration files
└── pages/                  # Page components
```

## 🎯 Available Widget Types

### 1. Number Widget
แสดงตัวเลข KPI พร้อม trend indicator

```typescript
{
  type: 'number',
  config: {
    title: 'Total Revenue',
    format: 'currency',
    prefix: '$',
    showTrend: true,
  },
  dataSource: {
    config: { type: 'rest', url: '/api/revenue' }
  }
}
```

### 2. Chart Widget
แสดงกราฟหลายประเภท: Line, Bar, Pie, Area

```typescript
{
  type: 'chart',
  config: {
    title: 'Sales Trend',
    chartType: 'line',
    showLegend: true,
    colors: ['#3b82f6', '#10b981'],
  },
  dataSource: {
    config: { type: 'rest', url: '/api/sales' }
  }
}
```

### 3. Table Widget
แสดงข้อมูลตาราง พร้อม sorting และ pagination

```typescript
{
  type: 'table',
  config: {
    title: 'Recent Orders',
    pagination: true,
    sortable: true,
  },
  dataSource: {
    config: { type: 'rest', url: '/api/orders' }
  }
}
```

## 🔌 Data Sources

### REST API
```typescript
{
  type: 'rest',
  url: '/api/data',
  method: 'GET',
  headers: { 'Authorization': 'Bearer token' },
  refreshInterval: 60000, // 1 minute
}
```

### WebSocket
```typescript
{
  type: 'websocket',
  url: 'wss://api.example.com/stream',
  reconnect: true,
  reconnectInterval: 3000,
}
```

### Static Data
```typescript
{
  type: 'static',
  data: {
    value: 1234,
    trend: 'up',
  }
}
```

## 🎨 Customization

### Theme
แก้ไขสีใน `src/index.css`:

```css
:root {
  --primary: 221.2 83.2% 53.3%;
  --secondary: 210 40% 96.1%;
  /* ... */
}
```

### Widget Layout
ปรับแต่ง grid layout:

```typescript
{
  cols: 12,
  rowHeight: 50,
  margin: [16, 16],
  compactType: 'vertical',
}
```

## 📖 API Reference

### Creating a Dashboard

```typescript
import { useDashboard } from '@/hooks';

function MyComponent() {
  const { createDashboard, createWidget } = useDashboard();

  const handleCreate = () => {
    createDashboard('My Dashboard', 'Description');
    createWidget('number');
    createWidget('chart');
  };
}
```

### Custom Data Transformer

```typescript
{
  dataSource: {
    config: { type: 'rest', url: '/api/data' },
    transformer: (data) => ({
      value: data.total,
      previousValue: data.lastMonth,
    })
  }
}
```

## 🛠️ Development

### Adding a New Widget Type

1. Create widget component in `src/components/widgets/`
2. Register widget in widget registry
3. Add widget type to TypeScript types

```typescript
// 1. Create widget component
export function MyWidget({ id, config, dataSource }: WidgetProps) {
  return <BaseWidget>...</BaseWidget>;
}

// 2. Register widget
widgetRegistry.register({
  type: 'mywidget',
  name: 'My Widget',
  component: MyWidget,
  defaultConfig: { /* ... */ },
  defaultLayout: { w: 4, h: 3 },
});
```

### Creating a Custom Data Adapter

```typescript
export class CustomAdapter extends BaseDataSourceAdapter {
  async fetch(): Promise<unknown> {
    // Implement fetch logic
    const data = await fetchFromCustomSource();
    return this.transform(data);
  }

  protected validateConfig(): void {
    // Validate configuration
  }
}
```

## 🔧 Technologies Used

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **Zustand** - State management
- **React Query** - Data fetching & caching
- **Recharts** - Charts
- **React Grid Layout** - Grid system
- **React Table** - Tables

## 📝 Architecture

สามารถอ่านเอกสารสถาปัตยกรรมฉบับเต็มได้ที่ [ARCHITECTURE.md](./ARCHITECTURE.md)

## 🤝 Contributing

Contributions are welcome! Please read the architecture document first.

## 📄 License

MIT

## 🎯 Roadmap

- [ ] Map Widget (Leaflet integration)
- [ ] GraphQL Data Source
- [ ] Real-time collaboration
- [ ] Dashboard templates
- [ ] Export/Import dashboards
- [ ] Mobile app
- [ ] Widget marketplace
- [ ] Advanced filtering
- [ ] Scheduled reports

## 💡 Tips

1. **Performance**: ใช้ `refreshInterval` อย่างระมัดระวังเพื่อไม่ให้ API overload
2. **Error Handling**: Widget แต่ละตัวมี Error Boundary แยกกัน
3. **Caching**: React Query จะ cache data อัตโนมัติ
4. **Type Safety**: ใช้ TypeScript types เพื่อความปลอดภัย
5. **Testing**: แนะนำใช้ static data source สำหรับการทดสอบ

## 🆘 Support

หากพบปัญหาหรือมีคำถาม:
- อ่าน [ARCHITECTURE.md](./ARCHITECTURE.md)
- เช็ค demo data ใน `src/config/demo-data.ts`
- ดูตัวอย่าง widget implementations

---

Built with ❤️ using modern web technologies