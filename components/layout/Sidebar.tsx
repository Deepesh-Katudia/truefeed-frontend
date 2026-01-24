'use client';

import { useEffect, useState } from 'react';
import { Users, FileText, User, LogOut } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useRouter, usePathname } from 'next/navigation';
import { toAbsoluteUrl } from '@/lib/api';

export function Sidebar() {
  const [activeItem, setActiveItem] = useState('News Feed');
  const { user, logout } = useAuth();
  const router = useRouter();
  const path = usePathname();
  useEffect(() => {
    if (!path) return;
    if (path.startsWith('/people')) {
      setActiveItem('People');
    } else if (path.startsWith('/profile')) {
      setActiveItem('Profile');
    } else {
      setActiveItem('News Feed');
    }
  }, [path]);

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
    } else if (label === 'People') {
      router.push('/people');
    }
    // Add more routes as needed
  };

  const menuItems = [
    { icon: Users, label: 'People', badge: null },
    { icon: FileText, label: 'News Feed', badge: null },
    { icon: User, label: 'Profile', badge: null },
  ];

  return (
    <aside className="w-72 bg-gray-00 border-r border-gray-900 px-6 py-6 flex flex-col h-screen sticky top-0">
      {/* Logo */}
      <div className="flex items-center gap-2 mb-8">
        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
          <span className="text-white text-lg font-bold">T</span>
        </div>
        <span className="text-xl font-bold text-shadow-white">TrueFeed</span>
      </div>

      {/* User Profile */}
      <div 
        className="flex items-center gap-4 mb-6 pb-5 bg-amber-700 border-black cursor-pointer hover:bg-gray-50 -mx-3 px-3 py-2 rounded-lg transition-colors"
        onClick={() => router.push('/profile')}
      >
        <img
          src={toAbsoluteUrl(user?.picture) || `https://i.pravatar.cc/150?u=${user?.email || 'default'}`}
          alt={user?.name || user?.email || 'User'}
          className="w-12 h-12 rounded-full"
        />
        <div className="flex-1">
          <div className="font-semibold text-gray-900">
            {user?.name || 'Anonymous User'}
          </div>
          <div className="text-sm text-gray-900">
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

      
    </aside>
  );
}
