'use client';

import { useState, useEffect, useCallback } from 'react';
import { getUser } from '@/lib/auth';
import api from '@/lib/api';
import {
  AlertCircle, CheckCircle, Calendar, Wallet, CreditCard, ArrowDownCircle,
  ArrowUpCircle, Phone, MapPin,
} from 'lucide-react';

interface Member {
  id: string; memberNumber: string; fullName: string; phone?: string;
  address?: string; joinedDate: string; status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
  monthlyAmount?: string; userId: string;
}
interface Deposit   { id: string; amount: string; date: string; description?: string; memberId: string; }
interface Withdrawal{ id: string; amount: string; date: string; description?: string; memberId: string; }
interface DueRecord { id: string; amount: string; dueDate: string; paidDate?: string; status: 'PAID'|'UNPAID'|'PARTIAL'; memberId: string; }

const formatTaka = (n: number) => '৳ ' + n.toLocaleString('en-IN');
const fmtDate = (iso: string) =>
  new Date(iso).toLocaleDateString('en-BD', { day: '2-digit', month: 'short', year: 'numeric' });
const fmtMonthYear = (iso: string) =>
  new Date(iso).toLocaleString('default', { month: 'long', year: 'numeric' });

export default function MemberDashboardPage() {
  const user = getUser();
  const [loading, setLoading] = useState(true);
  const [error, setError]   = useState('');
  const [member, setMember] = useState<Member | null>(null);
  const [balance, setBalance] = useState<number | null>(null);
  const [deposits, setDeposits]     = useState<Deposit[]>([]);
  const [withdrawals, setWithdrawals] = useState<Withdrawal[]>([]);
  const [dues, setDues]             = useState<DueRecord[]>([]);

  const fetchData = useCallback(async () => {
    if (!user?.sub) return;
    setLoading(true); setError('');
    try {
      const membersRes = await api.get('/members', { params: { limit: 100 } });
      const all: Member[] = Array.isArray(membersRes.data) ? membersRes.data : membersRes.data?.data ?? [];
      const found = all.find(m => m.userId === user.sub);
      if (!found) {
        setError('আপনার অ্যাকাউন্টে কোনো সদস্য প্রোফাইল লিঙ্ক করা নেই');
        setLoading(false); return;
      }
      setMember(found);
      const mid = found.id;
      const [balRes, depRes, wdRes, dueRes] = await Promise.all([
        api.get(`/members/${mid}/balance`).catch(() => ({ data: { balance: 0 } })),
        api.get('/deposits',    { params: { memberId: mid, limit: 5 } }),
        api.get('/withdrawals', { params: { memberId: mid, limit: 5 } }),
        api.get('/dues',        { params: { memberId: mid, limit: 100 } }),
      ]);
      const raw = balRes.data;
      const value = typeof raw === 'number' ? raw : 
                    typeof raw === 'object' && raw.balance !== undefined ? Number(raw.balance) :
                    typeof raw === 'object' && raw.totalDeposits !== undefined ? 
                    Number(raw.totalDeposits) - Number(raw.totalWithdrawals) : 0;
      setBalance(value);
      setDeposits(Array.isArray(depRes.data) ? depRes.data : depRes.data?.data ?? []);
      setWithdrawals(Array.isArray(wdRes.data) ? wdRes.data : wdRes.data?.data ?? []);
      setDues(Array.isArray(dueRes.data) ? dueRes.data : dueRes.data?.data ?? []);
    } catch (err) {
      console.error(err);
      setError('ডেটা লোড করতে সমস্যা হয়েছে।');
    } finally { setLoading(false); }
  }, [user?.sub]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const pendingDues = dues.filter(d => d.status === 'UNPAID' || d.status === 'PARTIAL');

  if (loading) return (
    <div className="space-y-6 animate-pulse">
      <div className="h-44 bg-zinc-800 rounded-xl" />
      <div className="grid grid-cols-3 gap-4">
        {[0,1,2].map(i => <div key={i} className="h-28 bg-zinc-800 rounded-xl" />)}
      </div>
      {[0,1,2].map(i => <div key={i} className="h-48 bg-zinc-800 rounded-xl" />)}
    </div>
  );

  if (error || !member) return (
    <div className="flex flex-col items-center justify-center h-64 space-y-3 text-center">
      <AlertCircle className="w-12 h-12 text-red-500" />
      <h2 className="text-lg font-semibold text-white">প্রোফাইল পাওয়া যায়নি</h2>
      <p className="text-zinc-400 text-sm max-w-xs">{error || 'কোনো তথ্য পাওয়া যায়নি।'}</p>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* SECTION 1 — Profile Card */}
      <div className="bg-zinc-900 rounded-xl p-6 border border-zinc-800">
        <div className="flex flex-col sm:flex-row sm:items-start gap-4">
          <div className="w-16 h-16 rounded-full bg-indigo-600 flex items-center justify-center text-2xl font-bold text-white shrink-0">
            {member.fullName.charAt(0)}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-2xl font-bold text-white">{member.fullName}</h1>
              <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${
                member.status === 'ACTIVE'
                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                  : 'bg-red-500/10 text-red-400 border-red-500/30'
              }`}>{member.status}</span>
            </div>
            <span className="mt-1 inline-block text-sm font-semibold text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 rounded-full px-3 py-0.5">
              {member.memberNumber}
            </span>
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-zinc-400">
              {member.phone && <div className="flex items-center gap-2"><Phone className="w-4 h-4 text-zinc-500" /><span>{member.phone}</span></div>}
              {member.address && <div className="flex items-center gap-2"><MapPin className="w-4 h-4 text-zinc-500" /><span>{member.address}</span></div>}
              <div className="flex items-center gap-2"><Calendar className="w-4 h-4 text-zinc-500" /><span>যোগদান: {fmtDate(member.joinedDate)}</span></div>
              <div className="flex items-center gap-2"><CreditCard className="w-4 h-4 text-zinc-500" />
                <span className="text-emerald-400 font-semibold">মাসিক চাঁদা: {formatTaka(Number(member.monthlyAmount || 0))}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 2 — Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 flex items-start gap-4">
          <div className="w-11 h-11 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center shrink-0">
            <Wallet className="w-5 h-5 text-indigo-400" />
          </div>
          <div><p className="text-xs text-zinc-400 font-medium">মোট জমা</p>
            <p className="text-xl font-bold text-white mt-0.5">{balance !== null ? formatTaka(balance) : '—'}</p></div>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 flex items-start gap-4">
          <div className="w-11 h-11 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center shrink-0">
            <CreditCard className="w-5 h-5 text-blue-400" />
          </div>
          <div><p className="text-xs text-zinc-400 font-medium">মাসিক চাঁদা</p>
            <p className="text-xl font-bold text-white mt-0.5">{formatTaka(Number(member.monthlyAmount || 0))}</p></div>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 flex items-start gap-4">
          <div className="w-11 h-11 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center shrink-0">
            <AlertCircle className="w-5 h-5 text-red-400" />
          </div>
          <div><p className="text-xs text-zinc-400 font-medium">বকেয়া চাঁদা</p>
            <p className="text-xl font-bold text-white mt-0.5">{pendingDues.length}<span className="text-sm text-zinc-500 font-normal ml-1">মাস</span></p></div>
        </div>
      </div>

      {/* SECTION 3 — Due Records */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-zinc-800 flex items-center gap-3">
          <h2 className="text-base font-semibold text-white">বকেয়া চাঁদা</h2>
          {pendingDues.length > 0 && (
            <span className="text-xs font-bold bg-red-500/20 text-red-400 border border-red-500/30 rounded-full px-2 py-0.5">{pendingDues.length}</span>
          )}
        </div>
        {pendingDues.length === 0 ? (
          <div className="m-6 bg-emerald-500/10 border border-emerald-500/20 rounded-lg px-5 py-4 flex items-center gap-3 text-emerald-400">
            <CheckCircle className="w-5 h-5 shrink-0" />
            <span className="text-sm font-medium">✓ সকল চাঁদা পরিশোধ করা হয়েছে</span>
          </div>
        ) : (
          <div className="divide-y divide-zinc-800">
            {pendingDues.map(due => (
              <div key={due.id} className="px-6 py-4 flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-white">{fmtMonthYear(due.dueDate)}</p>
                  <p className="text-xs text-zinc-500 mt-0.5">দেয়: {fmtDate(due.dueDate)}</p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span className="font-semibold text-white">{formatTaka(Number(due.amount))}</span>
                  <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${
                    due.status === 'PARTIAL'
                      ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30'
                      : 'bg-red-500/10 text-red-400 border-red-500/30'
                  }`}>{due.status === 'PARTIAL' ? 'আংশিক' : 'বকেয়া'}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* SECTION 4 — Recent Deposits */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-zinc-800 flex items-center gap-3">
          <ArrowDownCircle className="w-5 h-5 text-emerald-500" />
          <h2 className="text-base font-semibold text-white">সাম্প্রতিক জমা</h2>
        </div>
        {deposits.length === 0 ? (
          <div className="px-6 py-10 text-center text-zinc-500 text-sm">কোনো জমার রেকর্ড নেই</div>
        ) : (
          <table className="w-full text-sm">
            <thead><tr className="text-xs text-zinc-500 uppercase tracking-wide border-b border-zinc-800">
              <th className="text-left px-6 py-3 font-medium">তারিখ</th>
              <th className="text-right px-6 py-3 font-medium">পরিমাণ</th>
              <th className="text-left px-6 py-3 font-medium hidden sm:table-cell">বিবরণ</th>
            </tr></thead>
            <tbody className="divide-y divide-zinc-800">
              {deposits.map(d => (
                <tr key={d.id} className="hover:bg-zinc-800/30 transition-colors">
                  <td className="px-6 py-3 text-zinc-300">{fmtDate(d.date)}</td>
                  <td className="px-6 py-3 text-right font-semibold text-emerald-400">+{formatTaka(Number(d.amount))}</td>
                  <td className="px-6 py-3 text-zinc-500 hidden sm:table-cell">{d.description || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* SECTION 5 — Recent Withdrawals */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-zinc-800 flex items-center gap-3">
          <ArrowUpCircle className="w-5 h-5 text-red-500" />
          <h2 className="text-base font-semibold text-white">সাম্প্রতিক উত্তোলন</h2>
        </div>
        {withdrawals.length === 0 ? (
          <div className="px-6 py-10 text-center text-zinc-500 text-sm">কোনো উত্তোলনের রেকর্ড নেই</div>
        ) : (
          <table className="w-full text-sm">
            <thead><tr className="text-xs text-zinc-500 uppercase tracking-wide border-b border-zinc-800">
              <th className="text-left px-6 py-3 font-medium">তারিখ</th>
              <th className="text-right px-6 py-3 font-medium">পরিমাণ</th>
              <th className="text-left px-6 py-3 font-medium hidden sm:table-cell">বিবরণ</th>
            </tr></thead>
            <tbody className="divide-y divide-zinc-800">
              {withdrawals.map(w => (
                <tr key={w.id} className="hover:bg-zinc-800/30 transition-colors">
                  <td className="px-6 py-3 text-zinc-300">{fmtDate(w.date)}</td>
                  <td className="px-6 py-3 text-right font-semibold text-red-400">-{formatTaka(Number(w.amount))}</td>
                  <td className="px-6 py-3 text-zinc-500 hidden sm:table-cell">{w.description || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
