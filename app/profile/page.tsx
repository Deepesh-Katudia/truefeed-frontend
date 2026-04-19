'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Loader2 } from 'lucide-react';
import { ProfileContent } from '@/components/profile/ProfileContent';

export default function ProfilePage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#edede9]">
        <Loader2 className="h-8 w-8 animate-spin text-[#6f6258]" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return <ProfileContent user={user} />;
}
