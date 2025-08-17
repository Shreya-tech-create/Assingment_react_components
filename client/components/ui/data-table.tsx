import * as React from "react";
import { ChevronUp, ChevronDown, ChevronsUpDown, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Column<T> {
  key: string;
  title: string;
  dataIndex: keyof T;
  sortable?: boolean;
  render?: (value: any, record: T, index: number) => React.ReactNode;
  width?: string | number;
  align?: 'left' | 'center' | 'right';
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  loading?: boolean;
  selectable?: boolean;
  onRowSelect?: (selectedRows: T[]) => void;
  rowKey?: keyof T | ((record: T) => string | number);
  emptyMessage?: string;
  className?: string;
  maxHeight?: string | number;
}

type SortDirection = 'asc' | 'desc' | null;

interface SortState {
  key: string | null;
  direction: SortDirection;
}

function DataTable<T extends Record<string, any>>({
  data,
  columns,
  loading = false,
  selectable = false,
  onRowSelect,
  rowKey = 'id' as keyof T,
  emptyMessage = "No data available",
  className,
  maxHeight,
}: DataTableProps<T>) {
  const [sortState, setSortState] = React.useState<SortState>({
    key: null,
    direction: null,
  });
  const [selectedRows, setSelectedRows] = React.useState<Set<string | number>>(new Set());

  const getRowKey = React.useCallback((record: T, index: number): string | number => {
    if (typeof rowKey === 'function') {
      return rowKey(record);
    }
    return record[rowKey] ?? index;
  }, [rowKey]);

  // Sort data
  const sortedData = React.useMemo(() => {
    if (!sortState.key || !sortState.direction) {
      return data;
    }

    const column = columns.find(col => col.key === sortState.key);
    if (!column) return data;

    return [...data].sort((a, b) => {
      const aValue = a[column.dataIndex];
      const bValue = b[column.dataIndex];

      if (aValue === bValue) return 0;
      
      let result = 0;
      if (aValue == null) result = -1;
      else if (bValue == null) result = 1;
      else if (typeof aValue === 'string' && typeof bValue === 'string') {
        result = aValue.localeCompare(bValue);
      } else if (typeof aValue === 'number' && typeof bValue === 'number') {
        result = aValue - bValue;
      } else {
        result = String(aValue).localeCompare(String(bValue));
      }

      return sortState.direction === 'desc' ? -result : result;
    });
  }, [data, sortState, columns]);

  const handleSort = (columnKey: string) => {
    const column = columns.find(col => col.key === columnKey);
    if (!column?.sortable) return;

    setSortState(prev => {
      if (prev.key !== columnKey) {
        return { key: columnKey, direction: 'asc' };
      }
      
      switch (prev.direction) {
        case 'asc':
          return { key: columnKey, direction: 'desc' };
        case 'desc':
          return { key: null, direction: null };
        default:
          return { key: columnKey, direction: 'asc' };
      }
    });
  };

  const handleRowSelection = (rowKey: string | number, checked: boolean) => {
    const newSelectedRows = new Set(selectedRows);
    
    if (checked) {
      newSelectedRows.add(rowKey);
    } else {
      newSelectedRows.delete(rowKey);
    }
    
    setSelectedRows(newSelectedRows);
    
    if (onRowSelect) {
      const selectedData = sortedData.filter((item, index) => 
        newSelectedRows.has(getRowKey(item, index))
      );
      onRowSelect(selectedData);
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const allKeys = new Set(sortedData.map((item, index) => getRowKey(item, index)));
      setSelectedRows(allKeys);
      onRowSelect?.(sortedData);
    } else {
      setSelectedRows(new Set());
      onRowSelect?.([]);
    }
  };

  const isAllSelected = sortedData.length > 0 && selectedRows.size === sortedData.length;
  const isIndeterminate = selectedRows.size > 0 && selectedRows.size < sortedData.length;

  const getSortIcon = (columnKey: string) => {
    if (sortState.key !== columnKey) {
      return <ChevronsUpDown className="ml-2 h-4 w-4 text-muted-foreground" />;
    }
    
    if (sortState.direction === 'asc') {
      return <ChevronUp className="ml-2 h-4 w-4" />;
    }
    
    if (sortState.direction === 'desc') {
      return <ChevronDown className="ml-2 h-4 w-4" />;
    }
    
    return <ChevronsUpDown className="ml-2 h-4 w-4 text-muted-foreground" />;
  };

  const tableStyle = maxHeight ? { maxHeight, overflow: 'auto' } : undefined;

  if (loading) {
    return (
      <div className={cn("rounded-md border", className)}>
        <div className="flex items-center justify-center h-64">
          <div className="flex items-center gap-2">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span className="text-muted-foreground">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  if (!loading && data.length === 0) {
    return (
      <div className={cn("rounded-md border", className)}>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <p className="text-muted-foreground">{emptyMessage}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("rounded-md border", className)} style={tableStyle}>
      <Table>
        <TableHeader>
          <TableRow>
            {selectable && (
              <TableHead className="w-12">
                <Checkbox
                  checked={isAllSelected}
                  indeterminate={isIndeterminate}
                  onCheckedChange={handleSelectAll}
                  aria-label="Select all rows"
                />
              </TableHead>
            )}
            {columns.map((column) => (
              <TableHead
                key={column.key}
                style={{ width: column.width }}
                className={cn(
                  column.align === 'center' && 'text-center',
                  column.align === 'right' && 'text-right',
                  column.sortable && 'cursor-pointer select-none hover:bg-muted/50'
                )}
                onClick={() => column.sortable && handleSort(column.key)}
              >
                <div className="flex items-center">
                  {column.title}
                  {column.sortable && getSortIcon(column.key)}
                </div>
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedData.map((row, index) => {
            const key = getRowKey(row, index);
            const isSelected = selectedRows.has(key);
            
            return (
              <TableRow
                key={key}
                data-state={isSelected ? "selected" : undefined}
                className={cn(
                  isSelected && "bg-muted/50",
                  selectable && "cursor-pointer"
                )}
              >
                {selectable && (
                  <TableCell>
                    <Checkbox
                      checked={isSelected}
                      onCheckedChange={(checked) => 
                        handleRowSelection(key, checked as boolean)
                      }
                      aria-label={`Select row ${index + 1}`}
                    />
                  </TableCell>
                )}
                {columns.map((column) => {
                  const value = row[column.dataIndex];
                  const cellContent = column.render 
                    ? column.render(value, row, index)
                    : value;
                  
                  return (
                    <TableCell
                      key={column.key}
                      className={cn(
                        column.align === 'center' && 'text-center',
                        column.align === 'right' && 'text-right'
                      )}
                    >
                      {cellContent}
                    </TableCell>
                  );
                })}
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}

export { DataTable, type DataTableProps, type Column };
