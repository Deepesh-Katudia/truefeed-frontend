'use client';

import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  loading?: boolean;
  children: React.ReactNode;
}

export function Button({
  variant = 'primary',
  loading = false,
  children,
  className = '',
  disabled,
  ...props
}: ButtonProps) {
  const isDisabled = disabled || loading;

  const base =
    'relative inline-flex select-none items-center justify-center gap-2 rounded-2xl px-6 py-3.5 font-semibold ' +
    'transition-all duration-200 ease-out active:scale-[0.98] ' +
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d6ccc2] focus-visible:ring-offset-2 focus-visible:ring-offset-[#fffaf4] ' +
    'disabled:cursor-not-allowed disabled:opacity-60 disabled:active:scale-100 ' +
    'shadow-sm hover:-translate-y-[1px] hover:shadow-lg';

  const styles: Record<string, string> = {
    primary:
      'bg-[#6f6258] text-[#fffaf4] shadow-[#6f6258]/20 hover:bg-[#5f554d] hover:shadow-[#6f6258]/25',
    secondary:
      'border border-[#302c28]/10 bg-[#f5ebe0] text-[#302c28] hover:bg-[#fffaf4] shadow-[#302c28]/5',
    outline:
      'border border-[#302c28]/10 bg-[#fffaf4]/50 text-[#4d453e] hover:bg-[#f5ebe0]',
    ghost:
      'bg-transparent text-[#5f554d] shadow-none hover:bg-[#edede9] hover:shadow-sm',
  };

  return (
    <button
      className={`${base} ${styles[variant]} ${className}`}
      disabled={isDisabled}
      {...props}
    >
      {loading ? (
        <span className="flex items-center justify-center gap-2">
          <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24">
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
              fill="none"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          Loading...
        </span>
      ) : (
        children
      )}
    </button>
  );
}
