import { Plus, Settings, Moon, Sun, Save, LayoutDashboard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useDashboard } from '@/hooks';
import { useThemeStore } from '@/store/theme-store';
import { WidgetType } from '@/types';

export function Toolbar() {
  const { editMode, setEditMode, createWidget, saveDashboard, currentDashboard } = useDashboard();
  const { mode, toggleMode } = useThemeStore();

  console.log('Toolbar render - editMode:', editMode);

  const handleAddWidget = (type: WidgetType) => {
    console.log('handleAddWidget clicked with type:', type);
    try {
      createWidget(type);
      console.log('Widget created successfully');
    } catch (error) {
      console.error('Error creating widget:', error);
    }
  };

  const handleSave = () => {
    console.log('Save button clicked');
    try {
      saveDashboard();
      console.log('Save completed');
    } catch (error) {
      console.error('Error saving dashboard:', error);
    }
  };

  const handleEditToggle = () => {
    console.log('Edit button clicked, current mode:', editMode);
    setEditMode(!editMode);
  };

  return (
    <div className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center justify-between px-6">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <LayoutDashboard className="h-6 w-6 text-primary" />
            <h1 className="text-xl font-bold">
              {currentDashboard?.name || 'MultiDashboard'}
            </h1>
          </div>
          {currentDashboard?.description && (
            <p className="text-sm text-muted-foreground">{currentDashboard.description}</p>
          )}
        </div>

        <div className="flex items-center space-x-2">
          {editMode && (
            <>
              <Button variant="outline" size="sm" onClick={() => handleAddWidget('number')}>
                <Plus className="mr-2 h-4 w-4" />
                Number
              </Button>
              <Button variant="outline" size="sm" onClick={() => handleAddWidget('chart')}>
                <Plus className="mr-2 h-4 w-4" />
                Chart
              </Button>
              <Button variant="outline" size="sm" onClick={() => handleAddWidget('table')}>
                <Plus className="mr-2 h-4 w-4" />
                Table
              </Button>
              <Button variant="outline" size="sm" onClick={handleSave}>
                <Save className="mr-2 h-4 w-4" />
                Save
              </Button>
            </>
          )}

          <Button
            variant={editMode ? 'default' : 'outline'}
            size="sm"
            onClick={handleEditToggle}
          >
            <Settings className="mr-2 h-4 w-4" />
            {editMode ? 'Done' : 'Edit'}
          </Button>

          <Button variant="ghost" size="icon" onClick={toggleMode}>
            {mode === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>
        </div>
      </div>
    </div>
  );
}
