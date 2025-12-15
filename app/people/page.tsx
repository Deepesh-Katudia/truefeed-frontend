'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { friendsAPI, toAbsoluteUrl } from '@/lib/api';
import { Sidebar } from '@/components/layout/Sidebar';

interface Person {
  _id: string;
  name: string;
  email: string;
  picture?: string | null;
  description?: string;
  isFriend: boolean;
  incomingPending: boolean;
  outgoingPending: boolean;
}

export default function PeoplePage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [q, setQ] = useState('an');
  const [list, setList] = useState<Person[]>([]);
  const [fetching, setFetching] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (loading || !user) return;
    load(q);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, user]);

  const load = async (query: string) => {
    try {
      setFetching(true);
      const effectiveQ = query.trim().length >= 2 ? query : 'an';
      const data = await friendsAPI.search(effectiveQ, 20);
      setList(data.results || []);
      setError('');
    } catch (e: any) {
      setError(e.message || 'Failed to load people');
    } finally {
      setFetching(false);
    }
  };

  const sendRequest = async (targetUserId: string) => {
    try {
      await friendsAPI.request(targetUserId);
      setList((prev) =>
        prev.map((p) =>
          p._id === targetUserId ? { ...p, outgoingPending: true } : p
        )
      );
    } catch (e: any) {
      setError(e.message || 'Failed to send request');
    }
  };

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="flex max-w-[1920px] mx-auto">
        <Sidebar />
        <div className="flex-1 px-6 py-8">
        {/* Top Nav with Search */}
        <div className="bg-white rounded-2xl shadow-sm p-4 mb-6 flex items-center gap-3">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && load(q)}
            placeholder="Search people"
            className="flex-1 px-4 py-2 bg-gray-50 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
          />
          <button
            onClick={() => load(q)}
            disabled={fetching}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg text-sm font-semibold hover:bg-blue-600 transition-colors disabled:opacity-50"
          >
            {fetching ? 'Searching...' : 'Search'}
          </button>
        </div>

        {/* Results */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm mb-4">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {list.map((p) => {
            const actionLabel = p.isFriend
              ? 'Friends'
              : p.outgoingPending || p.incomingPending
              ? 'Pending'
              : 'Add Friend';
            const disabled = p.isFriend || p.outgoingPending || p.incomingPending;
            return (
              <div key={p._id} className="bg-white rounded-2xl shadow-sm p-4 flex items-center gap-3">
                <img
                  src={toAbsoluteUrl(p.picture || undefined) || 'https://i.pravatar.cc/100?u=' + p.email}
                  alt={p.name || p.email}
                  className="w-12 h-12 rounded-full"
                />
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-gray-900 max-w-[180px] truncate">{p.name || p.email}</div>
                  <div className="text-xs text-gray-500 max-w-[220px] truncate">{p.description || p.email}</div>
                </div>
                <button
                  onClick={() => !disabled && sendRequest(p._id)}
                  disabled={disabled}
                  className={`px-3 py-1.5 rounded text-xs font-semibold ${
                    p.isFriend
                      ? 'bg-green-100 text-green-700'
                      : p.outgoingPending || p.incomingPending
                      ? 'bg-yellow-100 text-yellow-700'
                      : 'bg-blue-500 text-white hover:bg-blue-600'
                  }`}
                >
                  {actionLabel}
                </button>
              </div>
            );
          })}
        </div>

        {!fetching && list.length === 0 && (
          <div className="text-sm text-gray-500 mt-6">No people found</div>
        )}
        </div>
      </div>
    </div>
  );
}
