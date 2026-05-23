'use client';

import { useState, useEffect, useCallback } from 'react';
import { Download, Users, TrendingUp, TrendingDown, AlertCircle, RefreshCw } from 'lucide-react';
import api from '@/lib/api';
import { Member, DashboardSummary } from '@/types';

const formatTaka = (amount: number | string): string =>
  `৳ ${Number(amount).toLocaleString('en-IN')}`;

const downloadCSV = (filename: string, rows: string[][]) => {
  const content = rows.map(r => r.map(cell => `"${String(cell ?? '').replace(/"/g, '""')}"`).join(',')).join('\n');
  const blob = new Blob([content], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
};

interface MemberWithBalance extends Member {
  balance: number;
}

interface DuesSummary {
  totalDue: number;
  totalPaid: number;
  totalPartial: number;
  overdueCount: number;
}

export default function ReportsPage() {
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [membersWithBalance, setMembersWithBalance] = useState<MemberWithBalance[]>([]);
  const [duesSummary, setDuesSummary] = useState<DuesSummary | null>(null);
  const [loadingSummary, setLoadingSummary] = useState(true);
  const [loadingMembers, setLoadingMembers] = useState(true);
  const [loadingDues, setLoadingDues] = useState(true);
  const [exportingMembers, setExportingMembers] = useState(false);
  const [exportingDeposits, setExportingDeposits] = useState(false);

  const fetchSummary = useCallback(async () => {
    setLoadingSummary(true);
    try {
      const response = await api.get('/dashboard/summary');
      setSummary(response.data.data || response.data);
    } catch (err) {
      console.error('Failed to fetch summary:', err);
    } finally {
      setLoadingSummary(false);
    }
  }, []);

  const fetchMembersWithBalances = useCallback(async () => {
    setLoadingMembers(true);
    try {
      const membersRes = await api.get('/members', { params: { limit: 50 } });
      const membersData: Member[] = membersRes.data.data || membersRes.data;
      const members = Array.isArray(membersData) ? membersData : [];

      // Fetch balances in parallel
      const withBalances = await Promise.all(
        members.map(async (member) => {
          try {
            const balRes = await api.get(`/members/${member.id}/balance`);
            const bal = balRes.data?.balance ?? balRes.data?.netBalance ?? Number(balRes.data) ?? 0;
            return { ...member, balance: Number(bal) };
          } catch {
            return { ...member, balance: 0 };
          }
        })
      );

      // Sort by balance descending
      withBalances.sort((a, b) => b.balance - a.balance);
      setMembersWithBalance(withBalances);
    } catch (err) {
      console.error('Failed to fetch members:', err);
    } finally {
      setLoadingMembers(false);
    }
  }, []);

  const fetchDuesSummary = useCallback(async () => {
    setLoadingDues(true);
    try {
      const response = await api.get('/dues/summary');
      setDuesSummary(response.data.data || response.data);
    } catch (err) {
      console.error('Failed to fetch dues summary:', err);
    } finally {
      setLoadingDues(false);
    }
  }, []);

  useEffect(() => {
    fetchSummary();
    fetchMembersWithBalances();
    fetchDuesSummary();
  }, [fetchSummary, fetchMembersWithBalances, fetchDuesSummary]);

  const handleExportMembers = async () => {
    setExportingMembers(true);
    try {
      const response = await api.get('/members', { params: { limit: 500 } });
      const data: Member[] = response.data.data || response.data;
      const members = Array.isArray(data) ? data : [];

      const headers = ['Member Number', 'Full Name', 'Phone', 'Address', 'Joined Date', 'Status'];
      const rows = members.map(m => [
        m.memberNumber,
        m.fullName,
        m.phone || '',
        m.address || '',
        m.joinDate ? new Date(m.joinDate).toLocaleDateString() : '',
        m.status,
      ]);

      downloadCSV(`members_export_${new Date().toISOString().split('T')[0]}.csv`, [headers, ...rows]);
    } catch (err) {
      console.error('Failed to export members:', err);
      alert('Export failed. Please try again.');
    } finally {
      setExportingMembers(false);
    }
  };

  const handleExportDeposits = async () => {
    setExportingDeposits(true);
    try {
      const response = await api.get('/deposits', { params: { limit: 1000 } });
      const data = response.data.data || response.data;
      const deposits = Array.isArray(data) ? data : [];

      const headers = ['Date', 'Member Name', 'Member Number', 'Amount', 'Description'];
      const rows = deposits.map((d: any) => [
        d.date ? new Date(d.date).toLocaleDateString() : '',
        d.member?.fullName || '',
        d.member?.memberNumber || '',
        d.amount,
        d.description || '',
      ]);

      downloadCSV(`deposits_export_${new Date().toISOString().split('T')[0]}.csv`, [headers, ...rows]);
    } catch (err) {
      console.error('Failed to export deposits:', err);
      alert('Export failed. Please try again.');
    } finally {
      setExportingDeposits(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Page Title */}
      <div>
        <h1 className="text-2xl font-bold text-white">Reports & Analytics</h1>
        <p className="text-zinc-400 mt-1 text-sm">Financial overview and exportable data for the group.</p>
      </div>

      {/* SECTION 1 — Summary Cards */}
      <section>
        <h2 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider mt-8 mb-4">Financial Summary</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
          {loadingSummary ? (
            Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-28 bg-zinc-800 rounded-xl animate-pulse" />
            ))
          ) : (
            <>
              <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 flex flex-col gap-2">
                <div className="w-9 h-9 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-indigo-400" />
                </div>
                <p className="text-xs text-zinc-400 font-medium">Net Balance</p>
                <p className="text-xl font-bold text-white">
                  {formatTaka(summary?.financials?.netBalance ?? 0)}
                </p>
              </div>
              <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 flex flex-col gap-2">
                <div className="w-9 h-9 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-emerald-400" />
                </div>
                <p className="text-xs text-zinc-400 font-medium">Total Deposits</p>
                <p className="text-xl font-bold text-white">
                  {formatTaka(summary?.financials?.totalDeposits ?? 0)}
                </p>
              </div>
              <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 flex flex-col gap-2">
                <div className="w-9 h-9 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center justify-center">
                  <TrendingDown className="w-5 h-5 text-red-400" />
                </div>
                <p className="text-xs text-zinc-400 font-medium">Total Withdrawals</p>
                <p className="text-xl font-bold text-white">
                  {formatTaka(summary?.financials?.totalWithdrawals ?? 0)}
                </p>
              </div>
              <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 flex flex-col gap-2">
                <div className="w-9 h-9 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
                  <AlertCircle className="w-5 h-5 text-amber-400" />
                </div>
                <p className="text-xs text-zinc-400 font-medium">Dues Pending</p>
                <p className="text-xl font-bold text-white">
                  {formatTaka(summary?.dues?.totalPending ?? 0)}
                </p>
              </div>
            </>
          )}
        </div>
      </section>

      {/* SECTION 2 — Member-wise Balance Table */}
      <section>
        <div className="flex items-center justify-between mt-8 mb-4">
          <h2 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider">Member Balances</h2>
          {!loadingMembers && (
            <span className="text-xs text-zinc-500">{membersWithBalance.length} members</span>
          )}
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-zinc-800 text-zinc-400 text-xs uppercase font-semibold">
                <tr>
                  <th className="px-5 py-3 rounded-tl-xl">Member No.</th>
                  <th className="px-5 py-3">Full Name</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3 rounded-tr-xl text-right">Balance</th>
                </tr>
              </thead>
              <tbody>
                {loadingMembers ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i} className="border-b border-zinc-800 animate-pulse">
                      <td className="px-5 py-3"><div className="h-4 bg-zinc-800 rounded w-16" /></td>
                      <td className="px-5 py-3"><div className="h-4 bg-zinc-800 rounded w-32" /></td>
                      <td className="px-5 py-3"><div className="h-5 bg-zinc-800 rounded-full w-16" /></td>
                      <td className="px-5 py-3 text-right"><div className="h-4 bg-zinc-800 rounded w-20 ml-auto" /></td>
                    </tr>
                  ))
                ) : membersWithBalance.length === 0 ? (
                  <tr className="border-b border-zinc-800">
                    <td colSpan={4} className="px-5 py-10 text-center text-zinc-500">
                      <Users className="w-6 h-6 mx-auto mb-2 opacity-30" />
                      No members found
                    </td>
                  </tr>
                ) : (
                  membersWithBalance.map((member) => (
                    <tr key={member.id} className="border-b border-zinc-800 hover:bg-zinc-800/50 transition-colors">
                      <td className="px-5 py-3 text-zinc-400 font-mono">{member.memberNumber}</td>
                      <td className="px-5 py-3 font-medium text-white">{member.fullName}</td>
                      <td className="px-5 py-3">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${
                          member.status === 'ACTIVE'
                            ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'
                            : 'bg-red-500/10 text-red-500 border border-red-500/20'
                        }`}>
                          {member.status}
                        </span>
                      </td>
                      <td className={`px-5 py-3 text-right font-semibold ${member.balance >= 0 ? 'text-white' : 'text-red-400'}`}>
                        {formatTaka(member.balance)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* SECTION 3 — Due Records Summary */}
      <section>
        <h2 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider mt-8 mb-4">Dues Summary</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {loadingDues ? (
            Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-24 bg-zinc-800 rounded-xl animate-pulse" />
            ))
          ) : (
            <>
              <div className="bg-zinc-900 border border-emerald-500/20 rounded-xl p-5 space-y-1">
                <p className="text-xs text-zinc-400 font-medium uppercase tracking-wide">Total Collected</p>
                <p className="text-2xl font-bold text-emerald-400">
                  {formatTaka(duesSummary?.totalPaid ?? 0)}
                </p>
              </div>
              <div className="bg-zinc-900 border border-red-500/20 rounded-xl p-5 space-y-1">
                <p className="text-xs text-zinc-400 font-medium uppercase tracking-wide">Total Pending</p>
                <p className="text-2xl font-bold text-red-400">
                  {formatTaka(duesSummary?.totalDue ?? 0)}
                </p>
              </div>
              <div className="bg-zinc-900 border border-amber-500/20 rounded-xl p-5 space-y-1">
                <p className="text-xs text-zinc-400 font-medium uppercase tracking-wide">Overdue Records</p>
                <p className="text-2xl font-bold text-amber-400">
                  {duesSummary?.overdueCount ?? 0}
                  <span className="text-sm text-zinc-500 font-normal ml-1">records</span>
                </p>
              </div>
            </>
          )}
        </div>
      </section>

      {/* SECTION 4 — Export Buttons */}
      <section>
        <h2 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider mt-8 mb-4">Export Data</h2>
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <h3 className="text-white font-medium mb-1">Members CSV</h3>
            <p className="text-xs text-zinc-400 mb-3">
              Downloads all member records including name, phone, address, join date, and status.
            </p>
            <button
              onClick={handleExportMembers}
              disabled={exportingMembers}
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-60 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              {exportingMembers
                ? <RefreshCw className="w-4 h-4 animate-spin" />
                : <Download className="w-4 h-4" />}
              {exportingMembers ? 'Exporting...' : 'Export Members CSV'}
            </button>
          </div>

          <div className="w-px bg-zinc-800 hidden sm:block" />

          <div className="flex-1">
            <h3 className="text-white font-medium mb-1">Deposits CSV</h3>
            <p className="text-xs text-zinc-400 mb-3">
              Downloads all deposit transactions with member info, date, amount, and description.
            </p>
            <button
              onClick={handleExportDeposits}
              disabled={exportingDeposits}
              className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-60 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              {exportingDeposits
                ? <RefreshCw className="w-4 h-4 animate-spin" />
                : <Download className="w-4 h-4" />}
              {exportingDeposits ? 'Exporting...' : 'Export Deposits CSV'}
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
