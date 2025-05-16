import React, { useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  ArrowUpDown,
  MoreHorizontal,
  Filter,
  Pencil,
  Trash,
  RotateCcw,
  Eye,
  Check,
  Printer,
  QrCode,
  Barcode,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
} from '@/components/ui/pagination';

// Tooltip Component
const Tooltip: React.FC<{ text: string; children: React.ReactNode }> = ({ text, children }) => {
  return (
    <div className="relative group">
      {children}
      {text && (
        <div className="absolute invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-gray-800 text-white text-xs rounded py-1 px-2 z-10 -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap">
          {text}
        </div>
      )}
    </div>
  );
};

export interface Column<T> {
  header: string;
  accessor: keyof T | ((row: T) => string | number);
  sortable?: boolean;
  filterable?: boolean;
  className?: string;
  render?: (value: any, row: T) => React.ReactNode;
}

interface ControlVisibility {
  view?: boolean;
  edit?: boolean;
  delete?: boolean;
  revert?: boolean;
  check?: boolean;
  print?: boolean;
  qr?: boolean;
  bar?: boolean;

  viewTooltip?: string;
  editTooltip?: string;
  deleteTooltip?: string;
  revertTooltip?: string;
  checkTooltip?: string;
  printTooltip?: string;
  qrTooltip?: string;
  barTooltip?: string;
}

interface DataGridProps<T> {
  columns: Column<T>[];
  data: T[];
  pageSize?: number;
  currentPage?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
  onSort?: (column: string, direction: 'asc' | 'desc') => void;
  className?: string;
  striped?: boolean;
  hoverable?: boolean;
  controls?: ControlVisibility;
  onView?: (row: T) => void;
  onEdit?: (row: T) => void;
  onDelete?: (row: T) => void;
  onRevert?: (row: T) => void;
  onCheck?: (row: T) => void;
  onPrint?: (row: T) => void;
  onQr?: (row: T) => void;
  onBar?: (row: T) => void;
}

function DataGrid<T>({
  columns,
  data,
  pageSize = 4,
  currentPage = 1,
  totalPages,
  onPageChange,
  onSort,
  className,
  striped = false,
  hoverable = true,
  controls = {},
  onView,
  onEdit,
  onDelete,
  onRevert,
  onCheck,
  onPrint,
  onQr,
  onBar,
}: DataGridProps<T>) {
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  const handleSort = (column: Column<T>) => {
    if (!column.sortable || typeof column.accessor !== 'string') return;
    const direction =
      sortColumn === column.accessor && sortDirection === 'asc' ? 'desc' : 'asc';
    setSortColumn(column.accessor as string);
    setSortDirection(direction);
    onSort?.(column.accessor as string, direction);
  };

  const calculatedTotalPages = totalPages || Math.ceil(data.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, data.length);
  const paginatedData = data.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    if (page < 1 || page > calculatedTotalPages) return;
    onPageChange?.(page);
  };

  const getCellValue = (row: T, column: Column<T>) => {
    if (typeof column.accessor === 'function') return column.accessor(row);
    return row[column.accessor] as unknown as string | number;
  };

  return (
    <div className={cn('w-full overflow-hidden border border-[#d1d5db]', className)}>
      <ScrollArea className="h-full">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr>
                {columns.map((column, index) => (
                  <th
                    key={index}
                    className={cn(
                      'p-2 text-left font-medium relative sticky top-0 z-10',
                      'bg-blue-600 text-white shadow-sm text-sm',
                      column.sortable && 'cursor-pointer select-none',
                      column.className
                    )}
                    onClick={() => column.sortable && handleSort(column)}
                  >
                    <div className="flex items-center justify-between">
                      <span>{column.header}</span>
                      {column.sortable && (
                        <ArrowUpDown className="h-3.5 w-3.5 ml-1 opacity-70" />
                      )}
                    </div>
                    <div className="absolute right-1 top-1/2 -translate-y-1/2 flex space-x-1">
                      {column.filterable && (
                        <button
                          className="p-1 text-white hover:bg-blue-700 rounded-sm transition-colors"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Filter className="h-3.5 w-3.5" />
                        </button>
                      )}
                      <button
                        className="p-1 text-white hover:bg-blue-700 rounded-sm transition-colors"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <MoreHorizontal className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </th>
                ))}
                {controls.view && <th className="w-[40px] p-2 sticky top-0 z-10 bg-blue-600 text-white text-center text-sm" />}
                {controls.edit && <th className="w-[40px] p-2 sticky top-0 z-10 bg-blue-600 text-white text-center text-sm" />}
                {controls.delete && <th className="w-[40px] p-2 sticky top-0 z-10 bg-blue-600 text-white text-center text-sm" />}
                {controls.revert && <th className="w-[40px] p-2 sticky top-0 z-10 bg-blue-600 text-white text-center text-sm" />}
                {controls.check && <th className="w-[40px] p-2 sticky top-0 z-10 bg-blue-600 text-white text-center text-sm" />}
                {controls.print && <th className="w-[40px] p-2 sticky top-0 z-10 bg-blue-600 text-white text-center text-sm" />}
                {controls.qr && <th className="w-[40px] p-2 sticky top-0 z-10 bg-blue-600 text-white text-center text-sm" />}
                {controls.bar && <th className="w-[40px] p-2 sticky top-0 z-10 bg-blue-600 text-white text-center text-sm" />}
              </tr>
            </thead>
            <tbody>
              {paginatedData.length > 0 ? (
                paginatedData.map((row, rowIndex) => (
                  <tr
                    key={rowIndex}
                    className={cn(
                      'border-t border-[#d1d5db] divide-x divide-[#d1d5db]',
                      hoverable && 'hover:bg-gray-50',
                      striped && rowIndex % 2 === 0 && 'bg-gray-50'
                    )}
                  >
                    {columns.map((column, colIndex) => (
                      <td
                        key={colIndex}
                        className={cn('p-2 text-sm border-b border-[#d1d5db]', column.className)}
                      >
                        {column.render
                          ? column.render(getCellValue(row, column), row)
                          : getCellValue(row, column)}
                      </td>
                    ))}
                     {controls.print && (
                      <td className="p-1 text-center border-b border-[#d1d5db]">
                        <Tooltip text={controls.printTooltip || 'Print'}>
                          <button onClick={() => onPrint?.(row)} className="bg-indigo-600 text-white p-1.5 rounded-full">
                            <Printer className="w-4 h-4" />
                          </button>
                        </Tooltip>
                      </td>
                    )}
                    {controls.bar && (
                      <td className="p-1 text-center border-b border-[#d1d5db]">
                        <Tooltip text={controls.barTooltip || 'Barcode'}>
                          <button onClick={() => onBar?.(row)} className="bg-yellow-600 text-white p-1.5 rounded-full">
                            <Barcode className="w-4 h-4" />
                          </button>
                        </Tooltip>
                      </td>
                    )}
                    {controls.qr && (
                      <td className="p-1 text-center border-b border-[#d1d5db]">
                        <Tooltip text={controls.qrTooltip || 'QR Code'}>
                          <button onClick={() => onQr?.(row)} className="bg-teal-600 text-white p-1.5 rounded-full">
                            <QrCode className="w-4 h-4" />
                          </button>
                        </Tooltip>
                      </td>
                    )}
                    {controls.view && (
                      <td className="p-1 text-center border-b border-[#d1d5db]">
                        <Tooltip text={controls.viewTooltip || 'View'}>
                          <button onClick={() => onView?.(row)} className="bg-green-600 text-white p-1.5 rounded-full">
                            <Eye className="w-4 h-4" />
                          </button>
                        </Tooltip>
                      </td>
                    )}
                    {controls.edit && (
                      <td className="p-1 text-center border-b border-[#d1d5db]">
                        <Tooltip text={controls.editTooltip || 'Edit'}>
                          <button onClick={() => onEdit?.(row)} className="bg-[#2525bd] text-white p-1.5 rounded-full">
                            <Pencil className="w-4 h-4" />
                          </button>
                        </Tooltip>
                      </td>
                    )}
                    {controls.delete && (
                      <td className="p-1 text-center border-b border-[#d1d5db]">
                        <Tooltip text={controls.deleteTooltip || 'Delete'}>
                          <button onClick={() => onDelete?.(row)} className="bg-red-600 text-white p-1.5 rounded-full">
                            <Trash className="w-4 h-4" />
                          </button>
                        </Tooltip>
                      </td>
                    )}
                    {controls.revert && (
                      <td className="p-1 text-center border-b border-[#d1d5db]">
                        <Tooltip text={controls.revertTooltip || 'Revert'}>
                          <button onClick={() => onRevert?.(row)} className="bg-orange-600 text-white p-1.5 rounded-full">
                            <RotateCcw className="w-4 h-4" />
                          </button>
                        </Tooltip>
                      </td>
                    )}
                    {controls.check && (
                      <td className="p-1 text-center border-b border-[#d1d5db]">
                        <Tooltip text={controls.checkTooltip || 'Check'}>
                          <button onClick={() => onCheck?.(row)} className="bg-[#642ec1] text-white p-1.5 rounded-full">
                            <Check className="w-4 h-4" />
                          </button>
                        </Tooltip>
                      </td>
                    )}
                   
                    
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={
                      columns.length +
                      (controls.view ? 1 : 0) +
                      (controls.edit ? 1 : 0) +
                      (controls.delete ? 1 : 0) +
                      (controls.revert ? 1 : 0) +
                      (controls.check ? 1 : 0) +
                      (controls.print ? 1 : 0) +
                      (controls.qr ? 1 : 0) +
                      (controls.bar ? 1 : 0)
                    }
                    className="p-3 text-center text-gray-500 text-sm"
                  >
                    No data available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </ScrollArea>

      {calculatedTotalPages > 1 && (
        <div className="py-2 border-t flex justify-center">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <button
                  onClick={() => handlePageChange(1)}
                  disabled={currentPage === 1}
                  className={cn(
                    'flex items-center justify-center w-7 h-7 text-sm rounded-full',
                    currentPage === 1 ? 'text-gray-400 cursor-not-allowed' : 'text-black hover:bg-gray-100'
                  )}
                >
                  <ChevronsLeft className="h-3.5 w-3.5" />
                </button>
              </PaginationItem>

              <PaginationItem>
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={cn(
                    'flex items-center justify-center w-7 h-7 text-sm rounded-full',
                    currentPage === 1 ? 'text-gray-400 cursor-not-allowed' : 'text-black hover:bg-gray-100'
                  )}
                >
                  <ChevronLeft className="h-3.5 w-3.5" />
                </button>
              </PaginationItem>

              {Array.from({ length: Math.min(5, calculatedTotalPages) }).map((_, index) => {
                let pageNumber;
                if (calculatedTotalPages <= 5) {
                  pageNumber = index + 1;
                } else if (currentPage <= 3) {
                  pageNumber = index + 1;
                } else if (currentPage >= calculatedTotalPages - 2) {
                  pageNumber = calculatedTotalPages - 4 + index;
                } else {
                  pageNumber = currentPage - 2 + index;
                }

                return (
                  <PaginationItem key={index}>
                    <PaginationLink
                      className={cn(
                        'w-7 h-7 text-sm flex items-center justify-center rounded-full',
                        currentPage === pageNumber ? 'bg-blue-600 text-white' : 'hover:bg-gray-100'
                      )}
                      onClick={() => handlePageChange(pageNumber)}
                    >
                      {pageNumber}
                    </PaginationLink>
                  </PaginationItem>
                );
              })}

              <PaginationItem>
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === calculatedTotalPages}
                  className={cn(
                    'flex items-center justify-center w-7 h-7 text-sm rounded-full',
                    currentPage === calculatedTotalPages
                      ? 'text-gray-400 cursor-not-allowed'
                      : 'text-black hover:bg-gray-100'
                  )}
                >
                  <ChevronRight className="h-3.5 w-3.5" />
                </button>
              </PaginationItem>

              <PaginationItem>
                <button
                  onClick={() => handlePageChange(calculatedTotalPages)}
                  disabled={currentPage === calculatedTotalPages}
                  className={cn(
                    'flex items-center justify-center w-7 h-7 text-sm rounded-full',
                    currentPage === calculatedTotalPages
                      ? 'text-gray-400 cursor-not-allowed'
                      : 'text-black hover:bg-gray-100'
                  )}
                >
                  <ChevronsRight className="h-3.5 w-3.5" />
                </button>
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
}

export default DataGrid;
