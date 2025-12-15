'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { usersAPI } from '@/lib/api';
import { Sidebar } from '@/components/layout/Sidebar';

export default function UserProfilePage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const params = useParams();
  const userId = String(params?.id || '');
  const [target, setTarget] = useState<any>(null);
  const [relation, setRelation] = useState<{ isFriend: boolean; incomingPending: boolean; outgoingPending: boolean } | null>(null);

  useEffect(() => {
    if (!loading && !user) router.push('/login');
  }, [user, loading, router]);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await usersAPI.get(userId);
        setTarget(data.user);
        setRelation(data.relation);
      } catch {
        setTarget(null);
        setRelation(null);
      }
    };
    if (userId) load();
  }, [userId]);

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex">
      <Sidebar />
      <div className="flex-1 px-8 py-6">
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="h-24 bg-gradient-to-r from-blue-500 to-blue-600" />
          <div className="mt-2 px-6 pb-6">
            <div className="flex items-end gap-4">
              <img
                src={target?.picture || `https://i.pravatar.cc/120?u=${target?.email || 'user'}`}
                alt={target?.name || target?.email}
                className="w-20 h-20 rounded-full ring-4 ring-white object-cover"
              />
              <div className="flex-1 min-w-0">
                <div className="text-xl font-bold text-gray-900 truncate">{target?.name || target?.email}</div>
                <div className="text-sm text-gray-500 truncate">@{String(target?.email || '').split('@')[0]}</div>
              </div>
              <div className="flex items-center gap-2">
                <button className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-semibold">Posts 0</button>
                <button className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-semibold">Friends 0</button>
                <button
                  disabled
                  className={`px-4 py-2 rounded-lg text-sm font-semibold ${
                    relation?.isFriend
                      ? 'bg-green-100 text-green-700'
                      : relation?.incomingPending || relation?.outgoingPending
                      ? 'bg-yellow-100 text-yellow-700'
                      : 'bg-blue-500 text-white'
                  }`}
                >
                  {relation?.isFriend ? 'Friends' : relation?.incomingPending || relation?.outgoingPending ? 'Pending' : 'Add Friend'}
                </button>
              </div>
            </div>
            <div className="mt-4 text-gray-700 line-clamp-2">{target?.description || ''}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
