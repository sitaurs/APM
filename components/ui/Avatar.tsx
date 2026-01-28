import { forwardRef, ImgHTMLAttributes } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { getInitials } from '@/lib/utils';

interface AvatarProps {
  src?: string | null;
  alt: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  showVerified?: boolean;
}

const sizeClasses = {
  xs: 'w-6 h-6 text-xs',
  sm: 'w-8 h-8 text-sm',
  md: 'w-10 h-10 text-base',
  lg: 'w-16 h-16 text-xl',
  xl: 'w-20 h-20 text-2xl',
};

const Avatar = forwardRef<HTMLDivElement, AvatarProps>(
  ({ src, alt, size = 'md', className, showVerified }, ref) => {
    const initials = getInitials(alt);

    return (
      <div
        ref={ref}
        className={cn(
          'relative rounded-full overflow-hidden bg-gray-100 flex-shrink-0',
          sizeClasses[size],
          className
        )}
      >
        {src ? (
          <Image
            src={src}
            alt={alt}
            fill
            className="object-cover"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-secondary to-primary flex items-center justify-center">
            <span className="text-white font-semibold">{initials}</span>
          </div>
        )}

        {/* Verified Badge */}
        {showVerified && (
          <div className="absolute -bottom-0.5 -right-0.5 bg-green-500 rounded-full p-0.5 border-2 border-white">
            <svg
              className="w-2.5 h-2.5 text-white"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        )}
      </div>
    );
  }
);

Avatar.displayName = 'Avatar';

// Avatar Group - untuk menampilkan beberapa avatar
interface AvatarGroupProps {
  avatars: Array<{ src?: string; alt: string }>;
  max?: number;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  className?: string;
}

const AvatarGroup = ({ avatars, max = 4, size = 'sm', className }: AvatarGroupProps) => {
  const visibleAvatars = avatars.slice(0, max);
  const remaining = avatars.length - max;

  return (
    <div className={cn('flex -space-x-2', className)}>
      {visibleAvatars.map((avatar, index) => (
        <Avatar
          key={index}
          src={avatar.src}
          alt={avatar.alt}
          size={size}
          className="ring-2 ring-white"
        />
      ))}
      {remaining > 0 && (
        <div
          className={cn(
            'flex items-center justify-center rounded-full bg-gray-200 text-text-muted font-medium ring-2 ring-white',
            sizeClasses[size]
          )}
        >
          +{remaining}
        </div>
      )}
    </div>
  );
};

export { Avatar, AvatarGroup };
