'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { isAuthenticated, isAdmin } from '@/lib/auth';

export default function RootPage() {
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated()) {
      router.replace('/login');
    } else if (isAdmin()) {
      router.replace('/admin/dashboard');
    } else {
      router.replace('/dashboard');
    }
  }, [router]);

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 border-4 border-zinc-700 border-t-indigo-500 rounded-full animate-spin" />
        <p className="text-zinc-500 text-sm">Redirecting...</p>
      </div>
    </div>
  );
}
