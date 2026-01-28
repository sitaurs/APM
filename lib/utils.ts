import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { format, formatDistanceToNow, differenceInDays, parseISO } from 'date-fns';
import { id } from 'date-fns/locale';
import { DEADLINE_THRESHOLDS } from './constants';

/**
 * Merge Tailwind CSS classes dengan clsx
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format tanggal ke format Indonesia
 */
export function formatDate(date: string | Date, formatStr: string = 'dd MMMM yyyy'): string {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return format(dateObj, formatStr, { locale: id });
}

/**
 * Format tanggal relatif (misal: "2 hari lagi")
 */
export function formatRelativeDate(date: string | Date): string {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return formatDistanceToNow(dateObj, { locale: id, addSuffix: true });
}

/**
 * Hitung sisa hari sampai deadline
 */
export function getDaysUntilDeadline(deadline: string | Date): number {
  const deadlineDate = typeof deadline === 'string' ? parseISO(deadline) : deadline;
  return differenceInDays(deadlineDate, new Date());
}

/**
 * Tentukan status deadline (urgent/soon/normal/passed)
 */
export function getDeadlineStatus(deadline: string | Date): 'urgent' | 'soon' | 'normal' | 'passed' {
  const days = getDaysUntilDeadline(deadline);
  
  if (days < 0) return 'passed';
  if (days <= DEADLINE_THRESHOLDS.urgent) return 'urgent';
  if (days <= DEADLINE_THRESHOLDS.soon) return 'soon';
  return 'normal';
}

/**
 * Format deadline untuk display
 */
export function formatDeadlineDisplay(deadline: string | Date): { text: string; status: string } {
  const days = getDaysUntilDeadline(deadline);
  const status = getDeadlineStatus(deadline);
  
  if (days < 0) {
    return { text: 'Sudah Ditutup', status: 'passed' };
  }
  
  if (days === 0) {
    return { text: 'Hari Ini!', status: 'urgent' };
  }
  
  if (days === 1) {
    return { text: 'Besok!', status: 'urgent' };
  }
  
  if (days <= 7) {
    return { text: `${days} hari lagi`, status: 'urgent' };
  }
  
  return { text: formatDate(deadline, 'dd MMM yyyy'), status };
}

/**
 * Truncate text dengan ellipsis
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + '...';
}

/**
 * Slugify text untuk URL
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Format angka ke format Indonesia (dengan separator ribuan)
 */
export function formatNumber(num: number): string {
  return new Intl.NumberFormat('id-ID').format(num);
}

/**
 * Format currency ke Rupiah
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Get initials dari nama
 */
export function getInitials(name: string): string {
  return name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Generate random color dari array warna APM
 */
export function getRandomColor(): string {
  const colors = ['#0B4F94', '#00A8E8', '#FF7F11'];
  return colors[Math.floor(Math.random() * colors.length)];
}

/**
 * Debounce function
 */
export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

/**
 * Get status color class
 */
export function getStatusColorClass(status: string): string {
  const statusColors: Record<string, string> = {
    open: 'status-open',
    'coming-soon': 'status-coming-soon',
    closed: 'status-closed',
    pending: 'status-pending',
    verified: 'status-verified',
    urgent: 'deadline-urgent',
  };
  
  return statusColors[status] || 'badge-primary';
}

/**
 * Build query string dari object
 */
export function buildQueryString(params: Record<string, string | number | boolean | undefined>): string {
  const searchParams = new URLSearchParams();
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== '') {
      searchParams.append(key, String(value));
    }
  });
  
  return searchParams.toString();
}

/**
 * Parse query string ke object
 */
export function parseQueryString(queryString: string): Record<string, string> {
  const params = new URLSearchParams(queryString);
  const result: Record<string, string> = {};
  
  params.forEach((value, key) => {
    result[key] = value;
  });
  
  return result;
}

/**
 * Check if client side
 */
export function isClient(): boolean {
  return typeof window !== 'undefined';
}

/**
 * Copy text to clipboard
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  if (!isClient()) return false;
  
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}

/**
 * Generate Google Calendar URL
 */
export function generateGoogleCalendarUrl(event: {
  title: string;
  description?: string;
  location?: string;
  startDate: Date;
  endDate?: Date;
}): string {
  const { title, description, location, startDate, endDate } = event;
  
  const formatDateForGoogle = (date: Date) => 
    format(date, "yyyyMMdd'T'HHmmss");
  
  const start = formatDateForGoogle(startDate);
  const end = formatDateForGoogle(endDate || startDate);
  
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: title,
    dates: `${start}/${end}`,
    ...(description && { details: description }),
    ...(location && { location }),
  });
  
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}
