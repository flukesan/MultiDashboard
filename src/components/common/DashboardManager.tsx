import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useDashboardStore } from '@/store/dashboard-store';
import { Plus, Trash2, Check } from 'lucide-react';

interface DashboardManagerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DashboardManager({ open, onOpenChange }: DashboardManagerProps) {
  const {
    dashboards,
    currentDashboardId,
    createDashboard,
    deleteDashboard,
    switchDashboard,
  } = useDashboardStore();

  const [isCreating, setIsCreating] = useState(false);
  const [newName, setNewName] = useState('');
  const [newDescription, setNewDescription] = useState('');

  const handleCreate = () => {
    if (newName.trim()) {
      createDashboard(newName.trim(), newDescription.trim() || undefined);
      setNewName('');
      setNewDescription('');
      setIsCreating(false);
    }
  };

  const handleDelete = (dashboardId: string) => {
    if (dashboards.length > 1) {
      if (confirm('Are you sure you want to delete this dashboard?')) {
        deleteDashboard(dashboardId);
      }
    } else {
      alert('Cannot delete the last dashboard!');
    }
  };

  const handleSwitch = (dashboardId: string) => {
    switchDashboard(dashboardId);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Dashboard Manager</DialogTitle>
          <DialogDescription>
            Create, delete, and switch between dashboards
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          {/* Create New Dashboard */}
          {isCreating ? (
            <div className="border rounded-lg p-4 bg-muted/50 space-y-3">
              <h3 className="font-medium text-sm">New Dashboard</h3>
              <Input
                placeholder="Dashboard name"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleCreate();
                  if (e.key === 'Escape') setIsCreating(false);
                }}
                autoFocus
              />
              <Textarea
                placeholder="Description (optional)"
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
                rows={2}
              />
              <div className="flex gap-2">
                <Button size="sm" onClick={handleCreate} disabled={!newName.trim()}>
                  Create
                </Button>
                <Button size="sm" variant="outline" onClick={() => setIsCreating(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <Button onClick={() => setIsCreating(true)} variant="outline" className="w-full">
              <Plus className="mr-2 h-4 w-4" />
              Create New Dashboard
            </Button>
          )}

          {/* Dashboard List */}
          <div className="space-y-2">
            <h3 className="font-medium text-sm text-muted-foreground">Dashboards ({dashboards.length})</h3>
            {dashboards.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">
                No dashboards yet. Create one to get started!
              </p>
            ) : (
              <div className="space-y-2">
                {dashboards.map((dashboard) => {
                  const isCurrent = dashboard.id === currentDashboardId;
                  return (
                    <div
                      key={dashboard.id}
                      className={`
                        border rounded-lg p-4 flex items-start justify-between
                        transition-colors cursor-pointer hover:bg-muted/50
                        ${isCurrent ? 'bg-primary/10 border-primary' : 'bg-card'}
                      `}
                      onClick={() => !isCurrent && handleSwitch(dashboard.id)}
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium truncate">{dashboard.name}</h4>
                          {isCurrent && (
                            <span className="flex items-center gap-1 text-xs text-primary">
                              <Check className="h-3 w-3" />
                              Active
                            </span>
                          )}
                        </div>
                        {dashboard.description && (
                          <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                            {dashboard.description}
                          </p>
                        )}
                        <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                          <span>{dashboard.widgets.length} widgets</span>
                          {dashboard.updatedAt && (
                            <span>
                              Updated {new Date(dashboard.updatedAt).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                      </div>

                      <Button
                        size="icon"
                        variant="ghost"
                        className="ml-2 text-destructive hover:text-destructive hover:bg-destructive/10"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(dashboard.id);
                        }}
                        disabled={dashboards.length === 1}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
