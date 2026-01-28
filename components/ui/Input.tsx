import { forwardRef, InputHTMLAttributes, TextareaHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';
import { Search, X } from 'lucide-react';

// Base Input
interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, helperText, leftIcon, rightIcon, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-text-main mb-1.5">
            {label}
          </label>
        )}
        <div className="relative">
          {leftIcon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted">
              {leftIcon}
            </div>
          )}
          <input
            ref={ref}
            className={cn(
              'w-full px-4 py-2.5 rounded-lg border bg-white text-text-main placeholder:text-text-muted',
              'focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200',
              error
                ? 'border-error focus:ring-error'
                : 'border-gray-300 focus:ring-primary',
              leftIcon && 'pl-10',
              rightIcon && 'pr-10',
              className
            )}
            {...props}
          />
          {rightIcon && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted">
              {rightIcon}
            </div>
          )}
        </div>
        {error && (
          <p className="mt-1 text-sm text-error">{error}</p>
        )}
        {helperText && !error && (
          <p className="mt-1 text-sm text-text-muted">{helperText}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

// Search Input - sesuai mockup
interface SearchInputProps extends Omit<InputProps, 'leftIcon'> {
  onClear?: () => void;
  showClearButton?: boolean;
}

const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(
  ({ className, onClear, showClearButton, value, ...props }, ref) => {
    return (
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
        <input
          ref={ref}
          type="search"
          value={value}
          className={cn(
            'w-full pl-10 pr-10 py-2.5 rounded-lg border border-gray-300 bg-white',
            'text-text-main placeholder:text-text-muted',
            'focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent',
            'transition-all duration-200',
            className
          )}
          {...props}
        />
        {showClearButton && value && (
          <button
            type="button"
            onClick={onClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-main"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    );
  }
);

SearchInput.displayName = 'SearchInput';

// Textarea
interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, helperText, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-text-main mb-1.5">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          className={cn(
            'w-full px-4 py-2.5 rounded-lg border bg-white text-text-main placeholder:text-text-muted',
            'focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200',
            'resize-none min-h-[120px]',
            error
              ? 'border-error focus:ring-error'
              : 'border-gray-300 focus:ring-primary',
            className
          )}
          {...props}
        />
        {error && (
          <p className="mt-1 text-sm text-error">{error}</p>
        )}
        {helperText && !error && (
          <p className="mt-1 text-sm text-text-muted">{helperText}</p>
        )}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';

export { Input, SearchInput, Textarea };
