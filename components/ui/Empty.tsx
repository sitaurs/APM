import { cn } from '@/lib/utils';
import { Button } from './Button';
import { Search, FileQuestion, Trophy, Calendar } from 'lucide-react';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

export function EmptyState({
  icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center py-12 px-4 text-center',
        className
      )}
    >
      {icon && (
        <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center text-text-muted mb-4">
          {icon}
        </div>
      )}
      <h3 className="text-lg font-semibold text-text-main mb-2">{title}</h3>
      {description && (
        <p className="text-text-muted max-w-sm mb-6">{description}</p>
      )}
      {action && (
        <Button variant="primary" onClick={action.onClick}>
          {action.label}
        </Button>
      )}
    </div>
  );
}

// Pre-defined empty states
export function NoSearchResults({ query }: { query?: string }) {
  return (
    <EmptyState
      icon={<Search className="w-8 h-8" />}
      title="Tidak ada hasil ditemukan"
      description={
        query
          ? `Tidak ada hasil untuk "${query}". Coba kata kunci lain.`
          : 'Tidak ada hasil yang cocok dengan pencarian Anda.'
      }
    />
  );
}

export function NoLombaFound() {
  return (
    <EmptyState
      icon={<Trophy className="w-8 h-8" />}
      title="Belum ada lomba"
      description="Belum ada lomba yang tersedia saat ini. Silakan cek kembali nanti."
    />
  );
}

export function NoPrestasiFound() {
  return (
    <EmptyState
      icon={<Trophy className="w-8 h-8" />}
      title="Belum ada prestasi"
      description="Belum ada prestasi yang tercatat. Jadilah yang pertama!"
    />
  );
}

export function NoExpoFound() {
  return (
    <EmptyState
      icon={<Calendar className="w-8 h-8" />}
      title="Belum ada expo"
      description="Belum ada expo atau pameran yang dijadwalkan."
    />
  );
}
