'use client';

import { useEffect, useState } from 'react';
import { Camera, Loader2, Upload, X } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

import { useAuth } from '@/context/AuthContext';
import { profileAPI, toAbsoluteUrl } from '@/lib/api';
import { ProfileAvatar } from '@/components/ui/ProfileAvatar';

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

const getErrorMessage = (error: unknown, fallback: string) =>
  error instanceof Error ? error.message : fallback;

export function EditProfileModal({ isOpen, onClose, onSuccess, currentUser }: EditProfileModalProps) {
  const { refreshUser } = useAuth();

  const [formData, setFormData] = useState({
    name: currentUser.name || '',
    description: currentUser.description || '',
    phone: currentUser.phone || '',
  });

  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>(() => {
    const abs = toAbsoluteUrl(currentUser.picture) || '';
    if (!abs) return '';
    const sep = abs.includes('?') ? '&' : '?';
    return `${abs}${sep}t=${Date.now()}`;
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

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
          phoneNumber: formData.phone,
        });
      }

      await refreshUser();

      setSuccess('Profile updated successfully!');
      setTimeout(() => onSuccess(), 700);
    } catch (err: unknown) {
      setError(getErrorMessage(err, 'Failed to update profile'));
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
          <motion.button
            aria-label="Close modal"
            onClick={loading ? undefined : onClose}
            className="absolute inset-0 bg-[#302c28]/45 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          <motion.div
            role="dialog"
            aria-modal="true"
            className="relative max-h-[90vh] w-full max-w-2xl overflow-hidden rounded-3xl border border-[#302c28]/10 bg-[#fffaf4]/90 shadow-[0_24px_70px_rgba(48,44,40,0.20)] backdrop-blur-xl"
            initial={{ opacity: 0, y: 18, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 18, scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 260, damping: 24 }}
          >
            <div className="h-1 w-full bg-[#d6ccc2]" />

            <div className="flex items-center justify-between border-b border-[#302c28]/10 px-6 py-5">
              <div>
                <h2 className="text-lg font-bold text-[#302c28]">Edit Profile</h2>
                <p className="text-xs text-[#756b62]">Update your details and profile picture</p>
              </div>

              <button
                onClick={onClose}
                disabled={loading}
                className="rounded-xl p-2 transition hover:bg-[#edede9] disabled:opacity-50"
              >
                <X className="h-5 w-5 text-[#5f554d]" />
              </button>
            </div>

            <div className="max-h-[calc(90vh-64px)] overflow-y-auto px-6 py-6 pb-12">
              <div className="mb-6">
                <label className="mb-3 block text-sm font-semibold text-[#4d453e]">Profile Picture</label>

                <div className="flex items-center gap-6">
                  <div className="relative">
                    <ProfileAvatar
                      src={preview}
                      alt="Profile"
                      className="h-24 w-24 rounded-2xl border border-[#302c28]/10 object-cover shadow-md shadow-[#302c28]/5"
                      iconClassName="h-12 w-12"
                    />

                    <label className="absolute -bottom-2 -right-2 flex h-9 w-9 cursor-pointer items-center justify-center rounded-2xl bg-[#6f6258] shadow-lg shadow-[#6f6258]/20 transition hover:bg-[#5f554d]">
                      <Camera className="h-4 w-4 text-[#fffaf4]" />
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
                    <label className="inline-flex cursor-pointer items-center gap-2 rounded-2xl border border-[#302c28]/10 bg-[#edede9] px-4 py-2 shadow-sm transition hover:bg-[#d6ccc2]/70">
                      <Upload className="h-4 w-4 text-[#5f554d]" />
                      <span className="text-sm font-semibold text-[#4d453e]">Upload New Photo</span>
                      <input
                        type="file"
                        accept="image/png,image/jpeg,image/webp,image/gif"
                        onChange={handleImageSelect}
                        className="hidden"
                        disabled={loading}
                      />
                    </label>

                    <p className="mt-2 text-xs text-[#756b62]">PNG, JPEG, WebP or GIF. Max 5MB.</p>
                  </div>
                </div>
              </div>

              <div className="mb-5">
                <label className="mb-2 block text-sm font-semibold text-[#4d453e]">Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Your display name"
                  maxLength={100}
                  className="w-full rounded-2xl border border-[#302c28]/10 bg-[#edede9] px-4 py-3 text-[#302c28] placeholder:text-[#756b62] shadow-sm transition focus:outline-none focus:ring-4 focus:ring-[#d6ccc2]/50"
                  disabled={loading}
                />
              </div>

              <div className="mb-5">
                <label className="mb-2 block text-sm font-semibold text-[#4d453e]">Email</label>
                <input
                  type="text"
                  value={currentUser.email}
                  disabled
                  className="w-full cursor-not-allowed rounded-2xl border border-[#302c28]/10 bg-[#302c28]/5 px-4 py-3 text-[#756b62]"
                />
                <p className="mt-1 text-xs text-[#756b62]">Email cannot be changed</p>
              </div>

              <div className="mb-5">
                <label className="mb-2 block text-sm font-semibold text-[#4d453e]">Bio / Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Tell us about yourself..."
                  className="min-h-[120px] w-full resize-none rounded-2xl border border-[#302c28]/10 bg-[#edede9] px-4 py-3 text-[#302c28] placeholder:text-[#756b62] shadow-sm transition focus:outline-none focus:ring-4 focus:ring-[#d6ccc2]/50"
                  disabled={loading}
                  maxLength={1000}
                />
                <p className="mt-1 text-xs text-[#756b62]">{formData.description.length}/1000 characters</p>
              </div>

              <div className="mb-6">
                <label className="mb-2 block text-sm font-semibold text-[#4d453e]">Phone Number</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+1 (555) 123-4567"
                  className="w-full rounded-2xl border border-[#302c28]/10 bg-[#edede9] px-4 py-3 text-[#302c28] placeholder:text-[#756b62] shadow-sm transition focus:outline-none focus:ring-4 focus:ring-[#d6ccc2]/50"
                  disabled={loading}
                  maxLength={30}
                />
              </div>

              {success && (
                <div className="mb-5 rounded-2xl border border-emerald-400/30 bg-emerald-500/10 p-3 text-sm text-emerald-800">
                  {success}
                </div>
              )}

              {error && (
                <div className="mb-5 rounded-2xl border border-red-400/30 bg-red-500/10 p-3 text-sm text-red-800">
                  {error}
                </div>
              )}

              <div className="flex gap-3">
                <button
                  onClick={onClose}
                  disabled={loading}
                  className="flex-1 rounded-2xl border border-[#302c28]/10 bg-[#edede9] px-6 py-3 font-semibold text-[#4d453e] transition hover:bg-[#d6ccc2]/70 disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-[#6f6258] px-6 py-3 font-semibold text-[#fffaf4] shadow-md shadow-[#6f6258]/20 transition hover:bg-[#5f554d] disabled:opacity-50"
                >
                  {loading && <Loader2 className="h-5 w-5 animate-spin" />}
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
