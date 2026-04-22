'use client';

import { useEffect, useState } from 'react';

import { authAPI, friendsAPI } from '@/lib/api';
import { ProfileAvatar } from '@/components/ui/ProfileAvatar';

interface IncomingRequest {
  _id: string;
  name?: string;
  email: string;
  picture?: string | null;
}

const getErrorMessage = (error: unknown, fallback: string) =>
  error instanceof Error ? error.message : fallback;

export function Requests() {
  const [loading, setLoading] = useState(true);
  const [list, setList] = useState<IncomingRequest[]>([]);
  const [error, setError] = useState('');

  const load = async () => {
    try {
      setLoading(true);
      await authAPI.getProfile();

      const data = await friendsAPI.incoming();
      setList(data.results || []);
      setError('');
    } catch (e: unknown) {
      const msg = getErrorMessage(e, '');
      if (msg.toLowerCase().includes('unauthorized')) {
        setList([]);
        setError('');
      } else {
        setError(msg || 'Failed to load requests');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const accept = async (senderUserId: string) => {
    try {
      await friendsAPI.accept(senderUserId);
      setList((prev) => prev.filter((u) => u._id !== senderUserId));
    } catch (e: unknown) {
      setError(getErrorMessage(e, 'Failed to accept'));
    }
  };

  const decline = async (senderUserId: string) => {
    try {
      await friendsAPI.decline(senderUserId);
      setList((prev) => prev.filter((u) => u._id !== senderUserId));
    } catch (e: unknown) {
      setError(getErrorMessage(e, 'Failed to decline'));
    }
  };

  return (
    <div className="mb-8">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-xs font-semibold uppercase text-[#756b62]">Requests</h3>
        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#d6ccc2] text-xs font-semibold text-[#4d453e]">
          {list.length}
        </span>
      </div>
      {error && <div className="mb-3 text-xs text-red-600">{error}</div>}
      {loading ? (
        <div className="text-xs text-[#756b62]">Loading...</div>
      ) : (
        <div className="space-y-4">
          {list.map((u) => (
            <div key={u._id} className="flex items-start gap-3">
              <ProfileAvatar
                src={u.picture}
                alt={u.name || u.email}
                className="h-12 w-12 rounded-full border border-[#302c28]/10 object-cover"
                iconClassName="h-6 w-6"
              />
              <div className="flex-1">
                <h4 className="mb-1 text-sm font-semibold text-[#302c28]">{u.name || u.email}</h4>
                <p className="mb-3 text-xs text-[#756b62]">wants to add you to friends</p>
                <div className="flex gap-2">
                  <button
                    onClick={() => accept(u._id)}
                    className="flex-1 rounded-lg bg-[#6f6258] px-3 py-2 text-sm font-semibold text-[#fffaf4] transition-colors hover:bg-[#5f554d]"
                  >
                    Accept
                  </button>
                  <button
                    onClick={() => decline(u._id)}
                    className="flex-1 rounded-lg border border-[#302c28]/10 bg-[#edede9] px-3 py-2 text-sm font-semibold text-[#5f554d] transition-colors hover:bg-[#d6ccc2]/70"
                  >
                    Decline
                  </button>
                </div>
              </div>
            </div>
          ))}
          {list.length === 0 && <div className="text-xs text-[#756b62]">No requests</div>}
        </div>
      )}
    </div>
  );
}
