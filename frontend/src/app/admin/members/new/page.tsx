'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Loader2 } from 'lucide-react';
import api from '@/lib/api';

export default function NewMemberPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    phone: '',
    address: '',
    joinDate: new Date().toISOString().split('T')[0],
    memberNumber: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Build payload. Remove empty optional fields
      const payload: any = {
        fullName: formData.fullName,
      };
      
      if (formData.email) payload.email = formData.email;
      if (formData.password) payload.password = formData.password;
      if (formData.phone) payload.phone = formData.phone;
      if (formData.address) payload.address = formData.address;
      if (formData.joinDate) payload.joinDate = formData.joinDate;
      if (formData.memberNumber) payload.memberNumber = formData.memberNumber;

      await api.post('/members', payload);
      
      setSuccess(true);
      setTimeout(() => {
        router.push('/admin/members');
      }, 1500);
    } catch (err: any) {
      console.error('Failed to create member:', err);
      setError(
        err.response?.data?.message || 
        err.message || 
        'An error occurred while creating the member. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
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
          {error && (
            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-500 text-sm">
              {error}
            </div>
          )}

          {success && (
            <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-emerald-500 text-sm">
              Member created successfully! Redirecting...
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
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
                className="w-full bg-zinc-800 border border-zinc-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-shadow"
                placeholder="John Doe"
              />
            </div>

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

            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-300">
                Join Date
              </label>
              <input
                type="date"
                name="joinDate"
                value={formData.joinDate}
                onChange={handleChange}
                className="w-full bg-zinc-800 border border-zinc-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-shadow"
              />
            </div>

            <div className="space-y-2 sm:col-span-2">
              <label className="text-sm font-medium text-zinc-300">
                Phone
              </label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full bg-zinc-800 border border-zinc-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-shadow"
                placeholder="+880 1XXX-XXXXXX"
              />
            </div>

            <div className="space-y-2 sm:col-span-2">
              <label className="text-sm font-medium text-zinc-300">
                Address
              </label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                rows={3}
                className="w-full bg-zinc-800 border border-zinc-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-shadow resize-none"
                placeholder="Full address..."
              />
            </div>

            <div className="sm:col-span-2 pt-4 border-t border-zinc-800">
              <h3 className="text-sm font-semibold text-white mb-4">User Account Setup (Optional)</h3>
              <p className="text-xs text-zinc-400 mb-4">
                If you provide an email and password, a User account will be created and linked to this Member.
              </p>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-300">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full bg-zinc-800 border border-zinc-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-shadow"
                placeholder="john@example.com"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-300">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full bg-zinc-800 border border-zinc-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-shadow"
                placeholder="••••••••"
              />
            </div>
          </div>

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
              {loading ? 'Saving...' : 'Save Member'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
