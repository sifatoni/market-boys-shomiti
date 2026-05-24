'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { isAuthenticated, isAdmin, getUser } from '@/lib/auth';
import { authService } from '@/services/authService';
import { LogOut, LayoutDashboard, ArrowDownCircle, ArrowUpCircle } from 'lucide-react';

const tabs = [
  { label: 'ড্যাশবোর্ড', href: '/dashboard', icon: LayoutDashboard },
  { label: 'জমা', href: '/dashboard/deposits', icon: ArrowDownCircle },
  { label: 'উত্তোলন', href: '/dashboard/withdrawals', icon: ArrowUpCircle },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
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
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-indigo-600 flex items-center justify-center font-bold text-white text-sm shrink-0">
              M
            </div>
            <div className="leading-tight">
              <p className="font-bold text-white text-base tracking-tight">Market Boys Shomiti</p>
              <p className="text-xs text-zinc-400 font-medium">সদস্য পোর্টাল</p>
            </div>
          </div>

          {/* User Info + Logout */}
          <div className="flex items-center gap-3">
            {user && (
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-sm font-semibold text-white uppercase shrink-0">
                  {(user.name || user.email || 'U').charAt(0)}
                </div>
                <span className="text-sm font-medium text-zinc-300 hidden sm:block">
                  {user.name || user.email}
                </span>
              </div>
            )}
            <button
              onClick={() => authService.logout()}
              className="flex items-center gap-1.5 text-sm text-zinc-400 hover:text-red-400 transition-colors px-2.5 py-1.5 rounded-lg hover:bg-zinc-800"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>

        {/* Tabs Navigation */}
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex items-center gap-1">
            {tabs.map(({ label, href, icon: Icon }) => {
              const isActive = pathname === href;
              return (
                <Link
                  key={href}
                  href={href}
                  className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                    isActive
                      ? 'border-indigo-500 text-indigo-400'
                      : 'border-transparent text-zinc-400 hover:text-zinc-200 hover:border-zinc-600'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {label}
                </Link>
              );
            })}
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
