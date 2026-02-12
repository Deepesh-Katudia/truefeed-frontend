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
    // layout
    'relative inline-flex items-center justify-center gap-2 select-none ' +
    'px-6 py-3.5 rounded-2xl font-semibold ' +
    // motion
    'transition-all duration-200 ease-out ' +
    'active:scale-[0.98] ' +
    // focus
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/60 focus-visible:ring-offset-2 focus-visible:ring-offset-white/40 ' +
    // disabled
    'disabled:opacity-60 disabled:cursor-not-allowed disabled:active:scale-100 ' +
    // polish
    'shadow-sm hover:shadow-lg';

  // Theme colors that match your UI
  const styles: Record<string, string> = {
    primary:
      'text-white ' +
      'bg-gradient-to-r from-indigo-500 via-blue-500 to-violet-500 ' +
      'hover:from-indigo-500 hover:via-sky-500 hover:to-fuchsia-500 ' +
      'shadow-indigo-500/20 hover:shadow-indigo-500/30 ' +
      'transform hover:-translate-y-[1px]',

    secondary:
      'text-slate-900 ' +
      'bg-white/80 backdrop-blur border border-white/70 ' +
      'hover:bg-white/95 ' +
      'shadow-black/5 hover:shadow-black/10 ' +
      'transform hover:-translate-y-[1px]',

    outline:
      'text-slate-800 ' +
      'bg-white/50 backdrop-blur ' +
      'border border-slate-200/80 ' +
      'hover:border-indigo-300/80 hover:bg-white/70 ' +
      'transform hover:-translate-y-[1px]',

    ghost:
      'text-slate-700 ' +
      'bg-transparent ' +
      'hover:bg-white/60 ' +
      'shadow-none hover:shadow-sm',
  };

  // Subtle animated sheen for primary buttons
  const sheen =
    variant === 'primary' && !isDisabled
      ? 'before:absolute before:inset-0 before:rounded-2xl before:bg-[linear-gradient(120deg,transparent,rgba(255,255,255,0.35),transparent)] ' +
        'before:translate-x-[-120%] hover:before:translate-x-[120%] ' +
        'before:transition-transform before:duration-700 before:ease-out ' +
        'before:pointer-events-none'
      : '';

  // Soft outer glow on hover for primary
  const glow =
    variant === 'primary' && !isDisabled
      ? 'after:absolute after:inset-0 after:rounded-2xl after:opacity-0 hover:after:opacity-100 ' +
        'after:blur-xl after:transition-opacity after:duration-300 after:pointer-events-none ' +
        'after:bg-gradient-to-r after:from-indigo-400/25 after:via-sky-400/25 after:to-fuchsia-400/25'
      : '';

  return (
    <button
      className={`${base} ${styles[variant]} ${sheen} ${glow} ${className}`}
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
