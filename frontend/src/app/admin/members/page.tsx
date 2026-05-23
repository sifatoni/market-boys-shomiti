'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Eye, Edit, Plus, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import api from '@/lib/api';
import BalanceDisplay from './[id]/balance-display';
import { Member } from '@/types';

export default function MembersPage() {
  const router = useRouter();
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 20;

  const fetchMembers = useCallback(async (searchQuery: string, currentPage: number) => {
    setLoading(true);
    try {
      // Assuming backend supports pagination and search like this
      const response = await api.get(`/members`, {
        params: { search: searchQuery, page: currentPage, limit }
      });
      // The backend might return an array directly or a paginated object
      const data = response.data.data || response.data;
      setMembers(Array.isArray(data) ? data : []);
      
      // If the backend doesn't return totalPages, we can fake it or just disable next if data.length < limit
      if (response.data.totalPages) {
        setTotalPages(response.data.totalPages);
      } else {
        setTotalPages(Array.isArray(data) && data.length === limit ? currentPage + 1 : currentPage);
      }
    } catch (error) {
      console.error('Failed to fetch members:', error);
      setMembers([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchMembers(search, page);
    }, 400);

    return () => clearTimeout(delayDebounceFn);
  }, [search, page, fetchMembers]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setPage(1); // Reset to first page on search
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <h1 className="text-2xl font-bold text-white">Members Management</h1>
        <Link
          href="/admin/members/new"
          className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-lg font-medium transition-colors"
        >
          <Plus className="w-5 h-5" />
          Add Member
        </Link>
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
        <div className="p-4 border-b border-zinc-800 flex items-center justify-between bg-zinc-900 mb-6">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
            <input
              type="text"
              placeholder="Search members..."
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
                <th className="py-3 px-6 text-xs font-semibold uppercase tracking-wider rounded-tl-xl text-left">Member No.</th>
                <th className="py-3 px-6 text-xs font-semibold uppercase tracking-wider text-left">Full Name</th>
                <th className="py-3 px-6 text-xs font-semibold uppercase tracking-wider text-left">Phone</th>
                <th className="py-3 px-6 text-xs font-semibold uppercase tracking-wider text-left">Join Date</th>
                <th className="py-3 px-6 text-xs font-semibold uppercase tracking-wider text-left">Status</th>
                <th className="py-3 px-6 text-xs font-semibold uppercase tracking-wider text-left">Balance</th>
                <th className="py-3 px-6 text-xs font-semibold uppercase tracking-wider rounded-tr-xl text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="border-b border-zinc-800 animate-pulse">
                    <td className="px-6 py-4"><div className="h-4 bg-zinc-800 rounded w-16"></div></td>
                    <td className="px-6 py-4"><div className="h-4 bg-zinc-800 rounded w-32"></div></td>
                    <td className="px-6 py-4"><div className="h-4 bg-zinc-800 rounded w-24"></div></td>
                    <td className="px-6 py-4"><div className="h-4 bg-zinc-800 rounded w-24"></div></td>
                    <td className="px-6 py-4"><div className="h-6 bg-zinc-800 rounded-full w-16"></div></td>
                    <td className="px-6 py-4"><div className="h-4 bg-zinc-800 rounded w-16"></div></td>
                    <td className="px-6 py-4 flex justify-end gap-2">
                      <div className="w-8 h-8 bg-zinc-800 rounded-lg"></div>
                      <div className="w-8 h-8 bg-zinc-800 rounded-lg"></div>
                    </td>
                  </tr>
                ))
              ) : members.length === 0 ? (
                <tr className="border-b border-zinc-800">
                  <td colSpan={7} className="px-6 py-12 text-center text-zinc-500">
                    No members found
                  </td>
                </tr>
              ) : (
                members.map((member) => (
                  <tr key={member.id} className="border-b border-zinc-800 hover:bg-zinc-800/50 transition-colors group">
                    <td className="px-6 py-4 font-medium text-white">{member.memberNumber}</td>
                    <td className="px-6 py-4 font-medium text-white">{member.fullName}</td>
                    <td className="px-6 py-4">{member.phone || '—'}</td>
                    <td className="px-6 py-4">
                      {member.joinDate ? new Date(member.joinDate).toLocaleDateString() : '—'}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        member.status === 'ACTIVE' 
                          ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' 
                          : 'bg-red-500/10 text-red-500 border border-red-500/20'
                      }`}>
                        {member.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <BalanceDisplay memberId={member.id} />
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => router.push(`/admin/members/${member.id}`)}
                          className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-700 rounded-lg transition-colors"
                          title="View"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => router.push(`/admin/members/${member.id}/edit`)}
                          className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-700 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
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
