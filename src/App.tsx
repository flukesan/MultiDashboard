import { useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Dashboard } from '@/pages/Dashboard';
import { useDashboardStore } from '@/store/dashboard-store';
import { DEMO_DASHBOARD } from '@/config/demo-data';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

function App() {
  const { dashboards, loadDashboards, createDashboard, updateDashboard } = useDashboardStore();

  // Load dashboards on first mount
  useEffect(() => {
    loadDashboards();
  }, [loadDashboards]);

  // Create demo dashboard if no dashboards exist
  useEffect(() => {
    if (dashboards.length === 0) {
      const newDashboard = createDashboard(
        DEMO_DASHBOARD.name,
        DEMO_DASHBOARD.description
      );

      // Add demo widgets to the new dashboard
      if (DEMO_DASHBOARD.widgets.length > 0) {
        updateDashboard(newDashboard.id, {
          widgets: DEMO_DASHBOARD.widgets,
        });
      }
    }
  }, [dashboards, createDashboard, updateDashboard]);

  return (
    <QueryClientProvider client={queryClient}>
      <Dashboard />
    </QueryClientProvider>
  );
}

export default App;
