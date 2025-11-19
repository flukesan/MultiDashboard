import { useState } from 'react';
import { Widget, DataSourceConfig as DataSourceConfigType } from '@/types';
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
import { DataSourceConfig } from './DataSourceConfig';

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
  const [dataSourceConfig, setDataSourceConfig] = useState<DataSourceConfigType | null>(
    widget.dataSource?.config || null
  );
  const [showDataSource, setShowDataSource] = useState(false);

  const handleSave = () => {
    const updates: Partial<Widget> = {
      config: {
        ...widget.config,
        title,
        description,
      },
    };

    // Update data source if configured
    if (dataSourceConfig) {
      updates.dataSource = {
        config: dataSourceConfig,
        transformer: widget.dataSource?.transformer,
      };
    }

    onSave(updates);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
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
            <label className="text-sm font-medium">Description (optional)</label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter widget description"
              rows={2}
            />
          </div>

          {/* Data Source Section */}
          <div className="border-t pt-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-medium">Data Source</h3>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowDataSource(!showDataSource)}
              >
                {showDataSource ? 'Hide' : 'Configure'}
              </Button>
            </div>

            {/* Show current data source info when collapsed */}
            {!showDataSource && dataSourceConfig && (
              <div className="rounded-md bg-muted p-3 text-sm">
                <p className="font-medium">Current: {dataSourceConfig.type.toUpperCase()}</p>
                {dataSourceConfig.type === 'rest' && (
                  <p className="text-xs text-muted-foreground mt-1">
                    {dataSourceConfig.url}
                  </p>
                )}
                {dataSourceConfig.type === 'postgresql' && (
                  <p className="text-xs text-muted-foreground mt-1">
                    {dataSourceConfig.username}@{dataSourceConfig.host}:
                    {dataSourceConfig.port}/{dataSourceConfig.database}
                  </p>
                )}
                {dataSourceConfig.type === 'mysql' && (
                  <p className="text-xs text-muted-foreground mt-1">
                    {dataSourceConfig.username}@{dataSourceConfig.host}:
                    {dataSourceConfig.port}/{dataSourceConfig.database}
                  </p>
                )}
                {dataSourceConfig.type === 'mqtt' && (
                  <p className="text-xs text-muted-foreground mt-1">
                    {dataSourceConfig.brokerUrl} → {dataSourceConfig.topic}
                  </p>
                )}
                {dataSourceConfig.type === 'influxdb' && (
                  <p className="text-xs text-muted-foreground mt-1">
                    {dataSourceConfig.org}/{dataSourceConfig.bucket}
                  </p>
                )}
              </div>
            )}

            {/* Data Source Configuration Form */}
            {showDataSource && (
              <div className="border rounded-lg p-4 bg-muted/30">
                <DataSourceConfig
                  value={dataSourceConfig}
                  onChange={setDataSourceConfig}
                />
              </div>
            )}
          </div>
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
