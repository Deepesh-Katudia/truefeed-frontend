 'use client';
import { useEffect, useRef, useState } from 'react';
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
  const [idx, setIdx] = useState(0);
  const timer = useRef<any>(null);
  useEffect(() => {
    setIdx(initialIndex || 0);
    if (!group) return;
    const item = group.items[initialIndex || 0];
    if (!item) return;
    onViewed(item._id);
  }, [group, initialIndex]);

  useEffect(() => {
    if (!group) return;
    const item = group.items[idx];
    if (!item) return;
    clearTimeout(timer.current);
    if (item.mediaType === 'video') return;
    timer.current = setTimeout(() => next(), 5000);
    return () => clearTimeout(timer.current);
  }, [group, idx]);

  const next = () => {
    if (!group) return;
    const n = idx + 1;
    if (n >= group.items.length) {
      onClose();
    } else {
      setIdx(n);
      onViewed(group.items[n]._id);
    }
  };

  if (!group) return null;
  const item = group.items[idx];

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center">
      <div className="w-full max-w-lg bg-black rounded-2xl overflow-hidden relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 bg-white text-gray-800 rounded px-3 py-1 text-sm"
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
          <img src={toAbsoluteUrl(item.mediaUrl)} alt="" className="w-full object-contain max-h-[80vh]" />
        ) : (
          <div className="text-white p-6">{item.text || ''}</div>
        )}
        {item.text && <div className="absolute bottom-3 left-3 right-3 text-white">{item.text}</div>}
      </div>
    </div>
  );
}
