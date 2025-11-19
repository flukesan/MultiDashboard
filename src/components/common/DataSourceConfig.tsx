import { useState } from 'react';
import type { DataSourceConfig, DataSourceType } from '@/types';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Database, Globe, Radio, TrendingUp, FileJson } from 'lucide-react';

interface DataSourceConfigProps {
  value: DataSourceConfig | null;
  onChange: (config: DataSourceConfig) => void;
}

const DATA_SOURCE_TYPES: Array<{
  type: DataSourceType;
  label: string;
  icon: typeof Database;
  requiresBackend: boolean;
}> = [
  { type: 'rest', label: 'REST API', icon: Globe, requiresBackend: false },
  { type: 'websocket', label: 'WebSocket', icon: Radio, requiresBackend: false },
  { type: 'postgresql', label: 'PostgreSQL', icon: Database, requiresBackend: true },
  { type: 'mysql', label: 'MySQL', icon: Database, requiresBackend: true },
  { type: 'mqtt', label: 'MQTT', icon: Radio, requiresBackend: true },
  { type: 'influxdb', label: 'InfluxDB', icon: TrendingUp, requiresBackend: false },
  { type: 'static', label: 'Static Data', icon: FileJson, requiresBackend: false },
];

export function DataSourceConfig({ value, onChange }: DataSourceConfigProps) {
  const [selectedType, setSelectedType] = useState<DataSourceType>(
    value?.type || 'rest'
  );

  const handleTypeChange = (type: DataSourceType) => {
    setSelectedType(type);

    // Create default config for selected type
    const defaultConfigs: Record<DataSourceType, Partial<DataSourceConfig>> = {
      rest: { type: 'rest', url: '', method: 'GET' },
      graphql: { type: 'graphql', endpoint: '', query: '' },
      websocket: { type: 'websocket', url: '' },
      static: { type: 'static', data: {} },
      postgresql: {
        type: 'postgresql',
        host: 'localhost',
        port: 5432,
        database: '',
        username: '',
        password: '',
        query: 'SELECT * FROM table_name LIMIT 100',
      },
      mysql: {
        type: 'mysql',
        host: 'localhost',
        port: 3306,
        database: '',
        username: '',
        password: '',
        query: 'SELECT * FROM table_name LIMIT 100',
      },
      mqtt: {
        type: 'mqtt',
        brokerUrl: 'mqtt://localhost',
        port: 1883,
        topic: 'sensors/#',
        qos: 0,
      },
      influxdb: {
        type: 'influxdb',
        url: 'http://localhost:8086',
        token: '',
        org: '',
        bucket: '',
        query: '',
      },
    };

    onChange(defaultConfigs[type] as DataSourceConfig);
  };

  const updateConfig = (updates: Partial<DataSourceConfig>) => {
    onChange({ ...(value || {}), ...updates } as DataSourceConfig);
  };

  const selectedTypeInfo = DATA_SOURCE_TYPES.find((t) => t.type === selectedType);

  return (
    <div className="space-y-4">
      {/* Data Source Type Selector */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Data Source Type</label>
        <div className="grid grid-cols-2 gap-2">
          {DATA_SOURCE_TYPES.map((typeInfo) => {
            const Icon = typeInfo.icon;
            const isSelected = selectedType === typeInfo.type;

            return (
              <button
                key={typeInfo.type}
                onClick={() => handleTypeChange(typeInfo.type)}
                className={`
                  flex items-center gap-2 p-3 rounded-lg border text-sm transition-all
                  ${
                    isSelected
                      ? 'border-primary bg-primary/10 font-medium'
                      : 'border-border hover:border-primary/50 hover:bg-muted/50'
                  }
                `}
              >
                <Icon className="h-4 w-4" />
                <span>{typeInfo.label}</span>
                {typeInfo.requiresBackend && (
                  <span className="ml-auto text-xs text-muted-foreground">*Backend</span>
                )}
              </button>
            );
          })}
        </div>
        {selectedTypeInfo?.requiresBackend && (
          <p className="text-xs text-muted-foreground">
            * Requires backend API server to proxy the connection
          </p>
        )}
      </div>

      {/* Dynamic Configuration Fields */}
      <div className="space-y-3">
        {selectedType === 'rest' && (
          <>
            <div>
              <label className="text-sm font-medium">URL</label>
              <Input
                placeholder="https://api.example.com/data"
                value={(value as any)?.url || ''}
                onChange={(e) => updateConfig({ url: e.target.value })}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Method</label>
              <select
                className="w-full px-3 py-2 rounded-md border border-border bg-background"
                value={(value as any)?.method || 'GET'}
                onChange={(e) => updateConfig({ method: e.target.value as any })}
              >
                <option value="GET">GET</option>
                <option value="POST">POST</option>
                <option value="PUT">PUT</option>
                <option value="DELETE">DELETE</option>
              </select>
            </div>
          </>
        )}

        {selectedType === 'postgresql' && (
          <>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm font-medium">Host</label>
                <Input
                  placeholder="localhost"
                  value={(value as any)?.host || ''}
                  onChange={(e) => updateConfig({ host: e.target.value })}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Port</label>
                <Input
                  type="number"
                  placeholder="5432"
                  value={(value as any)?.port || ''}
                  onChange={(e) => updateConfig({ port: parseInt(e.target.value) })}
                />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium">Database</label>
              <Input
                placeholder="mydb"
                value={(value as any)?.database || ''}
                onChange={(e) => updateConfig({ database: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm font-medium">Username</label>
                <Input
                  placeholder="postgres"
                  value={(value as any)?.username || ''}
                  onChange={(e) => updateConfig({ username: e.target.value })}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Password</label>
                <Input
                  type="password"
                  placeholder="••••••••"
                  value={(value as any)?.password || ''}
                  onChange={(e) => updateConfig({ password: e.target.value })}
                />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium">SQL Query</label>
              <Textarea
                placeholder="SELECT * FROM sensors WHERE timestamp > NOW() - INTERVAL '1 hour'"
                value={(value as any)?.query || ''}
                onChange={(e) => updateConfig({ query: e.target.value })}
                rows={3}
              />
            </div>
          </>
        )}

        {selectedType === 'mysql' && (
          <>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm font-medium">Host</label>
                <Input
                  placeholder="localhost"
                  value={(value as any)?.host || ''}
                  onChange={(e) => updateConfig({ host: e.target.value })}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Port</label>
                <Input
                  type="number"
                  placeholder="3306"
                  value={(value as any)?.port || ''}
                  onChange={(e) => updateConfig({ port: parseInt(e.target.value) })}
                />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium">Database</label>
              <Input
                placeholder="mydb"
                value={(value as any)?.database || ''}
                onChange={(e) => updateConfig({ database: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm font-medium">Username</label>
                <Input
                  placeholder="root"
                  value={(value as any)?.username || ''}
                  onChange={(e) => updateConfig({ username: e.target.value })}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Password</label>
                <Input
                  type="password"
                  placeholder="••••••••"
                  value={(value as any)?.password || ''}
                  onChange={(e) => updateConfig({ password: e.target.value })}
                />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium">SQL Query</label>
              <Textarea
                placeholder="SELECT * FROM sensors WHERE timestamp > DATE_SUB(NOW(), INTERVAL 1 HOUR)"
                value={(value as any)?.query || ''}
                onChange={(e) => updateConfig({ query: e.target.value })}
                rows={3}
              />
            </div>
          </>
        )}

        {selectedType === 'mqtt' && (
          <>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm font-medium">Broker URL</label>
                <Input
                  placeholder="mqtt://broker.hivemq.com"
                  value={(value as any)?.brokerUrl || ''}
                  onChange={(e) => updateConfig({ brokerUrl: e.target.value })}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Port</label>
                <Input
                  type="number"
                  placeholder="1883"
                  value={(value as any)?.port || ''}
                  onChange={(e) => updateConfig({ port: parseInt(e.target.value) })}
                />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium">Topic</label>
              <Input
                placeholder="sensors/temperature"
                value={(value as any)?.topic || ''}
                onChange={(e) => updateConfig({ topic: e.target.value })}
              />
              <p className="text-xs text-muted-foreground mt-1">
                Use # for multi-level wildcard, + for single-level wildcard
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm font-medium">Username (optional)</label>
                <Input
                  placeholder="username"
                  value={(value as any)?.username || ''}
                  onChange={(e) => updateConfig({ username: e.target.value })}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Password (optional)</label>
                <Input
                  type="password"
                  placeholder="••••••••"
                  value={(value as any)?.password || ''}
                  onChange={(e) => updateConfig({ password: e.target.value })}
                />
              </div>
            </div>
          </>
        )}

        {selectedType === 'influxdb' && (
          <>
            <div>
              <label className="text-sm font-medium">URL</label>
              <Input
                placeholder="http://localhost:8086"
                value={(value as any)?.url || ''}
                onChange={(e) => updateConfig({ url: e.target.value })}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Token</label>
              <Input
                type="password"
                placeholder="Your InfluxDB token"
                value={(value as any)?.token || ''}
                onChange={(e) => updateConfig({ token: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm font-medium">Organization</label>
                <Input
                  placeholder="my-org"
                  value={(value as any)?.org || ''}
                  onChange={(e) => updateConfig({ org: e.target.value })}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Bucket</label>
                <Input
                  placeholder="my-bucket"
                  value={(value as any)?.bucket || ''}
                  onChange={(e) => updateConfig({ bucket: e.target.value })}
                />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium">Flux Query</label>
              <Textarea
                placeholder={`from(bucket: "my-bucket")
  |> range(start: -1h)
  |> filter(fn: (r) => r._measurement == "temperature")`}
                value={(value as any)?.query || ''}
                onChange={(e) => updateConfig({ query: e.target.value })}
                rows={4}
              />
            </div>
          </>
        )}

        {selectedType === 'websocket' && (
          <div>
            <label className="text-sm font-medium">WebSocket URL</label>
            <Input
              placeholder="wss://api.example.com/ws"
              value={(value as any)?.url || ''}
              onChange={(e) => updateConfig({ url: e.target.value })}
            />
          </div>
        )}

        {selectedType === 'static' && (
          <div>
            <label className="text-sm font-medium">JSON Data</label>
            <Textarea
              placeholder='{"labels": ["A", "B", "C"], "values": [10, 20, 30]}'
              value={
                typeof (value as any)?.data === 'string'
                  ? (value as any)?.data
                  : JSON.stringify((value as any)?.data || {}, null, 2)
              }
              onChange={(e) => {
                try {
                  updateConfig({ data: JSON.parse(e.target.value) });
                } catch {
                  updateConfig({ data: e.target.value });
                }
              }}
              rows={6}
            />
          </div>
        )}

        {/* Refresh Interval (common to all) */}
        <div>
          <label className="text-sm font-medium">Refresh Interval (ms)</label>
          <Input
            type="number"
            placeholder="5000"
            value={(value as any)?.refreshInterval || ''}
            onChange={(e) =>
              updateConfig({ refreshInterval: parseInt(e.target.value) || undefined })
            }
          />
          <p className="text-xs text-muted-foreground mt-1">
            Leave empty for no auto-refresh (except real-time sources like MQTT/WebSocket)
          </p>
        </div>
      </div>
    </div>
  );
}
