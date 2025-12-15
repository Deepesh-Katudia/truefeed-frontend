'use client';

import { MoreVertical, Share2 } from 'lucide-react';
import { getFileUrl } from '@/lib/api';

interface Post {
  _id: string;
  userId: string;
  content?: string;
  mediaUrl?: string;
  createdAt: string;
  updatedAt: string;
}

interface PostCardProps {
  post: Post;
}

export function PostCard({ post }: PostCardProps) {
  const formatTimestamp = (date: string) => {
    const now = new Date();
    const postDate = new Date(date);
    const diffInHours = Math.floor((now.getTime() - postDate.getTime()) / (1000 * 60 * 60));

    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours} hours ago`;
    const days = Math.floor(diffInHours / 24);
    if (days === 1) return '1 day ago';
    return `${days} days ago`;
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
      {/* Post Header */}
      <div className="p-6 pb-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <img
              src="https://i.pravatar.cc/150?u=aniruddha"
              alt="Aniruddha Rath"
              className="w-12 h-12 rounded-full"
            />
            <div>
              <h3 className="font-semibold text-gray-900">Aniruddha Rath</h3>
              <p className="text-sm text-gray-500">{formatTimestamp(post.createdAt)}</p>
            </div>
          </div>
          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <MoreVertical className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* Post Content */}
        {post.content && (
          <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{post.content}</p>
        )}
      </div>

      {/* Post Image */}
      {post.mediaUrl && (
        <div className="w-full">
          <img
            src={post.mediaUrl.startsWith('http') ? post.mediaUrl : getFileUrl(post.mediaUrl.split('/').pop() || '')}
            alt="Post media"
            className="w-full max-h-[600px] object-cover"
          />
        </div>
      )}

      {/* Post Actions */}
      <div className="px-6 py-4 border-t border-gray-100">
        <div className="flex items-center gap-6">
          <button className="flex items-center gap-2 text-gray-600 hover:text-blue-500 transition-colors">
            <Share2 className="w-5 h-5" />
            <span className="text-sm font-medium">Share</span>
          </button>
        </div>
      </div>
    </div>
  );
}