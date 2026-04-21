'use client';

import { useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

import { useAuth } from '@/context/AuthContext';
import { storiesAPI, toAbsoluteUrl } from '@/lib/api';
import { StoryCreateModal } from './StoryCreateModal';
import { StoryViewer } from './StoryViewer';

interface StoryItem {
  _id: string;
  text?: string;
  mediaUrl?: string;
  mediaType: 'image' | 'video' | 'none';
  createdAt: string;
  expiresAt: string;
}

interface StoryUserGroup {
  user: { _id: string; name?: string; email?: string; picture?: string | null };
  latestCreatedAt: string;
  items: StoryItem[];
}

const getErrorMessage = (error: unknown, fallback: string) =>
  error instanceof Error ? error.message : fallback;

export function StoryBar() {
  const [groups, setGroups] = useState<StoryUserGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showCreate, setShowCreate] = useState(false);
  const [viewerGroup, setViewerGroup] = useState<StoryUserGroup | null>(null);
  const { user } = useAuth();
  const [viewerStartIdx, setViewerStartIdx] = useState(0);
  const stripRef = useRef<HTMLDivElement>(null);

  const load = async () => {
    try {
      setLoading(true);
      const data = await storiesAPI.feed();
      setGroups(data.users || []);
      setError('');
    } catch (e: unknown) {
      setError(getErrorMessage(e, 'Failed to load stories'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const renderStoryCard = (g: StoryUserGroup, bgSrc: string, onClick: () => void, key: string) => (
    <div key={key} className="w-24 flex-shrink-0 sm:w-32" onClick={onClick}>
      <div className="relative h-36 cursor-pointer overflow-hidden rounded-2xl border border-[#302c28]/10 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_18px_42px_rgba(48,44,40,0.14)] sm:h-48">
        <img src={bgSrc} alt={g.user.name || g.user.email || 'Story'} className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#302c28]/55 via-transparent to-transparent" />
        <div className="absolute left-3 top-3">
          <img
            src={toAbsoluteUrl(g.user.picture || undefined) || 'https://i.pravatar.cc/100?u=' + (g.user.email || g.user._id)}
            alt={g.user.name || g.user.email || 'User'}
            className="h-8 w-8 rounded-full border-2 border-[#fffaf4] object-cover sm:h-10 sm:w-10"
          />
        </div>
        <div className="absolute bottom-3 left-3 right-3">
          <p className="truncate text-sm font-semibold text-white">{g.user.name || g.user.email}</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="mb-4 sm:mb-6">
      <div className="relative">
        <div className="flex gap-3 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] sm:gap-4 lg:overflow-x-hidden [&::-webkit-scrollbar]:hidden" ref={stripRef}>
          <div className="w-24 flex-shrink-0 sm:w-32" onClick={() => setShowCreate(true)}>
            <div className="group relative h-36 cursor-pointer overflow-hidden rounded-2xl border border-[#302c28]/10 bg-[#edede9] shadow-sm transition-all duration-200 hover:-translate-y-1 hover:bg-[#f5ebe0] hover:shadow-[0_18px_42px_rgba(48,44,40,0.12)] sm:h-48">
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full border border-[#302c28]/10 bg-[#fffaf4] shadow-lg shadow-[#302c28]/5 transition-transform group-hover:scale-110">
                  <svg className="h-6 w-6 text-[#5f554d]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </div>
                <span className="text-center text-xs font-semibold text-[#4d453e] sm:text-sm">Add Story</span>
              </div>
            </div>
          </div>

          {loading && (
            <div className="flex h-36 w-24 flex-shrink-0 items-center justify-center rounded-2xl border border-[#302c28]/10 bg-[#edede9] text-center text-xs text-[#756b62] sm:h-48 sm:w-32 sm:text-sm">
              Loading...
            </div>
          )}

          {!loading && error && (
            <div className="flex h-36 w-40 flex-shrink-0 items-center justify-center rounded-2xl border border-red-200 bg-red-50 px-4 text-center text-xs text-red-700 sm:h-48 sm:w-48 sm:text-sm">
              {error}
            </div>
          )}

          {!loading && !error && groups.flatMap((g) => {
            const uid = String(user?._id || user?.id);
            if (String(g.user._id) === uid) {
              return g.items.map((it, index) => {
                const bgSrc =
                  (it.mediaType === 'image' && toAbsoluteUrl(it.mediaUrl)) ||
                  g.user.picture ||
                  'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=300&h=400&fit=crop';

                return renderStoryCard(
                  g,
                  bgSrc,
                  () => {
                    setViewerGroup(g);
                    setViewerStartIdx(index);
                  },
                  `self-${String(it._id)}`
                );
              });
            }

            const firstWithMedia = g.items.find((it) => it.mediaType === 'image') || g.items[0];
            const bgSrc =
              (firstWithMedia && firstWithMedia.mediaType === 'image' && toAbsoluteUrl(firstWithMedia.mediaUrl)) ||
              g.user.picture ||
              'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=300&h=400&fit=crop';

            return [
              renderStoryCard(
                g,
                bgSrc,
                () => {
                  setViewerGroup(g);
                  setViewerStartIdx(0);
                },
                String(g.user._id)
              ),
            ];
          })}
        </div>

        <div className="absolute -left-6 top-1/2 z-10 hidden -translate-y-1/2 sm:block">
          <button
            onClick={() => stripRef.current?.scrollBy({ left: -180, behavior: 'smooth' })}
            className="rounded-full border border-[#302c28]/10 bg-[#fffaf4]/95 p-2 shadow-md shadow-[#302c28]/10 transition hover:bg-[#f5ebe0]"
            aria-label="Scroll stories left"
          >
            <ChevronLeft className="h-5 w-5 text-[#5f554d]" />
          </button>
        </div>
        <div className="absolute -right-6 top-1/2 z-10 hidden -translate-y-1/2 sm:block">
          <button
            onClick={() => stripRef.current?.scrollBy({ left: 180, behavior: 'smooth' })}
            className="rounded-full border border-[#302c28]/10 bg-[#fffaf4]/95 p-2 shadow-md shadow-[#302c28]/10 transition hover:bg-[#f5ebe0]"
            aria-label="Scroll stories right"
          >
            <ChevronRight className="h-5 w-5 text-[#5f554d]" />
          </button>
        </div>
      </div>

      <StoryCreateModal
        isOpen={showCreate}
        onClose={() => setShowCreate(false)}
        onSuccess={(item) => {
          setGroups((prev) => {
            const uid = String(user?._id || user?.id);
            const idx = prev.findIndex((g) => String(g.user._id) === uid);
            let nextGroups: StoryUserGroup[];
            if (idx >= 0) {
              const copy = [...prev];
              copy[idx] = {
                ...copy[idx],
                latestCreatedAt: item.createdAt,
                items: [item, ...copy[idx].items.filter((it) => String(it._id) !== String(item._id))],
              };
              nextGroups = copy;
            } else {
              const newGroup: StoryUserGroup = {
                user: { _id: uid, name: user?.name, email: user?.email, picture: user?.picture || null },
                latestCreatedAt: item.createdAt,
                items: [item],
              };
              nextGroups = [newGroup, ...prev];
            }
            const g = nextGroups.find((x) => String(x.user._id) === uid) || null;
            setViewerStartIdx(0);
            setViewerGroup(g);
            return nextGroups;
          });

          storiesAPI.feed().then((data) => {
            setGroups((prev) => {
              const incoming = (data.users || []) as StoryUserGroup[];
              const map = new Map<string, StoryUserGroup>();
              for (const g of prev) map.set(String(g.user._id), g);
              for (const g of incoming) {
                const key = String(g.user._id);
                if (map.has(key)) {
                  const existing = map.get(key)!;
                  const seen = new Set(existing.items.map((i) => String(i._id)));
                  const mergedItems = [...existing.items];
                  for (const it of g.items) {
                    if (!seen.has(String(it._id))) mergedItems.push(it);
                  }
                  map.set(key, {
                    ...existing,
                    latestCreatedAt: g.latestCreatedAt,
                    items: mergedItems.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),
                  });
                } else {
                  map.set(key, g);
                }
              }
              return Array.from(map.values()).sort((a, b) => new Date(b.latestCreatedAt).getTime() - new Date(a.latestCreatedAt).getTime());
            });
          }).catch(() => {});
        }}
      />
      {viewerGroup && (
        <StoryViewer
          key={`${viewerGroup.user._id}-${viewerStartIdx}`}
          group={viewerGroup}
          groups={groups}
          initialIndex={viewerStartIdx}
          onClose={() => setViewerGroup(null)}
          onViewed={(id) => {
            void storiesAPI.markViewed(id);
          }}
        />
      )}
    </div>
  );
}
