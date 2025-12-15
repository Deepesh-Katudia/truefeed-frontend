'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Edit2 } from 'lucide-react';
import { ProfileSidebar } from './ProfileSidebar';
import { CoverBanner } from './CoverBanner';
import { CollectionsCarousel } from './CollectionsCarousel';
import { Biography } from './Biography';
import { MembershipCard } from './MembershipCard';
import { FooterBar } from './FooterBar';
import { EditProfileModal } from './EditProfileModal';
import { useAuth } from '@/context/AuthContext';

interface User {
  _id?: string;
  id?: string;
  email: string;
  name?: string;
  picture?: string;
  description?: string;
  phone?: string;
}

interface ProfileContentProps {
  user: User;
}

export function ProfileContent({ user }: ProfileContentProps) {
  const [showEditModal, setShowEditModal] = useState(false);
  const { refreshUser } = useAuth();

  const handleProfileUpdated = async () => {
    await refreshUser();
    setShowEditModal(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Use the same Sidebar from dashboard */}
      <div className="w-72 flex-shrink-0">
        <div className="fixed w-72 h-screen">
          <ProfileSidebar />
        </div>
      </div>

      {/* Main Profile Content */}
      <div className="flex-1 flex flex-col bg-white">
        {/* Top Bar */}
        <div className="flex items-center justify-between px-8 py-4 border-b border-gray-100">
          <Link 
            href="/dashboard"
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm font-medium">back to feed</span>
          </Link>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowEditModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 transition-colors"
            >
              <Edit2 className="w-4 h-4" />
              Edit Profile
            </button>

            <div className="text-sm text-gray-600">
              Hello, <span className="font-semibold text-gray-900">{user.name || 'User'}</span>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto">
          <div className="flex gap-8 p-8">
            {/* Main Content */}
            <div className="flex-1 space-y-8">
              <CoverBanner />
              <CollectionsCarousel />
              <MembershipCard />
            </div>

            {/* Right Sidebar */}
            <div className="w-80 space-y-6">
              <Biography />
            </div>
          </div>
        </div>

        {/* Footer */}
        <FooterBar />
      </div>

      {/* Edit Profile Modal */}
      <EditProfileModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        onSuccess={handleProfileUpdated}
        currentUser={user}
      />
    </div>
  );
}