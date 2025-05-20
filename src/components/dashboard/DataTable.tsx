import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronUp, ChevronDown, Check, X } from 'lucide-react';
import { useVirtualizer } from '@tanstack/react-virtual';

interface Column {
  key: string;
  label: string;
  sortable?: boolean;
}

interface DataTableProps {
  data: any[];
  columns: Column[];
  onRowSelect?: (selectedRows: any[]) => void;
}

export const DataTable: React.FC<DataTableProps> = ({
  data,
  columns,
  onRowSelect,
}) => {
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: 'asc' | 'desc';
  } | null>(null);
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
  const [showBulkActions, setShowBulkActions] = useState(false);

  const parentRef = React.useRef<HTMLDivElement>(null);

  const rowVirtualizer = useVirtualizer({
    count: data.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 48,
    overscan: 5,
  });

  const handleSort = (key: string) => {
    setSortConfig((current) => ({
      key,
      direction:
        current?.key === key && current.direction === 'asc' ? 'desc' : 'asc',
    }));
  };

  const handleRowSelect = (id: string) => {
    const newSelected = new Set(selectedRows);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedRows(newSelected);
    setShowBulkActions(newSelected.size > 0);
    onRowSelect?.(Array.from(newSelected).map((id) => data.find((row) => row.id === id)));
  };

  const sortedData = React.useMemo(() => {
    if (!sortConfig) return data;
    return [...data].sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }, [data, sortConfig]);

  return (
    <div className="relative">
      {/* Table Header */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="sticky top-0 z-10 bg-dark-surface border-b border-dark-border"
      >
        <div className="grid grid-cols-12 gap-4 px-6 py-4">
          {columns.map((column) => (
            <div
              key={column.key}
              className={`col-span-${12 / columns.length} flex items-center space-x-2 ${
                column.sortable ? 'cursor-pointer' : ''
              }`}
              onClick={() => column.sortable && handleSort(column.key)}
            >
              <span className="text-sm font-medium text-text-secondary">
                {column.label}
              </span>
              {column.sortable && (
                <div className="flex flex-col">
                  <ChevronUp
                    className={`h-3 w-3 ${
                      sortConfig?.key === column.key && sortConfig.direction === 'asc'
                        ? 'text-accent-primary'
                        : 'text-text-secondary'
                    }`}
                  />
                  <ChevronDown
                    className={`h-3 w-3 ${
                      sortConfig?.key === column.key && sortConfig.direction === 'desc'
                        ? 'text-accent-primary'
                        : 'text-text-secondary'
                    }`}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </motion.div>

      {/* Bulk Actions */}
      <AnimatePresence>
        {showBulkActions && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="absolute top-0 left-0 right-0 bg-dark-surface border-b border-dark-border z-20"
          >
            <div className="px-6 py-3 flex items-center justify-between">
              <span className="text-sm text-text-secondary">
                {selectedRows.size} items selected
              </span>
              <div className="flex items-center space-x-4">
                <button className="text-sm text-accent-primary hover:text-accent-primary/80 transition-colors">
                  Export
                </button>
                <button className="text-sm text-accent-error hover:text-accent-error/80 transition-colors">
                  Delete
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Table Body */}
      <div
        ref={parentRef}
        className="h-[400px] overflow-auto scrollbar-thin scrollbar-thumb-dark-border scrollbar-track-transparent"
      >
        <div
          style={{
            height: `${rowVirtualizer.getTotalSize()}px`,
            width: '100%',
            position: 'relative',
          }}
        >
          {rowVirtualizer.getVirtualItems().map((virtualRow) => {
            const row = sortedData[virtualRow.index];
            return (
              <motion.div
                key={row.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: virtualRow.index * 0.05 }}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: `${virtualRow.size}px`,
                  transform: `translateY(${virtualRow.start}px)`,
                }}
                className={`grid grid-cols-12 gap-4 px-6 py-3 border-b border-dark-border hover:bg-dark-card transition-colors ${
                  selectedRows.has(row.id) ? 'bg-dark-card' : ''
                }`}
              >
                {columns.map((column) => (
                  <div
                    key={column.key}
                    className={`col-span-${12 / columns.length} flex items-center`}
                  >
                    {column.key === 'select' ? (
                      <button
                        onClick={() => handleRowSelect(row.id)}
                        className="p-1 rounded-full hover:bg-dark-surface transition-colors"
                      >
                        {selectedRows.has(row.id) ? (
                          <Check className="h-4 w-4 text-accent-primary" />
                        ) : (
                          <X className="h-4 w-4 text-text-secondary" />
                        )}
                      </button>
                    ) : (
                      <span className="text-sm text-text-primary">
                        {row[column.key]}
                      </span>
                    )}
                  </div>
                ))}
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}; 