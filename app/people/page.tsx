'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowRight, Check, Clock3, Loader2, Search, UserPlus, Users } from 'lucide-react';
import { motion } from 'framer-motion';

import { useAuth } from '@/context/AuthContext';
import { friendsAPI, toAbsoluteUrl } from '@/lib/api';
import { Sidebar } from '@/components/layout/Sidebar';

interface Person {
  _id: string;
  name: string;
  email: string;
  picture?: string | null;
  description?: string;
  isFriend: boolean;
  incomingPending: boolean;
  outgoingPending: boolean;
}

const getErrorMessage = (error: unknown, fallback: string) =>
  error instanceof Error ? error.message : fallback;

const fadeUp = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0 },
};

const softSpring = { type: 'spring' as const, stiffness: 260, damping: 24 };

function getAvatar(person: Person) {
  return (
    toAbsoluteUrl(person.picture || undefined) ||
    `https://i.pravatar.cc/120?u=${encodeURIComponent(person.email)}`
  );
}

function getRelation(person: Person) {
  if (person.isFriend) {
    return {
      label: 'Friends',
      icon: Check,
      disabled: true,
      className: 'border-emerald-200 bg-emerald-50 text-emerald-700',
    };
  }

  if (person.outgoingPending || person.incomingPending) {
    return {
      label: person.incomingPending ? 'Pending' : 'Requested',
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

export default function PeoplePage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const requestIdRef = useRef(0);
  const [q, setQ] = useState('');
  const [list, setList] = useState<Person[]>([]);
  const [fetching, setFetching] = useState(false);
  const [error, setError] = useState('');
  const [requestingId, setRequestingId] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  const load = useCallback(async (query: string) => {
    const requestId = requestIdRef.current + 1;
    requestIdRef.current = requestId;

    try {
      setFetching(true);
      const data = await friendsAPI.search(query.trim(), 30);
      if (requestId !== requestIdRef.current) return;
      setList(data.results || []);
      setError('');
    } catch (e: unknown) {
      if (requestId !== requestIdRef.current) return;
      setList([]);
      setError(getErrorMessage(e, 'Failed to load people'));
    } finally {
      if (requestId === requestIdRef.current) {
        setFetching(false);
      }
    }
  }, []);

  useEffect(() => {
    if (loading || !user) return;
    const timer = window.setTimeout(() => {
      void load(q);
    }, q.trim() ? 280 : 80);

    return () => window.clearTimeout(timer);
  }, [loading, user, q, load]);

  const sendRequest = async (targetUserId: string) => {
    try {
      setRequestingId(targetUserId);
      await friendsAPI.request(targetUserId);
      setList((prev) =>
        prev.map((p) =>
          p._id === targetUserId ? { ...p, outgoingPending: true } : p
        )
      );
      setError('');
    } catch (e: unknown) {
      const msg = getErrorMessage(e, 'Failed to send request');
      if (/already|pending/i.test(msg)) {
        setList((prev) =>
          prev.map((p) =>
            p._id === targetUserId ? { ...p, outgoingPending: true } : p
          )
        );
      } else {
        setError(msg);
      }
    } finally {
      setRequestingId(null);
    }
  };

  const directoryLabel = useMemo(() => {
    const trimmed = q.trim();
    const count = list.length;
    const profileLabel = count === 1 ? 'profile' : 'profiles';
    if (!trimmed) return `Showing ${count} ${profileLabel}`;
    return `Showing ${count} ${profileLabel} for "${trimmed}"`;
  }, [q, list.length]);

  if (loading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#edede9] text-[#302c28]">
        <Loader2 className="h-8 w-8 animate-spin text-[#6f6258]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen text-[#302c28]">
      <div className="fixed inset-0 -z-10 bg-[linear-gradient(135deg,#edede9_0%,#f5ebe0_54%,#d6ccc2_100%)]" />
      <div
        className="fixed inset-0 -z-10 opacity-[0.055]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(48,44,40,0.55) 1px, transparent 1px), linear-gradient(90deg, rgba(48,44,40,0.55) 1px, transparent 1px)',
          backgroundSize: '34px 34px',
        }}
      />

      <div className="mx-auto flex max-w-[1920px] gap-6 px-4 lg:px-0">
        <motion.div
          initial={{ opacity: 0, x: -16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={softSpring}
          className="hidden shrink-0 lg:block"
        >
          <Sidebar />
        </motion.div>

        <main className="min-w-0 flex-1 px-0 py-5 sm:px-2 lg:px-0 lg:py-8">
          <div className="mx-auto w-full max-w-6xl space-y-6">
            <motion.section
              variants={fadeUp}
              initial="hidden"
              animate="show"
              transition={softSpring}
              className="overflow-hidden rounded-3xl border border-[#302c28]/10 bg-[#fffaf4]/75 shadow-[0_24px_70px_rgba(48,44,40,0.12)] backdrop-blur-xl"
            >
              <div className="h-1 w-full bg-[#d6ccc2]" />
              <div className="p-5 sm:p-6">
                <div>
                  <div className="mb-3 inline-flex items-center gap-2 rounded-2xl border border-[#302c28]/10 bg-[#f5ebe0]/80 px-3 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-[#756b62]">
                    <Users className="h-4 w-4" />
                    People Directory
                  </div>
                  <h1 className="text-3xl font-bold leading-tight text-[#302c28] sm:text-4xl">
                    Find members across TrueFeed.
                  </h1>
                  <p className="mt-3 max-w-2xl text-sm leading-6 text-[#5f554d] sm:text-base">
                    Search member profiles, open profile pages, and send friend requests from one clean workspace.
                  </p>
                </div>
              </div>
            </motion.section>

            <motion.section
              variants={fadeUp}
              initial="hidden"
              animate="show"
              transition={{ ...softSpring, delay: 0.04 }}
              className="rounded-3xl border border-[#302c28]/10 bg-[#fffaf4]/75 p-4 shadow-[0_18px_55px_rgba(48,44,40,0.10)] backdrop-blur-xl sm:p-5"
            >
              <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
                <div className="relative min-w-0 flex-1">
                  <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#756b62]" />
                  <input
                    value={q}
                    onChange={(e) => setQ(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') void load(q);
                    }}
                    placeholder="Search by name, email, or profile bio"
                    className="h-12 w-full rounded-2xl border border-[#302c28]/10 bg-[#edede9] py-3 pl-12 pr-4 text-sm font-medium text-[#302c28] placeholder:text-[#756b62] shadow-sm transition focus:outline-none focus:ring-4 focus:ring-[#d6ccc2]/50"
                  />
                </div>
                <button
                  onClick={() => void load(q)}
                  disabled={fetching}
                  className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-[#6f6258] px-5 py-3 text-sm font-semibold text-[#fffaf4] shadow-md shadow-[#6f6258]/20 transition hover:bg-[#5f554d] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {fetching ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
                  {fetching ? 'Searching' : 'Search'}
                </button>
              </div>

              <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-[#302c28]/10 pt-4">
                <p className="text-sm font-medium text-[#5f554d]">{directoryLabel}</p>
                <p className="text-xs text-[#756b62]">
                  Addable members show a request action on the right.
                </p>
              </div>
            </motion.section>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700"
              >
                {error}
              </motion.div>
            )}

            <section className="grid grid-cols-[repeat(auto-fit,minmax(270px,1fr))] gap-4">
              {list.map((person, index) => {
                const relation = getRelation(person);
                const RelationIcon = relation.icon;
                return (
                  <motion.article
                    key={person._id}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ ...softSpring, delay: Math.min(index * 0.025, 0.18) }}
                    className="group overflow-hidden rounded-3xl border border-[#302c28]/10 bg-[#fffaf4]/75 shadow-[0_16px_45px_rgba(48,44,40,0.08)] backdrop-blur-xl transition hover:-translate-y-1 hover:bg-[#fffaf4] hover:shadow-[0_24px_62px_rgba(48,44,40,0.12)]"
                  >
                    <div className="h-1 w-full bg-[#d6ccc2]" />
                    <div className="p-5">
                      <div className="flex items-start gap-4">
                        <Link href={`/profile/${person._id}`} className="shrink-0">
                          <img
                            src={getAvatar(person)}
                            alt={person.name || person.email}
                            className="h-16 w-16 rounded-2xl border border-[#302c28]/10 object-cover shadow-sm"
                          />
                        </Link>

                        <div className="min-w-0 flex-1">
                          <Link href={`/profile/${person._id}`} className="group/link block">
                            <h2 className="truncate text-lg font-bold text-[#302c28] group-hover/link:text-[#5f554d]">
                              {person.name || person.email}
                            </h2>
                            <p className="truncate text-sm text-[#756b62]">
                              @{person.email.split('@')[0]}
                            </p>
                          </Link>
                        </div>
                      </div>

                      <p className="mt-4 line-clamp-2 min-h-[2.75rem] text-sm leading-6 text-[#5f554d]">
                        {person.description?.trim() || 'No profile bio yet.'}
                      </p>

                      <div className="mt-5 flex items-center gap-2">
                        <button
                          onClick={() => void sendRequest(person._id)}
                          disabled={relation.disabled || requestingId === person._id}
                          className={`inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-2xl border px-3 py-2 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-80 ${relation.className}`}
                        >
                          {requestingId === person._id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <RelationIcon className="h-4 w-4" />
                          )}
                          {requestingId === person._id ? 'Sending' : relation.label}
                        </button>

                        <Link
                          href={`/profile/${person._id}`}
                          className="inline-flex min-h-11 items-center justify-center rounded-2xl border border-[#302c28]/10 bg-[#edede9] px-3 py-2 text-[#5f554d] transition hover:bg-[#d6ccc2]/70"
                          aria-label={`Open ${person.name || person.email} profile`}
                        >
                          <ArrowRight className="h-4 w-4" />
                        </Link>
                      </div>
                    </div>
                  </motion.article>
                );
              })}
            </section>

            {!fetching && list.length === 0 && !error && (
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={softSpring}
                className="rounded-3xl border border-[#302c28]/10 bg-[#fffaf4]/75 p-10 text-center shadow-[0_18px_55px_rgba(48,44,40,0.10)] backdrop-blur-xl"
              >
                <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl border border-[#302c28]/10 bg-[#edede9] text-[#6f6258]">
                  <Users className="h-7 w-7" />
                </div>
                <div className="font-semibold text-[#302c28]">No profiles found</div>
                <div className="text-sm text-[#756b62]">Try a different name, email, or bio keyword.</div>
              </motion.div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
