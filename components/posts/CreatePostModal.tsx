'use client';

import { useState } from 'react';
import { X, Image as ImageIcon, Loader2 } from 'lucide-react';
import { postAPI, aiAPI, toAbsoluteUrl } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';

interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPostCreated: () => void;
}

const getErrorMessage = (error: unknown, fallback: string) =>
  error instanceof Error ? error.message : fallback;

export function CreatePostModal({ isOpen, onClose, onPostCreated }: CreatePostModalProps) {
  const [content, setContent] = useState('');
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [aiPreview, setAiPreview] = useState<{ tag: string; score: number | null; summary: string } | null>(null);
  const [checking, setChecking] = useState(false);
  const { user } = useAuth();

  if (!isOpen) return null;

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedImage(file);
    
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setSelectedImage(null);
    setPreview('');
  };

  const handleSubmit = async () => {
    if (!content.trim() && !selectedImage) {
      setError('Please add some content or an image');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Step 1: call AI /check for credibility preview
      setChecking(true);
      let aiToSend: { fact_check_status?: string; credibility_score?: number; summary?: string } | undefined = undefined;
      try {
        const res = await aiAPI.checkCredibility(content);
        const status = String(res?.response?.fact_check_status || '').toLowerCase();
        const tagMap: Record<string, string> = {
          verified: 'Verified',
          misleading: 'Misleading',
          debunked: 'False',
          outdated: 'Outdated',
          unverified: 'Unverified',
          'not applicable': 'Not Applicable',
        };
        setAiPreview({
          tag: tagMap[status] || 'Unverified',
          score: typeof res?.response?.credibility_score === 'number' ? Math.round(res.response.credibility_score) : null,
          summary: res?.response?.summary || '',
        });
        aiToSend = {
          fact_check_status: res?.response?.fact_check_status,
          credibility_score: res?.response?.credibility_score,
          summary: res?.response?.summary,
        };
      } catch {
        setAiPreview({ tag: 'Unverified', score: null, summary: '' });
        aiToSend = undefined;
      } finally {
        setChecking(false);
      }

      // Use the combined endpoint with AI payload from the same tick
      await postAPI.createWithMedia(content, selectedImage || undefined, aiToSend);

      // Reset form
      setContent('');
      setSelectedImage(null);
      setPreview('');
      setAiPreview(null);
      
      // Notify parent
      onPostCreated();
      onClose();
    } catch (err: unknown) {
      setError(getErrorMessage(err, 'Failed to create post'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#302c28]/45 p-4 backdrop-blur-sm">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-[#302c28]/10 bg-[#fffaf4] shadow-[0_24px_70px_rgba(48,44,40,0.20)]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#302c28]/10 p-6">
          <h2 className="text-xl font-bold text-[#302c28]">Create Post</h2>
          <button
            onClick={onClose}
            className="rounded-full p-2 transition-colors hover:bg-[#edede9]"
            disabled={loading}
          >
            <X className="h-5 w-5 text-[#756b62]" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* User Info */}
          <div className="flex items-center gap-3 mb-4">
            <img
              src={toAbsoluteUrl(user?.picture) || `https://i.pravatar.cc/150?u=${user?.email || 'user'}`}
              alt={user?.name || user?.email || 'User'}
              className="h-12 w-12 rounded-full border border-[#302c28]/10 object-cover"
            />
            <div>
              <div className="font-semibold text-[#302c28]">{user?.name || user?.email || 'User'}</div>
              <div className="text-sm text-[#756b62]">@{user?.email?.split('@')[0] || 'user'}</div>
            </div>
          </div>

          {/* Text Area */}
          <textarea
            placeholder={`What's on your mind, ${user?.name || (user?.email ? user.email.split('@')[0] : 'you')}?`}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="min-h-[150px] w-full resize-none rounded-xl border border-[#302c28]/10 bg-[#edede9] p-4 text-[#302c28] placeholder:text-[#756b62] focus:outline-none focus:ring-2 focus:ring-[#d6ccc2]"
            disabled={loading}
            maxLength={2000}
          />

          {/* Image Preview */}
          {preview && (
            <div className="mt-4 relative">
              <img
                src={preview}
                alt="Preview"
                className="h-64 w-full rounded-lg border border-[#302c28]/10 object-cover"
              />
              <button
                onClick={removeImage}
                className="absolute right-2 top-2 rounded-full bg-red-600 p-2 text-white transition-colors hover:bg-red-700"
                disabled={loading}
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          )}

          {/* AI Preview */}
          {aiPreview && (
            <div className="mt-4 space-y-2">
              <div className="flex items-center gap-2">
                <span
                  className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                  aiPreview.tag === 'Verified'
                      ? 'border border-emerald-200 bg-emerald-50 text-emerald-700'
                      : aiPreview.tag === 'False'
                      ? 'border border-red-200 bg-red-50 text-red-700'
                      : 'border border-[#302c28]/10 bg-[#d6ccc2]/70 text-[#5f554d]'
                  }`}
                >
                  {aiPreview.tag}
                </span>
                {typeof aiPreview.score === 'number' && (
                  <span className="text-xs text-[#756b62]">Credibility {aiPreview.score}/5</span>
                )}
              </div>
              {aiPreview.summary && (
                <p className="rounded-lg border border-[#302c28]/10 bg-[#edede9]/75 p-3 text-sm text-[#5f554d]">
                  {aiPreview.summary}
                </p>
              )}
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
              {error}
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-between mt-6">
            <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-[#302c28]/10 bg-[#edede9] px-4 py-2 transition-colors hover:bg-[#d6ccc2]/70">
              <ImageIcon className="h-5 w-5 text-[#5f554d]" />
              <span className="text-sm font-medium text-[#5f554d]">Add Photo</span>
              <input
                type="file"
                accept="image/png,image/jpeg,image/webp,image/gif"
                onChange={handleImageSelect}
                className="hidden"
                disabled={loading || !!selectedImage}
              />
            </label>

            <button
              onClick={handleSubmit}
              disabled={loading || (!content.trim() && !selectedImage)}
              className="flex items-center gap-2 rounded-xl bg-[#6f6258] px-6 py-3 font-semibold text-[#fffaf4] transition-colors hover:bg-[#5f554d] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {(loading || checking) && <Loader2 className="h-5 w-5 animate-spin" />}
              {loading ? 'Posting...' : checking ? 'Checking...' : 'Post'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
