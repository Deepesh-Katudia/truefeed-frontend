import { Sidebar } from './Sidebar';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { toAbsoluteUrl } from '@/lib/api';
import { StoryBar } from '../stories/StoryBar';
import { Feed } from '../posts/Feed';
import { Requests } from '../right-panel/Requests';
import { Contacts } from '../right-panel/Contacts';

export function DashboardLayout() {
  const { user } = useAuth();
  return (
    <div className="min-h-screen bg-amber-100">
      <div className="flex max-w-[1920px] mx-auto">
        {/* Left Sidebar - Fixed Width */}
        <Sidebar />

        {/* Main Content Area - Flexible */}
        <div className="flex-1 flex justify-center">
          {/* Center Feed - Max Width with Auto Margins */}
          <main className="w-full max-w-3xl px-6 py-6">
            <StoryBar />
            <Feed />
          </main>
        </div>

        {/* Right Panel - Fixed Width */}
        <aside className="w-80 px-6 py-6 bg-amber-100 border-2 border-black flex-col">
          {/* Actions */}
          <div className="flex items-center justify-end gap-3 mb-6">
            <button
              onClick={() => window.dispatchEvent(new CustomEvent('open-create-post'))}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg text-sm font-semibold hover:bg-blue-600 transition-colors flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Create
            </button>
            <Link href="/profile">
              <img
                src={toAbsoluteUrl(user?.picture) || `https://i.pravatar.cc/150?u=${user?.email || 'user'}`}
                alt={user?.name || user?.email || 'Profile'}
                className="w-10 h-10 rounded-full border-2 border-blue-500 cursor-pointer"
              />
            </Link>
          </div>

          <Requests />
          <Contacts />
        </aside>
      </div>
    </div>
  );
}
