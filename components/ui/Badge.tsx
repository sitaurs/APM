import { HTMLAttributes, forwardRef } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center gap-1 font-medium rounded-full transition-colors',
  {
    variants: {
      variant: {
        default: 'bg-gray-100 text-gray-700',
        primary: 'bg-primary-100 text-primary-700',
        secondary: 'bg-secondary-100 text-secondary-700',
        accent: 'bg-accent-100 text-accent-700',
        success: 'bg-green-100 text-green-700',
        warning: 'bg-amber-100 text-amber-700',
        error: 'bg-red-100 text-red-700',
        info: 'bg-blue-100 text-blue-700',
        // Status badges - sesuai mockup
        open: 'bg-green-500 text-white',
        closed: 'bg-red-500 text-white',
        'coming-soon': 'bg-amber-500 text-white',
        pending: 'bg-amber-100 text-amber-700',
        verified: 'bg-green-500 text-white',
        // Level badges
        nasional: 'bg-primary text-white',
        internasional: 'bg-secondary text-white',
        regional: 'bg-gray-500 text-white',
        // Tag badges
        gratis: 'bg-green-100 text-green-700 border border-green-200',
        berbayar: 'bg-amber-100 text-amber-700 border border-amber-200',
        online: 'bg-blue-100 text-blue-700 border border-blue-200',
        offline: 'bg-gray-100 text-gray-700 border border-gray-200',
        // Outline badge
        outline: 'bg-transparent text-gray-700 border border-gray-300',
      },
      size: {
        sm: 'text-xs px-2 py-0.5',
        md: 'text-xs px-2.5 py-1',
        lg: 'text-sm px-3 py-1.5',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  }
);

export interface BadgeProps
  extends HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {
  icon?: React.ReactNode;
}

const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant, size, icon, children, ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={cn(badgeVariants({ variant, size, className }))}
        {...props}
      >
        {icon}
        {children}
      </span>
    );
  }
);

Badge.displayName = 'Badge';

// Verified Badge dengan icon check
const VerifiedBadge = ({ className }: { className?: string }) => (
  <span
    className={cn(
      'inline-flex items-center gap-1 bg-green-500 text-white text-xs px-2 py-0.5 rounded-full font-medium',
      className
    )}
  >
    <svg
      className="w-3 h-3"
      fill="currentColor"
      viewBox="0 0 20 20"
    >
      <path
        fillRule="evenodd"
        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
        clipRule="evenodd"
      />
    </svg>
    Verified
  </span>
);

export { Badge, badgeVariants, VerifiedBadge };
