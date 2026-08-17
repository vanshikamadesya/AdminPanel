import { useEffect } from 'react';
import type { ReactNode } from 'react';
import { X } from 'lucide-react';
import { cn } from '../../lib/utils';
import { Button } from './Button';

interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

const sizeClasses = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-2xl',
};

export function Drawer({
  isOpen,
  onClose,
  title,
  description,
  children,
  size = 'md',
}: DrawerProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-slate-950/30 backdrop-blur-sm" onClick={onClose} />

      <div className="absolute top-0 right-0 flex h-full w-full justify-end">
        <div
          className={cn(
            'bg-card text-card-foreground h-full w-full overflow-y-auto border-l border-border p-6 shadow-2xl transition-transform duration-300 sm:p-8',
            sizeClasses[size]
          )}
        >
          <div className="mb-7 flex items-start justify-between gap-3 border-b pb-5">
            <div>
              {title && <h2 className="text-2xl font-semibold tracking-tight">{title}</h2>}
              {description && <p className="text-muted-foreground mt-1 text-sm">{description}</p>}
            </div>
            <Button variant="ghost" size="icon" onClick={onClose} aria-label="Close drawer">
              <X className="h-5 w-5" />
            </Button>
          </div>

          <div>{children}</div>
        </div>
      </div>
    </div>
  );
}
