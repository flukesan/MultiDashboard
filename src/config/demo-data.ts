/**
 * Demo/Mock data for testing widgets without external APIs
 */

import { Dashboard } from '@/types';

export const DEMO_DASHBOARD: Dashboard = {
  id: 'demo-dashboard',
  name: 'Sales Dashboard',
  description: 'Real-time sales metrics and analytics',
  widgets: [
    // Number Widget - Total Revenue
    {
      id: 'revenue-widget',
      type: 'number',
      config: {
        title: 'Total Revenue',
        description: 'Monthly revenue',
        format: 'currency',
        prefix: '$',
        decimals: 0,
        showTrend: true,
        size: 'md',
      },
      dataSource: {
        config: {
          type: 'static',
          data: {
            value: 125430,
            previousValue: 98750,
            trend: 'up',
          },
        },
      },
      layout: { x: 0, y: 0, w: 3, h: 3, minW: 2, minH: 2 },
    },

    // Number Widget - Active Users
    {
      id: 'users-widget',
      type: 'number',
      config: {
        title: 'Active Users',
        description: 'Current active users',
        format: 'number',
        decimals: 0,
        showTrend: true,
        size: 'md',
      },
      dataSource: {
        config: {
          type: 'static',
          data: {
            value: 2543,
            previousValue: 2890,
            trend: 'down',
          },
        },
      },
      layout: { x: 3, y: 0, w: 3, h: 3, minW: 2, minH: 2 },
    },

    // Number Widget - Conversion Rate
    {
      id: 'conversion-widget',
      type: 'number',
      config: {
        title: 'Conversion Rate',
        description: 'Monthly conversion',
        format: 'percentage',
        decimals: 1,
        showTrend: true,
        size: 'md',
      },
      dataSource: {
        config: {
          type: 'static',
          data: {
            value: 3.8,
            previousValue: 3.2,
            trend: 'up',
          },
        },
      },
      layout: { x: 6, y: 0, w: 3, h: 3, minW: 2, minH: 2 },
    },

    // Number Widget - Orders
    {
      id: 'orders-widget',
      type: 'number',
      config: {
        title: 'Total Orders',
        description: 'This month',
        format: 'number',
        decimals: 0,
        showTrend: false,
        size: 'md',
      },
      dataSource: {
        config: {
          type: 'static',
          data: {
            value: 842,
          },
        },
      },
      layout: { x: 9, y: 0, w: 3, h: 3, minW: 2, minH: 2 },
    },

    // Chart Widget - Revenue Over Time
    {
      id: 'revenue-chart',
      type: 'chart',
      config: {
        title: 'Revenue Trend',
        description: 'Last 6 months',
        chartType: 'line',
        showLegend: true,
        showGrid: true,
        smooth: true,
        colors: ['#3b82f6', '#10b981'],
      },
      dataSource: {
        config: {
          type: 'static',
          data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
            datasets: [
              {
                label: 'Revenue',
                data: [65000, 75000, 82000, 78000, 95000, 125430],
              },
              {
                label: 'Target',
                data: [70000, 72000, 75000, 80000, 90000, 100000],
              },
            ],
          },
        },
      },
      layout: { x: 0, y: 3, w: 6, h: 5, minW: 4, minH: 4 },
    },

    // Chart Widget - Sales by Category (Pie)
    {
      id: 'category-chart',
      type: 'chart',
      config: {
        title: 'Sales by Category',
        description: 'Current month',
        chartType: 'pie',
        showLegend: true,
        colors: ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'],
      },
      dataSource: {
        config: {
          type: 'static',
          data: {
            labels: ['Electronics', 'Clothing', 'Food', 'Books', 'Other'],
            datasets: [
              {
                label: 'Sales',
                data: [35, 25, 20, 12, 8],
              },
            ],
          },
        },
      },
      layout: { x: 6, y: 3, w: 6, h: 5, minW: 4, minH: 4 },
    },

    // Table Widget - Recent Orders
    {
      id: 'orders-table',
      type: 'table',
      config: {
        title: 'Recent Orders',
        description: 'Latest customer orders',
        pagination: true,
        pageSize: 5,
        sortable: true,
        striped: true,
      },
      dataSource: {
        config: {
          type: 'static',
          data: {
            columns: [
              { id: 'id', header: 'Order ID', accessor: 'id' },
              { id: 'customer', header: 'Customer', accessor: 'customer' },
              { id: 'product', header: 'Product', accessor: 'product' },
              { id: 'amount', header: 'Amount', accessor: 'amount' },
              { id: 'status', header: 'Status', accessor: 'status' },
            ],
            rows: [
              {
                id: '#1234',
                customer: 'John Doe',
                product: 'Laptop',
                amount: '$1,299',
                status: 'Completed',
              },
              {
                id: '#1235',
                customer: 'Jane Smith',
                product: 'Phone',
                amount: '$899',
                status: 'Processing',
              },
              {
                id: '#1236',
                customer: 'Bob Johnson',
                product: 'Tablet',
                amount: '$499',
                status: 'Completed',
              },
              {
                id: '#1237',
                customer: 'Alice Brown',
                product: 'Headphones',
                amount: '$299',
                status: 'Shipped',
              },
              {
                id: '#1238',
                customer: 'Charlie Wilson',
                product: 'Monitor',
                amount: '$599',
                status: 'Completed',
              },
              {
                id: '#1239',
                customer: 'Diana Lee',
                product: 'Keyboard',
                amount: '$149',
                status: 'Processing',
              },
            ],
          },
        },
      },
      layout: { x: 0, y: 8, w: 12, h: 6, minW: 6, minH: 5 },
    },
  ],
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
