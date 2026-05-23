'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Loader2, Search } from 'lucide-react';
import api from '@/lib/api';

interface MemberOption {
  id: string;
  fullName: string;
  memberNumber: string;
}

export default function NewDepositPage() {
  const router = useRouter();

  // Member search state
  const [memberQuery, setMemberQuery] = useState('');
  const [memberOptions, setMemberOptions] = useState<MemberOption[]>([]);
  const [memberSearching, setMemberSearching] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<MemberOption | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Form fields
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [description, setDescription] = useState('');

  // Submission state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // Member search with 400ms debounce
  const searchMembers = useCallback(async (q: string) => {
    if (!q.trim()) { setMemberOptions([]); return; }
    setMemberSearching(true);
    try {
      const res = await api.get('/members', { params: { search: q } });
      const raw = res.data?.data ?? res.data;
      setMemberOptions(Array.isArray(raw) ? raw.slice(0, 8) : []);
    } catch {
      setMemberOptions([]);
    } finally {
      setMemberSearching(false);
    }
  }, []);

  useEffect(() => {
    const t = setTimeout(() => searchMembers(memberQuery), 400);
    return () => clearTimeout(t);
  }, [memberQuery, searchMembers]);

  // Close dropdown when clicking outside
  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, []);

  function selectMember(m: MemberOption) {
    setSelectedMember(m);
    setMemberQuery(`${m.memberNumber} — ${m.fullName}`);
    setDropdownOpen(false);
    setMemberOptions([]);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedMember) { setError('Please select a member.'); return; }
    setError('');
    setLoading(true);

    try {
      await api.post('/deposits', {
        memberId: selectedMember.id,
        amount,
        date,
        description: description.trim() || undefined,
      });
      setSuccess(true);
      setTimeout(() => router.push('/admin/deposits'), 2000);
    } catch (err: any) {
      setError(
        err.response?.data?.message ??
        err.message ??
        'Failed to record deposit. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          href="/admin/deposits"
          className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-white">Record Deposit</h1>
          <p className="text-sm text-zinc-500 mt-0.5">Add a new deposit entry for a member</p>
        </div>
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-xl shadow-sm overflow-hidden">
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm flex items-start gap-2">
              <svg className="w-4 h-4 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
              </svg>
              {error}
            </div>
          )}

          {success && (
            <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-emerald-400 text-sm">
              Deposit recorded successfully! Redirecting…
            </div>
          )}

          {/* Member search */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-300">
              Member <span className="text-red-500">*</span>
            </label>
            <div className="relative" ref={dropdownRef}>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                <input
                  type="text"
                  value={memberQuery}
                  onChange={(e) => {
                    setMemberQuery(e.target.value);
                    setSelectedMember(null);
                    setDropdownOpen(true);
                  }}
                  onFocus={() => memberQuery && setDropdownOpen(true)}
                  placeholder="Type to search members…"
                  className="w-full bg-zinc-800 border border-zinc-700 text-white rounded-lg pl-9 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent placeholder:text-zinc-600 transition-shadow"
                />
                {memberSearching && (
                  <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 animate-spin" />
                )}
              </div>

              {/* Dropdown */}
              {dropdownOpen && memberOptions.length > 0 && (
                <div className="absolute z-20 w-full mt-1 bg-zinc-800 border border-zinc-700 rounded-lg shadow-xl overflow-hidden">
                  {memberOptions.map((m) => (
                    <button
                      key={m.id}
                      type="button"
                      onMouseDown={() => selectMember(m)}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-left hover:bg-zinc-700 transition-colors"
                    >
                      <div className="flex items-center justify-center w-7 h-7 rounded-full bg-emerald-600/20 text-emerald-400 text-xs font-bold shrink-0">
                        {m.fullName.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm text-white font-medium">{m.fullName}</p>
                        <p className="text-xs text-zinc-400 font-mono">{m.memberNumber}</p>
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {dropdownOpen && memberQuery && !memberSearching && memberOptions.length === 0 && (
                <div className="absolute z-20 w-full mt-1 bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 text-sm text-zinc-500 shadow-xl">
                  No members found for "{memberQuery}"
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Amount */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-300">
                Amount (৳) <span className="text-red-500">*</span>
              </label>
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
            </div>

            {/* Date */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-300">
                Payment Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full bg-zinc-800 border border-zinc-700 text-white rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-shadow"
              />
            </div>

            {/* Description */}
            <div className="space-y-2 sm:col-span-2">
              <label className="text-sm font-medium text-zinc-300">
                Description
                <span className="text-zinc-500 font-normal ml-1">(optional)</span>
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                placeholder="e.g. Monthly contribution — May 2026"
                className="w-full bg-zinc-800 border border-zinc-700 text-white rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none placeholder:text-zinc-600 transition-shadow"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-zinc-800">
            <Link
              href="/admin/deposits"
              className="px-4 py-2 text-sm font-medium text-zinc-300 hover:bg-zinc-800 rounded-lg transition-colors"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={loading || success || !selectedMember}
              className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-60 disabled:cursor-not-allowed text-white px-6 py-2 rounded-lg font-medium transition-colors"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              {loading ? 'Recording…' : 'Record Deposit'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
