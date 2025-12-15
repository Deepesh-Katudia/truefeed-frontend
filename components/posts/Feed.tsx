'use client';

import { useState, useEffect } from 'react';
import { PostCard } from './PostCard';
import { CreatePostModal } from './CreatePostModal';
import { postAPI, getFileUrl } from '@/lib/api';
import { Loader2, RefreshCw } from 'lucide-react';

interface Post {
  _id: string;
  userId: string;
  content?: string;
  mediaUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export function Feed() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);

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
    } catch (err: any) {
      setError(err.message || 'Failed to load posts');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadPosts();
  }, []);

  const handlePostCreated = () => {
    loadPosts(true); // Refresh posts after creating new one
  };

  return (
    <div className="space-y-6">
      {/* Post Creation Box */}
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <div className="flex items-center gap-3">
          <img
            src="https://i.pravatar.cc/150?u=aniruddha"
            alt="Aniruddha Rath"
            className="w-12 h-12 rounded-full"
          />
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex-1 px-4 py-3 bg-gray-50 rounded-xl text-gray-600 text-left hover:bg-gray-100 transition-colors"
          >
            What's new, Aniruddha?
          </button>
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-6 py-3 bg-blue-500 text-white rounded-xl font-semibold hover:bg-blue-600 transition-colors flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
            Post It!
          </button>
        </div>
      </div>

      {/* Refresh Button */}
      {posts.length > 0 && (
        <div className="flex justify-center">
          <button
            onClick={() => loadPosts(true)}
            disabled={refreshing}
            className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl shadow-sm hover:shadow-md transition-all disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 text-blue-500 ${refreshing ? 'animate-spin' : ''}`} />
            <span className="text-sm font-medium text-gray-700">
              {refreshing ? 'Refreshing...' : 'Refresh'}
            </span>
          </button>
        </div>
      )}

      {/* Loading State */}
      {loading && posts.length === 0 && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
          {error}
        </div>
      )}

      {/* Empty State */}
      {!loading && posts.length === 0 && !error && (
        <div className="bg-white rounded-2xl shadow-sm p-12 text-center">
          <div className="text-6xl mb-4">📝</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No posts yet</h3>
          <p className="text-gray-600 mb-6">Share your first thought with the world!</p>
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-6 py-3 bg-blue-500 text-white rounded-xl font-semibold hover:bg-blue-600 transition-colors"
          >
            Create Your First Post
          </button>
        </div>
      )}

      {/* Posts List */}
      {posts.map((post) => (
        <PostCard key={post._id} post={post} />
      ))}

      {/* Create Post Modal */}
      <CreatePostModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onPostCreated={handlePostCreated}
      />
    </div>
  );
}