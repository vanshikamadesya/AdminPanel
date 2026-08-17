import { cn } from '../../lib/utils';

interface AvatarProps {
  firstName: string;
  lastName: string;
  src?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizeStyles = {
  sm: 'h-8 w-8 text-xs',
  md: 'h-10 w-10 text-sm',
  lg: 'h-16 w-16 text-lg',
};

export function Avatar({ firstName, lastName, src, size = 'md', className }: AvatarProps) {
  const initials = `${firstName?.[0] || ''}${lastName?.[0] || ''}`.toUpperCase();

  if (src) {
    return (
      <img
        src={src}
        alt={`${firstName} ${lastName}`}
        className={cn(
          'rounded-full object-cover',
          sizeStyles[size],
          className
        )}
      />
    );
  }

  return (
    <div
      className={cn(
        'flex items-center justify-center rounded-full bg-gradient-to-br from-sky-400 to-indigo-500 font-bold text-white shadow-lg',
        sizeStyles[size],
        className
      )}
    >
      {initials}
    </div>
  );
}
