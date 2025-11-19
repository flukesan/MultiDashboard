import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { widgetRegistry } from '@/lib/widget-registry';
import * as Icons from 'lucide-react';
import { WidgetType } from '@/types';

interface WidgetTypeSelectorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelectWidget: (type: WidgetType) => void;
}

export function WidgetTypeSelector({
  open,
  onOpenChange,
  onSelectWidget,
}: WidgetTypeSelectorProps) {
  const widgets = widgetRegistry.getAll();

  const handleSelectWidget = (type: WidgetType) => {
    onSelectWidget(type);
    onOpenChange(false);
  };

  const getIcon = (iconName: string) => {
    const IconComponent = (Icons as any)[iconName];
    return IconComponent ? <IconComponent className="h-8 w-8" /> : null;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader onClose={() => onOpenChange(false)}>
          <DialogTitle>Add Widget</DialogTitle>
          <DialogDescription>
            Choose a widget type to add to your dashboard
          </DialogDescription>
        </DialogHeader>

        {/* Widget Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 py-4">
          {widgets.map((widget) => (
            <Button
              key={widget.type}
              variant="outline"
              className="h-auto flex flex-col items-center gap-3 p-4 hover:bg-accent hover:border-primary transition-all"
              onClick={() => handleSelectWidget(widget.type)}
            >
              {/* Icon */}
              <div className="text-primary">
                {getIcon(widget.icon)}
              </div>

              {/* Name */}
              <div className="text-sm font-semibold text-center">
                {widget.name}
              </div>

              {/* Description */}
              <div className="text-xs text-muted-foreground text-center line-clamp-2">
                {widget.description}
              </div>
            </Button>
          ))}
        </div>

        {/* Footer with info */}
        <div className="pt-4 border-t">
          <p className="text-xs text-muted-foreground text-center">
            {widgets.length} widget types available
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
