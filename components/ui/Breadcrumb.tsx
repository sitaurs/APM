import Link from 'next/link';
import { cn } from '@/lib/utils';
import { ChevronRight, Home } from 'lucide-react';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
  showHome?: boolean;
}

export function Breadcrumb({ items, className, showHome = true }: BreadcrumbProps) {
  return (
    <nav
      className={cn('flex items-center text-sm', className)}
      aria-label="Breadcrumb"
    >
      <ol className="flex items-center gap-1">
        {/* Home */}
        {showHome && (
          <>
            <li>
              <Link
                href="/"
                className="text-text-muted hover:text-primary transition-colors"
              >
                <Home className="w-4 h-4" />
              </Link>
            </li>
            <li className="text-gray-300">
              <ChevronRight className="w-4 h-4" />
            </li>
          </>
        )}

        {/* Items */}
        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return (
            <li key={item.label} className="flex items-center gap-1">
              {item.href && !isLast ? (
                <Link
                  href={item.href}
                  className="text-text-muted hover:text-primary transition-colors"
                >
                  {item.label}
                </Link>
              ) : (
                <span
                  className={cn(
                    isLast ? 'text-text-main font-medium' : 'text-text-muted'
                  )}
                  aria-current={isLast ? 'page' : undefined}
                >
                  {item.label}
                </span>
              )}
              {!isLast && (
                <ChevronRight className="w-4 h-4 text-gray-300 ml-1" />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
