'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Loader2, UserPlus, KeyRound } from 'lucide-react';
import api from '@/lib/api';

export default function NewMemberPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    fullName: '',
    memberNumber: '',
    phone: '',
    monthlyAmount: '',
    address: '',
    email: '',
    password: '',
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // 1. Validate: email is required (every member needs a login account)
      if (!formData.email || !formData.password) {
        setError('Email and password are required to create a member account');
        setLoading(false);
        return;
      }

      // 2. Auto-generate memberNumber if empty
      const memberNumber =
        formData.memberNumber.trim() ||
        'MBR-' + String(Math.floor(Math.random() * 9000) + 1000);

      // 3. Step 1 — create user account
      const registerRes = await api.post('/auth/register', {
        email: formData.email,
        name: formData.fullName,
        password: formData.password,
        role: 'USER',
      });

      const userId: string = registerRes.data.id;

      // 4. Step 2 — create member linked to that user
      const memberPayload: Record<string, string> = {
        memberNumber,
        fullName: formData.fullName,
        userId,
      };
      if (formData.phone.trim()) memberPayload.phone = formData.phone.trim();
      if (formData.address.trim()) memberPayload.address = formData.address.trim();
      memberPayload.monthlyAmount = formData.monthlyAmount.trim() || '0';
      memberPayload.plainPassword = formData.password; // for welcome email only

      await api.post('/members', memberPayload);

      setSuccess(true);
      setTimeout(() => {
        router.push('/admin/members');
      }, 1500);
    } catch (err: any) {
      console.error('Failed to create member:', err);
      const msg = err.response?.data?.message;
      setError(
        Array.isArray(msg)
          ? msg.join(' · ')
          : msg || err.message || 'An error occurred. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  const showPassword = formData.email.trim().length > 0;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          href="/admin/members"
          className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h1 className="text-2xl font-bold text-white">Add New Member</h1>
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden shadow-sm">
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Error */}
          {error && (
            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
              {error}
            </div>
          )}

          {/* Success */}
          {success && (
            <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-emerald-400 text-sm">
              Member created successfully! Redirecting…
            </div>
          )}

          {/* ── Member Details ── */}
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
                value={formData.fullName}
                onChange={handleChange}
                className="w-full bg-zinc-800 border border-zinc-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-shadow placeholder:text-zinc-600"
                placeholder="John Doe"
              />
            </div>

            {/* Member Number */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-300">
                Member Number
              </label>
              <input
                type="text"
                name="memberNumber"
                value={formData.memberNumber}
                onChange={handleChange}
                className="w-full bg-zinc-800 border border-zinc-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-shadow placeholder:text-zinc-600"
                placeholder="Auto-generated if empty"
              />
            </div>

            {/* Phone */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-300">Phone</label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full bg-zinc-800 border border-zinc-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-shadow placeholder:text-zinc-600"
                placeholder="+880 1XXX-XXXXXX"
              />
            </div>

            {/* Monthly Contribution */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-300">Monthly Contribution (৳)</label>
              <input
                type="number"
                name="monthlyAmount"
                min={0}
                step={0.01}
                value={formData.monthlyAmount}
                onChange={handleChange}
                className="w-full bg-zinc-800 border border-zinc-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-shadow placeholder:text-zinc-600"
                placeholder="e.g. 1000"
              />
            </div>

            {/* Address */}
            <div className="space-y-2 sm:col-span-2">
              <label className="text-sm font-medium text-zinc-300">Address</label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                rows={3}
                className="w-full bg-zinc-800 border border-zinc-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-shadow resize-none placeholder:text-zinc-600"
                placeholder="Full address…"
              />
            </div>
          </div>

          {/* ── Login Account Section ── */}
          <div className="pt-4 border-t border-zinc-800 space-y-4">
            <div className="flex items-center gap-2">
              <UserPlus className="w-4 h-4 text-emerald-400" />
              <h3 className="text-sm font-semibold text-white">
                Login Account
              </h3>
              <span className="text-xs text-red-400 font-medium">(Required)</span>
            </div>
            <p className="text-xs text-zinc-400">
              Every member needs a login account. Provide an email and password to
              create one.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Email */}
              <div className="space-y-2 sm:col-span-2">
                <label className="text-sm font-medium text-zinc-300">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full bg-zinc-800 border border-zinc-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-shadow placeholder:text-zinc-600"
                  placeholder="john@example.com"
                />
              </div>

              {/* Password — visible only when email is filled */}
              {showPassword && (
                <div className="space-y-2 sm:col-span-2">
                  <label className="text-sm font-medium text-zinc-300 flex items-center gap-1.5">
                    <KeyRound className="w-3.5 h-3.5 text-zinc-400" />
                    Password <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full bg-zinc-800 border border-zinc-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-shadow placeholder:text-zinc-600"
                    placeholder="••••••••"
                  />
                </div>
              )}
            </div>
          </div>

          {/* ── Actions ── */}
          <div className="flex items-center justify-end gap-4 pt-4 border-t border-zinc-800">
            <Link
              href="/admin/members"
              className="px-4 py-2 text-sm font-medium text-zinc-300 bg-transparent hover:bg-zinc-800 rounded-lg transition-colors"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={loading || success}
              className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 disabled:bg-emerald-600/50 text-white px-6 py-2 rounded-lg font-medium transition-colors"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              {loading ? 'Saving…' : 'Save Member'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
