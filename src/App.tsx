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
  const { currentDashboard, setDashboard } = useDashboardStore();

  // Load demo dashboard on first load
  useEffect(() => {
    if (!currentDashboard) {
      setDashboard(DEMO_DASHBOARD);
    }
  }, [currentDashboard, setDashboard]);

  return (
    <QueryClientProvider client={queryClient}>
      <Dashboard />
    </QueryClientProvider>
  );
}

export default App;
