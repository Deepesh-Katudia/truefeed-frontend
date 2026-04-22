'use client';

import { useEffect, useState } from 'react';
import { Loader2, PenLine, RefreshCw } from 'lucide-react';

import { useAuth } from '@/context/AuthContext';
import { postAPI } from '@/lib/api';
import { ProfileAvatar } from '@/components/ui/ProfileAvatar';
import { CreatePostModal } from './CreatePostModal';
import { PostCard } from './PostCard';

interface Post {
  _id: string;
  userId: string;
  content?: string;
  mediaUrl?: string;
  createdAt: string;
  updatedAt: string;
  ai?: {
    tag?: string;
    summary?: string;
    score?: number | null;
  } | null;
}

const getErrorMessage = (error: unknown, fallback: string) =>
  error instanceof Error ? error.message : fallback;

export function Feed() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const { user } = useAuth();

  const loadPosts = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      const data = await postAPI.getMyPosts();
      setPosts(data.posts || []);
      setError('');
    } catch (err: unknown) {
      setError(getErrorMessage(err, 'Failed to load posts'));
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadPosts();
  }, []);

  useEffect(() => {
    const handler = () => setShowCreateModal(true);
    window.addEventListener('open-create-post', handler as EventListener);
    return () => {
      window.removeEventListener('open-create-post', handler as EventListener);
    };
  }, []);

  const handlePostCreated = () => {
    loadPosts(true);
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="rounded-2xl border border-[#302c28]/10 bg-[#fffaf4]/80 p-4 shadow-[0_14px_42px_rgba(48,44,40,0.08)] sm:p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <ProfileAvatar
            src={user?.picture}
            alt={user?.name || user?.email || 'User'}
            className="h-11 w-11 rounded-full border border-[#302c28]/10 object-cover sm:h-12 sm:w-12"
            iconClassName="h-5 w-5 sm:h-6 sm:w-6"
          />
          <button
            onClick={() => setShowCreateModal(true)}
            className="min-w-0 flex-1 rounded-xl border border-[#302c28]/10 bg-[#edede9] px-4 py-3 text-left text-sm text-[#756b62] transition-colors hover:bg-[#d6ccc2]/70 sm:text-base"
          >
            {`What's new, ${user?.name || (user?.email ? user.email.split('@')[0] : 'you')}?`}
          </button>
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#6f6258] px-6 py-3 font-semibold text-[#fffaf4] shadow-md shadow-[#6f6258]/20 transition-colors hover:bg-[#5f554d] sm:w-auto"
          >
            <PenLine className="h-5 w-5" />
            Post It
          </button>
        </div>
      </div>

      {posts.length > 0 && (
        <div className="flex justify-center">
          <button
            onClick={() => loadPosts(true)}
            disabled={refreshing}
            className="flex items-center gap-2 rounded-xl border border-[#302c28]/10 bg-[#fffaf4]/80 px-4 py-2 shadow-sm transition-all hover:-translate-y-0.5 hover:bg-[#f5ebe0] hover:shadow-md disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 text-[#6f6258] ${refreshing ? 'animate-spin' : ''}`} />
            <span className="text-sm font-medium text-[#5f554d]">
              {refreshing ? 'Refreshing...' : 'Refresh'}
            </span>
          </button>
        </div>
      )}

      {loading && posts.length === 0 && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-[#6f6258]" />
        </div>
      )}

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {!loading && posts.length === 0 && !error && (
        <div className="rounded-2xl border border-[#302c28]/10 bg-[#fffaf4]/80 p-6 text-center shadow-[0_14px_42px_rgba(48,44,40,0.08)] sm:p-12">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl border border-[#302c28]/10 bg-[#edede9] text-[#6f6258]">
            <PenLine className="h-8 w-8" />
          </div>
          <h3 className="mb-2 text-xl font-semibold text-[#302c28]">No posts yet</h3>
          <p className="mb-6 text-[#756b62]">Share your first thought with the world.</p>
          <button
            onClick={() => setShowCreateModal(true)}
            className="rounded-xl bg-[#6f6258] px-6 py-3 font-semibold text-[#fffaf4] transition-colors hover:bg-[#5f554d]"
          >
            Create Your First Post
          </button>
        </div>
      )}

      {posts.map((post) => (
        <PostCard key={post._id} post={post} />
      ))}

      <CreatePostModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onPostCreated={handlePostCreated}
      />
    </div>
  );
}
