import { Pencil, Trash2 } from 'lucide-react';
import { Button } from './Button';
import { Pagination } from './Pagination';

export interface Column<T> {
  header: string;
  align?: 'left' | 'right';
  className?: string;
  render: (item: T) => React.ReactNode;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  loading: boolean;
  emptyMessage?: string;
  keyField: keyof T & string;
  onEdit?: (item: T) => void;
  onDelete?: (item: T) => void;
  canEdit?: (item: T) => boolean;
  canDelete?: (item: T) => boolean;
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
}

export function DataTable<T extends Record<string, any>>({
  data,
  columns,
  loading,
  emptyMessage = 'No data found',
  keyField,
  onEdit,
  onDelete,
  canEdit = () => true,
  canDelete = () => true,
  page,
  pageSize,
  total,
  totalPages,
  onPageChange,
  onPageSizeChange,
}: DataTableProps<T>) {
  const showActions = onEdit || onDelete;

  return (
    <>
      {loading ? (
        <div className="p-8 text-center">Loading...</div>
      ) : data.length === 0 ? (
        <div className="p-8 text-center text-muted-foreground">{emptyMessage}</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b text-sm">
                {columns.map((col) => (
                  <th
                    key={col.header}
                    className={`px-6 py-3 text-xs font-medium uppercase tracking-wider text-muted-foreground ${col.align === 'right' ? 'text-right' : ''} ${col.className ?? ''}`}
                  >
                    {col.header}
                  </th>
                ))}
                {showActions && (
                  <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Actions
                  </th>
                )}
              </tr>
            </thead>
            <tbody>
              {data.map((item) => (
                <tr key={item[keyField]} className="border-b last:border-b-0">
                  {columns.map((col) => (
                    <td key={col.header} className={`px-6 py-4 text-sm ${col.className ?? ''}`}>
                      {col.render(item)}
                    </td>
                  ))}
                  {showActions && (
                    <td className="px-6 py-4">
                      <div className="flex justify-end gap-2">
                        {onEdit && canEdit(item) && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onEdit(item)}
                            className="gap-2"
                          >
                            <Pencil className="h-3.5 w-3.5" />
                            Edit
                          </Button>
                        )}
                        {onDelete && canDelete(item) && (
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => onDelete(item)}
                            className="gap-2"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                            Delete
                          </Button>
                        )}
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <Pagination
        page={page}
        pageSize={pageSize}
        total={total}
        totalPages={totalPages}
        onPageChange={onPageChange}
        onPageSizeChange={onPageSizeChange}
      />
    </>
  );
}
