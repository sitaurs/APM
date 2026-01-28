'use client';

import { forwardRef, SelectHTMLAttributes, useState } from 'react';
import { cn } from '@/lib/utils';
import { ChevronDown, Check } from 'lucide-react';

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'onChange'> {
  label?: string;
  error?: string;
  helperText?: string;
  options: SelectOption[];
  placeholder?: string;
  onChange?: (value: string) => void;
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, error, helperText, options, placeholder, onChange, value, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-text-main mb-1.5">
            {label}
          </label>
        )}
        <div className="relative">
          <select
            ref={ref}
            value={value}
            onChange={(e) => onChange?.(e.target.value)}
            className={cn(
              'w-full px-4 py-2.5 rounded-lg border bg-white text-text-main appearance-none cursor-pointer',
              'focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200',
              error
                ? 'border-error focus:ring-error'
                : 'border-gray-300 focus:ring-primary',
              !value && 'text-text-muted',
              className
            )}
            {...props}
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted pointer-events-none" />
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

Select.displayName = 'Select';

// Filter Chips / Toggle Group - sesuai mockup (Online, Gratis, Nasional, etc.)
interface FilterChipProps {
  label: string;
  isActive?: boolean;
  onClick?: () => void;
  icon?: React.ReactNode;
}

const FilterChip = ({ label, isActive, onClick, icon }: FilterChipProps) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200',
        'border focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1',
        isActive
          ? 'bg-primary text-white border-primary'
          : 'bg-white text-text-main border-gray-300 hover:border-primary hover:text-primary'
      )}
    >
      {icon}
      {label}
      {isActive && <Check className="w-3.5 h-3.5" />}
    </button>
  );
};

// Toggle Switch
interface ToggleProps {
  label: string;
  checked?: boolean;
  onChange?: (checked: boolean) => void;
}

const Toggle = ({ label, checked, onChange }: ToggleProps) => {
  return (
    <label className="inline-flex items-center gap-2 cursor-pointer">
      <div className="relative">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange?.(e.target.checked)}
          className="sr-only peer"
        />
        <div className={cn(
          'w-10 h-6 rounded-full transition-colors duration-200',
          'peer-focus:ring-2 peer-focus:ring-primary peer-focus:ring-offset-1',
          checked ? 'bg-primary' : 'bg-gray-300'
        )}>
          <div className={cn(
            'absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform duration-200',
            checked && 'translate-x-4'
          )} />
        </div>
      </div>
      <span className="text-sm text-text-main">{label}</span>
    </label>
  );
};

export { Select, FilterChip, Toggle };
