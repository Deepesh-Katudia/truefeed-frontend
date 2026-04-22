'use client';

import { User } from 'lucide-react';

import { toAbsoluteUrl } from '@/lib/api';

interface ProfileAvatarProps {
  src?: string | null;
  alt: string;
  className?: string;
  iconClassName?: string;
}

export function ProfileAvatar({
  src,
  alt,
  className = '',
  iconClassName = 'h-1/2 w-1/2',
}: ProfileAvatarProps) {
  const imageSrc = toAbsoluteUrl(src || undefined);

  if (imageSrc) {
    return <img src={imageSrc} alt={alt} className={className} />;
  }

  return (
    <div
      role="img"
      aria-label={alt}
      className={`flex items-center justify-center bg-[#edede9] text-[#756b62] ${className}`}
    >
      <User className={iconClassName} aria-hidden="true" />
    </div>
  );
}
