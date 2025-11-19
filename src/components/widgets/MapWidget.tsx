import { useEffect, useRef, useState } from 'react';
import { MapPin } from 'lucide-react';
import { MapWidgetConfig, MapData } from '@/types';
import { BaseWidget } from './BaseWidget';
import { useDataSource } from '@/hooks';

interface MapWidgetProps {
  id: string;
  config: MapWidgetConfig;
  dataSource?: any;
  editMode?: boolean;
  onRemove?: () => void;
  onEdit?: () => void;
  onUpdateTitle?: (title: string) => void;
}

export function MapWidget({
  id,
  config,
  dataSource,
  editMode,
  onRemove,
  onEdit,
  onUpdateTitle,
}: MapWidgetProps) {
  const { data, isLoading, error } = useDataSource<MapData>(id, dataSource);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const [mapReady, setMapReady] = useState(false);

  // Simulate map initialization
  useEffect(() => {
    if (mapContainerRef.current && !mapReady) {
      // In a real implementation, you would initialize Leaflet here
      // For now, we'll just set it as ready
      const timer = setTimeout(() => {
        setMapReady(true);
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [mapReady]);

  const renderContent = () => {
    // If no data source, show placeholder
    if (!dataSource) {
      return (
        <div className="flex h-full flex-col items-center justify-center space-y-4 p-8">
          <MapPin className="h-16 w-16 text-muted-foreground" />
          <div className="text-center">
            <h3 className="font-semibold">Map Widget</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Configure a data source to display map markers
            </p>
          </div>
          {editMode && (
            <p className="text-xs text-muted-foreground">
              Click the settings icon to configure this widget
            </p>
          )}
        </div>
      );
    }

    // Show map with data
    return (
      <div className="relative h-full w-full">
        {/* Map Container */}
        <div
          ref={mapContainerRef}
          className="h-full w-full rounded-md bg-muted/20 relative overflow-hidden"
        >
          {/* Placeholder Map UI */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center space-y-2">
              <MapPin className="h-12 w-12 text-primary mx-auto" />
              <div>
                <p className="text-sm font-medium">Interactive Map</p>
                <p className="text-xs text-muted-foreground">
                  {data?.markers?.length || 0} marker(s)
                </p>
              </div>
            </div>
          </div>

          {/* Map Controls (simulated) */}
          <div className="absolute top-2 right-2 space-y-1">
            <button className="bg-background border rounded p-1 shadow-sm hover:bg-accent">
              <svg
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
            </button>
            <button className="bg-background border rounded p-1 shadow-sm hover:bg-accent">
              <svg
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M20 12H4"
                />
              </svg>
            </button>
          </div>

          {/* Markers indicator */}
          {data?.markers && data.markers.length > 0 && (
            <div className="absolute bottom-2 left-2 bg-background/90 border rounded px-2 py-1 text-xs">
              {data.markers.length} location{data.markers.length !== 1 ? 's' : ''}
            </div>
          )}
        </div>

        {/* Info about Leaflet integration */}
        {editMode && (
          <div className="absolute bottom-2 right-2 bg-background/90 border rounded px-2 py-1 text-xs text-muted-foreground max-w-xs">
            Full Leaflet integration coming soon
          </div>
        )}
      </div>
    );
  };

  return (
    <BaseWidget
      id={id}
      config={config}
      isLoading={isLoading}
      error={error as Error}
      onRemove={onRemove}
      onEdit={onEdit}
      onUpdateTitle={onUpdateTitle}
      editMode={editMode}
    >
      {renderContent()}
    </BaseWidget>
  );
}
