'use client';
import { useEffect, useState } from 'react';
import { friendsAPI, toAbsoluteUrl } from '@/lib/api';

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

export function Contacts() {
  const [q, setQ] = useState('');
  const [loading, setLoading] = useState(true);
  const [list, setList] = useState<Contact[]>([]);
  const [error, setError] = useState('');

  const load = async (query: string) => {
    try {
      setLoading(true);
      const val = query.trim();
      if (val.length < 2) {
        setList([]);
        setError('');
        return;
      }
      const data = await friendsAPI.search(val, 8);
      setList(data.results || []);
      setError('');
    } catch (e: any) {
      setError(e.message || 'Failed to load contacts');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const t = setTimeout(() => load(q), 300);
    return () => clearTimeout(t);
  }, [q]);

  const sendRequest = async (targetUserId: string) => {
    try {
      await friendsAPI.request(targetUserId);
      setList((prev) =>
        prev.map((c) =>
          c._id === targetUserId ? { ...c, outgoingPending: true } : c
        )
      );
    } catch (e: any) {
      setError(e.message || 'Failed to send request');
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xs font-semibold text-gray-500 uppercase">Contacts</h3>
        <span className="text-xs text-gray-400">{list.length}</span>
      </div>
      <div className="mb-3">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search contacts"
          className="w-full px-3 py-2 bg-gray-50 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
        />
      </div>
      {error && <div className="text-xs text-red-600 mb-2">{error}</div>}
      {loading ? (
        <div className="text-xs text-gray-500">Loading…</div>
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
              <div key={contact._id} className="flex items-center justify-between group">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="relative">
                    <img
                      src={toAbsoluteUrl(contact.picture || undefined) || 'https://i.pravatar.cc/100?u=' + contact.email}
                      alt={contact.name}
                      className="w-10 h-10 rounded-full"
                    />
                  </div>
                  <span className="text-sm font-medium text-gray-900 max-w-[150px] truncate">
                    {contact.name || contact.email}
                  </span>
                </div>
                <button
                  onClick={() => !disabled && sendRequest(contact._id)}
                  disabled={disabled}
                  className={`px-2 py-1 rounded text-xs font-semibold ${
                    contact.isFriend
                      ? 'bg-green-100 text-green-700'
                      : contact.outgoingPending || contact.incomingPending
                      ? 'bg-yellow-100 text-yellow-700'
                      : 'bg-blue-500 text-white hover:bg-blue-600'
                  }`}
                >
                  {actionLabel}
                </button>
              </div>
            );
          })}
          {list.length === 0 && <div className="text-xs text-gray-500">No contacts</div>}
        </div>
      )}
    </div>
  );
}
