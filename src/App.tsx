import { useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Dashboard } from '@/pages/Dashboard';
import { HomePage } from '@/pages/HomePage';
import { useDashboardStore } from '@/store/dashboard-store';
import { useHomePageStore } from '@/store/homepage-store';
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
  const { dashboards, currentDashboardId, loadDashboards, createDashboard, updateDashboard, navigateToHome } = useDashboardStore();
  const { loadConfig } = useHomePageStore();

  // Load data on first mount
  useEffect(() => {
    loadDashboards();
    loadConfig();
  }, [loadDashboards, loadConfig]);

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

  // Determine which view to show
  // Show HomePage if no dashboard is selected, otherwise show Dashboard
  const showHomePage = !currentDashboardId;

  return (
    <QueryClientProvider client={queryClient}>
      {showHomePage ? (
        <HomePage />
      ) : (
        <Dashboard onNavigateHome={navigateToHome} />
      )}
    </QueryClientProvider>
  );
}

export default App;
