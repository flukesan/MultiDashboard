import { ReactNode, useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Settings, X, GripVertical } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ErrorBoundary } from '@/components/common/ErrorBoundary';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { BaseWidgetConfig } from '@/types';

interface BaseWidgetProps {
  id: string;
  config: BaseWidgetConfig;
  children: ReactNode;
  isLoading?: boolean;
  error?: Error | null;
  onRemove?: () => void;
  onEdit?: () => void;
  onUpdateTitle?: (title: string) => void;
  editMode?: boolean;
  className?: string;
}

export function BaseWidget({
  id: _id,
  config,
  children,
  isLoading,
  error,
  onRemove,
  onEdit,
  onUpdateTitle,
  editMode,
  className,
}: BaseWidgetProps) {
  const showHeader = config.showHeader !== false;
  const showBorder = config.showBorder !== false;
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [titleValue, setTitleValue] = useState(config.title || '');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditingTitle && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditingTitle]);

  const handleTitleDoubleClick = () => {
    if (editMode) {
      setIsEditingTitle(true);
    }
  };

  const handleTitleBlur = () => {
    setIsEditingTitle(false);
    if (titleValue !== config.title && onUpdateTitle) {
      onUpdateTitle(titleValue);
    }
  };

  const handleTitleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleTitleBlur();
    } else if (e.key === 'Escape') {
      setTitleValue(config.title || '');
      setIsEditingTitle(false);
    }
  };

  return (
    <Card
      className={cn(
        'relative h-full flex flex-col overflow-hidden',
        !showBorder && 'border-0 shadow-none',
        className
      )}
    >
      {showHeader && (config.title || config.description || editMode) && (
        <CardHeader className="flex-shrink-0 space-y-0 pb-4">
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              {config.title && (
                isEditingTitle ? (
                  <Input
                    ref={inputRef}
                    value={titleValue}
                    onChange={(e) => setTitleValue(e.target.value)}
                    onBlur={handleTitleBlur}
                    onKeyDown={handleTitleKeyDown}
                    className="h-8 text-lg font-semibold"
                  />
                ) : (
                  <CardTitle
                    className={cn(
                      'text-lg truncate',
                      editMode && 'cursor-pointer hover:text-primary'
                    )}
                    onDoubleClick={handleTitleDoubleClick}
                    title={editMode ? 'Double-click to edit' : config.title}
                  >
                    {config.title}
                  </CardTitle>
                )
              )}
              {config.description && (
                <CardDescription className="mt-1 truncate">{config.description}</CardDescription>
              )}
            </div>
            {editMode && (
              <div className="flex items-center space-x-1 ml-2 flex-shrink-0">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 cursor-move"
                  data-drag-handle
                  title="Drag to move"
                >
                  <GripVertical className="h-4 w-4" />
                </Button>
                {onEdit && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={onEdit}
                    title="Widget settings"
                  >
                    <Settings className="h-4 w-4" />
                  </Button>
                )}
                {onRemove && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={onRemove}
                    title="Remove widget"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            )}
          </div>
        </CardHeader>
      )}

      <CardContent className="flex-1 min-h-0 overflow-hidden pb-6">
        <ErrorBoundary>
          {isLoading ? (
            <div className="flex h-full items-center justify-center">
              <LoadingSpinner text="Loading..." />
            </div>
          ) : error ? (
            <div className="flex h-full flex-col items-center justify-center space-y-2 text-center">
              <p className="text-sm font-medium text-destructive">Error loading widget</p>
              <p className="text-xs text-muted-foreground">{error.message}</p>
            </div>
          ) : (
            <div className="h-full w-full">{children}</div>
          )}
        </ErrorBoundary>
      </CardContent>
    </Card>
  );
}
