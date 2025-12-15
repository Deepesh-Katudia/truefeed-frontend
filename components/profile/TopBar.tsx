'use client';

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export function TopBar() {
  return (
    <div className="flex items-center justify-between px-6 py-3 border-b border-gray-100 flex-shrink-0">
      {/* Back Button */}
      <Link 
        href="/dashboard"
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span className="text-sm font-medium">back</span>
      </Link>

      {/* Empty space */}
      <div></div>

      {/* User Greeting */}
      <div className="text-sm text-gray-600">
        Hello, <span className="font-semibold text-gray-900">Aniruddha</span>
      </div>
    </div>
  );
}