'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Loader2, X, ChevronDown, Check } from 'lucide-react';
import api from '@/lib/api';

interface MemberOption {
  id: string;
  fullName: string;
  memberNumber: string;
  status?: string;
}

export default function NewWithdrawalPage() {
  const router = useRouter();

  // ── Member select state ──────────────────────────────────────────────────
  const [allMembers, setAllMembers] = useState<MemberOption[]>([]);
  const [filterText, setFilterText] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedMember, setSelectedMember] = useState<MemberOption | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // ── Form fields ──────────────────────────────────────────────────────────
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [description, setDescription] = useState('');

  // ── Submission state ─────────────────────────────────────────────────────
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // Fetch all members once on mount
  useEffect(() => {
    api.get('/members', { params: { limit: 100 } })
      .then(res => {
        const raw = res.data?.data ?? res.data;
        setAllMembers(Array.isArray(raw) ? raw : []);
      })
      .catch(() => setAllMembers([]));
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, []);

  // Client-side filtered list
  const filtered = allMembers.filter(m =>
    m.fullName.toLowerCase().includes(filterText.toLowerCase()) ||
    m.memberNumber.toLowerCase().includes(filterText.toLowerCase())
  );

  function selectMember(m: MemberOption) {
    setSelectedMember(m);
    setFilterText('');
    setShowDropdown(false);
  }

  function clearMember() {
    setSelectedMember(null);
    setFilterText('');
    setShowDropdown(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedMember) { setError('Please select a member'); return; }
    setError('');
    setLoading(true);
    try {
      await api.post('/withdrawals', {
        memberId: selectedMember.id,
        amount: String(amount),
        date: date ? new Date(date).toISOString() : new Date().toISOString(),
        description: description.trim() || undefined,
      });
      setSuccess(true);
      setTimeout(() => router.push('/admin/withdrawals'), 1500);
    } catch (err: any) {
      const msg = err.response?.data?.message;
      setError(
        Array.isArray(msg) ? msg.join(' · ') : msg ?? err.message ?? 'Failed to record withdrawal.'
      );
    } finally {
      setLoading(false);
    }
  }

  const isActive = (m: MemberOption) =>
    !m.status || m.status.toUpperCase() === 'ACTIVE';

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
        <h1 className="text-2xl font-bold text-white">Record Withdrawal</h1>
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden shadow-sm">
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
              {error}
            </div>
          )}

          {success && (
            <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-emerald-400 text-sm flex items-center gap-2">
              <Check className="w-4 h-4" />
              Withdrawal recorded successfully! Redirecting…
            </div>
          )}

          {/* ── Member Select ── */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-300">
              Member <span className="text-red-500">*</span>
            </label>

            <div className="relative" ref={dropdownRef}>
              {selectedMember ? (
                /* Selected state — click to reopen */
                <div
                  onClick={() => setShowDropdown(true)}
                  className="flex items-center gap-3 bg-zinc-800 border border-emerald-600 rounded-lg px-4 py-2.5 cursor-pointer hover:border-emerald-500 transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
                    {selectedMember.fullName.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-white font-medium leading-tight">{selectedMember.fullName}</p>
                    <p className="text-xs text-zinc-400 font-mono">{selectedMember.memberNumber}</p>
                  </div>
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); clearMember(); }}
                    className="text-zinc-500 hover:text-white transition-colors ml-1"
                    aria-label="Clear selection"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                /* Input trigger */
                <div className="relative">
                  <input
                    type="text"
                    value={filterText}
                    onClick={() => setShowDropdown(true)}
                    onChange={(e) => { setFilterText(e.target.value); setShowDropdown(true); }}
                    placeholder="Select a member..."
                    autoComplete="off"
                    className="w-full bg-zinc-800 border border-zinc-700 text-white rounded-lg px-4 pr-10 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent placeholder:text-zinc-500 transition-shadow cursor-pointer"
                  />
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 pointer-events-none" />
                </div>
              )}

              {/* Dropdown */}
              {showDropdown && (
                <div className="absolute z-50 w-full mt-1 bg-zinc-800 border border-zinc-700 rounded-xl shadow-2xl max-h-56 overflow-y-auto">
                  {filtered.length > 0 ? (
                    filtered.map((m) => (
                      <button
                        key={m.id}
                        type="button"
                        onMouseDown={() => selectMember(m)}
                        className="w-full px-4 py-3 hover:bg-zinc-700 cursor-pointer flex items-center gap-3 transition-colors"
                      >
                        <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
                          {m.fullName.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1 text-left">
                          <p className="text-sm text-white font-medium leading-tight">{m.fullName}</p>
                          <p className="text-xs text-zinc-400 font-mono">{m.memberNumber}</p>
                        </div>
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                          isActive(m) ? 'bg-emerald-500/15 text-emerald-400' : 'bg-zinc-600/40 text-zinc-400'
                        }`}>
                          {m.status?.toUpperCase() ?? 'ACTIVE'}
                        </span>
                        {selectedMember?.id === m.id && (
                          <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                        )}
                      </button>
                    ))
                  ) : (
                    <div className="px-4 py-4 text-sm text-zinc-500 text-center">
                      No members found
                    </div>
                  )}
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
                Date <span className="text-red-500">*</span>
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
              <label className="text-sm font-medium text-zinc-300">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                placeholder="Reason for withdrawal..."
                className="w-full bg-zinc-800 border border-zinc-700 text-white rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-shadow resize-none placeholder:text-zinc-600"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-4 pt-4 border-t border-zinc-800">
            <Link
              href="/admin/withdrawals"
              className="px-4 py-2 text-sm font-medium text-zinc-300 bg-transparent hover:bg-zinc-800 rounded-lg transition-colors"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={loading || success || !selectedMember}
              className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-60 disabled:cursor-not-allowed text-white px-6 py-2 rounded-lg font-medium transition-colors"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              {loading ? 'Recording…' : 'Record Withdrawal'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
