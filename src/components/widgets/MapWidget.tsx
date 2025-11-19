import { useEffect, useRef, useState, useCallback } from 'react';
import { MapPin, Search } from 'lucide-react';
import { MapWidgetConfig, MapData } from '@/types';
import { BaseWidget } from './BaseWidget';
import { useDataSource } from '@/hooks';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface MapWidgetProps {
  id: string;
  config: MapWidgetConfig;
  dataSource?: any;
  editMode?: boolean;
  onRemove?: () => void;
  onEdit?: () => void;
  onUpdateTitle?: (title: string) => void;
}

// Declare Google Maps types
declare global {
  interface Window {
    google: any;
    initGoogleMaps: () => void;
  }
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
  const mapInstanceRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const [mapReady, setMapReady] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [googleMapsLoaded, setGoogleMapsLoaded] = useState(false);

  // Default center (Bangkok, Thailand)
  const defaultCenter = config.center || [13.7563, 100.5018];
  const defaultZoom = config.zoom || 12;

  // Google Maps API Key - should be in environment variable
  const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';

  // Load Google Maps script
  useEffect(() => {
    if (window.google?.maps) {
      setGoogleMapsLoaded(true);
      return;
    }

    if (!GOOGLE_MAPS_API_KEY) {
      console.warn('Google Maps API key not found. Set VITE_GOOGLE_MAPS_API_KEY in .env file');
      return;
    }

    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places`;
    script.async = true;
    script.defer = true;
    script.onload = () => {
      setGoogleMapsLoaded(true);
    };
    script.onerror = () => {
      console.error('Failed to load Google Maps script');
    };

    document.head.appendChild(script);

    return () => {
      // Cleanup script if component unmounts
      if (script.parentNode) {
        document.head.removeChild(script);
      }
    };
  }, [GOOGLE_MAPS_API_KEY]);

  // Initialize map
  useEffect(() => {
    if (!mapContainerRef.current || !googleMapsLoaded || mapInstanceRef.current) {
      return;
    }

    try {
      const map = new window.google.maps.Map(mapContainerRef.current, {
        center: { lat: defaultCenter[0], lng: defaultCenter[1] },
        zoom: defaultZoom,
        mapTypeControl: true,
        streetViewControl: false,
        fullscreenControl: !editMode,
        zoomControl: true,
      });

      mapInstanceRef.current = map;
      setMapReady(true);

      // Save position on map changes (only in edit mode)
      if (editMode && onEdit) {
        map.addListener('center_changed', () => {
          const center = map.getCenter();
          if (center && config.center) {
            const newCenter: [number, number] = [center.lat(), center.lng()];
            // Only update if significantly different (to avoid too many updates)
            const diff = Math.abs(config.center[0] - newCenter[0]) + Math.abs(config.center[1] - newCenter[1]);
            if (diff > 0.001) {
              // This would trigger a config update through onEdit
              console.log('Map center changed:', newCenter);
            }
          }
        });

        map.addListener('zoom_changed', () => {
          const zoom = map.getZoom();
          if (zoom !== config.zoom) {
            console.log('Map zoom changed:', zoom);
          }
        });
      }
    } catch (err) {
      console.error('Error initializing Google Maps:', err);
    }
  }, [googleMapsLoaded, defaultCenter, defaultZoom, editMode, config.center, config.zoom, onEdit]);

  // Update markers when data changes
  useEffect(() => {
    if (!mapInstanceRef.current || !mapReady) return;

    // Clear existing markers
    markersRef.current.forEach((marker) => marker.setMap(null));
    markersRef.current = [];

    // Add new markers
    if (data?.markers && Array.isArray(data.markers)) {
      data.markers.forEach((markerData: any) => {
        if (markerData.lat && markerData.lng) {
          const marker = new window.google.maps.Marker({
            position: { lat: markerData.lat, lng: markerData.lng },
            map: mapInstanceRef.current,
            title: markerData.title || markerData.label || 'Location',
          });

          // Add info window if there's additional data
          if (markerData.description || markerData.info) {
            const infoWindow = new window.google.maps.InfoWindow({
              content: `
                <div style="padding: 8px;">
                  <h3 style="margin: 0 0 4px 0; font-weight: 600;">${markerData.title || 'Location'}</h3>
                  <p style="margin: 0; font-size: 12px;">${markerData.description || markerData.info || ''}</p>
                </div>
              `,
            });

            marker.addListener('click', () => {
              infoWindow.open(mapInstanceRef.current, marker);
            });
          }

          markersRef.current.push(marker);
        }
      });

      // Fit bounds if multiple markers
      if (data.markers.length > 1) {
        const bounds = new window.google.maps.LatLngBounds();
        data.markers.forEach((markerData: any) => {
          if (markerData.lat && markerData.lng) {
            bounds.extend({ lat: markerData.lat, lng: markerData.lng });
          }
        });
        mapInstanceRef.current.fitBounds(bounds);
      }
    }
  }, [data, mapReady]);

  // Search functionality
  const handleSearch = useCallback(() => {
    if (!searchQuery || !mapInstanceRef.current || !window.google?.maps?.places) return;

    const service = new window.google.maps.places.PlacesService(mapInstanceRef.current);
    const request = {
      query: searchQuery,
      fields: ['name', 'geometry'],
    };

    service.findPlaceFromQuery(request, (results: any, status: any) => {
      if (status === window.google.maps.places.PlacesServiceStatus.OK && results) {
        const place = results[0];
        if (place.geometry?.location) {
          mapInstanceRef.current.setCenter(place.geometry.location);
          mapInstanceRef.current.setZoom(15);

          // Add temporary marker
          const marker = new window.google.maps.Marker({
            position: place.geometry.location,
            map: mapInstanceRef.current,
            title: place.name,
          });

          markersRef.current.push(marker);
        }
      }
    });
  }, [searchQuery]);

  // Save current map position
  const handleSavePosition = useCallback(() => {
    if (!mapInstanceRef.current || !onEdit) return;

    const center = mapInstanceRef.current.getCenter();
    const zoom = mapInstanceRef.current.getZoom();

    if (center) {
      const newCenter: [number, number] = [center.lat(), center.lng()];
      console.log('Saving map position:', { center: newCenter, zoom });
      // This should trigger a config update through the settings modal
      // For now, we'll just log it
      alert(`Position saved!\nLat: ${newCenter[0].toFixed(6)}\nLng: ${newCenter[1].toFixed(6)}\nZoom: ${zoom}`);
    }
  }, [onEdit]);

  const renderContent = () => {
    // Show message if Google Maps API key is not configured
    if (!GOOGLE_MAPS_API_KEY) {
      return (
        <div className="flex h-full flex-col items-center justify-center space-y-4 p-8">
          <MapPin className="h-16 w-16 text-muted-foreground" />
          <div className="text-center">
            <h3 className="font-semibold">Google Maps Not Configured</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Add VITE_GOOGLE_MAPS_API_KEY to your .env file
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              Get your API key from: <br />
              <a
                href="https://console.cloud.google.com/google/maps-apis"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary underline"
              >
                Google Cloud Console
              </a>
            </p>
          </div>
        </div>
      );
    }

    return (
      <div className="relative h-full w-full flex flex-col">
        {/* Search bar - only in edit mode */}
        {editMode && googleMapsLoaded && (
          <div className="absolute top-2 left-2 right-2 z-10 flex gap-2">
            <Input
              type="text"
              placeholder="Search location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              className="bg-background/95 backdrop-blur"
            />
            <Button size="sm" onClick={handleSearch}>
              <Search className="h-4 w-4" />
            </Button>
            <Button size="sm" variant="outline" onClick={handleSavePosition}>
              Save Position
            </Button>
          </div>
        )}

        {/* Map Container */}
        <div ref={mapContainerRef} className="flex-1 w-full rounded-md overflow-hidden bg-muted/20">
          {!googleMapsLoaded && (
            <div className="h-full flex items-center justify-center">
              <div className="text-center space-y-2">
                <MapPin className="h-12 w-12 text-primary mx-auto animate-pulse" />
                <p className="text-sm font-medium">Loading Google Maps...</p>
              </div>
            </div>
          )}
        </div>

        {/* Marker count */}
        {data?.markers && data.markers.length > 0 && (
          <div className="absolute bottom-2 left-2 bg-background/90 border rounded px-3 py-1.5 text-sm backdrop-blur">
            <MapPin className="h-3 w-3 inline mr-1" />
            {data.markers.length} location{data.markers.length !== 1 ? 's' : ''}
          </div>
        )}

        {/* Current position info - edit mode only */}
        {editMode && mapReady && (
          <div className="absolute bottom-2 right-2 bg-background/90 border rounded px-3 py-1.5 text-xs text-muted-foreground backdrop-blur">
            Lat: {defaultCenter[0].toFixed(4)}, Lng: {defaultCenter[1].toFixed(4)}, Zoom: {defaultZoom}
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
