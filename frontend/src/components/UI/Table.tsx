import React from 'react';
import { cn } from '@/lib/utils';
import { ChevronUp, ChevronDown } from 'lucide-react';

export interface TableProps extends React.HTMLAttributes<HTMLTableElement> {
  children: React.ReactNode;
}

export function Table({ className, children, ...props }: TableProps) {
  return (
    <div className="overflow-x-auto border border-gray-800 rounded-lg bg-[#0a0a0a]">
      <table
        className={cn('w-full text-sm text-left text-gray-300', className)}
        {...props}
      >
        {children}
      </table>
    </div>
  );
}

export interface TableHeaderProps extends React.HTMLAttributes<HTMLTableSectionElement> {
  children: React.ReactNode;
}

export function TableHeader({ className, children, ...props }: TableHeaderProps) {
  return (
    <thead
      className={cn('bg-[#1a1a1a] border-b border-gray-800', className)}
      {...props}
    >
      {children}
    </thead>
  );
}

export interface TableBodyProps extends React.HTMLAttributes<HTMLTableSectionElement> {
  children: React.ReactNode;
}

export function TableBody({ className, children, ...props }: TableBodyProps) {
  return (
    <tbody className={cn('divide-y divide-gray-800 bg-[#0a0a0a]', className)} {...props}>
      {children}
    </tbody>
  );
}

export interface TableRowProps extends React.HTMLAttributes<HTMLTableRowElement> {
  children: React.ReactNode;
}

export function TableRow({ className, children, ...props }: TableRowProps) {
  return (
    <tr className={cn('hover:bg-[#1a1a1a] transition-colors', className)} {...props}>
      {children}
    </tr>
  );
}

export interface TableHeadProps extends React.ThHTMLAttributes<HTMLTableCellElement> {
  children: React.ReactNode;
  sortable?: boolean;
  sortDirection?: 'asc' | 'desc' | null;
  onSort?: () => void;
}

export function TableHead({ 
  className, 
  children, 
  sortable = false, 
  sortDirection, 
  onSort,
  ...props 
}: TableHeadProps) {
  return (
    <th
      className={cn(
        'px-6 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider',
        sortable && 'cursor-pointer select-none hover:bg-[#252525]',
        className
      )}
      onClick={sortable ? onSort : undefined}
      {...props}
    >
      <div className="flex items-center gap-2">
        {children}
        {sortable && (
          <div className="flex flex-col">
            <ChevronUp 
              className={cn(
                'h-3 w-3 -mb-1',
                sortDirection === 'asc' ? 'text-white' : 'text-gray-600'
              )} 
            />
            <ChevronDown 
              className={cn(
                'h-3 w-3',
                sortDirection === 'desc' ? 'text-white' : 'text-gray-600'
              )} 
            />
          </div>
        )}
      </div>
    </th>
  );
}

export interface TableCellProps extends React.TdHTMLAttributes<HTMLTableCellElement> {
  children: React.ReactNode;
}

export function TableCell({ className, children, ...props }: TableCellProps) {
  return (
    <td className={cn('px-6 py-4 whitespace-nowrap text-gray-300', className)} {...props}>
      {children}
    </td>
  );
}
