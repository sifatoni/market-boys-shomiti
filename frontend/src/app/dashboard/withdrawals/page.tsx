'use client';

import { useState, useEffect, useCallback } from 'react';
import { getUser } from '@/lib/auth';
import api from '@/lib/api';
import { ArrowUpCircle, AlertCircle } from 'lucide-react';

interface Member     { id: string; userId: string; }
interface Withdrawal { id: string; amount: string; date: string; description?: string; memberId: string; }

const formatTaka = (n: number) => '৳ ' + n.toLocaleString('en-IN');
const fmtDate = (iso: string) =>
  new Date(iso).toLocaleDateString('bn-BD', { day: '2-digit', month: 'short', year: 'numeric' });

export default function MemberWithdrawalsPage() {
  const user = getUser();
  const [loading, setLoading]         = useState(true);
  const [error, setError]             = useState('');
  const [withdrawals, setWithdrawals] = useState<Withdrawal[]>([]);

  const fetchData = useCallback(async () => {
    if (!user?.sub) return;
    setLoading(true); setError('');
    try {
      const membersRes = await api.get('/members', { params: { limit: 100 } });
      const all: Member[] = Array.isArray(membersRes.data) ? membersRes.data : membersRes.data?.data ?? [];
      const found = all.find(m => m.userId === user.sub);
      if (!found) { setError('কোনো সদস্য প্রোফাইল পাওয়া যায়নি।'); setLoading(false); return; }

      const wdRes = await api.get('/withdrawals', { params: { memberId: found.id, limit: 100 } });
      setWithdrawals(Array.isArray(wdRes.data) ? wdRes.data : wdRes.data?.data ?? []);
    } catch (err) {
      console.error(err);
      setError('ডেটা লোড করতে সমস্যা হয়েছে।');
    } finally { setLoading(false); }
  }, [user?.sub]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const total = withdrawals.reduce((s, w) => s + Number(w.amount), 0);

  if (loading) return (
    <div className="space-y-4 animate-pulse">
      <div className="h-10 bg-zinc-800 rounded w-1/3" />
      <div className="h-64 bg-zinc-800 rounded-xl" />
    </div>
  );

  if (error) return (
    <div className="flex flex-col items-center justify-center h-64 space-y-3 text-center">
      <AlertCircle className="w-12 h-12 text-red-500" />
      <p className="text-zinc-400 text-sm">{error}</p>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <ArrowUpCircle className="w-6 h-6 text-red-500" />
        <h1 className="text-2xl font-bold text-white">আমার উত্তোলনের ইতিহাস</h1>
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
        {withdrawals.length === 0 ? (
          <div className="px-6 py-16 text-center text-zinc-500 text-sm">কোনো উত্তোলনের রেকর্ড নেই</div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-xs text-zinc-500 uppercase tracking-wide border-b border-zinc-800 bg-zinc-900/80">
                <th className="text-left px-6 py-3 font-medium">#</th>
                <th className="text-left px-6 py-3 font-medium">তারিখ</th>
                <th className="text-right px-6 py-3 font-medium">পরিমাণ</th>
                <th className="text-left px-6 py-3 font-medium hidden sm:table-cell">বিবরণ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800">
              {withdrawals.map((w, idx) => (
                <tr key={w.id} className="hover:bg-zinc-800/30 transition-colors">
                  <td className="px-6 py-3 text-zinc-500">{idx + 1}</td>
                  <td className="px-6 py-3 text-zinc-300">{fmtDate(w.date)}</td>
                  <td className="px-6 py-3 text-right font-semibold text-red-400">
                    -{formatTaka(Number(w.amount))}
                  </td>
                  <td className="px-6 py-3 text-zinc-500 hidden sm:table-cell">{w.description || '—'}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="border-t-2 border-zinc-700 bg-zinc-800/50">
                <td colSpan={2} className="px-6 py-3 text-sm font-semibold text-zinc-300">মোট উত্তোলন</td>
                <td className="px-6 py-3 text-right text-lg font-bold text-red-400">
                  {formatTaka(total)}
                </td>
                <td className="hidden sm:table-cell" />
              </tr>
            </tfoot>
          </table>
        )}
      </div>
    </div>
  );
}
