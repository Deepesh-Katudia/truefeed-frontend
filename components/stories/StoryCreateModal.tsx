'use client';
import { useState } from 'react';
import { storiesAPI } from '@/lib/api';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (item: { _id: string; text?: string; mediaUrl?: string; mediaType: 'image' | 'video' | 'none'; createdAt: string; expiresAt: string }) => void;
}

export function StoryCreateModal({ isOpen, onClose, onSuccess }: Props) {
  const [text, setText] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const onFile = (e: any) => {
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
    } catch (e: any) {
      setError(e.message || 'Could not create story');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl w-full max-w-md p-6">
        <div className="text-lg font-semibold mb-4 text-black">Create Story</div>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Say something..."
          maxLength={300}
          className="w-full h-24 bg-gray-50 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
        />
        <div className="mt-4">
          <input type="file" accept="image/*,video/*" onChange={onFile} className="text-gray-900" />
        </div>
        {preview && (
          <div className="mt-4 relative">
            {file && file.type.startsWith('video') ? (
              <video src={preview} controls className="w-full rounded-lg" />
            ) : (
              <img src={preview} alt="preview" className="w-full rounded-lg" />
            )}
            <button
              onClick={removeFile}
              className="absolute top-2 right-2 px-2 py-1 bg-red-500 text-white rounded"
            >
              Remove
            </button>
          </div>
        )}
        {error && <div className="mt-3 text-sm text-red-600">{error}</div>}
        <div className="mt-6 flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 rounded bg-gray-100 text-gray-700">Cancel</button>
          <button
            onClick={submit}
            disabled={loading || (!text.trim() && !file)}
            className="px-4 py-2 rounded bg-blue-500 text-white disabled:opacity-50"
          >
            {loading ? 'Posting...' : 'Post Story'}
          </button>
        </div>
      </div>
    </div>
  );
}
