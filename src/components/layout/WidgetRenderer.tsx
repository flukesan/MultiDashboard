import { Widget } from '@/types';
import { ChartWidget, NumberWidget, TableWidget } from '@/components/widgets';
import { useWidget } from '@/hooks';

interface WidgetRendererProps {
  widget: Widget;
  editMode: boolean;
}

export function WidgetRenderer({ widget, editMode }: WidgetRendererProps) {
  const { remove } = useWidget(widget.id);

  const commonProps = {
    id: widget.id,
    config: widget.config,
    dataSource: widget.dataSource,
    editMode,
    onRemove: remove,
  };

  switch (widget.type) {
    case 'chart':
      return <ChartWidget {...commonProps} config={widget.config as any} />;

    case 'number':
      return <NumberWidget {...commonProps} config={widget.config as any} />;

    case 'table':
      return <TableWidget {...commonProps} config={widget.config as any} />;

    case 'text':
      // TODO: Implement TextWidget
      return (
        <div className="flex h-full items-center justify-center rounded-lg border border-dashed">
          <p className="text-muted-foreground">Text widget (Coming soon)</p>
        </div>
      );

    case 'map':
      // TODO: Implement MapWidget
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
}
