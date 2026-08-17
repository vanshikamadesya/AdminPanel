import { useEffect, useRef } from 'react';
import { X, AlertTriangle } from 'lucide-react';
import { Button } from './Button';
import { cn } from '../../lib/utils';

interface ConfirmationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'danger' | 'warning' | 'default';
  isLoading?: boolean;
}

export function ConfirmationDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  variant = 'danger',
  isLoading = false,
}: ConfirmationDialogProps) {
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div
        ref={dialogRef}
        className={cn(
          'relative z-50 w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-xl',
          'animate-in fade-in-0 zoom-in-95 duration-200'
        )}
      >
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-lg p-1 text-muted-foreground hover:text-foreground transition-colors"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="flex flex-col items-center text-center">
          <div
            className={cn(
              'mb-4 flex h-12 w-12 items-center justify-center rounded-full',
              variant === 'danger' && 'bg-red-100 dark:bg-red-900/30',
              variant === 'warning' && 'bg-yellow-100 dark:bg-yellow-900/30',
              variant === 'default' && 'bg-primary/10'
            )}
          >
            <AlertTriangle
              className={cn(
                'h-6 w-6',
                variant === 'danger' && 'text-red-600 dark:text-red-400',
                variant === 'warning' && 'text-yellow-600 dark:text-yellow-400',
                variant === 'default' && 'text-primary'
              )}
            />
          </div>

          <h3 className="text-lg font-semibold text-foreground mb-2">{title}</h3>
          <p className="text-sm text-muted-foreground mb-6">{description}</p>

          <div className="flex w-full gap-3">
            <Button
              variant="outline"
              className="flex-1"
              onClick={onClose}
              disabled={isLoading}
            >
              {cancelLabel}
            </Button>
            <Button
              variant={variant === 'danger' ? 'destructive' : 'default'}
              className="flex-1"
              onClick={onConfirm}
              isLoading={isLoading}
              disabled={isLoading}
            >
              {confirmLabel}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
