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
    } catch (err: any) {
      setError(err.message || 'Failed to create post');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Create Post</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            disabled={loading}
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* User Info */}
          <div className="flex items-center gap-3 mb-4">
            <img
              src={toAbsoluteUrl(user?.picture) || `https://i.pravatar.cc/150?u=${user?.email || 'user'}`}
              alt={user?.name || user?.email || 'User'}
              className="w-12 h-12 rounded-full"
            />
            <div>
              <div className="font-semibold text-gray-900">{user?.name || user?.email || 'User'}</div>
              <div className="text-sm text-gray-500">@{user?.email?.split('@')[0] || 'user'}</div>
            </div>
          </div>

          {/* Text Area */}
          <textarea
            placeholder={`What's on your mind, ${user?.name || (user?.email ? user.email.split('@')[0] : 'you')}?`}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full min-h-[150px] p-4 bg-gray-50 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
            disabled={loading}
            maxLength={2000}
          />

          {/* Image Preview */}
          {preview && (
            <div className="mt-4 relative">
              <img
                src={preview}
                alt="Preview"
                className="w-full h-64 object-cover rounded-lg"
              />
              <button
                onClick={removeImage}
                className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                disabled={loading}
              >
                <X className="w-4 h-4" />
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
                      ? 'bg-green-100 text-green-700'
                      : aiPreview.tag === 'False'
                      ? 'bg-red-100 text-red-700'
                      : 'bg-yellow-100 text-yellow-700'
                  }`}
                >
                  {aiPreview.tag}
                </span>
                {typeof aiPreview.score === 'number' && (
                  <span className="text-xs text-gray-600">Credibility {aiPreview.score}/5</span>
                )}
              </div>
              {aiPreview.summary && (
                <p className="text-sm text-gray-600 bg-gray-50 border border-gray-200 rounded-lg p-3">
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
            <label className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg cursor-pointer transition-colors">
              <ImageIcon className="w-5 h-5 text-gray-600" />
              <span className="text-sm font-medium text-gray-700">Add Photo</span>
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
              className="px-6 py-3 bg-blue-500 text-white rounded-xl font-semibold hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {(loading || checking) && <Loader2 className="w-5 h-5 animate-spin" />}
              {loading ? 'Posting...' : checking ? 'Checking...' : 'Post'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
