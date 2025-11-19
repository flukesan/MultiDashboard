import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useDashboardStore } from '@/store/dashboard-store';

interface AutoRotateSettingsProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AutoRotateSettings({ open, onOpenChange }: AutoRotateSettingsProps) {
  const { autoRotate, setAutoRotate } = useDashboardStore();
  const [interval, setInterval] = useState(autoRotate.interval.toString());
  const [pauseOnHover, setPauseOnHover] = useState(autoRotate.pauseOnHover ?? true);

  // Sync with store when dialog opens
  useEffect(() => {
    if (open) {
      setInterval(autoRotate.interval.toString());
      setPauseOnHover(autoRotate.pauseOnHover ?? true);
    }
  }, [open, autoRotate]);

  const handleSave = () => {
    const intervalNum = parseInt(interval, 10);
    if (intervalNum > 0) {
      setAutoRotate({
        interval: intervalNum,
        pauseOnHover,
      });
      onOpenChange(false);
    }
  };

  const handleCancel = () => {
    // Reset to current values
    setInterval(autoRotate.interval.toString());
    setPauseOnHover(autoRotate.pauseOnHover ?? true);
    onOpenChange(false);
  };

  const intervalNum = parseInt(interval, 10);
  const isValid = !isNaN(intervalNum) && intervalNum > 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Auto-Rotate Settings</DialogTitle>
          <DialogDescription>
            Configure automatic dashboard rotation for slideshow mode
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          {/* Interval Setting */}
          <div className="space-y-2">
            <label htmlFor="interval" className="text-sm font-medium">
              Rotation Interval (seconds)
            </label>
            <Input
              id="interval"
              type="number"
              min="1"
              max="3600"
              value={interval}
              onChange={(e) => setInterval(e.target.value)}
              placeholder="Enter seconds"
            />
            {!isValid && interval !== '' && (
              <p className="text-xs text-destructive">
                Please enter a valid number greater than 0
              </p>
            )}
            <p className="text-xs text-muted-foreground">
              How long to display each dashboard before switching to the next
            </p>
          </div>

          {/* Pause on Hover */}
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="pauseOnHover"
              checked={pauseOnHover}
              onChange={(e) => setPauseOnHover(e.target.checked)}
              className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
            />
            <label
              htmlFor="pauseOnHover"
              className="text-sm font-medium cursor-pointer"
            >
              Pause rotation when hovering over dashboard
            </label>
          </div>

          {/* Quick presets */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">
              Quick Presets
            </label>
            <div className="flex gap-2 flex-wrap">
              <Button
                size="sm"
                variant="outline"
                onClick={() => setInterval('5')}
              >
                5s
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setInterval('10')}
              >
                10s
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setInterval('15')}
              >
                15s
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setInterval('30')}
              >
                30s
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setInterval('60')}
              >
                1m
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setInterval('300')}
              >
                5m
              </Button>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={!isValid}>
              Save Settings
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
