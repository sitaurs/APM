import { forwardRef, ButtonHTMLAttributes } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg',
  {
    variants: {
      variant: {
        primary: 'bg-accent text-white hover:bg-accent-600 focus:ring-accent shadow-sm',
        secondary: 'bg-secondary text-white hover:bg-secondary-600 focus:ring-secondary shadow-sm',
        outline: 'border-2 border-primary text-primary bg-transparent hover:bg-primary hover:text-white focus:ring-primary',
        'outline-white': 'border-2 border-white text-white bg-transparent hover:bg-white hover:text-primary focus:ring-white',
        ghost: 'text-text-main hover:bg-gray-100 focus:ring-gray-300',
        link: 'text-primary underline-offset-4 hover:underline focus:ring-0 p-0',
        danger: 'bg-error text-white hover:bg-red-600 focus:ring-error shadow-sm',
        success: 'bg-success text-white hover:bg-green-600 focus:ring-success shadow-sm',
      },
      size: {
        sm: 'text-sm px-3 py-1.5',
        md: 'text-sm px-4 py-2.5',
        lg: 'text-base px-6 py-3',
        xl: 'text-lg px-8 py-4',
        icon: 'p-2',
        'icon-sm': 'p-1.5',
        'icon-lg': 'p-3',
      },
      fullWidth: {
        true: 'w-full',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
);

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      fullWidth,
      isLoading,
      leftIcon,
      rightIcon,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, fullWidth, className }))}
        ref={ref}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : leftIcon ? (
          leftIcon
        ) : null}
        {children}
        {rightIcon && !isLoading ? rightIcon : null}
      </button>
    );
  }
);

Button.displayName = 'Button';

export { Button, buttonVariants };
