'use client';

import { useState, useEffect } from 'react';
import { Mail, Clock } from 'lucide-react';

export function FooterBar() {
  const [currentTime, setCurrentTime] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const timeString = now.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      });
      setCurrentTime(timeString);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="border-t border-gray-100 px-8 py-4">
      <div className="flex items-center justify-between">
        {/* Left: Message Input */}
        <div className="flex-1 max-w-md">
          <div className="relative">
            <input
              type="text"
              placeholder="Send a message to Aniruddha..."
              className="w-full px-4 py-2 pr-10 bg-gray-50 border border-gray-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            />
            <button className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 hover:bg-gray-200 rounded-full transition-colors">
              <Mail className="w-4 h-4 text-gray-400" />
            </button>
          </div>
        </div>

        {/* Right: Location, Time & Social */}
        <div className="flex items-center gap-6">
          {/* Social Icons */}
          <div className="flex gap-3">
            <button className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors">
              <Mail className="w-4 h-4 text-gray-600" />
            </button>
            <button className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors">
              <svg className="w-4 h-4 text-gray-600" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </button>
            <button className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors">
              <svg className="w-4 h-4 text-gray-600" fill="currentColor" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10" />
              </svg>
            </button>
          </div>

          {/* Location & Time */}
          <div className="text-right">
            <p className="text-xs text-gray-500 mb-1">MONTREAL, QC, Canada</p>
            <p className="text-2xl font-bold text-gray-900">{currentTime || '04:20 PM'}</p>
          </div>
        </div>
      </div>
    </div>
  );
}