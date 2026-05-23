'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Download, User, Calendar, FileText, Hash } from 'lucide-react';
import api from '@/lib/api';

interface DepositDetail {
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

function formatDate(s: string) {
  return new Date(s).toLocaleDateString('en-GB', {
    day: 'numeric', month: 'long', year: 'numeric',
  });
}

function DetailSkeleton() {
  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-pulse">
      <div className="h-8 bg-zinc-800 rounded w-1/3" />
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-8 space-y-6">
        <div className="h-10 bg-zinc-800 rounded w-40" />
        <div className="grid grid-cols-2 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="space-y-2">
              <div className="h-3 bg-zinc-700 rounded w-20" />
              <div className="h-5 bg-zinc-800 rounded w-32" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

interface FieldProps { label: string; value: React.ReactNode; icon: React.ReactNode; }
function Field({ label, value, icon }: FieldProps) {
  return (
    <div className="flex items-start gap-3 p-4 bg-zinc-800/50 rounded-lg border border-zinc-800">
      <div className="mt-0.5 text-zinc-500 shrink-0">{icon}</div>
      <div>
        <p className="text-xs font-medium text-zinc-500 uppercase tracking-wide mb-1">{label}</p>
        <p className="text-sm text-zinc-100">{value}</p>
      </div>
    </div>
  );
}

export default function DepositDetailPage() {
  const params = useParams();
  const id = params.id as string;

  const [deposit, setDeposit] = useState<DepositDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchDeposit = useCallback(async () => {
    try {
      const res = await api.get(`/deposits/${id}`);
      setDeposit(res.data?.data ?? res.data);
    } catch {
      setError('Deposit not found or could not be loaded.');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => { fetchDeposit(); }, [fetchDeposit]);

  if (loading) return <DetailSkeleton />;

  if (error || !deposit) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <p className="text-zinc-400">{error || 'Deposit not found.'}</p>
        <Link href="/admin/deposits" className="text-sm text-emerald-500 hover:underline">
          Back to Deposits
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/deposits"
            className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-white">Deposit Details</h1>
            <p className="text-xs font-mono text-zinc-500 mt-0.5">{deposit.id}</p>
          </div>
        </div>

        {/* Download Invoice placeholder */}
        <button
          type="button"
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-zinc-300 bg-zinc-800 border border-zinc-700 hover:bg-zinc-700 hover:text-white rounded-lg transition-colors"
          title="PDF generation coming soon"
        >
          <Download className="w-4 h-4" />
          Download Invoice
        </button>
      </div>

      {/* Main card */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl shadow-sm overflow-hidden">
        {/* Amount banner */}
        <div className="bg-emerald-600/10 border-b border-emerald-600/20 px-8 py-6 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-emerald-400 mb-1">
              Amount Deposited
            </p>
            <p className="text-4xl font-bold text-white">{formatTaka(deposit.amount)}</p>
          </div>
          <div className="flex items-center justify-center w-14 h-14 rounded-full bg-emerald-600/20 border border-emerald-600/30">
            <svg className="w-7 h-7 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
              <path strokeLinecap="round" strokeLinejoin="round" d="m9 12.75 3 3m0 0 3-3m-3 3v-7.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
            </svg>
          </div>
        </div>

        {/* Fields */}
        <div className="p-6 space-y-3">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-zinc-500 mb-4">
            Member Information
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Field
              label="Member Name"
              icon={<User className="w-4 h-4" />}
              value={deposit.member?.fullName ?? '—'}
            />
            <Field
              label="Member Number"
              icon={<Hash className="w-4 h-4" />}
              value={
                <span className="font-mono">{deposit.member?.memberNumber ?? '—'}</span>
              }
            />
          </div>

          <h2 className="text-xs font-semibold uppercase tracking-widest text-zinc-500 pt-2 mb-4">
            Transaction Details
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Field
              label="Payment Date"
              icon={<Calendar className="w-4 h-4" />}
              value={deposit.date ? formatDate(deposit.date) : '—'}
            />
            <Field
              label="Recorded On"
              icon={<Calendar className="w-4 h-4" />}
              value={deposit.createdAt ? formatDate(deposit.createdAt) : '—'}
            />
            <Field
              label="Description"
              icon={<FileText className="w-4 h-4" />}
              value={deposit.description || <span className="text-zinc-500 italic">No description</span>}
            />
            <Field
              label="Transaction ID"
              icon={<Hash className="w-4 h-4" />}
              value={<span className="font-mono text-xs break-all">{deposit.id}</span>}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-zinc-800 flex items-center justify-between">
          <Link
            href={`/admin/members/${deposit.memberId}`}
            className="text-sm text-emerald-500 hover:underline"
          >
            View member profile →
          </Link>
          <span className="text-xs text-zinc-600">
            Invoice PDF generation coming soon
          </span>
        </div>
      </div>
    </div>
  );
}
