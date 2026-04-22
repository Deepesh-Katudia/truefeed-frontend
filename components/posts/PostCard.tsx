'use client';

import { useState } from 'react';
import { AlertTriangle, Heart, MessageSquare, MoreVertical, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';

import { getFileUrl, postAPI } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { ProfileAvatar } from '@/components/ui/ProfileAvatar';

interface Post {
  _id: string;
  userId: string;
  content?: string;
  mediaUrl?: string;
  createdAt: string;
  updatedAt: string;
  likesCount?: number;
  likedBy?: string[];
  comments?: PostComment[];
  ai?: {
    tag?: string;
    summary?: string;
    score?: number | null;
  } | null;
}

interface PostComment {
  _id: string;
  userId?: string;
  text: string;
  createdAt?: string;
}

interface CommentResponse {
  id?: string;
}

interface PostCardProps {
  post: Post;
}

export function PostCard({ post }: PostCardProps) {
  const { user } = useAuth();
  const [likesCount, setLikesCount] = useState<number>(post.likesCount || 0);
  const [comments, setComments] = useState<PostComment[]>(post.comments || []);
  const [commentText, setCommentText] = useState('');
  const [liked, setLiked] = useState(() =>
    (post.likedBy || []).some((u) => String(u) === String(user?._id || user?.id))
  );
  const [aiPreview] = useState<{ tag: string; score: number | null; summary: string } | null>(
    post.ai
      ? {
          tag: post.ai.tag || 'Unverified',
          score: post.ai.score ?? null,
          summary: post.ai.summary || '',
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
    <motion.article
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 260, damping: 24 }}
      className="overflow-hidden rounded-2xl border border-[#302c28]/10 bg-[#fffaf4]/85 shadow-[0_14px_42px_rgba(48,44,40,0.08)]"
    >
      <div className="p-4 pb-4 sm:p-6">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <ProfileAvatar
              src={user?.picture}
              alt={user?.name || user?.email || 'User'}
              className="h-10 w-10 rounded-full border border-[#302c28]/10 object-cover sm:h-12 sm:w-12"
              iconClassName="h-5 w-5 sm:h-6 sm:w-6"
            />
            <div className="min-w-0">
              <h3 className="truncate font-semibold text-[#302c28]">{user?.name || user?.email || 'User'}</h3>
              <p className="text-sm text-[#756b62]">{formatTimestamp(post.createdAt)}</p>
            </div>
          </div>
          <button className="rounded-lg p-2 transition-colors hover:bg-[#edede9]" aria-label="Post options">
            <MoreVertical className="h-5 w-5 text-[#8a7b70]" />
          </button>
        </div>

        {post.content && (
          <p className="whitespace-pre-wrap leading-relaxed text-[#4d453e]">{post.content}</p>
        )}

        {aiPreview && (
          <div className="mt-4 space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              {aiPreview.tag === 'Verified' ? (
                <ShieldCheck className="h-5 w-5 text-emerald-700" />
              ) : (
                <AlertTriangle className="h-5 w-5 text-[#8a6f3e]" />
              )}
              <span
                className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                  aiPreview.tag === 'Verified'
                    ? 'border border-emerald-200 bg-emerald-50 text-emerald-700'
                    : aiPreview.tag === 'False'
                    ? 'border border-red-200 bg-red-50 text-red-700'
                    : 'border border-[#302c28]/10 bg-[#d6ccc2]/70 text-[#5f554d]'
                }`}
              >
                {aiPreview.tag || 'Unverified'}
              </span>
              {typeof aiPreview.score === 'number' && (
                <span className="text-xs text-[#756b62]">
                  Credibility {aiPreview.score}/5
                </span>
              )}
            </div>
            {aiPreview.summary && (
              <p className="rounded-lg border border-[#302c28]/10 bg-[#edede9]/75 p-3 text-sm text-[#5f554d]">
                {aiPreview.summary}
              </p>
            )}
          </div>
        )}
      </div>

      {post.mediaUrl && (
        <div className="w-full">
          <img
            src={post.mediaUrl.startsWith('http') ? post.mediaUrl : getFileUrl(post.mediaUrl.split('/').pop() || '')}
            alt="Post media"
            className="max-h-[600px] w-full object-cover"
          />
        </div>
      )}

      <div className="border-t border-[#302c28]/10 px-4 py-4 sm:px-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-6">
          <motion.button
            whileTap={{ scale: 0.94 }}
            whileHover={{ y: -1 }}
            onClick={async () => {
              try {
                if (liked) {
                  await postAPI.unlike(post._id);
                  setLikesCount((c) => Math.max(0, c - 1));
                  setLiked(false);
                } else {
                  await postAPI.like(post._id);
                  setLikesCount((c) => c + 1);
                  setLiked(true);
                }
              } catch {}
            }}
            className={`flex w-full items-center justify-center gap-2 rounded-full px-3 py-2 text-sm font-semibold transition-colors sm:w-auto ${
              liked
                ? 'bg-red-50 text-red-600'
                : 'bg-[#edede9] text-[#5f554d] hover:bg-[#d6ccc2]/80'
            }`}
          >
            <Heart className={`h-4 w-4 ${liked ? 'fill-current' : ''}`} />
            <span>Like</span>
            <span className="text-sm font-medium">{likesCount}</span>
          </motion.button>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5 flex-none text-[#8a7b70]" />
              <input
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                onKeyDown={async (e) => {
                  if (e.key === 'Enter' && commentText.trim()) {
                    try {
                      const res = (await postAPI.comment(post._id, commentText.trim())) as CommentResponse;
                      setComments((arr) => [...arr, { _id: res.id || crypto.randomUUID(), userId: user?._id || user?.id, text: commentText.trim(), createdAt: new Date().toISOString() }]);
                      setCommentText('');
                    } catch {}
                  }
                }}
                placeholder="Write a comment..."
                className="min-w-0 flex-1 rounded-lg border border-[#302c28]/10 bg-[#edede9] px-3 py-2 text-sm text-[#302c28] placeholder:text-[#756b62] focus:outline-none focus:ring-2 focus:ring-[#d6ccc2]"
              />
            </div>
            {comments.length > 0 && (
              <div className="mt-3 space-y-2">
                {comments.slice(-3).map((c) => {
                  const mine = String(c.userId) === String(user?._id || user?.id);
                  return (
                    <div key={c._id} className="flex items-center justify-between rounded-lg border border-[#302c28]/10 bg-[#f5ebe0]/80 px-3 py-2 text-sm text-[#4d453e]">
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
    </motion.article>
  );
}
