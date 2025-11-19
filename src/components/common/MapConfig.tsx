import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { MapPin } from 'lucide-react';

interface MapConfigData {
  center?: [number, number]; // [lat, lng]
  zoom?: number;
  markerColor?: string;
}

interface MapConfigProps {
  value: MapConfigData | null;
  onChange: (value: MapConfigData) => void;
}

export function MapConfig({ value, onChange }: MapConfigProps) {
  const currentConfig: MapConfigData = value || {
    center: [13.7563, 100.5018], // Bangkok default
    zoom: 12,
    markerColor: '#3b82f6',
  };

  const handleCenterChange = (index: 0 | 1, value: string) => {
    const numValue = parseFloat(value) || 0;
    const newCenter: [number, number] = [...(currentConfig.center || [0, 0])];
    newCenter[index] = numValue;
    onChange({
      ...currentConfig,
      center: newCenter,
    });
  };

  const handleZoomChange = (value: string) => {
    const numValue = parseInt(value) || 12;
    onChange({
      ...currentConfig,
      zoom: Math.max(1, Math.min(20, numValue)), // Clamp between 1-20
    });
  };

  const handleMarkerColorChange = (color: string) => {
    onChange({
      ...currentConfig,
      markerColor: color,
    });
  };

  const handleUseCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          onChange({
            ...currentConfig,
            center: [position.coords.latitude, position.coords.longitude],
            zoom: 15,
          });
        },
        (error) => {
          console.error('Error getting location:', error);
          alert('Could not get your current location. Please check browser permissions.');
        }
      );
    } else {
      alert('Geolocation is not supported by your browser.');
    }
  };

  // Preset locations
  const presetLocations = [
    { name: 'Bangkok, Thailand', center: [13.7563, 100.5018] as [number, number] },
    { name: 'London, UK', center: [51.5074, -0.1278] as [number, number] },
    { name: 'New York, USA', center: [40.7128, -74.0060] as [number, number] },
    { name: 'Tokyo, Japan', center: [35.6762, 139.6503] as [number, number] },
    { name: 'Sydney, Australia', center: [-33.8688, 151.2093] as [number, number] },
  ];

  return (
    <div className="space-y-6">
      {/* Map Center Position */}
      <div className="space-y-3">
        <Label className="text-sm font-semibold">Map Center Position</Label>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="latitude" className="text-xs">
              Latitude
            </Label>
            <Input
              id="latitude"
              type="number"
              step="0.0001"
              value={currentConfig.center?.[0] || 0}
              onChange={(e) => handleCenterChange(0, e.target.value)}
              placeholder="13.7563"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="longitude" className="text-xs">
              Longitude
            </Label>
            <Input
              id="longitude"
              type="number"
              step="0.0001"
              value={currentConfig.center?.[1] || 0}
              onChange={(e) => handleCenterChange(1, e.target.value)}
              placeholder="100.5018"
            />
          </div>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={handleUseCurrentLocation}
          className="w-full"
        >
          <MapPin className="h-4 w-4 mr-2" />
          Use Current Location
        </Button>
      </div>

      {/* Preset Locations */}
      <div className="space-y-3">
        <Label className="text-sm font-semibold">Quick Locations</Label>
        <div className="grid grid-cols-2 gap-2">
          {presetLocations.map((location) => (
            <Button
              key={location.name}
              variant="outline"
              size="sm"
              onClick={() =>
                onChange({
                  ...currentConfig,
                  center: location.center,
                  zoom: 12,
                })
              }
              className="text-xs"
            >
              {location.name}
            </Button>
          ))}
        </div>
      </div>

      {/* Zoom Level */}
      <div className="space-y-2">
        <Label htmlFor="zoom" className="text-sm font-semibold">
          Zoom Level
        </Label>
        <div className="flex items-center gap-3">
          <Input
            id="zoom"
            type="range"
            min="1"
            max="20"
            value={currentConfig.zoom || 12}
            onChange={(e) => handleZoomChange(e.target.value)}
            className="flex-1"
          />
          <Input
            type="number"
            min="1"
            max="20"
            value={currentConfig.zoom || 12}
            onChange={(e) => handleZoomChange(e.target.value)}
            className="w-20"
          />
        </div>
        <p className="text-xs text-muted-foreground">
          1 = World view, 20 = Street level
        </p>
      </div>

      {/* Marker Color */}
      <div className="space-y-2">
        <Label htmlFor="marker-color" className="text-sm font-semibold">
          Marker Color
        </Label>
        <div className="flex items-center gap-3">
          <Input
            id="marker-color"
            type="color"
            value={currentConfig.markerColor || '#3b82f6'}
            onChange={(e) => handleMarkerColorChange(e.target.value)}
            className="w-20 h-10"
          />
          <Input
            type="text"
            value={currentConfig.markerColor || '#3b82f6'}
            onChange={(e) => handleMarkerColorChange(e.target.value)}
            placeholder="#3b82f6"
            className="flex-1"
          />
        </div>
      </div>

      {/* Google Maps API Key Info */}
      <div className="border rounded-lg p-4 space-y-2 bg-muted/30">
        <h4 className="text-sm font-semibold">Google Maps Setup</h4>
        <p className="text-xs text-muted-foreground">
          To use Google Maps, add your API key to the <code className="bg-muted px-1 py-0.5 rounded">.env</code> file:
        </p>
        <pre className="text-xs bg-background border rounded p-2 overflow-x-auto">
          VITE_GOOGLE_MAPS_API_KEY=your_api_key_here
        </pre>
        <p className="text-xs text-muted-foreground">
          Get your API key from{' '}
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
