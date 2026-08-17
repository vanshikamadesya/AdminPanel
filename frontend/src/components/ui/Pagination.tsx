import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from './Button';

interface PaginationProps {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
}

export function Pagination({ page, pageSize, total, totalPages, onPageChange, onPageSizeChange }: PaginationProps) {
  const isAll = total > 0 && pageSize >= total;
  const start = total === 0 ? 0 : isAll ? 1 : (page - 1) * pageSize + 1;
  const end = isAll ? total : Math.min(page * pageSize, total);

  return (
    <div className="flex flex-wrap items-center justify-center gap-4 border-t pt-4">
      <div className="flex items-center gap-3 text-sm text-muted-foreground">
        <span>Rows per page</span>
        <select
          value={isAll ? 'all' : String(pageSize)}
          onChange={(event) => {
            const val = event.target.value;
            onPageSizeChange(val === 'all' ? total : Number(val));
          }}
          className="h-8 rounded-md border border-input bg-background px-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          aria-label="Rows per page"
        >
          {[10, 25, 50, 100].map((size) => <option key={size} value={size}>{size}</option>)}
          <option value="all">All</option>
        </select>
        <span>{start}–{end} of {total}</span>
      </div>
      <div className="flex items-center gap-3">
        {!isAll && (
          <span className="text-sm text-muted-foreground">Page {totalPages ? page : 0} of {totalPages}</span>
        )}
        <div className="flex items-center gap-1">
          <Button variant="outline" size="icon" className="h-8 w-8" disabled={page <= 1 || isAll} onClick={() => onPageChange(page - 1)} aria-label="Previous page">
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" className="h-8 w-8" disabled={page >= totalPages || totalPages === 0 || isAll} onClick={() => onPageChange(page + 1)} aria-label="Next page">
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
