'use client';
import { useEffect, useState } from 'react';
import { friendsAPI } from '@/lib/api';

interface IncomingUser {
  _id: string;
  name: string;
  email: string;
  picture?: string | null;
  description?: string;
}

export function Requests() {
  const [loading, setLoading] = useState(true);
  const [list, setList] = useState<IncomingUser[]>([]);
  const [error, setError] = useState('');

  const load = async () => {
    try {
      setLoading(true);
      const data = await friendsAPI.incoming();
      setList(data.results || []);
      setError('');
    } catch (e: any) {
      setError(e.message || 'Failed to load requests');
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
    } catch (e: any) {
      setError(e.message || 'Failed to accept');
    }
  };

  const decline = async (senderUserId: string) => {
    try {
      await friendsAPI.decline(senderUserId);
      setList((prev) => prev.filter((u) => u._id !== senderUserId));
    } catch (e: any) {
      setError(e.message || 'Failed to decline');
    }
  };

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xs font-semibold text-gray-500 uppercase">Requests</h3>
        <span className="w-6 h-6 bg-blue-500 text-white text-xs rounded-full flex items-center justify-center font-semibold">
          {list.length}
        </span>
      </div>
      {error && <div className="text-xs text-red-600 mb-3">{error}</div>}
      {loading ? (
        <div className="text-xs text-gray-500">Loading…</div>
      ) : (
        <div className="space-y-4">
          {list.map((u) => (
            <div key={u._id} className="flex items-start gap-3">
              <img
                src={u.picture || 'https://i.pravatar.cc/100?u=' + u.email}
                alt={u.name}
                className="w-12 h-12 rounded-full"
              />
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900 text-sm mb-1">{u.name || u.email}</h4>
                <p className="text-xs text-gray-500 mb-3">wants to add you to friends</p>
                <div className="flex gap-2">
                  <button
                    onClick={() => accept(u._id)}
                    className="flex-1 px-3 py-2 bg-blue-500 text-white rounded-lg text-sm font-semibold hover:bg-blue-600 transition-colors"
                  >
                    Accept
                  </button>
                  <button
                    onClick={() => decline(u._id)}
                    className="flex-1 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-semibold hover:bg-gray-200 transition-colors"
                  >
                    Decline
                  </button>
                </div>
              </div>
            </div>
          ))}
          {list.length === 0 && <div className="text-xs text-gray-500">No requests</div>}
        </div>
      )}
    </div>
  );
}
