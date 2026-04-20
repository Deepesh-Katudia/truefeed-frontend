'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import {
  ArrowLeft,
  CalendarDays,
  Check,
  Clock3,
  FileText,
  Loader2,
  Mail,
  UserPlus,
  Users,
} from 'lucide-react';
import { motion } from 'framer-motion';

import { useAuth } from '@/context/AuthContext';
import { friendsAPI, toAbsoluteUrl, usersAPI } from '@/lib/api';
import { Sidebar } from '@/components/layout/Sidebar';
import { MobileNav } from '@/components/layout/MobileNav';

interface TargetUser {
  _id?: string;
  id?: string;
  email?: string;
  name?: string;
  picture?: string | null;
  description?: string;
  createdAt?: string | null;
}

interface Relation {
  isFriend: boolean;
  incomingPending: boolean;
  outgoingPending: boolean;
}

interface ProfilePost {
  _id: string;
  content?: string;
  mediaUrl?: string;
  createdAt?: string;
  ai?: {
    tag?: string;
  } | null;
}

const fadeUp = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0 },
};

const softSpring = { type: 'spring' as const, stiffness: 260, damping: 24 };

const getErrorMessage = (error: unknown, fallback: string) =>
  error instanceof Error ? error.message : fallback;

function getRelationState(relation: Relation | null) {
  if (relation?.isFriend) {
    return {
      label: 'Friends',
      icon: Check,
      disabled: true,
      className: 'border-emerald-200 bg-emerald-50 text-emerald-700',
    };
  }

  if (relation?.incomingPending || relation?.outgoingPending) {
    return {
      label: relation.incomingPending ? 'Pending' : 'Requested',
      icon: Clock3,
      disabled: true,
      className: 'border-[#302c28]/10 bg-[#d6ccc2]/80 text-[#5f554d]',
    };
  }

  return {
    label: 'Add Friend',
    icon: UserPlus,
    disabled: false,
    className: 'border-[#6f6258] bg-[#6f6258] text-[#fffaf4] hover:bg-[#5f554d]',
  };
}

function formatDate(value?: string | null) {
  if (!value) return 'Recently joined';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'Recently joined';
  return `Joined ${date.toLocaleDateString(undefined, {
    month: 'short',
    year: 'numeric',
  })}`;
}

export default function UserProfilePage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const params = useParams();
  const userId = String(params?.id || '');
  const [target, setTarget] = useState<TargetUser | null>(null);
  const [relation, setRelation] = useState<Relation | null>(null);
  const [posts, setPosts] = useState<ProfilePost[]>([]);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [requesting, setRequesting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!loading && !user) router.push('/login');
  }, [user, loading, router]);

  useEffect(() => {
    if (loading || !user || !userId) return;

    let cancelled = false;

    async function load() {
      try {
        setLoadingProfile(true);
        setError('');
        const [profileData, postsData] = await Promise.all([
          usersAPI.get(userId),
          usersAPI.posts(userId).catch(() => ({ posts: [] })),
        ]);

        if (cancelled) return;
        setTarget(profileData.user || null);
        setRelation(profileData.relation || null);
        setPosts(postsData.posts || []);
      } catch (e: unknown) {
        if (cancelled) return;
        setTarget(null);
        setRelation(null);
        setPosts([]);
        setError(getErrorMessage(e, 'Failed to load profile'));
      } finally {
        if (!cancelled) setLoadingProfile(false);
      }
    }

    void load();

    return () => {
      cancelled = true;
    };
  }, [loading, user, userId]);

  const avatarSrc = useMemo(() => {
    return (
      toAbsoluteUrl(target?.picture || undefined) ||
      `https://i.pravatar.cc/160?u=${encodeURIComponent(target?.email || 'user')}`
    );
  }, [target?.picture, target?.email]);

  const sendRequest = async () => {
    const targetId = target?._id || target?.id;
    if (!targetId) return;

    try {
      setRequesting(true);
      await friendsAPI.request(targetId);
      setRelation((prev) => ({
        isFriend: Boolean(prev?.isFriend),
        incomingPending: Boolean(prev?.incomingPending),
        outgoingPending: true,
      }));
      setError('');
    } catch (e: unknown) {
      const msg = getErrorMessage(e, 'Failed to send request');
      if (/already|pending/i.test(msg)) {
        setRelation((prev) => ({
          isFriend: Boolean(prev?.isFriend),
          incomingPending: Boolean(prev?.incomingPending),
          outgoingPending: true,
        }));
      } else {
        setError(msg);
      }
    } finally {
      setRequesting(false);
    }
  };

  if (loading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#edede9] text-[#302c28]">
        <Loader2 className="h-8 w-8 animate-spin text-[#6f6258]" />
      </div>
    );
  }

  const relationState = getRelationState(relation);
  const RelationIcon = relationState.icon;

  return (
    <div className="min-h-screen pb-24 text-[#302c28] lg:pb-0">
      <div className="fixed inset-0 -z-10 bg-[linear-gradient(135deg,#edede9_0%,#f5ebe0_54%,#d6ccc2_100%)]" />
      <div
        className="fixed inset-0 -z-10 opacity-[0.055]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(48,44,40,0.55) 1px, transparent 1px), linear-gradient(90deg, rgba(48,44,40,0.55) 1px, transparent 1px)',
          backgroundSize: '34px 34px',
        }}
      />

      <div className="mx-auto flex max-w-[1920px] gap-6 px-3 sm:px-4 lg:px-0">
        <motion.div
          initial={{ opacity: 0, x: -16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={softSpring}
          className="hidden shrink-0 lg:block"
        >
          <Sidebar />
        </motion.div>

        <main className="min-w-0 flex-1 px-0 py-4 sm:px-2 sm:py-5 lg:px-0 lg:py-8">
          <div className="mx-auto w-full max-w-6xl space-y-6">
            <Link
              href="/people"
              className="inline-flex items-center gap-2 rounded-2xl border border-[#302c28]/10 bg-[#fffaf4]/75 px-4 py-2 text-sm font-semibold text-[#5f554d] shadow-sm transition hover:bg-[#f5ebe0]"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to people
            </Link>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700"
              >
                {error}
              </motion.div>
            )}

            {loadingProfile ? (
              <div className="rounded-3xl border border-[#302c28]/10 bg-[#fffaf4]/75 p-8 shadow-[0_24px_70px_rgba(48,44,40,0.12)] backdrop-blur-xl">
                <Loader2 className="h-8 w-8 animate-spin text-[#6f6258]" />
              </div>
            ) : !target ? (
              <div className="rounded-3xl border border-[#302c28]/10 bg-[#fffaf4]/75 p-10 text-center shadow-[0_24px_70px_rgba(48,44,40,0.12)] backdrop-blur-xl">
                <div className="font-semibold text-[#302c28]">Profile not found</div>
                <p className="mt-2 text-sm text-[#756b62]">This member may no longer be available.</p>
              </div>
            ) : (
              <>
                <motion.section
                  variants={fadeUp}
                  initial="hidden"
                  animate="show"
                  transition={softSpring}
                  className="overflow-hidden rounded-3xl border border-[#302c28]/10 bg-[#fffaf4]/75 shadow-[0_24px_70px_rgba(48,44,40,0.12)] backdrop-blur-xl"
                >
                  <div className="h-1 w-full bg-[#d6ccc2]" />
                  <div className="h-32 bg-[linear-gradient(135deg,#d6ccc2_0%,#f5ebe0_58%,#edede9_100%)] sm:h-40" />

                  <div className="px-5 pb-6 sm:px-6">
                    <div className="-mt-12 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
                      <div className="flex min-w-0 items-end gap-4">
                        <div className="rounded-3xl bg-[#fffaf4]/85 p-1.5 shadow-lg shadow-[#302c28]/10 backdrop-blur">
                          <img
                            src={avatarSrc}
                            alt={target.name || target.email || 'Profile'}
                            className="h-24 w-24 rounded-2xl object-cover ring-1 ring-[#302c28]/10 sm:h-28 sm:w-28"
                          />
                        </div>

                        <div className="min-w-0 pb-2">
                          <h1 className="truncate text-2xl font-bold text-[#302c28] sm:text-3xl">
                            {target.name || target.email}
                          </h1>
                          <p className="truncate text-sm text-[#756b62]">
                            @{String(target.email || '').split('@')[0]}
                          </p>
                        </div>
                      </div>

                      <button
                        onClick={() => void sendRequest()}
                        disabled={relationState.disabled || requesting}
                        className={`inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-2xl border px-5 py-3 text-sm font-semibold shadow-sm transition disabled:cursor-not-allowed disabled:opacity-80 sm:w-auto ${relationState.className}`}
                      >
                        {requesting ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <RelationIcon className="h-4 w-4" />
                        )}
                        {requesting ? 'Sending' : relationState.label}
                      </button>
                    </div>

                    <div className="mt-6 grid gap-4 lg:grid-cols-[1fr_18rem]">
                      <p className="rounded-2xl border border-[#302c28]/10 bg-[#f5ebe0]/70 p-4 text-sm leading-6 text-[#5f554d]">
                        {target.description?.trim() || 'No profile bio yet.'}
                      </p>

                      <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
                        <div className="rounded-2xl border border-[#302c28]/10 bg-[#edede9]/80 p-3">
                          <div className="flex items-center gap-2 text-xs font-semibold uppercase text-[#756b62]">
                            <FileText className="h-4 w-4" />
                            Posts
                          </div>
                          <div className="mt-1 text-xl font-bold text-[#302c28]">{posts.length}</div>
                        </div>
                        <div className="rounded-2xl border border-[#302c28]/10 bg-[#edede9]/80 p-3">
                          <div className="flex items-center gap-2 text-xs font-semibold uppercase text-[#756b62]">
                            <Mail className="h-4 w-4" />
                            Email
                          </div>
                          <div className="mt-1 truncate text-sm font-semibold text-[#302c28]">
                            {target.email || '-'}
                          </div>
                        </div>
                        <div className="rounded-2xl border border-[#302c28]/10 bg-[#edede9]/80 p-3">
                          <div className="flex items-center gap-2 text-xs font-semibold uppercase text-[#756b62]">
                            <CalendarDays className="h-4 w-4" />
                            Member
                          </div>
                          <div className="mt-1 text-sm font-semibold text-[#302c28]">
                            {formatDate(target.createdAt)}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.section>

                <motion.section
                  variants={fadeUp}
                  initial="hidden"
                  animate="show"
                  transition={{ ...softSpring, delay: 0.05 }}
                  className="rounded-3xl border border-[#302c28]/10 bg-[#fffaf4]/75 p-5 shadow-[0_18px_55px_rgba(48,44,40,0.10)] backdrop-blur-xl sm:p-6"
                >
                  <div className="mb-5 flex items-center justify-between gap-4">
                    <div>
                      <h2 className="text-lg font-bold text-[#302c28]">Recent posts</h2>
                      <p className="text-sm text-[#756b62]">Posts shared by this member.</p>
                    </div>
                    <div className="rounded-2xl border border-[#302c28]/10 bg-[#d6ccc2]/75 px-3 py-2 text-sm font-semibold text-[#5f554d]">
                      {posts.length}
                    </div>
                  </div>

                  {posts.length === 0 ? (
                    <div className="rounded-2xl border border-[#302c28]/10 bg-[#edede9]/75 p-8 text-center">
                      <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl border border-[#302c28]/10 bg-[#f5ebe0] text-[#6f6258]">
                        <Users className="h-6 w-6" />
                      </div>
                      <div className="font-semibold text-[#302c28]">No posts yet</div>
                      <p className="mt-1 text-sm text-[#756b62]">This profile does not have public posts to show.</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {posts.map((post) => (
                        <article
                          key={post._id}
                          className="overflow-hidden rounded-2xl border border-[#302c28]/10 bg-[#f5ebe0]/70 shadow-sm"
                        >
                          <div className="p-4">
                            <div className="mb-3 flex items-center justify-between gap-3">
                              <div className="text-sm font-semibold text-[#302c28]">
                                {target.name || target.email}
                              </div>
                              {post.ai?.tag ? (
                                <span className="rounded-2xl border border-[#302c28]/10 bg-[#d6ccc2]/70 px-3 py-1 text-xs font-semibold text-[#5f554d]">
                                  {post.ai.tag}
                                </span>
                              ) : null}
                            </div>
                            {post.content ? (
                              <p className="whitespace-pre-wrap text-sm leading-6 text-[#4d453e]">
                                {post.content}
                              </p>
                            ) : null}
                          </div>

                          {post.mediaUrl ? (
                            <img
                              src={toAbsoluteUrl(post.mediaUrl)}
                              alt="Post media"
                              className="max-h-[420px] w-full object-cover"
                            />
                          ) : null}
                        </article>
                      ))}
                    </div>
                  )}
                </motion.section>
              </>
            )}
          </div>
        </main>
      </div>
      <MobileNav />
    </div>
  );
}
