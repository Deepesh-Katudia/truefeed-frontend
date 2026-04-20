'use client';
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { Image as ImageIcon, Loader2, X } from 'lucide-react';
import { storiesAPI } from '@/lib/api';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (item: { _id: string; text?: string; mediaUrl?: string; mediaType: 'image' | 'video' | 'none'; createdAt: string; expiresAt: string }) => void;
}

const getErrorMessage = (error: unknown, fallback: string) =>
  error instanceof Error ? error.message : fallback;

export function StoryCreateModal({ isOpen, onClose, onSuccess }: Props) {
  const [mounted, setMounted] = useState(false);
  const [text, setText] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!isOpen || typeof document === 'undefined') return;

    const previousOverflow = document.body.style.overflow;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && !loading) {
        onClose();
      }
    };

    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, loading, onClose]);

  const onFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f);
    setPreview(URL.createObjectURL(f));
  };
  const removeFile = () => {
    setFile(null);
    setPreview('');
  };

  const submit = async () => {
    setLoading(true);
    setError('');
    try {
      let mediaUrl: string | undefined = undefined;
      if (file) {
        const res = await storiesAPI.uploadMedia(file);
        mediaUrl = res.url;
      }
      const createRes = await storiesAPI.create({ text: text.trim() || undefined, mediaUrl });
      const mediaType: 'image' | 'video' | 'none' =
        mediaUrl ? (file && file.type.startsWith('video') ? 'video' : 'image') : (text.trim() ? 'none' : 'none');
      onSuccess({
        _id: String(createRes.id || Date.now()),
        text: text.trim() || undefined,
        mediaUrl,
        mediaType,
        createdAt: new Date().toISOString(),
        expiresAt: createRes.expiresAt || new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      });
      setText('');
      setFile(null);
      setPreview('');
      onClose();
    } catch (e: unknown) {
      setError(getErrorMessage(e, 'Could not create story'));
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !mounted) return null;

  const modal = (
    <div
      className="fixed inset-0 z-[100] flex min-h-screen items-center justify-center bg-[#edede9]/72 p-3 backdrop-blur-md sm:p-4"
      role="presentation"
      onMouseDown={() => {
        if (!loading) onClose();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="create-story-title"
        onMouseDown={(event) => event.stopPropagation()}
        className="max-h-[min(90vh,680px)] w-full max-w-lg overflow-y-auto rounded-2xl border border-[#302c28]/10 bg-[#fffaf4]/95 shadow-[0_28px_80px_rgba(48,44,40,0.18)] backdrop-blur-xl"
      >
        <div className="flex items-center justify-between border-b border-[#302c28]/10 p-5 sm:p-6">
          <h2 id="create-story-title" className="text-xl font-bold text-[#302c28]">Create Story</h2>
          <button
            onClick={onClose}
            disabled={loading}
            aria-label="Close create story"
            className="rounded-full p-2 transition-colors hover:bg-[#edede9]"
          >
            <X className="h-5 w-5 text-[#756b62]" />
          </button>
        </div>

        <div className="p-5 sm:p-6">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Say something..."
            maxLength={300}
            disabled={loading}
            className="min-h-32 w-full resize-none rounded-xl border border-[#302c28]/10 bg-[#edede9] p-4 text-[#302c28] placeholder:text-[#756b62] focus:outline-none focus:ring-2 focus:ring-[#d6ccc2]"
          />

          {preview && (
            <div className="relative mt-4">
              {file && file.type.startsWith('video') ? (
                <video src={preview} controls className="max-h-80 w-full rounded-lg border border-[#302c28]/10 object-cover" />
              ) : (
                <img src={preview} alt="Story preview" className="max-h-80 w-full rounded-lg border border-[#302c28]/10 object-cover" />
              )}
              <button
                onClick={removeFile}
                disabled={loading}
                aria-label="Remove story media"
                className="absolute right-2 top-2 rounded-full bg-red-600 p-2 text-white transition-colors hover:bg-red-700 disabled:opacity-50"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          )}

          {error && (
            <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <label className="flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-[#302c28]/10 bg-[#edede9] px-4 py-2 transition-colors hover:bg-[#d6ccc2]/70">
              <ImageIcon className="h-5 w-5 text-[#5f554d]" />
              <span className="text-sm font-medium text-[#5f554d]">
                {file ? 'Media Added' : 'Add Photo'}
              </span>
              <input
                type="file"
                accept="image/*,video/*"
                onChange={onFile}
                className="hidden"
                disabled={loading || !!file}
              />
            </label>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
              <button
                onClick={onClose}
                disabled={loading}
                className="rounded-xl border border-[#302c28]/10 bg-[#edede9] px-6 py-3 font-semibold text-[#5f554d] transition-colors hover:bg-[#d6ccc2]/70 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={submit}
                disabled={loading || (!text.trim() && !file)}
                className="flex items-center justify-center gap-2 rounded-xl bg-[#6f6258] px-6 py-3 font-semibold text-[#fffaf4] transition-colors hover:bg-[#5f554d] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading && <Loader2 className="h-5 w-5 animate-spin" />}
                {loading ? 'Posting...' : 'Post Story'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(modal, document.body);
}
