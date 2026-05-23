'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Eye, Plus, Search, ChevronLeft, ChevronRight, Activity } from 'lucide-react';
import api from '@/lib/api';
import { Withdrawal } from '@/types';

export default function WithdrawalsPage() {
  const router = useRouter();
  const [withdrawals, setWithdrawals] = useState<Withdrawal[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 20;

  const fetchWithdrawals = useCallback(async (searchQuery: string, currentPage: number) => {
    setLoading(true);
    try {
      const response = await api.get(`/withdrawals`, {
        params: { search: searchQuery, page: currentPage, limit }
      });
      const data = response.data.data || response.data;
      setWithdrawals(Array.isArray(data) ? data : []);
      
      if (response.data.totalPages) {
        setTotalPages(response.data.totalPages);
      } else {
        setTotalPages(Array.isArray(data) && data.length === limit ? currentPage + 1 : currentPage);
      }
    } catch (error) {
      console.error('Failed to fetch withdrawals:', error);
      setWithdrawals([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchWithdrawals(search, page);
    }, 400);

    return () => clearTimeout(delayDebounceFn);
  }, [search, page, fetchWithdrawals]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setPage(1);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <h1 className="text-2xl font-bold text-white">Withdrawals Management</h1>
        <Link
          href="/admin/withdrawals/new"
          className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-lg font-medium transition-colors"
        >
          <Plus className="w-5 h-5" />
          Add Withdrawal
        </Link>
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
        <div className="p-4 border-b border-zinc-800 flex items-center justify-between bg-zinc-900 mb-6">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
            <input
              type="text"
              placeholder="Search by member..."
              value={search}
              onChange={handleSearchChange}
              className="w-full bg-zinc-800 border border-zinc-700 text-white rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent placeholder:text-zinc-500 transition-shadow"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-zinc-300">
            <thead className="bg-zinc-800 text-zinc-400">
              <tr>
                <th className="py-3 px-6 text-xs font-semibold uppercase tracking-wider text-left rounded-tl-xl w-16">#</th>
                <th className="py-3 px-6 text-xs font-semibold uppercase tracking-wider text-left">Member Name</th>
                <th className="py-3 px-6 text-xs font-semibold uppercase tracking-wider text-left">Member No.</th>
                <th className="py-3 px-6 text-xs font-semibold uppercase tracking-wider text-left">Amount</th>
                <th className="py-3 px-6 text-xs font-semibold uppercase tracking-wider text-left">Date</th>
                <th className="py-3 px-6 text-xs font-semibold uppercase tracking-wider text-left">Description</th>
                <th className="py-3 px-6 text-xs font-semibold uppercase tracking-wider text-right rounded-tr-xl">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="border-b border-zinc-800 animate-pulse">
                    <td className="px-6 py-4"><div className="h-4 bg-zinc-800 rounded w-8"></div></td>
                    <td className="px-6 py-4"><div className="h-4 bg-zinc-800 rounded w-32"></div></td>
                    <td className="px-6 py-4"><div className="h-4 bg-zinc-800 rounded w-16"></div></td>
                    <td className="px-6 py-4"><div className="h-4 bg-zinc-800 rounded w-20"></div></td>
                    <td className="px-6 py-4"><div className="h-4 bg-zinc-800 rounded w-24"></div></td>
                    <td className="px-6 py-4"><div className="h-4 bg-zinc-800 rounded w-48"></div></td>
                    <td className="px-6 py-4 flex justify-end">
                      <div className="w-8 h-8 bg-zinc-800 rounded-lg"></div>
                    </td>
                  </tr>
                ))
              ) : withdrawals.length === 0 ? (
                <tr className="border-b border-zinc-800">
                  <td colSpan={7} className="px-6 py-12 text-center text-zinc-500">
                    <div className="flex flex-col items-center justify-center">
                      <Activity className="w-8 h-8 mb-2 opacity-20" />
                      No withdrawals found
                    </div>
                  </td>
                </tr>
              ) : (
                withdrawals.map((withdrawal, index) => (
                  <tr key={withdrawal.id} className="border-b border-zinc-800 hover:bg-zinc-800/50 transition-colors group">
                    <td className="px-6 py-4 font-medium text-zinc-500">
                      {(page - 1) * limit + index + 1}
                    </td>
                    <td className="px-6 py-4 font-medium text-white">
                      {withdrawal.member?.fullName || '—'}
                    </td>
                    <td className="px-6 py-4 text-zinc-400">
                      {withdrawal.member?.memberNumber || '—'}
                    </td>
                    <td className="px-6 py-4 font-medium text-red-400">
                      ৳ {Number(withdrawal.amount).toLocaleString()}
                    </td>
                    <td className="px-6 py-4">
                      {withdrawal.date ? new Date(withdrawal.date).toLocaleDateString() : '—'}
                    </td>
                    <td className="px-6 py-4 text-zinc-400">
                      {withdrawal.description 
                        ? withdrawal.description.length > 40 
                          ? `${withdrawal.description.substring(0, 40)}...` 
                          : withdrawal.description 
                        : '—'}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => router.push(`/admin/withdrawals/${withdrawal.id}`)}
                          className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-700 rounded-lg transition-colors"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="p-4 border-t border-zinc-800 flex items-center justify-between bg-zinc-900 rounded-b-xl">
          <p className="text-sm text-zinc-400">
            Page {page} of {totalPages}
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-zinc-300 bg-zinc-800 border border-zinc-700 rounded-lg hover:bg-zinc-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              Previous
            </button>
            <button
              onClick={() => setPage(p => p + 1)}
              disabled={page >= totalPages}
              className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-zinc-300 bg-zinc-800 border border-zinc-700 rounded-lg hover:bg-zinc-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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
