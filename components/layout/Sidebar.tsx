'use client';

import { useState } from 'react';
import { Home, Users, Image, FileText, User, Settings, LogOut } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

export function Sidebar() {
  const [activeItem, setActiveItem] = useState('News Feed');
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  const handleNavigation = (label: string) => {
    setActiveItem(label);
    
    // Navigate based on menu item
    if (label === 'Profile') {
      router.push('/profile');
    } else if (label === 'News Feed') {
      router.push('/dashboard');
    } else if (label === 'Home') {
      router.push('/dashboard');
    }
    // Add more routes as needed
  };

  const menuItems = [
    { icon: Home, label: 'Home', badge: null },
    { icon: Users, label: 'People', badge: 1 },
    { icon: Image, label: 'Photos', badge: null },
    { icon: FileText, label: 'News Feed', badge: null },
    { icon: User, label: 'Profile', badge: null },
    { icon: Settings, label: 'Settings', badge: 1 },
  ];

  return (
    <aside className="w-72 bg-white border-r border-gray-100 px-6 py-6 flex flex-col h-screen sticky top-0">
      {/* Logo */}
      <div className="flex items-center gap-2 mb-8">
        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
          <span className="text-white text-lg font-bold">T</span>
        </div>
        <span className="text-xl font-bold text-gray-900">TrueFeed</span>
      </div>

      {/* User Profile */}
      <div 
        className="flex items-center gap-3 mb-8 pb-6 border-b border-gray-100 cursor-pointer hover:bg-gray-50 -mx-3 px-3 py-2 rounded-lg transition-colors"
        onClick={() => router.push('/profile')}
      >
        <img
          src={user?.picture || `https://i.pravatar.cc/150?u=${user?.email || 'default'}`}
          alt={user?.name || user?.email || 'User'}
          className="w-12 h-12 rounded-full"
        />
        <div className="flex-1">
          <div className="font-semibold text-gray-900">
            {user?.name || 'Anonymous User'}
          </div>
          <div className="text-sm text-gray-500">
            @{user?.email?.split('@')[0] || 'user'}
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = item.label === activeItem;

          return (
            <button
              key={item.label}
              onClick={() => handleNavigation(item.label)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-1 transition-colors relative ${
                isActive
                  ? 'bg-blue-50 text-blue-600'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              {isActive && (
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-600 rounded-r" />
              )}
              <Icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
              {item.badge && (
                <span className="ml-auto w-5 h-5 bg-blue-500 text-white text-xs rounded-full flex items-center justify-center">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Logout Button */}
      <button
        onClick={handleLogout}
        className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-colors mb-4"
      >
        <LogOut className="w-5 h-5" />
        <span className="font-medium">Logout</span>
      </button>

      {/* Invitations Section */}
      <div className="pt-6 border-t border-gray-100">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold text-gray-500 uppercase">Invitations</span>
          <span className="w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
            2
          </span>
        </div>

        <div className="relative rounded-xl overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1519681393784-d120267933ba?w=400&h=200&fit=crop"
            alt="Invitation"
            className="w-full h-32 object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <div className="flex items-center gap-2 mb-2">
              <img
                src="https://i.pravatar.cc/40?u=invitation"
                alt="User"
                className="w-8 h-8 rounded-full border-2 border-white"
              />
              <div className="w-2 h-2 bg-red-500 rounded-full absolute top-4 left-10" />
            </div>
            <h3 className="text-white font-bold text-sm mb-1">How To Build A Strong Company</h3>
          </div>
        </div>

        <div className="flex gap-2 mt-3">
          <button className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg text-sm font-semibold hover:bg-blue-600 transition-colors">
            Accept Invitation
          </button>
          <button className="px-3 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </aside>
  );
}