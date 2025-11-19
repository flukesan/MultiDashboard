import {
  Plus,
  Settings,
  Moon,
  Sun,
  Save,
  LayoutDashboard,
  Maximize2,
  Minimize2,
  Layers,
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
  Clock,
  Home,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useDashboard } from '@/hooks';
import { useThemeStore } from '@/store/theme-store';
import { useAlertStore } from '@/store/alert-store';
import { AlertNotificationCenter } from '@/components/common/AlertNotification';
import { WidgetType } from '@/types';
import { useState, useEffect } from 'react';
import { DashboardManager } from '@/components/common/DashboardManager';
import { AutoRotateSettings } from '@/components/common/AutoRotateSettings';
import { WidgetTypeSelector } from '@/components/common/WidgetTypeSelector';

interface ToolbarProps {
  onNavigateHome?: () => void;
}

export function Toolbar({ onNavigateHome }: ToolbarProps) {
  const {
    editMode,
    setEditMode,
    createWidget,
    saveDashboards,
    currentDashboard,
    dashboards,
    previousDashboard,
    nextDashboard,
    autoRotate,
    startAutoRotate,
    stopAutoRotate,
  } = useDashboard();
  const { mode, toggleMode } = useThemeStore();
  const { alerts, acknowledgeAlert, removeAlert } = useAlertStore();
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [dashboardManagerOpen, setDashboardManagerOpen] = useState(false);
  const [autoRotateSettingsOpen, setAutoRotateSettingsOpen] = useState(false);
  const [widgetSelectorOpen, setWidgetSelectorOpen] = useState(false);

  console.log('Toolbar render - editMode:', editMode);

  // Listen for fullscreen changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

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
      saveDashboards();
      console.log('Save completed');
    } catch (error) {
      console.error('Error saving dashboard:', error);
    }
  };

  const handleEditToggle = () => {
    console.log('Edit button clicked, current mode:', editMode);
    setEditMode(!editMode);
  };

  const handleFullscreenToggle = async () => {
    try {
      if (!document.fullscreenElement) {
        // Enter fullscreen
        await document.documentElement.requestFullscreen();
      } else {
        // Exit fullscreen
        await document.exitFullscreen();
      }
    } catch (error) {
      console.error('Error toggling fullscreen:', error);
    }
  };

  const handleAutoRotateToggle = () => {
    if (autoRotate.enabled) {
      stopAutoRotate();
    } else {
      startAutoRotate();
    }
  };

  return (
    <>
      <div className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex h-16 items-center justify-between px-6">
          {/* Left side - Dashboard info and navigation */}
          <div className="flex items-center space-x-4">
            {onNavigateHome && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onNavigateHome}
                className="gap-2"
              >
                <Home className="h-4 w-4" />
                Home
              </Button>
            )}

            <div className="flex items-center space-x-2">
              <LayoutDashboard className="h-6 w-6 text-primary" />
              <h1 className="text-xl font-bold">
                {currentDashboard?.name || 'MultiDashboard'}
              </h1>
            </div>

            {currentDashboard?.description && (
              <p className="text-sm text-muted-foreground">{currentDashboard.description}</p>
            )}

            {/* Dashboard Navigation - show when multiple dashboards */}
            {dashboards.length > 1 && (
              <div className="flex items-center space-x-1 ml-4 border-l pl-4">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={previousDashboard}
                  title="Previous Dashboard"
                >
                  <ChevronLeft className="h-5 w-5" />
                </Button>
                <span className="text-xs text-muted-foreground px-2">
                  {dashboards.findIndex((d) => d.id === currentDashboard?.id) + 1} / {dashboards.length}
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={nextDashboard}
                  title="Next Dashboard"
                >
                  <ChevronRight className="h-5 w-5" />
                </Button>
              </div>
            )}
          </div>

          {/* Right side - Controls */}
          <div className="flex items-center space-x-2">
            {/* Widget controls - only in edit mode */}
            {editMode && (
              <>
                {/* Add Widget button */}
                <Button
                  variant="default"
                  size="sm"
                  onClick={() => setWidgetSelectorOpen(true)}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Widget
                </Button>

                {/* Save button */}
                <Button variant="outline" size="sm" onClick={handleSave}>
                  <Save className="mr-2 h-4 w-4" />
                  Save
                </Button>

                <div className="w-px h-6 bg-border mx-2" />

                {/* Dashboard Manager button - only in edit mode */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setDashboardManagerOpen(true)}
                >
                  <Layers className="mr-2 h-4 w-4" />
                  Dashboards
                </Button>
              </>
            )}

            {/* Auto-rotate controls - show when not in edit mode and have multiple dashboards */}
            {!editMode && dashboards.length > 1 && (
              <>
                <Button
                  variant={autoRotate.enabled ? 'default' : 'ghost'}
                  size="icon"
                  onClick={handleAutoRotateToggle}
                  title={autoRotate.enabled ? 'Stop Auto-Rotate' : 'Start Auto-Rotate'}
                >
                  {autoRotate.enabled ? (
                    <Pause className="h-5 w-5" />
                  ) : (
                    <Play className="h-5 w-5" />
                  )}
                </Button>

                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setAutoRotateSettingsOpen(true)}
                  title="Auto-Rotate Settings"
                >
                  <Clock className="h-5 w-5" />
                </Button>
              </>
            )}

            <div className="w-px h-6 bg-border mx-2" />

            {/* Edit mode toggle */}
            <Button
              variant={editMode ? 'default' : 'outline'}
              size="sm"
              onClick={handleEditToggle}
            >
              <Settings className="mr-2 h-4 w-4" />
              {editMode ? 'Done' : 'Edit'}
            </Button>

            {/* Fullscreen toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={handleFullscreenToggle}
              title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
            >
              {isFullscreen ? <Minimize2 className="h-5 w-5" /> : <Maximize2 className="h-5 w-5" />}
            </Button>

            {/* Alert Notification Center */}
            <AlertNotificationCenter
              alerts={alerts}
              onAcknowledge={acknowledgeAlert}
              onDismiss={removeAlert}
            />

            {/* Theme toggle */}
            <Button variant="ghost" size="icon" onClick={toggleMode}>
              {mode === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Dashboard Manager Modal */}
      <DashboardManager
        open={dashboardManagerOpen}
        onOpenChange={setDashboardManagerOpen}
      />

      {/* Auto-Rotate Settings Modal */}
      <AutoRotateSettings
        open={autoRotateSettingsOpen}
        onOpenChange={setAutoRotateSettingsOpen}
      />

      {/* Widget Type Selector Modal */}
      <WidgetTypeSelector
        open={widgetSelectorOpen}
        onOpenChange={setWidgetSelectorOpen}
        onSelectWidget={handleAddWidget}
      />
    </>
  );
}
