'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import api from '@/lib/api';
import type { DashboardSummary } from '@/types';

function formatTaka(amount: number): string {
  return '৳ ' + amount.toLocaleString('en-IN');
}

// ── Skeleton ──────────────────────────────────────────────────────────────────

function CardSkeleton() {
  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-5 animate-pulse">
      <div className="flex items-start justify-between mb-4">
        <div className="h-3 w-24 rounded bg-zinc-700" />
        <div className="h-8 w-8 rounded-lg bg-zinc-700" />
      </div>
      <div className="h-7 w-32 rounded bg-zinc-700" />
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div className="p-6 lg:p-8 space-y-6">
      <div className="h-6 w-40 rounded bg-zinc-800 animate-pulse" />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, i) => <CardSkeleton key={i} />)}
      </div>
    </div>
  );
}

// ── Stat Card ─────────────────────────────────────────────────────────────────

interface StatCardProps {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  accent: string;   // Tailwind color class for icon bg
  iconColor: string;
}

function StatCard({ label, value, icon, accent, iconColor }: StatCardProps) {
  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-5 flex flex-col gap-3 hover:border-zinc-700 transition">
      <div className="flex items-start justify-between">
        <span className="text-xs font-medium text-zinc-400 uppercase tracking-wide">{label}</span>
        <div className={`flex items-center justify-center w-9 h-9 rounded-lg ${accent}`}>
          <span className={iconColor}>{icon}</span>
        </div>
      </div>
      <p className="text-2xl font-bold text-white">{value}</p>
    </div>
  );
}

// ── Icons ─────────────────────────────────────────────────────────────────────

const icons = {
  users: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
    </svg>
  ),
  userCheck: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
    </svg>
  ),
  wallet: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a2.25 2.25 0 0 0-2.25-2.25H15a3 3 0 1 1-6 0H5.25A2.25 2.25 0 0 0 3 12m18 0v6a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 18v-6m18 0V9M3 12V9m18-3a2.25 2.25 0 0 0-2.25-2.25H5.25A2.25 2.25 0 0 0 3 6v3m18-3V6" />
    </svg>
  ),
  exclamation: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
    </svg>
  ),
  arrowDown: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
      <path strokeLinecap="round" strokeLinejoin="round" d="m9 12.75 3 3m0 0 3-3m-3 3v-7.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
    </svg>
  ),
  arrowUp: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
      <path strokeLinecap="round" strokeLinejoin="round" d="m15 11.25-3-3m0 0-3 3m3-3v7.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
    </svg>
  ),
  checkCircle: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
    </svg>
  ),
  clock: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
    </svg>
  ),
};

// ── Page ──────────────────────────────────────────────────────────────────────

export default function DashboardPage() {
  const [data, setData] = useState<DashboardSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api
      .get<DashboardSummary>('/dashboard/summary')
      .then((res) => setData(res.data))
      .catch((err) => {
        console.error('Dashboard summary error:', err.response?.status, err.response?.data || err.message);
        setError('Failed to load dashboard data. Please try again.');
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <DashboardSkeleton />;

  if (error) {
    return (
      <div className="flex items-center justify-center h-full p-8">
        <div className="text-center space-y-3">
          <div className="flex items-center justify-center w-12 h-12 rounded-full bg-red-950/50 border border-red-800/60 mx-auto">
            <svg className="w-6 h-6 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
            </svg>
          </div>
          <p className="text-zinc-300 font-medium">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="text-sm text-indigo-400 hover:text-indigo-300 transition"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!data) return null;

  const rowOne: StatCardProps[] = [
    {
      label: 'Total Members',
      value: data.members.total,
      icon: icons.users,
      accent: 'bg-blue-500/10',
      iconColor: 'text-blue-400',
    },
    {
      label: 'Active Members',
      value: data.members.active,
      icon: icons.userCheck,
      accent: 'bg-green-500/10',
      iconColor: 'text-green-400',
    },
    {
      label: 'Net Balance',
      value: formatTaka(data.financials.netBalance),
      icon: icons.wallet,
      accent: 'bg-indigo-500/10',
      iconColor: 'text-indigo-400',
    },
    {
      label: 'Overdue Count',
      value: data.dues.overdueCount,
      icon: icons.exclamation,
      accent: 'bg-red-500/10',
      iconColor: 'text-red-400',
    },
  ];

  const rowTwo: StatCardProps[] = [
    {
      label: 'Total Deposits',
      value: formatTaka(data.financials.totalDeposits),
      icon: icons.arrowDown,
      accent: 'bg-green-500/10',
      iconColor: 'text-green-400',
    },
    {
      label: 'Total Withdrawals',
      value: formatTaka(data.financials.totalWithdrawals),
      icon: icons.arrowUp,
      accent: 'bg-red-500/10',
      iconColor: 'text-red-400',
    },
    {
      label: 'Dues Collected',
      value: formatTaka(data.dues.totalCollected),
      icon: icons.checkCircle,
      accent: 'bg-blue-500/10',
      iconColor: 'text-blue-400',
    },
    {
      label: 'Dues Pending',
      value: formatTaka(data.dues.totalPending),
      icon: icons.clock,
      accent: 'bg-orange-500/10',
      iconColor: 'text-orange-400',
    },
  ];

  return (
    <div className="p-6 lg:p-8 space-y-8">
      {/* Page header */}
      <div>
        <h1 className="text-xl font-bold text-white">Dashboard</h1>
        <p className="text-sm text-zinc-400 mt-0.5">Overview of your samiti's financial activity</p>
      </div>

      {/* Stats */}
      <section className="space-y-4">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {rowOne.map((card) => <StatCard key={card.label} {...card} />)}
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {rowTwo.map((card) => <StatCard key={card.label} {...card} />)}
        </div>
      </section>

      {/* Quick Actions */}
      <section>
        <h2 className="text-sm font-semibold text-zinc-300 uppercase tracking-wide mb-3">
          Quick Actions
        </h2>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/admin/deposits/new"
            className="flex items-center gap-2 rounded-lg bg-green-600 hover:bg-green-500 px-4 py-2.5 text-sm font-semibold text-white transition shadow-lg shadow-green-600/10"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            Add Deposit
          </Link>
          <Link
            href="/admin/withdrawals/new"
            className="flex items-center gap-2 rounded-lg bg-red-600 hover:bg-red-500 px-4 py-2.5 text-sm font-semibold text-white transition shadow-lg shadow-red-600/10"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            Add Withdrawal
          </Link>
          <Link
            href="/admin/members/new"
            className="flex items-center gap-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 px-4 py-2.5 text-sm font-semibold text-white transition shadow-lg shadow-indigo-600/10"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            Add Member
          </Link>
        </div>
      </section>
    </div>
  );
}
