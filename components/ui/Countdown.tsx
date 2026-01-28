'use client';

import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { differenceInSeconds } from 'date-fns';

interface CountdownTime {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

interface CountdownProps {
  targetDate: Date | string;
  className?: string;
  onComplete?: () => void;
  size?: 'sm' | 'md' | 'lg';
  showLabels?: boolean;
  variant?: 'default' | 'compact' | 'hero';
}

function calculateTimeLeft(targetDate: Date): CountdownTime {
  const now = new Date();
  const difference = differenceInSeconds(targetDate, now);

  if (difference <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  }

  return {
    days: Math.floor(difference / (60 * 60 * 24)),
    hours: Math.floor((difference % (60 * 60 * 24)) / (60 * 60)),
    minutes: Math.floor((difference % (60 * 60)) / 60),
    seconds: difference % 60,
  };
}

export function Countdown({
  targetDate,
  className,
  onComplete,
  size = 'md',
  showLabels = true,
  variant = 'default',
}: CountdownProps) {
  const target = typeof targetDate === 'string' ? new Date(targetDate) : targetDate;
  const [timeLeft, setTimeLeft] = useState<CountdownTime>(calculateTimeLeft(target));
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      const newTimeLeft = calculateTimeLeft(target);
      setTimeLeft(newTimeLeft);

      if (
        newTimeLeft.days === 0 &&
        newTimeLeft.hours === 0 &&
        newTimeLeft.minutes === 0 &&
        newTimeLeft.seconds === 0
      ) {
        setIsComplete(true);
        onComplete?.();
        clearInterval(timer);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [target, onComplete]);

  if (isComplete) {
    return (
      <div className={cn('text-error font-semibold', className)}>
        Waktu Habis!
      </div>
    );
  }

  // Hero variant - sesuai mockup (2 Hari, 14 Jam : 30 Menit)
  if (variant === 'hero') {
    return (
      <div className={cn('flex items-center gap-1 font-bold text-accent', className)}>
        <span>{timeLeft.days} Hari,</span>
        <span>{String(timeLeft.hours).padStart(2, '0')} Jam</span>
        <span>:</span>
        <span>{String(timeLeft.minutes).padStart(2, '0')} Menit</span>
      </div>
    );
  }

  // Compact variant
  if (variant === 'compact') {
    return (
      <div className={cn('font-mono font-semibold text-accent', className)}>
        {timeLeft.days > 0 && `${timeLeft.days}d `}
        {String(timeLeft.hours).padStart(2, '0')}:
        {String(timeLeft.minutes).padStart(2, '0')}:
        {String(timeLeft.seconds).padStart(2, '0')}
      </div>
    );
  }

  // Default variant - boxes
  const sizeClasses = {
    sm: 'w-12 h-12 text-lg',
    md: 'w-16 h-16 text-2xl',
    lg: 'w-20 h-20 text-3xl',
  };

  const labelSizes = {
    sm: 'text-xs',
    md: 'text-xs',
    lg: 'text-sm',
  };

  return (
    <div className={cn('flex gap-2', className)}>
      {/* Days */}
      <div className="flex flex-col items-center">
        <div
          className={cn(
            'flex items-center justify-center bg-primary text-white rounded-lg font-bold',
            sizeClasses[size]
          )}
        >
          {String(timeLeft.days).padStart(2, '0')}
        </div>
        {showLabels && (
          <span className={cn('mt-1 text-text-muted', labelSizes[size])}>Hari</span>
        )}
      </div>

      {/* Separator */}
      <div className="flex items-center text-2xl font-bold text-primary self-start mt-3">:</div>

      {/* Hours */}
      <div className="flex flex-col items-center">
        <div
          className={cn(
            'flex items-center justify-center bg-primary text-white rounded-lg font-bold',
            sizeClasses[size]
          )}
        >
          {String(timeLeft.hours).padStart(2, '0')}
        </div>
        {showLabels && (
          <span className={cn('mt-1 text-text-muted', labelSizes[size])}>Jam</span>
        )}
      </div>

      {/* Separator */}
      <div className="flex items-center text-2xl font-bold text-primary self-start mt-3">:</div>

      {/* Minutes */}
      <div className="flex flex-col items-center">
        <div
          className={cn(
            'flex items-center justify-center bg-primary text-white rounded-lg font-bold',
            sizeClasses[size]
          )}
        >
          {String(timeLeft.minutes).padStart(2, '0')}
        </div>
        {showLabels && (
          <span className={cn('mt-1 text-text-muted', labelSizes[size])}>Menit</span>
        )}
      </div>

      {/* Seconds - optional for sm size */}
      {size !== 'sm' && (
        <>
          <div className="flex items-center text-2xl font-bold text-primary self-start mt-3">:</div>
          <div className="flex flex-col items-center">
            <div
              className={cn(
                'flex items-center justify-center bg-accent text-white rounded-lg font-bold',
                sizeClasses[size]
              )}
            >
              {String(timeLeft.seconds).padStart(2, '0')}
            </div>
            {showLabels && (
              <span className={cn('mt-1 text-text-muted', labelSizes[size])}>Detik</span>
            )}
          </div>
        </>
      )}
    </div>
  );
}

// Mini countdown badge
interface CountdownBadgeProps {
  targetDate: Date | string;
  className?: string;
}

export function CountdownBadge({ targetDate, className }: CountdownBadgeProps) {
  const target = typeof targetDate === 'string' ? new Date(targetDate) : targetDate;
  const [timeLeft, setTimeLeft] = useState<CountdownTime>(calculateTimeLeft(target));

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft(target));
    }, 1000);

    return () => clearInterval(timer);
  }, [target]);

  const isUrgent = timeLeft.days <= 7;

  return (
    <div
      className={cn(
        'inline-flex items-center gap-1 px-2 py-1 rounded-md text-sm font-medium',
        isUrgent ? 'bg-accent/10 text-accent' : 'bg-primary/10 text-primary',
        className
      )}
    >
      <span>
        {timeLeft.days > 0 ? `${timeLeft.days} hari` : 
         timeLeft.hours > 0 ? `${timeLeft.hours} jam` : 
         `${timeLeft.minutes} menit`}
      </span>
    </div>
  );
}
