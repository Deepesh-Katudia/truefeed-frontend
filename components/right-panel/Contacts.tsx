'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';

import { friendsAPI } from '@/lib/api';
import { ProfileAvatar } from '@/components/ui/ProfileAvatar';

interface Contact {
  _id: string;
  name: string;
  email: string;
  picture?: string | null;
  description?: string;
  isFriend: boolean;
  incomingPending: boolean;
  outgoingPending: boolean;
}

const getErrorMessage = (error: unknown, fallback: string) =>
  error instanceof Error ? error.message : fallback;

export function Contacts() {
  const [q, setQ] = useState('');
  const [loading, setLoading] = useState(true);
  const [list, setList] = useState<Contact[]>([]);
  const [error, setError] = useState('');

  const load = useCallback(async (query: string) => {
    try {
      setLoading(true);
      const val = query.trim();
      const data = await friendsAPI.search(val, 8);
      setList(data.results || []);
      setError('');
    } catch (e: unknown) {
      setError(getErrorMessage(e, 'Failed to load contacts'));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const t = setTimeout(() => load(q), 300);
    return () => clearTimeout(t);
  }, [q, load]);

  const sendRequest = async (targetUserId: string) => {
    try {
      await friendsAPI.request(targetUserId);
      setList((prev) =>
        prev.map((c) =>
          c._id === targetUserId ? { ...c, outgoingPending: true } : c
        )
      );
    } catch (e: unknown) {
      const msg = getErrorMessage(e, 'Failed to send request');
      if (/already|pending/i.test(msg)) {
        setList((prev) =>
          prev.map((c) =>
            c._id === targetUserId ? { ...c, outgoingPending: true } : c
          )
        );
      } else {
        setError(msg);
      }
    }
  };

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-xs font-semibold uppercase text-[#756b62]">People</h3>
        <span className="text-xs text-[#8a7b70]">{list.length}</span>
      </div>
      <div className="mb-3">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search people"
          className="w-full rounded-lg border border-[#302c28]/10 bg-[#edede9] px-3 py-2 text-sm text-[#302c28] placeholder:text-[#756b62] focus:outline-none focus:ring-2 focus:ring-[#d6ccc2]"
        />
      </div>
      {error && <div className="mb-2 text-xs text-red-600">{error}</div>}
      {loading ? (
        <div className="text-xs text-[#756b62]">Loading...</div>
      ) : (
        <div className="space-y-3">
          {list.map((contact) => {
            const actionLabel = contact.isFriend
              ? 'Friends'
              : contact.outgoingPending || contact.incomingPending
              ? 'Pending'
              : 'Send Request';
            const disabled = contact.isFriend || contact.outgoingPending || contact.incomingPending;
            return (
              <div key={contact._id} className="group flex items-center justify-between gap-3">
                <Link href={`/profile/${contact._id}`} className="flex min-w-0 items-center gap-3">
                  <div className="relative">
                    <ProfileAvatar
                      src={contact.picture}
                      alt={contact.name}
                      className="h-10 w-10 rounded-full border border-[#302c28]/10 object-cover"
                      iconClassName="h-5 w-5"
                    />
                  </div>
                  <span className="max-w-[150px] truncate text-sm font-medium text-[#302c28]">
                    {contact.name || contact.email}
                  </span>
                </Link>
                <button
                  onClick={() => !disabled && sendRequest(contact._id)}
                  disabled={disabled}
                  className={`rounded px-2 py-1 text-xs font-semibold ${
                    contact.isFriend
                      ? 'border border-emerald-200 bg-emerald-50 text-emerald-700'
                      : contact.outgoingPending || contact.incomingPending
                      ? 'border border-[#302c28]/10 bg-[#d6ccc2]/70 text-[#5f554d]'
                      : 'bg-[#6f6258] text-[#fffaf4] hover:bg-[#5f554d]'
                  }`}
                >
                  {actionLabel}
                </button>
              </div>
            );
          })}
          {list.length === 0 && <div className="text-xs text-[#756b62]">No people found</div>}
        </div>
      )}
    </div>
  );
}
