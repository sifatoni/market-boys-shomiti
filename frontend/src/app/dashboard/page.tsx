'use client';

import { useState, useEffect, useCallback } from 'react';
import { getUser } from '@/lib/auth';
import api from '@/lib/api';
import { Member, Deposit, DueRecord } from '@/types';
import { Wallet, TrendingUp, AlertCircle, Calendar, CheckCircle, Clock, Minus } from 'lucide-react';

const formatTaka = (amount: number | string): string => {
  return `৳ ${Number(amount).toLocaleString('en-IN')}`;
};

export default function MemberDashboardPage() {
  const user = getUser();

  const [loading, setLoading] = useState(true);
  const [member, setMember] = useState<Member | null>(null);
  const [balance, setBalance] = useState<number | null>(null);
  const [deposits, setDeposits] = useState<Deposit[]>([]);
  const [dues, setDues] = useState<DueRecord[]>([]);

  const fetchDashboardData = useCallback(async () => {
    if (!user?.sub) return;
    setLoading(true);

    try {
      // Step 1: Resolve member from userId
      const membersRes = await api.get('/members', { params: { userId: user.sub, limit: 50 } });
      const membersData: Member[] = membersRes.data.data || membersRes.data;
      const allMembers = Array.isArray(membersData) ? membersData : [];
      const foundMember = allMembers.find(m => m.userId === user.sub);

      if (!foundMember) {
        setLoading(false);
        return;
      }

      setMember(foundMember);
      const memberId = foundMember.id;

      // Step 2: Fetch all member-specific data in parallel
      const [balanceRes, depositsRes, duesRes] = await Promise.all([
        api.get(`/members/${memberId}/balance`).catch(() => ({ data: { balance: 0 } })),
        api.get(`/deposits`, { params: { memberId, limit: 5 } }),
        api.get(`/dues`, { params: { memberId, limit: 50 } }),
      ]);

      setBalance(
        balanceRes.data?.balance ?? balanceRes.data?.netBalance ?? Number(balanceRes.data) ?? null
      );

      const depData = depositsRes.data.data || depositsRes.data;
      setDeposits(Array.isArray(depData) ? depData : []);

      const dueData = duesRes.data.data || duesRes.data;
      setDues(Array.isArray(dueData) ? dueData : []);

    } catch (error) {
      console.error('Failed to load member dashboard:', error);
    } finally {
      setLoading(false);
    }
  }, [user?.sub]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const totalDeposits = deposits.reduce((sum, d) => sum + Number(d.amount), 0);
  const pendingDues = dues.filter(d => d.status === 'UNPAID' || d.status === 'PARTIAL');

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-10 bg-zinc-800 rounded w-1/2"></div>
        <div className="grid grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-28 bg-zinc-800 rounded-xl"></div>
          ))}
        </div>
        <div className="h-64 bg-zinc-800 rounded-xl"></div>
        <div className="h-48 bg-zinc-800 rounded-xl"></div>
      </div>
    );
  }

  if (!member) {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-3">
        <AlertCircle className="w-12 h-12 text-zinc-600" />
        <h2 className="text-lg font-semibold text-white">No Member Profile Found</h2>
        <p className="text-zinc-400 text-sm text-center max-w-xs">
          Your account is not linked to a member profile. Please contact your admin.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* SECTION 1 — Welcome Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold text-white">
            Welcome, {member.fullName}
          </h1>
          <p className="text-zinc-400 mt-1">Here's your account overview</p>
        </div>
        <span className="inline-flex items-center self-start sm:self-auto gap-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-semibold px-4 py-2 rounded-full">
          {member.memberNumber}
        </span>
      </div>

      {/* SECTION 2 — Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Balance Card */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center shrink-0">
            <Wallet className="w-6 h-6 text-indigo-400" />
          </div>
          <div className="min-w-0">
            <p className="text-sm text-zinc-400 font-medium">My Balance</p>
            <p className="text-2xl font-bold text-white mt-0.5 truncate">
              {balance !== null ? formatTaka(balance) : '—'}
            </p>
          </div>
        </div>

        {/* Total Deposits Card */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0">
            <TrendingUp className="w-6 h-6 text-emerald-400" />
          </div>
          <div className="min-w-0">
            <p className="text-sm text-zinc-400 font-medium">Total Deposits</p>
            <p className="text-2xl font-bold text-white mt-0.5 truncate">
              {formatTaka(totalDeposits)}
            </p>
          </div>
        </div>

        {/* Pending Dues Card */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center shrink-0">
            <AlertCircle className="w-6 h-6 text-red-400" />
          </div>
          <div className="min-w-0">
            <p className="text-sm text-zinc-400 font-medium">Pending Dues</p>
            <p className="text-2xl font-bold text-white mt-0.5">
              {pendingDues.length}
              <span className="text-sm text-zinc-500 font-normal ml-1">record{pendingDues.length !== 1 ? 's' : ''}</span>
            </p>
          </div>
        </div>
      </div>

      {/* SECTION 3 — Due Records */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-zinc-800 flex items-center gap-2">
          <Clock className="w-5 h-5 text-amber-500" />
          <h2 className="text-lg font-semibold text-white">My Dues</h2>
        </div>

        {dues.length === 0 ? (
          <div className="px-6 py-10 text-center text-zinc-500">No due records found.</div>
        ) : (
          <div className="divide-y divide-zinc-800">
            {dues.map(due => (
              <div key={due.id} className="px-6 py-4 flex items-center justify-between gap-4 hover:bg-zinc-800/30 transition-colors">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center shrink-0">
                    <Calendar className="w-4 h-4 text-amber-400" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-white">
                      Due: {new Date(due.dueDate).toLocaleDateString()}
                    </p>
                    {due.paidDate && (
                      <p className="text-xs text-zinc-500 mt-0.5">
                        Paid: {new Date(due.paidDate).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-4 shrink-0">
                  <p className="font-semibold text-white">{formatTaka(due.amount)}</p>
                  <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold tracking-wide ${
                    due.status === 'PAID'
                      ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'
                      : due.status === 'PARTIAL'
                        ? 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20'
                        : 'bg-red-500/10 text-red-500 border border-red-500/20'
                  }`}>
                    {due.status === 'PAID' && <CheckCircle className="w-3 h-3 mr-1" />}
                    {due.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* SECTION 4 — Recent Deposits */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-zinc-800 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-emerald-500" />
          <h2 className="text-lg font-semibold text-white">Recent Deposits</h2>
        </div>

        {deposits.length === 0 ? (
          <div className="px-6 py-10 text-center text-zinc-500">No deposits yet.</div>
        ) : (
          <div className="divide-y divide-zinc-800">
            {deposits.map(deposit => (
              <div key={deposit.id} className="px-6 py-4 flex items-center justify-between gap-4 hover:bg-zinc-800/30 transition-colors">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0">
                    <TrendingUp className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-white">
                      {deposit.date ? new Date(deposit.date).toLocaleDateString() : '—'}
                    </p>
                    {deposit.description && (
                      <p className="text-xs text-zinc-500 mt-0.5 truncate max-w-xs">
                        {deposit.description}
                      </p>
                    )}
                  </div>
                </div>
                <p className="font-semibold text-emerald-400 shrink-0">
                  +{formatTaka(deposit.amount)}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
