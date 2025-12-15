'use client';
import { useEffect, useState } from 'react';
import { Edit2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { Sidebar } from '../layout/Sidebar';
import { postAPI, toAbsoluteUrl } from '@/lib/api';
import { EditProfileModal } from './EditProfileModal';

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
  const [tab, setTab] = useState<'posts' | 'friends'>('posts');
  const [posts, setPosts] = useState<any[]>([]);
  const { refreshUser } = useAuth();
  const [showEditModal, setShowEditModal] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await postAPI.getMyPosts();
        setPosts(data.posts || []);
      } catch {
        setPosts([]);
      }
    };
    load();
  }, []);

  return (
    <div className="min-h-screen bg-white flex">
      <Sidebar />
      <div className="flex-1 flex gap-8 px-8 py-6">
        <div className="flex-1 space-y-6">
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            <div className="h-24 bg-gradient-to-r from-blue-500 to-blue-600" />
            <div className="mt-2 px-6 pb-6">
              <div className="flex items-end gap-4">
                <img
                  src={toAbsoluteUrl(user?.picture) || `https://i.pravatar.cc/120?u=${user?.email || 'user'}`}
                  alt={user?.name || user?.email}
                  className="w-20 h-20 rounded-full ring-4 ring-white object-cover"
                />
                <div className="flex-1 min-w-0">
                  <div className="text-xl font-bold text-gray-900 truncate">{user?.name || user?.email}</div>
                  <div className="text-sm text-gray-500 truncate">@{user?.email?.split('@')[0]}</div>
                </div>
                <div className="flex items-center gap-2">
                  <button className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-semibold">Posts {posts.length}</button>
                  <button className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-semibold">Friends 0</button>
                  <button onClick={() => setShowEditModal(true)} className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg font-semibold">
                    <Edit2 className="w-4 h-4" />
                    Edit Profile
                  </button>
                </div>
              </div>
              <div className="mt-4 text-gray-700 line-clamp-2">{user?.description || ''}</div>
              <div className="mt-6 border-t border-gray-100">
                <div className="flex gap-6 px-1 py-3">
                  <button onClick={() => setTab('posts')} className={`px-3 py-1.5 rounded-lg text-sm font-semibold ${tab === 'posts' ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50'}`}>Posts</button>
                  <button onClick={() => setTab('friends')} className={`px-3 py-1.5 rounded-lg text-sm font-semibold ${tab === 'friends' ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50'}`}>Friends</button>
                </div>
              </div>
            </div>
          </div>
          {tab === 'posts' && (
            <div className="space-y-4">
              {posts.length === 0 ? (
                <div className="bg-white rounded-2xl shadow-sm p-8 text-center">
                  <div className="text-5xl mb-3">📝</div>
                  <div className="text-gray-900 font-semibold mb-1">No posts yet</div>
                  <div className="text-gray-600">Create your first post</div>
                </div>
              ) : (
                posts.map((p) => (
                  <div key={p._id} className="bg-white rounded-2xl shadow-sm overflow-hidden">
                    <div className="p-6">
                      <div className="flex items-center gap-3 mb-3">
                        <img
                          src={toAbsoluteUrl(user?.picture) || `https://i.pravatar.cc/100?u=${user?.email || 'user'}`}
                          alt={user?.name || user?.email}
                          className="w-10 h-10 rounded-full"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold text-gray-900 truncate">{user?.name || user?.email}</div>
                          <div className="text-xs text-gray-500">Just now</div>
                        </div>
                        {p?.ai?.tag && (
                          <span className="text-xs px-2 py-1 rounded bg-gray-100 text-gray-700">{p.ai.tag}</span>
                        )}
                      </div>
                      {p.content && <div className="text-gray-700 whitespace-pre-wrap">{p.content}</div>}
                    </div>
                    {p.mediaUrl && (
                      <img
                        src={toAbsoluteUrl(p.mediaUrl)}
                        alt="Post media"
                        className="w-full object-cover max-h-[400px]"
                      />
                    )}
                  </div>
                ))
              )}
            </div>
          )}
          {tab === 'friends' && <div className="bg-white rounded-2xl shadow-sm p-6 text-gray-600">No friends</div>}
        </div>
        <div className="w-96 space-y-6">
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <div className="text-sm font-semibold text-gray-900 mb-2">About</div>
            <div className="space-y-2">
              <div className="text-sm text-gray-900">Description</div>
              <div className="text-gray-700">{user?.description || '—'}</div>
            </div>
          </div>
        </div>
      </div>
      <EditProfileModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        onSuccess={async () => {
          await refreshUser();
          setShowEditModal(false);
        }}
        currentUser={user}
      />
    </div>
  );
}
