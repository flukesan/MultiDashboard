import { useState } from 'react';
import { Widget } from '@/types';
import { ChartWidget, NumberWidget, TableWidget } from '@/components/widgets';
import { useWidget } from '@/hooks';
import { WidgetSettingsModal } from '@/components/common/WidgetSettingsModal';

interface WidgetRendererProps {
  widget: Widget;
  editMode: boolean;
}

export function WidgetRenderer({ widget, editMode }: WidgetRendererProps) {
  const { remove, update } = useWidget(widget.id);
  const [settingsOpen, setSettingsOpen] = useState(false);

  const handleEdit = () => {
    setSettingsOpen(true);
  };

  const handleUpdateTitle = (title: string) => {
    update({
      config: {
        ...widget.config,
        title,
      },
    });
  };

  const commonProps = {
    id: widget.id,
    config: widget.config,
    dataSource: widget.dataSource,
    editMode,
    onRemove: remove,
    onEdit: handleEdit,
    onUpdateTitle: handleUpdateTitle,
  };

  const renderWidget = () => {
    switch (widget.type) {
      case 'chart':
        return <ChartWidget {...commonProps} config={widget.config as any} />;

      case 'number':
        return <NumberWidget {...commonProps} config={widget.config as any} />;

      case 'table':
        return <TableWidget {...commonProps} config={widget.config as any} />;

      case 'text':
        return (
          <div className="flex h-full items-center justify-center rounded-lg border border-dashed">
            <p className="text-muted-foreground">Text widget (Coming soon)</p>
          </div>
        );

      case 'map':
        return (
          <div className="flex h-full items-center justify-center rounded-lg border border-dashed">
            <p className="text-muted-foreground">Map widget (Coming soon)</p>
          </div>
        );

      default:
        return (
          <div className="flex h-full items-center justify-center rounded-lg border border-dashed">
            <p className="text-muted-foreground">Unknown widget type: {widget.type}</p>
          </div>
        );
    }
  };

  return (
    <>
      {renderWidget()}
      <WidgetSettingsModal
        widget={widget}
        open={settingsOpen}
        onOpenChange={setSettingsOpen}
        onSave={update}
      />
    </>
  );
}
