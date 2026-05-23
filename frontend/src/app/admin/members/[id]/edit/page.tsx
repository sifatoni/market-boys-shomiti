'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Loader2 } from 'lucide-react';
import api from '@/lib/api';

interface MemberFields {
  fullName: string;
  memberNumber: string;
  phone: string;
  address: string;
}

function FormSkeleton() {
  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-pulse">
      <div className="h-8 bg-zinc-800 rounded w-1/3" />
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 space-y-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="space-y-2">
            <div className="h-3 bg-zinc-700 rounded w-24" />
            <div className="h-10 bg-zinc-800 rounded-lg" />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function EditMemberPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [initialLoading, setInitialLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const [form, setForm] = useState<MemberFields>({
    fullName: '',
    memberNumber: '',
    phone: '',
    address: '',
  });

  const [original, setOriginal] = useState<MemberFields>({
    fullName: '',
    memberNumber: '',
    phone: '',
    address: '',
  });

  const fetchMember = useCallback(async () => {
    try {
      const res = await api.get(`/members/${id}`);
      const m = res.data?.data ?? res.data;
      const fields: MemberFields = {
        fullName: m.fullName ?? '',
        memberNumber: m.memberNumber ?? '',
        phone: m.phone ?? '',
        address: m.address ?? '',
      };
      setForm(fields);
      setOriginal(fields);
    } catch {
      setError('Failed to load member data.');
    } finally {
      setInitialLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchMember();
  }, [fetchMember]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setSaving(true);

    // Only send fields that actually changed
    const changed: Partial<MemberFields> = {};
    (Object.keys(form) as (keyof MemberFields)[]).forEach((key) => {
      if (form[key] !== original[key]) changed[key] = form[key];
    });

    if (Object.keys(changed).length === 0) {
      setSaving(false);
      setSuccess(true);
      setTimeout(() => router.push(`/admin/members/${id}`), 1500);
      return;
    }

    try {
      await api.patch(`/members/${id}`, changed);
      setSuccess(true);
      setTimeout(() => router.push(`/admin/members/${id}`), 1500);
    } catch (err: any) {
      setError(
        err.response?.data?.message ??
        err.message ??
        'Failed to update member. Please try again.'
      );
    } finally {
      setSaving(false);
    }
  }

  if (initialLoading) return <FormSkeleton />;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          href={`/admin/members/${id}`}
          className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-white">Edit Member</h1>
          <p className="text-sm text-zinc-500 mt-0.5">Update member profile information</p>
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
              Member updated successfully! Redirecting…
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Full Name */}
            <div className="space-y-2 sm:col-span-2">
              <label className="text-sm font-medium text-zinc-300">
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="fullName"
                required
                value={form.fullName}
                onChange={handleChange}
                className="w-full bg-zinc-800 border border-zinc-700 text-white rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-shadow placeholder:text-zinc-600"
                placeholder="Full name"
              />
            </div>

            {/* Member Number */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-300">Member Number</label>
              <input
                type="text"
                name="memberNumber"
                value={form.memberNumber}
                onChange={handleChange}
                className="w-full bg-zinc-800 border border-zinc-700 text-white rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-shadow placeholder:text-zinc-600"
                placeholder="MEM-001"
              />
            </div>

            {/* Phone */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-300">Phone</label>
              <input
                type="text"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                className="w-full bg-zinc-800 border border-zinc-700 text-white rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-shadow placeholder:text-zinc-600"
                placeholder="+880 1XXX-XXXXXX"
              />
            </div>

            {/* Address */}
            <div className="space-y-2 sm:col-span-2">
              <label className="text-sm font-medium text-zinc-300">Address</label>
              <textarea
                name="address"
                value={form.address}
                onChange={handleChange}
                rows={3}
                className="w-full bg-zinc-800 border border-zinc-700 text-white rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-shadow resize-none placeholder:text-zinc-600"
                placeholder="Full address…"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-zinc-800">
            <Link
              href={`/admin/members/${id}`}
              className="px-4 py-2 text-sm font-medium text-zinc-300 hover:bg-zinc-800 rounded-lg transition-colors"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={saving || success}
              className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-60 disabled:cursor-not-allowed text-white px-6 py-2 rounded-lg font-medium transition-colors"
            >
              {saving && <Loader2 className="w-4 h-4 animate-spin" />}
              {saving ? 'Saving…' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
