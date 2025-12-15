import { Sidebar } from './Sidebar';
import { StoryBar } from '../stories/StoryBar';
import { Feed } from '../posts/Feed';
import { Requests } from '../right-panel/Requests';
import { Contacts } from '../right-panel/Contacts';

export function DashboardLayout() {
  return (
    <div className="min-h-screen bg-gray-50">
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
        <aside className="w-80 px-6 py-6 bg-white border-l border-gray-100 flex-shrink-0">
          {/* Search Bar */}
          <div className="flex items-center gap-3 mb-6">
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder="Search"
                className="w-full pl-10 pr-4 py-2 bg-gray-50 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <svg
                className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <button className="px-4 py-2 bg-blue-500 text-white rounded-lg text-sm font-semibold hover:bg-blue-600 transition-colors flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Create
            </button>
            <img
              src="https://i.pravatar.cc/150?u=aniruddha"
              alt="Profile"
              className="w-10 h-10 rounded-full border-2 border-blue-500"
            />
          </div>

          <Requests />
          <Contacts />
        </aside>
      </div>
    </div>
  );
}