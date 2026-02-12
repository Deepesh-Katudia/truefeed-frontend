'use client';

import { useEffect, useMemo, useState } from 'react';
import { Edit2, Users, FileText } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

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
  user: User; // server/parent provided user (can become stale)
}

const fadeUp = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35 } },
};

const softSpring = { type: 'spring' as const, stiffness: 260, damping: 24 };

export function ProfileContent({ user }: ProfileContentProps) {
  const [tab, setTab] = useState<'posts' | 'friends'>('posts');
  const [posts, setPosts] = useState<any[]>([]);
  const [loadingPosts, setLoadingPosts] = useState(true);

  const { user: authUser, refreshUser } = useAuth();
  const [showEditModal, setShowEditModal] = useState(false);

  // Always prefer AuthContext user (fresh) over prop user (can be stale)
  const me = authUser ?? user;

  // Cache-bust for Supabase/public URLs and browser caching
  const avatarSrc = useMemo(() => {
    const base = toAbsoluteUrl(me?.picture);
    if (base) {
      const sep = base.includes('?') ? '&' : '?';
      return `${base}${sep}v=${Date.now()}`;
    }
    return `https://i.pravatar.cc/120?u=${me?.email || 'user'}`;
  }, [me?.picture, me?.email]);

  useEffect(() => {
    const load = async () => {
      setLoadingPosts(true);
      try {
        const data = await postAPI.getMyPosts();
        setPosts(data.posts || []);
      } catch {
        setPosts([]);
      } finally {
        setLoadingPosts(false);
      }
    };
    load();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-purple-50 to-blue-50">
      {/* Layout container */}
      <div className="flex min-h-screen flex-col lg:flex-row">
        {/* Sidebar */}
        <div className="lg:sticky lg:top-0 lg:h-screen">
          <Sidebar />
        </div>

        {/* Main */}
        <div className="flex-1 px-4 py-5 sm:px-6 lg:px-8 lg:py-8">
          <div className="mx-auto w-full max-w-6xl">
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
              {/* Left main column */}
              <div className="lg:col-span-8 space-y-6">
                {/* Profile Header Card */}
                <motion.div
                  variants={fadeUp}
                  initial="hidden"
                  animate="show"
                  className="overflow-hidden rounded-3xl border border-black/10 bg-white/70 shadow-2xl shadow-black/5 backdrop-blur-xl"
                >
                  {/* Accent strip */}
                  <div className="h-1 w-full bg-gradient-to-r from-amber-400 via-pink-400 to-sky-400" />

                  {/* Cover */}
                  <div className="relative">
                    <div
                      className="h-28 sm:h-32"
                      style={{
                        background: `
                          radial-gradient(circle at 15% 85%, #0f172a 0%, #1e3a8a 20%, transparent 50%),
                          radial-gradient(circle at 20% 20%, #06b6d4 0%, #22d3ee 30%, transparent 60%),
                          radial-gradient(circle at 80% 80%, #a855f7 0%, #c026d3 20%, transparent 55%),
                          linear-gradient(135deg, #3b82f6 0%, #8b5cf6 50%, #7c3aed 100%)
                        `,
                      }}
                    />
                    {/* subtle overlay */}
                    <div className="absolute inset-0 bg-white/5" />
                  </div>

                  {/* Content */}
                  <div className="px-5 pb-6 pt-4 sm:px-6 sm:pt-0">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                      {/* Avatar + identity */}
                      <div className="flex items-end gap-4">
                        <motion.div
                          initial={{ opacity: 0, scale: 0.95, y: 10 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          transition={softSpring}
                          className="-mt-10 sm:-mt-12"
                        >
                          <div className="rounded-3xl bg-white/70 p-1.5 shadow-lg shadow-black/10 backdrop-blur">
                            <img
                              src={avatarSrc}
                              alt={me?.name || me?.email}
                              className="h-20 w-20 sm:h-24 sm:w-24 rounded-2xl object-cover ring-1 ring-black/10"
                            />
                          </div>
                        </motion.div>

                        <div className="min-w-0 pb-1">
                          <div className="flex items-center gap-2">
                            <h1 className="truncate text-xl sm:text-2xl font-bold text-neutral-900">
                              {me?.name || me?.email}
                            </h1>
                          </div>
                          <p className="truncate text-sm text-neutral-600">
                            @{me?.email?.split('@')[0]}
                          </p>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex flex-wrap items-center gap-2 sm:justify-end">
                        <div className="flex items-center gap-2">
                          <span className="inline-flex items-center gap-1 rounded-2xl border border-black/10 bg-white/70 px-3 py-2 mt-2 text-sm font-semibold text-neutral-800 shadow-sm">
                            <FileText className="h-4 w-4" />
                            Posts <span className="opacity-70">{posts.length}</span>
                          </span>

                          <span className="inline-flex items-center gap-1 rounded-2xl border border-black/10 bg-white/70 px-3 py-2 mt-2 text-sm font-semibold text-neutral-800 shadow-sm">
                            <Users className="h-4 w-4" />
                            Friends <span className="opacity-70">0</span>
                          </span>
                        </div>

                        <button
                          onClick={() => setShowEditModal(true)}
                          className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-md shadow-indigo-500/20 transition hover:opacity-95 focus:outline-none focus:ring-4 focus:ring-indigo-200/40"
                        >
                          <Edit2 className="h-4 w-4" />
                          Edit Profile
                        </button>
                      </div>
                    </div>

                    {/* Bio */}
                    <div className="mt-4">
                      <p className="text-sm text-neutral-700">
                        {me?.description?.trim() ? me.description : 'Add a bio to tell people about you.'}
                      </p>
                    </div>

                    {/* Tabs */}
                    <div className="mt-6 border-t border-black/10 pt-4">
                      <div className="relative flex gap-2">
                        <button
                          onClick={() => setTab('posts')}
                          className={`relative rounded-2xl px-4 py-2 text-sm font-semibold transition ${
                            tab === 'posts'
                              ? 'text-blue-700'
                              : 'text-neutral-700 hover:bg-black/5'
                          }`}
                        >
                          Posts
                          {tab === 'posts' && (
                            <motion.div
                              layoutId="profileTabUnderline"
                              className="absolute inset-x-3 -bottom-1 h-0.5 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600"
                              transition={softSpring}
                            />
                          )}
                        </button>

                        <button
                          onClick={() => setTab('friends')}
                          className={`relative rounded-2xl px-4 py-2 text-sm font-semibold transition ${
                            tab === 'friends'
                              ? 'text-blue-700'
                              : 'text-neutral-700 hover:bg-black/5'
                          }`}
                        >
                          Friends
                          {tab === 'friends' && (
                            <motion.div
                              layoutId="profileTabUnderline"
                              className="absolute inset-x-3 -bottom-1 h-0.5 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600"
                              transition={softSpring}
                            />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Tab content */}
                <AnimatePresence mode="wait">
                  {tab === 'posts' && (
                    <motion.div
                      key="posts"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ duration: 0.25 }}
                      className="space-y-4"
                    >
                      {loadingPosts ? (
                        <div className="rounded-3xl border border-black/10 bg-white/70 p-6 shadow-lg shadow-black/5 backdrop-blur-xl">
                          <div className="h-4 w-40 rounded bg-black/10" />
                          <div className="mt-4 space-y-2">
                            <div className="h-3 w-full rounded bg-black/5" />
                            <div className="h-3 w-5/6 rounded bg-black/5" />
                            <div className="h-3 w-2/3 rounded bg-black/5" />
                          </div>
                        </div>
                      ) : posts.length === 0 ? (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.98 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={softSpring}
                          className="rounded-3xl border border-black/10 bg-white/70 p-10 text-center shadow-lg shadow-black/5 backdrop-blur-xl"
                        >
                          <div className="mx-auto mb-3 w-fit rounded-2xl bg-black/5 px-4 py-2 text-3xl">
                            📝
                          </div>
                          <div className="text-neutral-900 font-semibold">No posts yet</div>
                          <div className="text-sm text-neutral-600">Create your first post to show up here.</div>
                        </motion.div>
                      ) : (
                        posts.map((p) => (
                          <motion.div
                            key={p._id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={softSpring}
                            className="overflow-hidden rounded-3xl border border-black/10 bg-white/70 shadow-lg shadow-black/5 backdrop-blur-xl"
                          >
                            <div className="p-5 sm:p-6">
                              <div className="flex items-center gap-3 mb-3">
                                <img
                                  src={avatarSrc}
                                  alt={me?.name || me?.email}
                                  className="h-10 w-10 rounded-2xl object-cover ring-1 ring-black/10"
                                />
                                <div className="flex-1 min-w-0">
                                  <div className="truncate font-semibold text-neutral-900">
                                    {me?.name || me?.email}
                                  </div>
                                  <div className="text-xs text-neutral-500">Just now</div>
                                </div>

                                {p?.ai?.tag && (
                                  <span className="rounded-2xl border border-black/10 bg-white/80 px-3 py-1 text-xs font-semibold text-neutral-800">
                                    {p.ai.tag}
                                  </span>
                                )}
                              </div>

                              {p.content && (
                                <div className="text-neutral-800 whitespace-pre-wrap leading-relaxed">
                                  {p.content}
                                </div>
                              )}
                            </div>

                            {p.mediaUrl && (
                              <div className="px-5 pb-5 sm:px-6 sm:pb-6">
                                <img
                                  src={toAbsoluteUrl(p.mediaUrl)}
                                  alt="Post media"
                                  className="w-full max-h-[420px] rounded-2xl object-cover ring-1 ring-black/10"
                                />
                              </div>
                            )}
                          </motion.div>
                        ))
                      )}
                    </motion.div>
                  )}

                  {tab === 'friends' && (
                    <motion.div
                      key="friends"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ duration: 0.25 }}
                      className="rounded-3xl border border-black/10 bg-white/70 p-6 text-neutral-700 shadow-lg shadow-black/5 backdrop-blur-xl"
                    >
                      No friends yet.
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Right column */}
              <div className="lg:col-span-4 space-y-6">
                <motion.div
                  variants={fadeUp}
                  initial="hidden"
                  animate="show"
                  transition={{ delay: 0.05 }}
                  className="rounded-3xl border border-black/10 bg-white/70 p-6 shadow-2xl shadow-black/5 backdrop-blur-xl"
                >
                  <div className="text-sm font-bold text-neutral-900">About</div>
                  <div className="mt-3 space-y-3">
                    <div>
                      <div className="text-xs font-semibold text-neutral-600">Description</div>
                      <div className="mt-1 text-sm text-neutral-800">
                        {me?.description?.trim() ? me.description : '—'}
                      </div>
                    </div>

                    {me?.phone ? (
                      <div>
                        <div className="text-xs font-semibold text-neutral-600">Phone</div>
                        <div className="mt-1 text-sm text-neutral-800">{me.phone}</div>
                      </div>
                    ) : null}
                  </div>
                </motion.div>

                {/* Mobile-only quick actions card */}
                <div className="lg:hidden rounded-3xl border border-black/10 bg-white/70 p-4 shadow-lg shadow-black/5 backdrop-blur-xl">
                  <button
                    onClick={() => setShowEditModal(true)}
                    className="w-full rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-md shadow-indigo-500/20 transition hover:opacity-95"
                  >
                    Edit Profile
                  </button>
                </div>
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
          currentUser={me}
        />
      </div>
    </div>
  );
}
