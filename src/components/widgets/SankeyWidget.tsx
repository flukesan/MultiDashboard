import { useEffect, useState } from 'react';
import { BaseWidget } from './BaseWidget';
import { Widget } from '@/types';
import { AlertTriangle } from 'lucide-react';
import { ResponsiveContainer } from 'recharts';

interface SankeyWidgetProps {
  id: string;
  config: Widget['config'];
  dataSource?: any;
  editMode: boolean;
  onRemove: () => void;
  onEdit: () => void;
  onUpdateTitle: (title: string) => void;
}

interface SankeyNode {
  name: string;
}

interface SankeyLink {
  source: number;
  target: number;
  value: number;
}

interface SankeyData {
  nodes: SankeyNode[];
  links: SankeyLink[];
}

export function SankeyWidget({
  id,
  config,
  dataSource,
  editMode,
  onRemove,
  onEdit,
  onUpdateTitle,
}: SankeyWidgetProps) {
  const [data, setData] = useState<SankeyData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Simulate data fetch
    const fetchData = async () => {
      try {
        setIsLoading(true);

        // Mock Sankey data - Energy flow example
        const mockData: SankeyData = {
          nodes: [
            { name: 'Coal' },
            { name: 'Natural Gas' },
            { name: 'Solar' },
            { name: 'Wind' },
            { name: 'Electricity Generation' },
            { name: 'Industry' },
            { name: 'Residential' },
            { name: 'Commercial' },
          ],
          links: [
            { source: 0, target: 4, value: 350 },
            { source: 1, target: 4, value: 280 },
            { source: 2, target: 4, value: 120 },
            { source: 3, target: 4, value: 150 },
            { source: 4, target: 5, value: 400 },
            { source: 4, target: 6, value: 300 },
            { source: 4, target: 7, value: 200 },
          ],
        };

        setData(mockData);
        setError(null);
      } catch (err) {
        setError('Failed to load data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [dataSource]);

  const renderSankey = () => {
    if (!data) return null;

    const width = 100;
    const height = 100;
    const nodeWidth = 15;

    // Calculate total value for each node
    const nodeValues = new Map<number, number>();
    data.links.forEach((link) => {
      nodeValues.set(link.source, (nodeValues.get(link.source) || 0) + link.value);
      nodeValues.set(link.target, (nodeValues.get(link.target) || 0) + link.value);
    });

    // Position nodes in columns
    const sourceNodes = new Set(data.links.map(l => l.source));
    const targetNodes = new Set(data.links.map(l => l.target));
    const leftNodes = Array.from(sourceNodes).filter(n => !targetNodes.has(n));
    const rightNodes = Array.from(targetNodes).filter(n => !sourceNodes.has(n));
    const middleNodes = Array.from(sourceNodes).filter(n => targetNodes.has(n));

    const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4', '#84cc16'];

    return (
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full">
        {/* Draw links */}
        {data.links.map((link, idx) => {
          const sourceX = leftNodes.includes(link.source) ? 20 : middleNodes.includes(link.source) ? 50 : 80;
          const targetX = rightNodes.includes(link.target) ? 80 : middleNodes.includes(link.target) ? 50 : 20;

          const sourceIndex = leftNodes.indexOf(link.source) !== -1 ? leftNodes.indexOf(link.source) :
                             middleNodes.indexOf(link.source) !== -1 ? middleNodes.indexOf(link.source) : 0;
          const targetIndex = rightNodes.indexOf(link.target) !== -1 ? rightNodes.indexOf(link.target) :
                             middleNodes.indexOf(link.target) !== -1 ? middleNodes.indexOf(link.target) : 0;

          const sourceY = 20 + sourceIndex * 20;
          const targetY = 20 + targetIndex * 20;

          const strokeWidth = (link.value / 100) * 5;

          return (
            <g key={idx}>
              <path
                d={`M ${sourceX},${sourceY} C ${(sourceX + targetX) / 2},${sourceY} ${(sourceX + targetX) / 2},${targetY} ${targetX},${targetY}`}
                fill="none"
                stroke={colors[idx % colors.length]}
                strokeWidth={strokeWidth}
                opacity="0.5"
              />
            </g>
          );
        })}

        {/* Draw nodes */}
        {data.nodes.map((node, idx) => {
          const isLeft = leftNodes.includes(idx);
          const isRight = rightNodes.includes(idx);

          const x = isLeft ? 15 : isRight ? 85 : 50;
          const nodeList = isLeft ? leftNodes : isRight ? rightNodes : middleNodes;
          const nodeIndex = nodeList.indexOf(idx);
          const y = 20 + nodeIndex * 20;

          return (
            <g key={idx}>
              <rect
                x={x}
                y={y - 3}
                width={nodeWidth / 10}
                height={6}
                fill={colors[idx % colors.length]}
                opacity="0.8"
              />
              <text
                x={isLeft ? x - 2 : isRight ? x + 4 : x}
                y={y + 1}
                fontSize="3"
                fill="currentColor"
                textAnchor={isLeft ? 'end' : isRight ? 'start' : 'middle'}
                className="fill-foreground"
              >
                {node.name}
              </text>
            </g>
          );
        })}
      </svg>
    );
  };

  return (
    <BaseWidget
      id={id}
      config={config}
      editMode={editMode}
      onRemove={onRemove}
      onEdit={onEdit}
      onUpdateTitle={onUpdateTitle}
    >
      <div className="flex h-full w-full items-center justify-center p-4">
        {isLoading && (
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        )}

        {error && (
          <div className="flex items-center text-destructive">
            <AlertTriangle className="w-5 h-5 mr-2" />
            {error}
          </div>
        )}

        {!isLoading && !error && data && (
          <ResponsiveContainer width="100%" height="100%">
            <div className="w-full h-full">
              {renderSankey()}
            </div>
          </ResponsiveContainer>
        )}

        {!isLoading && !error && !data && (
          <div className="text-center text-muted-foreground">
            <p>No data available</p>
            <p className="text-xs mt-2">Configure data source to display Sankey diagram</p>
          </div>
        )}
      </div>
    </BaseWidget>
  );
}
