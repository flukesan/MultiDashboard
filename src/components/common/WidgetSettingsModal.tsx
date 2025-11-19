import { useState } from 'react';
import { Widget } from '@/types';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

interface WidgetSettingsModalProps {
  widget: Widget;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (updates: Partial<Widget>) => void;
}

export function WidgetSettingsModal({
  widget,
  open,
  onOpenChange,
  onSave,
}: WidgetSettingsModalProps) {
  const [title, setTitle] = useState(widget.config.title || '');
  const [description, setDescription] = useState(widget.config.description || '');
  const [dataSourceUrl, setDataSourceUrl] = useState(
    widget.dataSource?.config.type === 'rest' ? widget.dataSource.config.url : ''
  );

  const handleSave = () => {
    const updates: Partial<Widget> = {
      config: {
        ...widget.config,
        title,
        description,
      },
    };

    // Update data source if REST API
    if (widget.dataSource?.config.type === 'rest' && dataSourceUrl) {
      updates.dataSource = {
        ...widget.dataSource,
        config: {
          ...widget.dataSource.config,
          url: dataSourceUrl,
        },
      };
    }

    onSave(updates);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader onClose={() => onOpenChange(false)}>
          <DialogTitle>Widget Settings</DialogTitle>
          <DialogDescription>
            Configure widget title, description, and data source
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Title */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Title</label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter widget title"
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Description</label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter widget description"
              rows={2}
            />
          </div>

          {/* Data Source (only for REST) */}
          {widget.dataSource?.config.type === 'rest' && (
            <div className="space-y-2">
              <label className="text-sm font-medium">Data Source URL</label>
              <Input
                value={dataSourceUrl}
                onChange={(e) => setDataSourceUrl(e.target.value)}
                placeholder="https://api.example.com/data"
              />
              <p className="text-xs text-muted-foreground">
                Enter the REST API endpoint for this widget
              </p>
            </div>
          )}

          {/* Data Source Type Info */}
          {widget.dataSource && (
            <div className="rounded-md bg-muted p-3">
              <p className="text-xs font-medium">Data Source Type</p>
              <p className="text-xs text-muted-foreground capitalize">
                {widget.dataSource.config.type}
              </p>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
