import { useEffect } from 'react';
import { DashboardGrid } from '@/components/layout/DashboardGrid';
import { Toolbar } from '@/components/layout/Toolbar';
import { EmptyState } from '@/components/common/EmptyState';
import { LayoutDashboard } from 'lucide-react';
import { useDashboard } from '@/hooks';
import { Button } from '@/components/ui/button';

export function Dashboard() {
  const { currentDashboard, editMode, createDashboard, createWidget } = useDashboard();

  // Initialize with a default dashboard if none exists
  useEffect(() => {
    if (!currentDashboard) {
      createDashboard('My Dashboard', 'Welcome to MultiDashboard');
    }
  }, [currentDashboard, createDashboard]);

  if (!currentDashboard) {
    return null;
  }

  const hasWidgets = currentDashboard.widgets.length > 0;

  return (
    <div className="flex h-screen flex-col">
      <Toolbar />

      <div className="flex-1 overflow-auto">
        <div className="container mx-auto p-6">
          {hasWidgets ? (
            <DashboardGrid widgets={currentDashboard.widgets} editMode={editMode} />
          ) : (
            <EmptyState
              icon={LayoutDashboard}
              title="No widgets yet"
              description="Click 'Edit' to start adding widgets to your dashboard"
              action={
                <Button onClick={() => createWidget('number')}>
                  <LayoutDashboard className="mr-2 h-4 w-4" />
                  Add Your First Widget
                </Button>
              }
            />
          )}
        </div>
      </div>
    </div>
  );
}
