'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Loader2, Search, Check } from 'lucide-react';
import api from '@/lib/api';
import { Member } from '@/types';

export default function NewWithdrawalPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [formData, setFormData] = useState({
    memberId: '',
    amount: '',
    date: new Date().toISOString().split('T')[0],
    description: '',
  });

  // Member Search State
  const [memberSearch, setMemberSearch] = useState('');
  const [members, setMembers] = useState<Member[]>([]);
  const [searchingMembers, setSearchingMembers] = useState(false);
  const [showMemberDropdown, setShowMemberDropdown] = useState(false);
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Close dropdown when clicking outside
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowMemberDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (!memberSearch.trim()) {
        setMembers([]);
        return;
      }
      setSearchingMembers(true);
      try {
        const response = await api.get('/members', {
          params: { search: memberSearch, limit: 10 }
        });
        const data = response.data.data || response.data;
        setMembers(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Failed to search members:', err);
      } finally {
        setSearchingMembers(false);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [memberSearch]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectMember = (member: Member) => {
    setSelectedMember(member);
    setFormData(prev => ({ ...prev, memberId: member.id }));
    setMemberSearch('');
    setShowMemberDropdown(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.memberId) {
      setError('Please select a member.');
      return;
    }
    
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const payload: any = {
        memberId: formData.memberId,
        amount: String(formData.amount),
        date: formData.date ? new Date(formData.date).toISOString() : new Date().toISOString(),
      };
      
      if (formData.description) {
        payload.description = formData.description;
      }

      await api.post('/withdrawals', payload);
      
      setSuccess('Withdrawal recorded successfully! Redirecting...');
      setTimeout(() => {
        router.push('/admin/withdrawals');
      }, 2000);
    } catch (err: any) {
      console.error('Failed to create withdrawal:', err);
      setError(
        err.response?.data?.message || 
        err.message || 
        'An error occurred while creating the withdrawal.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
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
            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-500 text-sm">
              {error}
            </div>
          )}

          {success && (
            <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-emerald-500 text-sm flex items-center gap-2">
              <Check className="w-4 h-4" />
              {success}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            
            {/* Member Selection */}
            <div className="space-y-2 sm:col-span-2 relative" ref={dropdownRef}>
              <label className="text-sm font-medium text-zinc-300">
                Member <span className="text-red-500">*</span>
              </label>
              
              {selectedMember ? (
                <div className="flex items-center justify-between bg-zinc-800 border border-zinc-700 text-white rounded-lg px-4 py-2">
                  <div className="flex flex-col">
                    <span className="font-medium">{selectedMember.fullName}</span>
                    <span className="text-xs text-zinc-400">ID: {selectedMember.memberNumber}</span>
                  </div>
                  <button 
                    type="button" 
                    onClick={() => { setSelectedMember(null); setFormData(p => ({ ...p, memberId: '' })); }}
                    className="text-zinc-400 hover:text-red-400 text-sm"
                  >
                    Change
                  </button>
                </div>
              ) : (
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                  <input
                    type="text"
                    value={memberSearch}
                    onChange={(e) => {
                      setMemberSearch(e.target.value);
                      setShowMemberDropdown(true);
                    }}
                    onFocus={() => setShowMemberDropdown(true)}
                    className="w-full bg-zinc-800 border border-zinc-700 text-white rounded-lg pl-9 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-shadow placeholder:text-zinc-500"
                    placeholder="Search by name or member number..."
                  />
                  {searchingMembers && (
                    <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 animate-spin" />
                  )}
                </div>
              )}

              {/* Member Dropdown Results */}
              {showMemberDropdown && !selectedMember && (
                <div className="absolute z-10 w-full mt-1 bg-zinc-800 border border-zinc-700 rounded-lg shadow-xl max-h-60 overflow-y-auto">
                  {members.length > 0 ? (
                    <ul className="py-1">
                      {members.map(member => (
                        <li key={member.id}>
                          <button
                            type="button"
                            onClick={() => handleSelectMember(member)}
                            className="w-full text-left px-4 py-2 hover:bg-zinc-700 focus:bg-zinc-700 outline-none transition-colors"
                          >
                            <div className="font-medium text-white">{member.fullName}</div>
                            <div className="text-xs text-zinc-400">{member.memberNumber}</div>
                          </button>
                        </li>
                      ))}
                    </ul>
                  ) : memberSearch.trim() ? (
                    <div className="px-4 py-3 text-sm text-zinc-400 text-center">
                      No members found matching "{memberSearch}"
                    </div>
                  ) : (
                    <div className="px-4 py-3 text-sm text-zinc-500 text-center">
                      Type to search members...
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-300">
                Amount (৳) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="amount"
                required
                min="1"
                step="0.01"
                value={formData.amount}
                onChange={handleChange}
                className="w-full bg-zinc-800 border border-zinc-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-shadow"
                placeholder="0.00"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-300">
                Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                name="date"
                required
                value={formData.date}
                onChange={handleChange}
                className="w-full bg-zinc-800 border border-zinc-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-shadow"
              />
            </div>

            <div className="space-y-2 sm:col-span-2">
              <label className="text-sm font-medium text-zinc-300">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={3}
                className="w-full bg-zinc-800 border border-zinc-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-shadow resize-none"
                placeholder="Reason for withdrawal..."
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-4 pt-4 border-t border-zinc-800">
            <Link
              href="/admin/withdrawals"
              className="px-4 py-2 text-sm font-medium text-zinc-300 bg-transparent hover:bg-zinc-800 rounded-lg transition-colors"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={loading || success !== ''}
              className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 disabled:bg-emerald-600/50 text-white px-6 py-2 rounded-lg font-medium transition-colors"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              {loading ? 'Recording...' : 'Record Withdrawal'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
