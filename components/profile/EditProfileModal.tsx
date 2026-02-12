'use client';

import { useState, useEffect } from 'react';
import { X, Upload, Loader2, Camera } from 'lucide-react';
import { profileAPI, toAbsoluteUrl } from '@/lib/api';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';

interface User {
  _id?: string;
  id?: string;
  email: string;
  name?: string;
  picture?: string;
  description?: string;
  phone?: string;
}

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  currentUser: User;
}

export function EditProfileModal({ isOpen, onClose, onSuccess, currentUser }: EditProfileModalProps) {
  const { refreshUser } = useAuth();

  const [formData, setFormData] = useState({
    name: currentUser.name || '',
    description: currentUser.description || '',
    phone: currentUser.phone || '',
  });

  const [selectedImage, setSelectedImage] = useState<File | null>(null);

  // Initialize preview with absolute URL + cache-bust (so browser doesn't show old image)
  const [preview, setPreview] = useState<string>(() => {
    const abs = toAbsoluteUrl(currentUser.picture) || '';
    if (!abs) return '';
    const sep = abs.includes('?') ? '&' : '?';
    return `${abs}${sep}t=${Date.now()}`;
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // If user changes (modal reopened), refresh state
  useEffect(() => {
    setFormData({
      name: currentUser.name || '',
      description: currentUser.description || '',
      phone: currentUser.phone || '',
    });
    setSelectedImage(null);

    const abs = toAbsoluteUrl(currentUser.picture) || '';
    if (!abs) {
      setPreview('');
    } else {
      const sep = abs.includes('?') ? '&' : '?';
      setPreview(`${abs}${sep}t=${Date.now()}`);
    }

    setError('');
    setSuccess('');
  }, [currentUser, isOpen]);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!['image/png', 'image/jpeg', 'image/webp', 'image/gif'].includes(file.type)) {
      setError('Please select a valid image file (PNG, JPEG, WebP, or GIF)');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('Image size must be less than 5MB');
      return;
    }

    setSelectedImage(file);

    const reader = new FileReader();
    reader.onloadend = () => setPreview(reader.result as string);
    reader.readAsDataURL(file);

    setError('');
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      if (selectedImage) {
        await profileAPI.updateWithPicture({
          name: formData.name || undefined,
          description: formData.description,
          phone: formData.phone,
          picture: selectedImage,
        });
      } else {
        await profileAPI.updateProfile({
          name: formData.name || undefined,
          description: formData.description,
          phone: formData.phone,
          phoneNumber: formData.phone, // harmless if backend ignores, remove if your API rejects unknown fields
        } as any);
      }

      // KEY FIX: refresh global auth user so avatar updates everywhere
      await refreshUser();

      setSuccess('Profile updated successfully!');
      setTimeout(() => onSuccess(), 700);
    } catch (err: any) {
      setError(err?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Backdrop */}
          <motion.button
            aria-label="Close modal"
            onClick={loading ? undefined : onClose}
            className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Modal */}
          <motion.div
            role="dialog"
            aria-modal="true"
            className="relative w-full max-w-2xl max-h-[90vh] overflow-hidden rounded-3xl border border-black/10 bg-white/70 backdrop-blur-xl shadow-2xl shadow-black/10"
            initial={{ opacity: 0, y: 18, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 18, scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 260, damping: 24 }}
          >
            {/* Accent strip */}
            <div className="h-1 w-full bg-gradient-to-r from-amber-400 via-pink-400 to-sky-400" />

            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-black/10">
              <div>
                <h2 className="text-lg font-bold text-neutral-900">Edit Profile</h2>
                <p className="text-xs text-neutral-600">Update your details and profile picture</p>
              </div>

              <button
                onClick={onClose}
                disabled={loading}
                className="p-2 rounded-xl hover:bg-black/5 transition disabled:opacity-50"
              >
                <X className="w-5 h-5 text-neutral-700" />
              </button>
            </div>

            {/* Body scroll area */}
            <div className="max-h-[calc(90vh-64px)] overflow-y-auto px-6 py-6 pb-12">
              {/* Profile picture */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-neutral-800 mb-3">Profile Picture</label>

                <div className="flex items-center gap-6">
                  <div className="relative">
                    <img
                      src={
                        preview ||
                        (() => {
                          const abs = toAbsoluteUrl(currentUser.picture) || '';
                          if (!abs) return `https://i.pravatar.cc/150?u=${currentUser.email}`;
                          const sep = abs.includes('?') ? '&' : '?';
                          return `${abs}${sep}t=${Date.now()}`;
                        })()
                      }
                      alt="Profile"
                      className="w-24 h-24 rounded-2xl object-cover border border-black/10 shadow-md shadow-black/5"
                    />

                    <label className="absolute -bottom-2 -right-2 w-9 h-9 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center cursor-pointer shadow-lg shadow-indigo-500/20 hover:opacity-95 transition">
                      <Camera className="w-4 h-4 text-white" />
                      <input
                        type="file"
                        accept="image/png,image/jpeg,image/webp,image/gif"
                        onChange={handleImageSelect}
                        className="hidden"
                        disabled={loading}
                      />
                    </label>
                  </div>

                  <div className="flex-1">
                    <label className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl border border-black/10 bg-white/70 hover:bg-white transition cursor-pointer shadow-sm">
                      <Upload className="w-4 h-4 text-neutral-700" />
                      <span className="text-sm font-semibold text-neutral-800">Upload New Photo</span>
                      <input
                        type="file"
                        accept="image/png,image/jpeg,image/webp,image/gif"
                        onChange={handleImageSelect}
                        className="hidden"
                        disabled={loading}
                      />
                    </label>

                    <p className="text-xs text-neutral-600 mt-2">PNG, JPEG, WebP or GIF. Max 5MB.</p>
                  </div>
                </div>
              </div>

              {/* Name */}
              <div className="mb-5">
                <label className="block text-sm font-semibold text-neutral-800 mb-2">Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Your display name"
                  maxLength={100}
                  className="w-full px-4 py-3 rounded-2xl border border-black/10 bg-white/70 text-neutral-900 placeholder:text-neutral-400 shadow-sm focus:outline-none focus:ring-4 focus:ring-indigo-200/40 focus:border-indigo-300 transition"
                  disabled={loading}
                />
              </div>

              {/* Email (read-only) */}
              <div className="mb-5">
                <label className="block text-sm font-semibold text-neutral-800 mb-2">Email</label>
                <input
                  type="text"
                  value={currentUser.email}
                  disabled
                  className="w-full px-4 py-3 rounded-2xl border border-black/10 bg-black/5 text-neutral-500 cursor-not-allowed"
                />
                <p className="text-xs text-neutral-600 mt-1">Email cannot be changed</p>
              </div>

              {/* Bio */}
              <div className="mb-5">
                <label className="block text-sm font-semibold text-neutral-800 mb-2">Bio / Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Tell us about yourself..."
                  className="w-full min-h-[120px] px-4 py-3 rounded-2xl border border-black/10 bg-white/70 text-neutral-900 placeholder:text-neutral-400 shadow-sm focus:outline-none focus:ring-4 focus:ring-indigo-200/40 focus:border-indigo-300 transition resize-none"
                  disabled={loading}
                  maxLength={1000}
                />
                <p className="text-xs text-neutral-600 mt-1">{formData.description.length}/1000 characters</p>
              </div>

              {/* Phone */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-neutral-800 mb-2">Phone Number</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+1 (555) 123-4567"
                  className="w-full px-4 py-3 rounded-2xl border border-black/10 bg-white/70 text-neutral-900 placeholder:text-neutral-400 shadow-sm focus:outline-none focus:ring-4 focus:ring-indigo-200/40 focus:border-indigo-300 transition"
                  disabled={loading}
                  maxLength={30}
                />
              </div>

              {/* Success */}
              {success && (
                <div className="mb-5 p-3 rounded-2xl border border-emerald-400/30 bg-emerald-500/10 text-emerald-800 text-sm">
                  {success}
                </div>
              )}

              {/* Error */}
              {error && (
                <div className="mb-5 p-3 rounded-2xl border border-red-400/30 bg-red-500/10 text-red-800 text-sm">
                  {error}
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-3">
                <button
                  onClick={onClose}
                  disabled={loading}
                  className="flex-1 px-6 py-3 rounded-2xl border border-black/10 bg-white/70 text-neutral-800 font-semibold hover:bg-white transition disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="flex-1 px-6 py-3 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold shadow-md shadow-indigo-500/20 hover:opacity-95 transition disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {loading && <Loader2 className="w-5 h-5 animate-spin" />}
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
