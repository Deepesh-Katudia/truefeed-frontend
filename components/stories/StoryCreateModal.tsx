'use client';
import { useState } from 'react';
import { storiesAPI } from '@/lib/api';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (item: { _id: string; text?: string; mediaUrl?: string; mediaType: 'image' | 'video' | 'none'; createdAt: string; expiresAt: string }) => void;
}

const getErrorMessage = (error: unknown, fallback: string) =>
  error instanceof Error ? error.message : fallback;

export function StoryCreateModal({ isOpen, onClose, onSuccess }: Props) {
  const [text, setText] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#302c28]/45 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl border border-[#302c28]/10 bg-[#fffaf4] p-6 shadow-[0_24px_70px_rgba(48,44,40,0.20)]">
        <div className="mb-4 text-lg font-semibold text-[#302c28]">Create Story</div>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Say something..."
          maxLength={300}
          className="h-24 w-full rounded-lg border border-[#302c28]/10 bg-[#edede9] p-3 text-sm text-[#302c28] placeholder:text-[#756b62] focus:outline-none focus:ring-2 focus:ring-[#d6ccc2]"
        />
        <div className="mt-4">
          <input type="file" accept="image/*,video/*" onChange={onFile} className="text-sm text-[#5f554d]" />
        </div>
        {preview && (
          <div className="mt-4 relative">
            {file && file.type.startsWith('video') ? (
              <video src={preview} controls className="w-full rounded-lg border border-[#302c28]/10" />
            ) : (
              <img src={preview} alt="preview" className="w-full rounded-lg border border-[#302c28]/10" />
            )}
            <button
              onClick={removeFile}
              className="absolute right-2 top-2 rounded bg-red-600 px-2 py-1 text-white"
            >
              Remove
            </button>
          </div>
        )}
        {error && <div className="mt-3 text-sm text-red-600">{error}</div>}
        <div className="mt-6 flex justify-end gap-2">
          <button onClick={onClose} className="rounded border border-[#302c28]/10 bg-[#edede9] px-4 py-2 text-[#5f554d] transition hover:bg-[#d6ccc2]/70">Cancel</button>
          <button
            onClick={submit}
            disabled={loading || (!text.trim() && !file)}
            className="rounded bg-[#6f6258] px-4 py-2 text-[#fffaf4] transition hover:bg-[#5f554d] disabled:opacity-50"
          >
            {loading ? 'Posting...' : 'Post Story'}
          </button>
        </div>
      </div>
    </div>
  );
}
