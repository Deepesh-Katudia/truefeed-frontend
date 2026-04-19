'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

import { toAbsoluteUrl } from '@/lib/api';

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

interface ViewerState {
  groupId: string;
  index: number;
}

export function StoryViewer({
  group,
  onClose,
  onViewed,
  initialIndex = 0,
}: {
  group: StoryUserGroup | null;
  onClose: () => void;
  onViewed: (id: string) => void;
  initialIndex?: number;
}) {
  const [viewerState, setViewerState] = useState<ViewerState>({ groupId: '', index: 0 });
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const groupId = group?.user._id || '';
  const idx = viewerState.groupId === groupId ? viewerState.index : initialIndex || 0;

  const next = useCallback(() => {
    if (!group) return;
    const n = idx + 1;
    if (n >= group.items.length) {
      onClose();
    } else {
      setViewerState({ groupId, index: n });
      onViewed(group.items[n]._id);
    }
  }, [group, groupId, idx, onClose, onViewed]);

  useEffect(() => {
    if (!group) return;
    const item = group.items[idx];
    if (!item) return;
    onViewed(item._id);
  }, [group, idx, onViewed]);

  useEffect(() => {
    if (!group) return;
    const item = group.items[idx];
    if (!item) return;
    if (timer.current) clearTimeout(timer.current);
    if (item.mediaType === 'video') return;
    timer.current = setTimeout(next, 5000);
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, [group, idx, next]);

  if (!group) return null;
  const item = group.items[idx];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#302c28]/85 p-4 backdrop-blur-sm">
      <div className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-[#d6ccc2]/20 bg-[#1f1c19] shadow-[0_24px_70px_rgba(0,0,0,0.35)]">
        <button
          onClick={onClose}
          className="absolute right-3 top-3 z-10 rounded bg-[#fffaf4] px-3 py-1 text-sm font-semibold text-[#302c28] transition hover:bg-[#f5ebe0]"
        >
          Close
        </button>
        {item.mediaType === 'video' ? (
          <video
            src={toAbsoluteUrl(item.mediaUrl)}
            autoPlay
            controls
            className="w-full"
            onLoadedMetadata={(e) => {
              const v = e.currentTarget;
              setTimeout(next, Math.max(1000, (v.duration || 5) * 1000));
            }}
            onEnded={next}
          />
        ) : item.mediaType === 'image' ? (
          <img src={toAbsoluteUrl(item.mediaUrl)} alt="" className="max-h-[80vh] w-full object-contain" />
        ) : (
          <div className="p-6 text-white">{item.text || ''}</div>
        )}
        {item.text && <div className="absolute bottom-3 left-3 right-3 text-white">{item.text}</div>}
      </div>
    </div>
  );
}
