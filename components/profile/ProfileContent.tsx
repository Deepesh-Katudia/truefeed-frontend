'use client';

import { useEffect, useMemo, useState } from 'react';
import { Edit2, FileText, Users } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

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

interface ProfilePost {
  _id: string;
  content?: string;
  mediaUrl?: string;
  ai?: {
    tag?: string;
  } | null;
}

const fadeUp = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35 } },
};

const softSpring = { type: 'spring' as const, stiffness: 260, damping: 24 };

export function ProfileContent({ user }: ProfileContentProps) {
  const [tab, setTab] = useState<'posts' | 'friends'>('posts');
  const [posts, setPosts] = useState<ProfilePost[]>([]);
  const [loadingPosts, setLoadingPosts] = useState(true);

  const { user: authUser, refreshUser } = useAuth();
  const [showEditModal, setShowEditModal] = useState(false);

  const me = authUser ?? user;

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
    <div className="min-h-screen bg-[linear-gradient(135deg,#edede9_0%,#f5ebe0_54%,#d6ccc2_100%)] text-[#302c28]">
      <div className="flex min-h-screen flex-col lg:flex-row">
        <div className="lg:sticky lg:top-0 lg:h-screen">
          <Sidebar />
        </div>

        <div className="flex-1 px-4 py-5 sm:px-6 lg:px-8 lg:py-8">
          <div className="mx-auto w-full max-w-6xl">
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
              <div className="space-y-6 lg:col-span-8">
                <motion.div
                  variants={fadeUp}
                  initial="hidden"
                  animate="show"
                  className="overflow-hidden rounded-3xl border border-[#302c28]/10 bg-[#fffaf4]/75 shadow-[0_24px_70px_rgba(48,44,40,0.12)] backdrop-blur-xl"
                >
                  <div className="h-1 w-full bg-[#d6ccc2]" />

                  <div className="relative">
                    <div
                      className="h-28 sm:h-32"
                      style={{
                        background: 'linear-gradient(135deg, #d6ccc2 0%, #f5ebe0 58%, #edede9 100%)',
                      }}
                    />
                    <div className="absolute inset-0 bg-[#fffaf4]/10" />
                  </div>

                  <div className="px-5 pb-6 pt-4 sm:px-6 sm:pt-0">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                      <div className="flex items-end gap-4">
                        <motion.div
                          initial={{ opacity: 0, scale: 0.95, y: 10 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          transition={softSpring}
                          className="-mt-10 sm:-mt-12"
                        >
                          <div className="rounded-3xl bg-[#fffaf4]/80 p-1.5 shadow-lg shadow-[#302c28]/10 backdrop-blur">
                            <img
                              src={avatarSrc}
                              alt={me?.name || me?.email}
                              className="h-20 w-20 rounded-2xl object-cover ring-1 ring-[#302c28]/10 sm:h-24 sm:w-24"
                            />
                          </div>
                        </motion.div>

                        <div className="min-w-0 pb-1">
                          <h1 className="truncate text-xl font-bold text-[#302c28] sm:text-2xl">
                            {me?.name || me?.email}
                          </h1>
                          <p className="truncate text-sm text-[#756b62]">
                            @{me?.email?.split('@')[0]}
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-2 sm:justify-end">
                        <div className="flex items-center gap-2">
                          <span className="mt-2 inline-flex items-center gap-1 rounded-2xl border border-[#302c28]/10 bg-[#f5ebe0]/80 px-3 py-2 text-sm font-semibold text-[#4d453e] shadow-sm">
                            <FileText className="h-4 w-4" />
                            Posts <span className="opacity-70">{posts.length}</span>
                          </span>

                          <span className="mt-2 inline-flex items-center gap-1 rounded-2xl border border-[#302c28]/10 bg-[#f5ebe0]/80 px-3 py-2 text-sm font-semibold text-[#4d453e] shadow-sm">
                            <Users className="h-4 w-4" />
                            Friends <span className="opacity-70">0</span>
                          </span>
                        </div>

                        <button
                          onClick={() => setShowEditModal(true)}
                          className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#6f6258] px-4 py-2 text-sm font-semibold text-[#fffaf4] shadow-md shadow-[#6f6258]/20 transition hover:bg-[#5f554d] focus:outline-none focus:ring-4 focus:ring-[#d6ccc2]/50"
                        >
                          <Edit2 className="h-4 w-4" />
                          Edit Profile
                        </button>
                      </div>
                    </div>

                    <div className="mt-4">
                      <p className="text-sm text-[#5f554d]">
                        {me?.description?.trim() ? me.description : 'Add a bio to tell people about you.'}
                      </p>
                    </div>

                    <div className="mt-6 border-t border-[#302c28]/10 pt-4">
                      <div className="relative flex gap-2">
                        <button
                          onClick={() => setTab('posts')}
                          className={`relative rounded-2xl px-4 py-2 text-sm font-semibold transition ${
                            tab === 'posts'
                              ? 'text-[#5f554d]'
                              : 'text-[#756b62] hover:bg-[#edede9]'
                          }`}
                        >
                          Posts
                          {tab === 'posts' && (
                            <motion.div
                              layoutId="profileTabUnderline"
                              className="absolute inset-x-3 -bottom-1 h-0.5 rounded-full bg-[#8a7b70]"
                              transition={softSpring}
                            />
                          )}
                        </button>

                        <button
                          onClick={() => setTab('friends')}
                          className={`relative rounded-2xl px-4 py-2 text-sm font-semibold transition ${
                            tab === 'friends'
                              ? 'text-[#5f554d]'
                              : 'text-[#756b62] hover:bg-[#edede9]'
                          }`}
                        >
                          Friends
                          {tab === 'friends' && (
                            <motion.div
                              layoutId="profileTabUnderline"
                              className="absolute inset-x-3 -bottom-1 h-0.5 rounded-full bg-[#8a7b70]"
                              transition={softSpring}
                            />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>

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
                        <div className="rounded-3xl border border-[#302c28]/10 bg-[#fffaf4]/75 p-6 shadow-[0_18px_55px_rgba(48,44,40,0.10)] backdrop-blur-xl">
                          <div className="h-4 w-40 rounded bg-[#302c28]/10" />
                          <div className="mt-4 space-y-2">
                            <div className="h-3 w-full rounded bg-[#302c28]/5" />
                            <div className="h-3 w-5/6 rounded bg-[#302c28]/5" />
                            <div className="h-3 w-2/3 rounded bg-[#302c28]/5" />
                          </div>
                        </div>
                      ) : posts.length === 0 ? (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.98 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={softSpring}
                          className="rounded-3xl border border-[#302c28]/10 bg-[#fffaf4]/75 p-10 text-center shadow-[0_18px_55px_rgba(48,44,40,0.10)] backdrop-blur-xl"
                        >
                          <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl border border-[#302c28]/10 bg-[#edede9] text-[#6f6258]">
                            <FileText className="h-7 w-7" />
                          </div>
                          <div className="font-semibold text-[#302c28]">No posts yet</div>
                          <div className="text-sm text-[#756b62]">Create your first post to show up here.</div>
                        </motion.div>
                      ) : (
                        posts.map((p) => (
                          <motion.div
                            key={p._id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={softSpring}
                            className="overflow-hidden rounded-3xl border border-[#302c28]/10 bg-[#fffaf4]/75 shadow-[0_18px_55px_rgba(48,44,40,0.10)] backdrop-blur-xl"
                          >
                            <div className="p-5 sm:p-6">
                              <div className="mb-3 flex items-center gap-3">
                                <img
                                  src={avatarSrc}
                                  alt={me?.name || me?.email}
                                  className="h-10 w-10 rounded-2xl object-cover ring-1 ring-[#302c28]/10"
                                />
                                <div className="min-w-0 flex-1">
                                  <div className="truncate font-semibold text-[#302c28]">
                                    {me?.name || me?.email}
                                  </div>
                                  <div className="text-xs text-[#756b62]">Just now</div>
                                </div>

                                {p?.ai?.tag && (
                                  <span className="rounded-2xl border border-[#302c28]/10 bg-[#d6ccc2]/70 px-3 py-1 text-xs font-semibold text-[#5f554d]">
                                    {p.ai.tag}
                                  </span>
                                )}
                              </div>

                              {p.content && (
                                <div className="whitespace-pre-wrap leading-relaxed text-[#4d453e]">
                                  {p.content}
                                </div>
                              )}
                            </div>

                            {p.mediaUrl && (
                              <div className="px-5 pb-5 sm:px-6 sm:pb-6">
                                <img
                                  src={toAbsoluteUrl(p.mediaUrl)}
                                  alt="Post media"
                                  className="max-h-[420px] w-full rounded-2xl object-cover ring-1 ring-[#302c28]/10"
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
                      className="rounded-3xl border border-[#302c28]/10 bg-[#fffaf4]/75 p-6 text-[#5f554d] shadow-[0_18px_55px_rgba(48,44,40,0.10)] backdrop-blur-xl"
                    >
                      No friends yet.
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="space-y-6 lg:col-span-4">
                <motion.div
                  variants={fadeUp}
                  initial="hidden"
                  animate="show"
                  transition={{ delay: 0.05 }}
                  className="rounded-3xl border border-[#302c28]/10 bg-[#fffaf4]/75 p-6 shadow-[0_24px_70px_rgba(48,44,40,0.12)] backdrop-blur-xl"
                >
                  <div className="text-sm font-bold text-[#302c28]">About</div>
                  <div className="mt-3 space-y-3">
                    <div>
                      <div className="text-xs font-semibold text-[#756b62]">Description</div>
                      <div className="mt-1 text-sm text-[#4d453e]">
                        {me?.description?.trim() ? me.description : '-'}
                      </div>
                    </div>

                    {me?.phone ? (
                      <div>
                        <div className="text-xs font-semibold text-[#756b62]">Phone</div>
                        <div className="mt-1 text-sm text-[#4d453e]">{me.phone}</div>
                      </div>
                    ) : null}
                  </div>
                </motion.div>

                <div className="rounded-3xl border border-[#302c28]/10 bg-[#fffaf4]/75 p-4 shadow-[0_18px_55px_rgba(48,44,40,0.10)] backdrop-blur-xl lg:hidden">
                  <button
                    onClick={() => setShowEditModal(true)}
                    className="w-full rounded-2xl bg-[#6f6258] px-4 py-3 text-sm font-semibold text-[#fffaf4] shadow-md shadow-[#6f6258]/20 transition hover:bg-[#5f554d]"
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
