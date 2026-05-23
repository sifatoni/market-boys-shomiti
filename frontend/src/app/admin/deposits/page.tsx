'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Plus, Search, ChevronLeft, ChevronRight, Eye } from 'lucide-react';
import api from '@/lib/api';

interface DepositRow {
  id: string;
  amount: string | number;
  date: string;
  description?: string;
  memberId: string;
  member?: { fullName: string; memberNumber: string };
  createdAt: string;
}

function formatTaka(n: string | number) {
  return '৳ ' + Number(n).toLocaleString('en-IN');
}

function TableSkeleton() {
  return (
    <>
      {Array.from({ length: 5 }).map((_, i) => (
        <tr key={i} className="border-b border-zinc-800 animate-pulse">
          <td className="px-6 py-4"><div className="h-4 bg-zinc-800 rounded w-28" /></td>
          <td className="px-6 py-4"><div className="h-4 bg-zinc-800 rounded w-36" /></td>
          <td className="px-6 py-4"><div className="h-4 bg-zinc-800 rounded w-20" /></td>
          <td className="px-6 py-4"><div className="h-4 bg-zinc-800 rounded w-24" /></td>
          <td className="px-6 py-4"><div className="h-4 bg-zinc-800 rounded w-32" /></td>
          <td className="px-6 py-4 text-right"><div className="h-8 bg-zinc-800 rounded w-16 ml-auto" /></td>
        </tr>
      ))}
    </>
  );
}

export default function DepositsPage() {
  const router = useRouter();
  const [deposits, setDeposits] = useState<DepositRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 20;

  const fetchDeposits = useCallback(async (q: string, p: number) => {
    setLoading(true);
    try {
      const res = await api.get('/deposits', {
        params: { search: q || undefined, page: p, limit },
      });
      const raw = res.data?.data ?? res.data;
      const rows = Array.isArray(raw) ? raw : [];
      setDeposits(rows);
      if (res.data?.totalPages) {
        setTotalPages(res.data.totalPages);
      } else {
        setTotalPages(rows.length === limit ? p + 1 : p);
      }
    } catch {
      setDeposits([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const t = setTimeout(() => fetchDeposits(search, page), 400);
    return () => clearTimeout(t);
  }, [search, page, fetchDeposits]);

  function handleSearch(e: React.ChangeEvent<HTMLInputElement>) {
    setSearch(e.target.value);
    setPage(1);
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <h1 className="text-2xl font-bold text-white">Deposits</h1>
        <Link
          href="/admin/deposits/new"
          className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-lg font-medium transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Deposit
        </Link>
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
        {/* Search bar */}
        <div className="p-4 border-b border-zinc-800 mb-6">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
            <input
              type="text"
              placeholder="Search by member name…"
              value={search}
              onChange={handleSearch}
              className="w-full bg-zinc-800 border border-zinc-700 text-white rounded-lg pl-9 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent placeholder:text-zinc-500 transition-shadow"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-zinc-300">
            <thead className="bg-zinc-800 text-zinc-400">
              <tr>
                <th className="py-3 px-6 text-xs font-semibold uppercase tracking-wider text-left rounded-tl-xl">Member</th>
                <th className="py-3 px-6 text-xs font-semibold uppercase tracking-wider text-left">Member No.</th>
                <th className="py-3 px-6 text-xs font-semibold uppercase tracking-wider text-left">Amount</th>
                <th className="py-3 px-6 text-xs font-semibold uppercase tracking-wider text-left">Date</th>
                <th className="py-3 px-6 text-xs font-semibold uppercase tracking-wider text-left">Description</th>
                <th className="py-3 px-6 text-xs font-semibold uppercase tracking-wider text-right rounded-tr-xl">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <TableSkeleton />
              ) : deposits.length === 0 ? (
                <tr className="border-b border-zinc-800">
                  <td colSpan={6} className="px-6 py-16 text-center">
                    <div className="flex flex-col items-center gap-2 text-zinc-500">
                      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 0v3.75m-16.5-3.75v3.75m16.5 0v3.75M3.75 13.875v3.75" />
                      </svg>
                      <p className="text-sm">No deposits found</p>
                      {search && (
                        <button
                          onClick={() => { setSearch(''); setPage(1); }}
                          className="text-xs text-emerald-500 hover:underline"
                        >
                          Clear search
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                deposits.map((dep) => (
                  <tr
                    key={dep.id}
                    className="border-b border-zinc-800 hover:bg-zinc-800/50 transition-colors group cursor-pointer"
                    onClick={() => router.push(`/admin/deposits/${dep.id}`)}
                  >
                    <td className="px-6 py-4 font-medium text-white">
                      {dep.member?.fullName ?? '—'}
                    </td>
                    <td className="px-6 py-4 text-zinc-400 font-mono text-xs">
                      {dep.member?.memberNumber ?? '—'}
                    </td>
                    <td className="px-6 py-4 font-semibold text-emerald-400">
                      {formatTaka(dep.amount)}
                    </td>
                    <td className="px-6 py-4">
                      {dep.date ? new Date(dep.date).toLocaleDateString() : '—'}
                    </td>
                    <td className="px-6 py-4 text-zinc-400 max-w-[200px] truncate">
                      {dep.description || '—'}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={(e) => { e.stopPropagation(); router.push(`/admin/deposits/${dep.id}`); }}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-zinc-300 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        View
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="p-4 border-t border-zinc-800 flex items-center justify-between">
          <p className="text-sm text-zinc-500">Page {page} of {totalPages}</p>
          <div className="flex gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-zinc-300 bg-zinc-800 border border-zinc-700 rounded-lg hover:bg-zinc-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              Previous
            </button>
            <button
              onClick={() => setPage((p) => p + 1)}
              disabled={page >= totalPages}
              className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-zinc-300 bg-zinc-800 border border-zinc-700 rounded-lg hover:bg-zinc-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              Next
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
