'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Loader2 } from 'lucide-react';
import api from '@/lib/api';

interface WithdrawalDetail {
  id: string;
  amount: string | number;
  date: string;
  description?: string;
  member?: { fullName: string; memberNumber: string };
}

function FieldSkeleton() {
  return <div className="h-10 bg-zinc-800 rounded-lg animate-pulse w-full" />;
}

export default function EditWithdrawalPage() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();

  const [fetching, setFetching] = useState(true);
  const [withdrawal, setWithdrawal] = useState<WithdrawalDetail | null>(null);

  const [amount, setAmount] = useState('');
  const [date, setDate] = useState('');
  const [description, setDescription] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const res = await api.get(`/withdrawals/${id}`);
        const d: WithdrawalDetail = res.data;
        setWithdrawal(d);
        setAmount(String(Number(d.amount)));
        setDate(d.date ? d.date.split('T')[0] : '');
        setDescription(d.description ?? '');
      } catch {
        setError('Failed to load withdrawal.');
      } finally {
        setFetching(false);
      }
    }
    load();
  }, [id]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await api.patch(`/withdrawals/${id}`, {
        amount: String(amount),
        date,
        description: description.trim() || undefined,
      });
      setSuccess(true);
      setTimeout(() => router.push('/admin/withdrawals'), 1500);
    } catch (err: any) {
      const msg = err.response?.data?.message;
      setError(Array.isArray(msg) ? msg.join(' · ') : msg ?? err.message ?? 'Failed to update withdrawal.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          href="/admin/withdrawals"
          className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-white">Edit Withdrawal</h1>
          <p className="text-sm text-zinc-500 mt-0.5">Update withdrawal details</p>
        </div>
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-xl shadow-sm overflow-hidden">
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
              {error}
            </div>
          )}
          {success && (
            <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-emerald-400 text-sm">
              Withdrawal updated successfully! Redirecting…
            </div>
          )}

          {/* Member (read-only) */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-300">Member</label>
            {fetching ? (
              <FieldSkeleton />
            ) : (
              <div className="flex items-center gap-3 bg-zinc-800/60 border border-zinc-700 rounded-lg px-4 py-2.5">
                <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
                  {withdrawal?.member?.fullName?.charAt(0)?.toUpperCase() ?? '?'}
                </div>
                <div>
                  <p className="text-sm text-white font-medium">
                    {withdrawal?.member?.fullName ?? '—'}
                  </p>
                  <p className="text-xs text-zinc-400 font-mono">
                    {withdrawal?.member?.memberNumber ?? '—'}
                  </p>
                </div>
                <span className="ml-auto text-xs text-zinc-500 italic">read-only</span>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Amount */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-300">
                Amount (৳) <span className="text-red-500">*</span>
              </label>
              {fetching ? <FieldSkeleton /> : (
                <input
                  type="number"
                  required
                  min="1"
                  step="0.01"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                  className="w-full bg-zinc-800 border border-zinc-700 text-white rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent placeholder:text-zinc-600 transition-shadow"
                />
              )}
            </div>

            {/* Date */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-300">
                Date <span className="text-red-500">*</span>
              </label>
              {fetching ? <FieldSkeleton /> : (
                <input
                  type="date"
                  required
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full bg-zinc-800 border border-zinc-700 text-white rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-shadow"
                />
              )}
            </div>

            {/* Description */}
            <div className="space-y-2 sm:col-span-2">
              <label className="text-sm font-medium text-zinc-300">
                Description
                <span className="text-zinc-500 font-normal ml-1">(optional)</span>
              </label>
              {fetching ? (
                <div className="h-24 bg-zinc-800 rounded-lg animate-pulse w-full" />
              ) : (
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  placeholder="Reason for withdrawal..."
                  className="w-full bg-zinc-800 border border-zinc-700 text-white rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none placeholder:text-zinc-600 transition-shadow"
                />
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-zinc-800">
            <Link
              href="/admin/withdrawals"
              className="px-4 py-2 text-sm font-medium text-zinc-300 hover:bg-zinc-800 rounded-lg transition-colors"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={loading || success || fetching}
              className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-60 disabled:cursor-not-allowed text-white px-6 py-2 rounded-lg font-medium transition-colors"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              {loading ? 'Saving…' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
