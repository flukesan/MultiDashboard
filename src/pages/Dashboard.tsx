import { DashboardGrid } from '@/components/layout/DashboardGrid';
import { Toolbar } from '@/components/layout/Toolbar';
import { EmptyState } from '@/components/common/EmptyState';
import { LayoutDashboard } from 'lucide-react';
import { useDashboard, useAutoRotate } from '@/hooks';
import { Button } from '@/components/ui/button';

export function Dashboard() {
  const { currentDashboard, editMode, createWidget } = useDashboard();

  // Enable auto-rotate functionality
  useAutoRotate();

  if (!currentDashboard) {
    return null;
  }

  const hasWidgets = currentDashboard.widgets.length > 0;

  return (
    <div className="flex h-screen flex-col">
      <Toolbar />

      <div className="flex-1 overflow-auto" data-dashboard-container>
        {/* Remove container and use minimal padding for full-screen display */}
        <div className={editMode ? 'p-4' : 'p-2'}>
          {hasWidgets ? (
            <DashboardGrid widgets={currentDashboard.widgets} editMode={editMode} />
          ) : (
            <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
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
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
