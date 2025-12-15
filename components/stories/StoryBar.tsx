'use client';
import { useEffect, useRef, useState } from 'react';
import { storiesAPI, toAbsoluteUrl } from '@/lib/api';
import { StoryCreateModal } from './StoryCreateModal';
import { StoryViewer } from './StoryViewer';
import { useAuth } from '@/context/AuthContext';
import { ChevronLeft, ChevronRight } from 'lucide-react';

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
    } catch (e: any) {
      setError(e.message || 'Failed to load stories');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="mb-6">
      <div className="relative">
        <div className="flex gap-4 overflow-x-hidden pb-2" ref={stripRef}>
          <div className="flex-shrink-0 w-32" onClick={() => setShowCreate(true)}>
            <div className="relative h-48 bg-gray-100 rounded-2xl overflow-hidden cursor-pointer hover:shadow-lg transition-shadow group">
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mb-3 shadow-lg group-hover:scale-110 transition-transform">
                  <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </div>
              <span className="text-sm font-semibold text-gray-700">Add Story</span>
            </div>
          </div>
        </div>
        {groups.flatMap((g) => {
          const uid = String(user?._id || user?.id);
          if (String(g.user._id) === uid) {
            return g.items.map((it, index) => {
              const bgSrc =
                (it.mediaType === 'image' && toAbsoluteUrl(it.mediaUrl)) ||
                g.user.picture ||
                'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=300&h=400&fit=crop';
              return (
                <div
                  key={`self-${String(it._id)}`}
                  className="flex-shrink-0 w-32"
                  onClick={() => {
                    setViewerGroup(g);
                    setViewerStartIdx(index);
                  }}
                >
                  <div className="relative h-48 rounded-2xl overflow-hidden cursor-pointer hover:shadow-lg transition-shadow">
                    <img src={bgSrc} alt={g.user.name || g.user.email || 'Story'} className="w-full h-full object-cover" />
                    <div className="absolute top-3 left-3">
                      <img
                        src={toAbsoluteUrl(g.user.picture || undefined) || 'https://i.pravatar.cc/100?u=' + (g.user.email || g.user._id)}
                        alt={g.user.name || g.user.email || 'User'}
                        className="w-10 h-10 rounded-full border-2 border-white"
                      />
                    </div>
                    <div className="absolute bottom-3 left-3 right-3">
                      <p className="text-white text-sm font-semibold truncate">{g.user.name || g.user.email}</p>
                    </div>
                  </div>
                </div>
              );
            });
          }
          const firstWithMedia = g.items.find((it) => it.mediaType === 'image') || g.items[0];
          const bgSrc =
            (firstWithMedia && firstWithMedia.mediaType === 'image' && toAbsoluteUrl(firstWithMedia.mediaUrl)) ||
            g.user.picture ||
            'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=300&h=400&fit=crop';
          return [
            <div
              key={String(g.user._id)}
              className="flex-shrink-0 w-32"
              onClick={() => {
                setViewerGroup(g);
                setViewerStartIdx(0);
              }}
            >
              <div className="relative h-48 rounded-2xl overflow-hidden cursor-pointer hover:shadow-lg transition-shadow">
                <img src={bgSrc} alt={g.user.name || g.user.email || 'Story'} className="w-full h-full object-cover" />
                <div className="absolute top-3 left-3">
                  <img
                    src={toAbsoluteUrl(g.user.picture || undefined) || 'https://i.pravatar.cc/100?u=' + (g.user.email || g.user._id)}
                    alt={g.user.name || g.user.email || 'User'}
                    className="w-10 h-10 rounded-full border-2 border-white"
                  />
                </div>
                <div className="absolute bottom-3 left-3 right-3">
                  <p className="text-white text-sm font-semibold truncate">{g.user.name || g.user.email}</p>
                </div>
              </div>
            </div>,
          ];
        })}
        </div>
        <div className="absolute top-1/2 -translate-y-1/2 -left-6 z-10">
          <button
            onClick={() => stripRef.current?.scrollBy({ left: -180, behavior: 'smooth' })}
            className="p-2 rounded-full bg-white shadow hover:bg-gray-100"
          >
            <ChevronLeft className="w-5 h-5 text-gray-700" />
          </button>
        </div>
        <div className="absolute top-1/2 -translate-y-1/2 -right-6 z-10">
          <button
            onClick={() => stripRef.current?.scrollBy({ left: 180, behavior: 'smooth' })}
            className="p-2 rounded-full bg-white shadow hover:bg-gray-100"
          >
            <ChevronRight className="w-5 h-5 text-gray-700" />
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
            // Open viewer on the updated group immediately
            const g = nextGroups.find((x) => String(x.user._id) === uid) || null;
            setViewerGroup(g);
            return nextGroups;
          });
          // Also refresh from server and merge to ensure older items remain
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
                  map.set(key, { ...existing, latestCreatedAt: g.latestCreatedAt, items: mergedItems.sort((a,b)=> (new Date(b.createdAt).getTime()-new Date(a.createdAt).getTime())) });
                } else {
                  map.set(key, g);
                }
              }
              return Array.from(map.values()).sort((a,b)=> (new Date(b.latestCreatedAt).getTime()-new Date(a.latestCreatedAt).getTime()));
            });
          }).catch(() => {});
        }}
      />
      <StoryViewer
        group={viewerGroup}
        initialIndex={viewerStartIdx}
        onClose={() => setViewerGroup(null)}
        onViewed={(id) => storiesAPI.markViewed(id)}
      />
    </div>
  );
}
