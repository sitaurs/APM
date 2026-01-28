'use client';

import { cn } from '@/lib/utils';
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
  showFirstLast?: boolean;
  maxVisible?: number;
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  className,
  showFirstLast = true,
  maxVisible = 5,
}: PaginationProps) {
  const getPageNumbers = () => {
    const pages: (number | 'ellipsis')[] = [];
    
    if (totalPages <= maxVisible) {
      // Show all pages
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Show first page
      pages.push(1);
      
      // Calculate range around current page
      const rangeStart = Math.max(2, currentPage - 1);
      const rangeEnd = Math.min(totalPages - 1, currentPage + 1);
      
      // Add ellipsis if needed before range
      if (rangeStart > 2) {
        pages.push('ellipsis');
      }
      
      // Add range
      for (let i = rangeStart; i <= rangeEnd; i++) {
        pages.push(i);
      }
      
      // Add ellipsis if needed after range
      if (rangeEnd < totalPages - 1) {
        pages.push('ellipsis');
      }
      
      // Show last page
      pages.push(totalPages);
    }
    
    return pages;
  };

  if (totalPages <= 1) return null;

  const pages = getPageNumbers();

  return (
    <nav
      className={cn('flex items-center justify-center gap-1', className)}
      role="navigation"
      aria-label="Pagination"
    >
      {/* Previous Button */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={cn(
          'flex items-center justify-center w-9 h-9 rounded-lg transition-colors',
          'focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1',
          currentPage === 1
            ? 'text-gray-300 cursor-not-allowed'
            : 'text-text-muted hover:bg-gray-100 hover:text-text-main'
        )}
        aria-label="Previous page"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>

      {/* Page Numbers */}
      {pages.map((page, index) =>
        page === 'ellipsis' ? (
          <span
            key={`ellipsis-${index}`}
            className="flex items-center justify-center w-9 h-9 text-text-muted"
          >
            <MoreHorizontal className="w-4 h-4" />
          </span>
        ) : (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={cn(
              'flex items-center justify-center w-9 h-9 rounded-lg text-sm font-medium transition-colors',
              'focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1',
              page === currentPage
                ? 'bg-primary text-white'
                : 'text-text-main hover:bg-gray-100'
            )}
            aria-label={`Page ${page}`}
            aria-current={page === currentPage ? 'page' : undefined}
          >
            {page}
          </button>
        )
      )}

      {/* Next Button */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={cn(
          'flex items-center justify-center w-9 h-9 rounded-lg transition-colors',
          'focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1',
          currentPage === totalPages
            ? 'text-gray-300 cursor-not-allowed'
            : 'text-text-muted hover:bg-gray-100 hover:text-text-main'
        )}
        aria-label="Next page"
      >
        <ChevronRight className="w-5 h-5" />
      </button>
    </nav>
  );
}

// Simple pagination with info
interface PaginationInfoProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  className?: string;
}

export function PaginationInfo({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  className,
}: PaginationInfoProps) {
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <p className={cn('text-sm text-text-muted', className)}>
      Menampilkan <span className="font-medium text-text-main">{startItem}</span> -{' '}
      <span className="font-medium text-text-main">{endItem}</span> dari{' '}
      <span className="font-medium text-text-main">{totalItems}</span> hasil
    </p>
  );
}
