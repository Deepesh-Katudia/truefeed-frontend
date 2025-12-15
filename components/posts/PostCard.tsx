'use client';

import { MoreVertical, Share2, ShieldCheck, AlertTriangle } from 'lucide-react';
import { getFileUrl, toAbsoluteUrl, postAPI } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { useState } from 'react';
import { Heart, MessageSquare } from 'lucide-react';

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

interface PostCardProps {
  post: Post;
}

export function PostCard({ post }: PostCardProps) {
  const { user } = useAuth();
  const [likesCount, setLikesCount] = useState<number>((post as any).likesCount || 0);
  const [comments, setComments] = useState<any[]>((post as any).comments || []);
  const [commentText, setCommentText] = useState('');
  const liked = ((post as any).likedBy || []).some((u: any) => String(u) === String(user?._id || user?.id));
  const [aiPreview] = useState<{ tag: string; score: number | null; summary: string } | null>(
    (post as any)?.ai
      ? {
          tag: (post as any).ai.tag || 'Unverified',
          score: (post as any).ai.score ?? null,
          summary: (post as any).ai.summary || '',
        }
      : null
  );
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
              src={toAbsoluteUrl(user?.picture) || `https://i.pravatar.cc/150?u=${user?.email || 'user'}`}
              alt={user?.name || user?.email || 'User'}
              className="w-12 h-12 rounded-full"
            />
            <div>
              <h3 className="font-semibold text-gray-900">{user?.name || user?.email || 'User'}</h3>
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

        {/* AI Tag & Credibility */}
        {aiPreview && (
          <div className="mt-4 space-y-2">
            <div className="flex items-center gap-2">
              {aiPreview.tag === 'Verified' ? (
                <ShieldCheck className="w-5 h-5 text-green-600" />
              ) : (
                <AlertTriangle className="w-5 h-5 text-yellow-600" />
              )}
              <span
                className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                  aiPreview.tag === 'Verified'
                    ? 'bg-green-100 text-green-700'
                    : aiPreview.tag === 'False'
                    ? 'bg-red-100 text-red-700'
                    : 'bg-yellow-100 text-yellow-700'
                }`}
              >
                {aiPreview.tag || 'Unverified'}
              </span>
              {typeof aiPreview.score === 'number' && (
                <span className="text-xs text-gray-600">
                  Credibility {aiPreview.score}/5
                </span>
              )}
            </div>
            {aiPreview.summary && (
              <p className="text-sm text-gray-600 bg-gray-50 border border-gray-200 rounded-lg p-3">
                {aiPreview.summary}
              </p>
            )}
          </div>
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
          <button
            onClick={async () => {
              try {
                if (liked) {
                  await postAPI.unlike(post._id);
                  setLikesCount((c) => Math.max(0, c - 1));
                  (post as any).likedBy = ((post as any).likedBy || []).filter((u: any) => String(u) !== String(user?._id || user?.id));
                } else {
                  await postAPI.like(post._id);
                  setLikesCount((c) => c + 1);
                  ((post as any).likedBy || ((post as any).likedBy = [])).push(user?._id || user?.id);
                }
              } catch {}
            }}
            className={`flex items-center gap-2 ${liked ? 'text-red-600' : 'text-gray-600 hover:text-blue-500'} transition-colors`}
          >
            <Heart className={`w-5 h-5 ${liked ? 'fill-red-600' : ''}`} />
            <span className="text-sm font-medium">{likesCount}</span>
          </button>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-gray-400" />
              <input
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                onKeyDown={async (e) => {
                  if (e.key === 'Enter' && commentText.trim()) {
                    try {
                      const res = await postAPI.comment(post._id, commentText.trim());
                      setComments((arr) => [...arr, { _id: res.id, userId: user?._id || user?.id, text: commentText.trim(), createdAt: new Date().toISOString() }]);
                      setCommentText('');
                    } catch {}
                  }
                }}
                placeholder="Write a comment..."
                className="flex-1 px-3 py-2 bg-gray-50 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
              />
            </div>
            {comments.length > 0 && (
              <div className="mt-3 space-y-2">
                {comments.slice(-3).map((c) => {
                  const mine = String(c.userId) === String(user?._id || user?.id);
                  return (
                    <div key={c._id} className="text-sm text-gray-700 bg-gray-50 rounded-lg px-3 py-2 flex items-center justify-between">
                      <span className="truncate">{c.text}</span>
                      {mine && (
                        <button
                          onClick={async () => {
                            try {
                              await postAPI.deleteComment(post._id, c._id);
                              setComments((arr) => arr.filter((x) => x._id !== c._id));
                            } catch {}
                          }}
                          className="text-xs text-red-600 hover:text-red-700"
                        >
                          Delete
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
