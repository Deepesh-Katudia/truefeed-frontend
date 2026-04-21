'use client';

import { useCallback, useEffect, useMemo, useRef, useState, useSyncExternalStore } from 'react';
import { createPortal } from 'react-dom';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';

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

const STORY_DURATION_MS = 15000;
const subscribeToClient = () => () => {};
const getClientSnapshot = () => true;
const getServerSnapshot = () => false;

function clampIndex(index: number, length: number) {
  if (length <= 0) return 0;
  return Math.min(Math.max(index, 0), length - 1);
}

function getGroupId(group: StoryUserGroup | null | undefined) {
  return group?.user?._id ? String(group.user._id) : '';
}

function timeAgo(value: string) {
  const timestamp = new Date(value).getTime();
  if (!Number.isFinite(timestamp)) return '';

  const seconds = Math.max(1, Math.floor((Date.now() - timestamp) / 1000));
  if (seconds < 60) return 'Just now';

  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h`;

  return `${Math.floor(hours / 24)}d`;
}

export function StoryViewer({
  group,
  groups = [],
  onClose,
  onViewed,
  initialIndex = 0,
}: {
  group: StoryUserGroup | null;
  groups?: StoryUserGroup[];
  onClose: () => void;
  onViewed: (id: string) => void;
  initialIndex?: number;
}) {
  const requestedGroupId = getGroupId(group);
  const mounted = useSyncExternalStore(subscribeToClient, getClientSnapshot, getServerSnapshot);
  const [viewerState, setViewerState] = useState<ViewerState>(() => ({
    groupId: requestedGroupId,
    index: initialIndex,
  }));
  const [progress, setProgress] = useState(0);
  const onViewedRef = useRef(onViewed);
  const visibleGroups = useMemo(() => {
    const source = groups.length ? groups : group ? [group] : [];
    return source.filter((storyGroup) => storyGroup.items.length > 0);
  }, [group, groups]);

  const activeGroupIndex = visibleGroups.findIndex((storyGroup) => getGroupId(storyGroup) === viewerState.groupId);
  const activeGroup = activeGroupIndex >= 0 ? visibleGroups[activeGroupIndex] : null;
  const activeIndex = activeGroup ? clampIndex(viewerState.index, activeGroup.items.length) : 0;
  const activeItem = activeGroup?.items[activeIndex] || null;
  const activeUserName = activeGroup?.user.name || activeGroup?.user.email || 'Story';
  const activeUserAvatar =
    toAbsoluteUrl(activeGroup?.user.picture || undefined) ||
    `https://i.pravatar.cc/100?u=${activeGroup?.user.email || activeGroup?.user._id || 'story'}`;
  const mediaUrl = activeItem ? toAbsoluteUrl(activeItem.mediaUrl) : '';

  useEffect(() => {
    onViewedRef.current = onViewed;
  }, [onViewed]);

  const goTo = useCallback(
    (groupIndex: number, itemIndex: number) => {
      const nextGroup = visibleGroups[groupIndex];
      if (!nextGroup) return;

      setViewerState({
        groupId: getGroupId(nextGroup),
        index: clampIndex(itemIndex, nextGroup.items.length),
      });
      setProgress(0);
    },
    [visibleGroups]
  );

  const goPrevious = useCallback(() => {
    if (!activeGroup) return;

    if (activeIndex > 0) {
      goTo(activeGroupIndex, activeIndex - 1);
      return;
    }

    if (activeGroupIndex > 0) {
      const previousGroup = visibleGroups[activeGroupIndex - 1];
      goTo(activeGroupIndex - 1, previousGroup.items.length - 1);
    }
  }, [activeGroup, activeGroupIndex, activeIndex, goTo, visibleGroups]);

  const goNext = useCallback(() => {
    if (!activeGroup) return;

    if (activeIndex < activeGroup.items.length - 1) {
      goTo(activeGroupIndex, activeIndex + 1);
      return;
    }

    if (activeGroupIndex < visibleGroups.length - 1) {
      goTo(activeGroupIndex + 1, 0);
      return;
    }

    onClose();
  }, [activeGroup, activeGroupIndex, activeIndex, goTo, onClose, visibleGroups.length]);

  const hasPrevious = activeGroupIndex > 0 || activeIndex > 0;
  const hasNext = Boolean(activeGroup && (activeGroupIndex < visibleGroups.length - 1 || activeIndex < activeGroup.items.length - 1));

  useEffect(() => {
    if (!activeItem) return;
    onViewedRef.current(activeItem._id);
  }, [activeItem]);

  useEffect(() => {
    if (!activeItem) return;

    const startedAt = Date.now();
    const intervalId = window.setInterval(() => {
      const nextProgress = Math.min(((Date.now() - startedAt) / STORY_DURATION_MS) * 100, 100);
      setProgress(nextProgress);
      if (nextProgress >= 100) {
        window.clearInterval(intervalId);
        goNext();
      }
    }, 100);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [activeItem, goNext]);

  useEffect(() => {
    if (!activeItem || typeof document === 'undefined') return;

    const previousOverflow = document.body.style.overflow;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
      if (event.key === 'ArrowLeft') goPrevious();
      if (event.key === 'ArrowRight') goNext();
    };

    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [activeItem, goNext, goPrevious, onClose]);

  if (!mounted || !activeGroup || !activeItem) return null;

  const viewer = (
    <div
      className="fixed inset-0 z-[120] flex min-h-[100dvh] items-center justify-center bg-[#edede9]/78 p-0 backdrop-blur-xl sm:p-6"
      role="presentation"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,#f5ebe0_0%,rgba(245,235,224,0.55)_34%,rgba(214,204,194,0.7)_100%)]" />

      <button
        type="button"
        onClick={goPrevious}
        disabled={!hasPrevious}
        className="absolute left-3 top-1/2 z-20 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-[#302c28]/10 bg-[#fffaf4]/90 text-[#5f554d] shadow-[0_18px_45px_rgba(48,44,40,0.18)] backdrop-blur transition hover:bg-[#f5ebe0] disabled:pointer-events-none disabled:opacity-30 sm:flex"
        aria-label="Previous story"
      >
        <ChevronLeft className="h-6 w-6" />
      </button>

      <div
        role="dialog"
        aria-modal="true"
        aria-label={`${activeUserName} story`}
        className="relative z-10 flex h-[100dvh] w-full max-w-none overflow-hidden bg-[#141210] text-[#fffaf4] shadow-[0_32px_90px_rgba(48,44,40,0.24)] sm:h-[min(86vh,820px)] sm:max-w-[460px] sm:rounded-[1.75rem] sm:border sm:border-[#fffaf4]/20"
      >
        <div className="absolute left-0 right-0 top-0 z-20 space-y-3 bg-gradient-to-b from-black/70 via-black/28 to-transparent px-4 pb-12 pt-[max(1rem,env(safe-area-inset-top))]">
          <div className="flex gap-1.5" aria-hidden="true">
            {activeGroup.items.map((story, index) => (
              <div key={story._id} className="h-1 flex-1 overflow-hidden rounded-full bg-[#fffaf4]/28">
                <div
                  className="h-full rounded-full bg-[#fffaf4] transition-[width] duration-100 ease-linear"
                  style={{
                    width: `${index < activeIndex ? 100 : index === activeIndex ? progress : 0}%`,
                  }}
                />
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between gap-3">
            <div className="flex min-w-0 items-center gap-3">
              <img
                src={activeUserAvatar}
                alt={activeUserName}
                className="h-10 w-10 flex-shrink-0 rounded-full border border-[#fffaf4]/65 object-cover"
              />
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold leading-tight text-[#fffaf4]">{activeUserName}</p>
                <p className="text-xs font-medium text-[#fffaf4]/70">{timeAgo(activeItem.createdAt)}</p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-[#fffaf4]/14 text-[#fffaf4] transition hover:bg-[#fffaf4]/22"
              aria-label="Close story viewer"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        <button
          type="button"
          onClick={goPrevious}
          disabled={!hasPrevious}
          className="absolute bottom-0 left-0 top-20 z-10 w-1/2 disabled:pointer-events-none"
          aria-label="Previous story"
        />
        <button
          type="button"
          onClick={goNext}
          className="absolute bottom-0 right-0 top-20 z-10 w-1/2"
          aria-label={hasNext ? 'Next story' : 'Close story viewer'}
        />

        <div className="relative flex h-full w-full items-center justify-center">
          {activeItem.mediaType === 'video' && mediaUrl ? (
            <video
              key={activeItem._id}
              src={mediaUrl}
              autoPlay
              muted
              playsInline
              className="h-full w-full object-contain"
              onEnded={goNext}
            />
          ) : activeItem.mediaType === 'image' && mediaUrl ? (
            <img src={mediaUrl} alt="" className="h-full w-full object-contain" />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-[#1d1a17] px-8">
              <p className="max-w-[22rem] text-center text-2xl font-semibold leading-snug text-[#fffaf4] sm:text-3xl">
                {activeItem.text || ''}
              </p>
            </div>
          )}
        </div>

        {activeItem.text && activeItem.mediaType !== 'none' && (
          <div className="absolute bottom-0 left-0 right-0 z-20 bg-gradient-to-t from-black/78 via-black/35 to-transparent px-5 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-20">
            <p className="rounded-2xl border border-[#fffaf4]/12 bg-black/22 px-4 py-3 text-base font-medium leading-relaxed text-[#fffaf4] backdrop-blur-md">
              {activeItem.text}
            </p>
          </div>
        )}
      </div>

      <button
        type="button"
        onClick={goNext}
        className="absolute right-3 top-1/2 z-20 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-[#302c28]/10 bg-[#fffaf4]/90 text-[#5f554d] shadow-[0_18px_45px_rgba(48,44,40,0.18)] backdrop-blur transition hover:bg-[#f5ebe0] sm:flex"
        aria-label={hasNext ? 'Next story' : 'Close story viewer'}
      >
        <ChevronRight className="h-6 w-6" />
      </button>
    </div>
  );

  return createPortal(viewer, document.body);
}
