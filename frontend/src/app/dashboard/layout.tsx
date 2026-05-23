'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { isAuthenticated, isAdmin, getUser } from '@/lib/auth';
import { authService } from '@/services/authService';
import { LogOut } from 'lucide-react';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const user = getUser();

  useEffect(() => {
    if (!isAuthenticated()) {
      router.replace('/login');
      return;
    }
    if (isAdmin()) {
      router.replace('/admin/dashboard');
    }
  }, [router]);

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col">
      {/* Top Navbar */}
      <nav className="sticky top-0 z-40 w-full bg-zinc-900 border-b border-zinc-800 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          {/* Logo / Brand */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center font-bold text-white text-sm">
              M
            </div>
            <span className="font-bold text-white text-lg tracking-tight">
              Market Boys Shomiti
            </span>
          </div>

          {/* User Info + Logout */}
          <div className="flex items-center gap-4">
            {user && (
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-zinc-700 flex items-center justify-center text-sm font-semibold text-white uppercase">
                  {(user.name || user.email || 'U').charAt(0)}
                </div>
                <span className="text-sm font-medium text-zinc-300 hidden sm:block">
                  {user.name || user.email}
                </span>
              </div>
            )}
            <button
              onClick={() => authService.logout()}
              className="flex items-center gap-1.5 text-sm text-zinc-400 hover:text-red-400 transition-colors px-2 py-1.5 rounded-lg hover:bg-zinc-800"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Page Content */}
      <main className="flex-1">
        <div className="max-w-4xl mx-auto px-4 py-8">
          {children}
        </div>
      </main>
    </div>
  );
}
