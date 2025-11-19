import { useMemo } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
  flexRender,
  ColumnDef,
  SortingState,
} from '@tanstack/react-table';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { TableWidgetConfig, TableData } from '@/types';
import { BaseWidget } from './BaseWidget';
import { useDataSource } from '@/hooks';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useState } from 'react';

interface TableWidgetProps {
  id: string;
  config: TableWidgetConfig;
  dataSource?: any;
  editMode?: boolean;
  onRemove?: () => void;
  onEdit?: () => void;
}

export function TableWidget({
  id,
  config,
  dataSource,
  editMode,
  onRemove,
  onEdit,
}: TableWidgetProps) {
  const { data, isLoading, error } = useDataSource<TableData>(id, dataSource);
  const [sorting, setSorting] = useState<SortingState>([]);

  const columns = useMemo<ColumnDef<any>[]>(() => {
    if (!data?.columns) return [];

    return data.columns.map((col) => ({
      id: col.id,
      accessorKey: col.accessor || col.id,
      header: col.header,
      cell: col.cell
        ? ({ row }) => col.cell!(row.original)
        : ({ getValue }) => getValue(),
      enableSorting: config.sortable !== false && col.sortable !== false,
      size: col.width,
    }));
  }, [data?.columns, config.sortable]);

  const table = useReactTable({
    data: data?.rows || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: config.pagination ? getPaginationRowModel() : undefined,
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    state: {
      sorting,
    },
    initialState: {
      pagination: {
        pageSize: config.pageSize || 10,
      },
    },
  });

  const renderContent = () => {
    if (!data) return null;

    return (
      <div className="flex h-full flex-col">
        <div className="flex-1 overflow-auto">
          <table className="w-full border-collapse text-sm">
            <thead className="sticky top-0 z-10 bg-muted backdrop-blur">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      className={cn(
                        'border-b px-4 py-3 text-left font-medium',
                        header.column.getCanSort() && 'cursor-pointer select-none hover:bg-muted'
                      )}
                      onClick={header.column.getToggleSortingHandler()}
                      style={{ width: header.getSize() }}
                    >
                      <div className="flex items-center space-x-2">
                        <span>
                          {flexRender(header.column.columnDef.header, header.getContext())}
                        </span>
                        {header.column.getCanSort() && (
                          <div className="flex flex-col">
                            {header.column.getIsSorted() === 'asc' ? (
                              <ChevronUp className="h-4 w-4" />
                            ) : header.column.getIsSorted() === 'desc' ? (
                              <ChevronDown className="h-4 w-4" />
                            ) : null}
                          </div>
                        )}
                      </div>
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {table.getRowModel().rows.map((row, index) => (
                <tr
                  key={row.id}
                  className={cn(
                    'hover:bg-muted/50',
                    config.striped && index % 2 === 1 && 'bg-muted/20'
                  )}
                >
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="border-b px-4 py-3">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {config.pagination && (
          <div className="flex items-center justify-between border-t px-4 py-3">
            <div className="text-sm text-muted-foreground">
              Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
            </div>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
              >
                Next
              </Button>
            </div>
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
      editMode={editMode}
    >
      {renderContent()}
    </BaseWidget>
  );
}
