'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Edit, User, Phone, MapPin, Calendar, CreditCard, Clock, Activity, FileText } from 'lucide-react';
import api from '@/lib/api';
import { Member, Deposit, DueRecord } from '@/types';

export default function MemberDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [loading, setLoading] = useState(true);
  const [member, setMember] = useState<Member | null>(null);
  const [deposits, setDeposits] = useState<Deposit[]>([]);
  const [dues, setDues] = useState<DueRecord[]>([]);

  const fetchMemberDetails = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    try {
      // Fetch member details
      const memberRes = await api.get(`/members/${id}`);
      setMember(memberRes.data.data || memberRes.data);

      // Fetch member's deposits
      const depositsRes = await api.get(`/deposits`, { params: { memberId: id, limit: 5 } });
      const depData = depositsRes.data.data || depositsRes.data;
      setDeposits(Array.isArray(depData) ? depData.slice(0, 5) : []);

      // Fetch member's dues
      const duesRes = await api.get(`/dues`, { params: { memberId: id, limit: 5 } });
      const dueData = duesRes.data.data || duesRes.data;
      setDues(Array.isArray(dueData) ? dueData.slice(0, 5) : []);

    } catch (error) {
      console.error('Failed to fetch member details:', error);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchMemberDetails();
  }, [fetchMemberDetails]);

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-8 bg-zinc-800 rounded w-1/4"></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1 h-64 bg-zinc-800 rounded-xl"></div>
          <div className="md:col-span-2 space-y-6">
            <div className="h-48 bg-zinc-800 rounded-xl"></div>
            <div className="h-48 bg-zinc-800 rounded-xl"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!member) {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-4">
        <p className="text-zinc-400">Member not found.</p>
        <button onClick={() => router.push('/admin/members')} className="text-emerald-500 hover:underline">
          Go back to Members
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/members"
            className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-2xl font-bold text-white">Member Details</h1>
        </div>
        <button
          onClick={() => router.push(`/admin/members/${id}/edit`)}
          className="flex items-center gap-2 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
        >
          <Edit className="w-4 h-4" />
          Edit Member
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Left Column: Profile Card */}
        <div className="md:col-span-1 space-y-6">
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 shadow-sm flex flex-col items-center text-center space-y-4">
            <div className="w-24 h-24 bg-zinc-800 rounded-full flex items-center justify-center border-4 border-zinc-800 shadow-inner">
              <User className="w-10 h-10 text-zinc-500" />
            </div>
            
            <div>
              <h2 className="text-xl font-bold text-white">{member.fullName}</h2>
              <p className="text-emerald-500 font-medium">{member.memberNumber}</p>
            </div>

            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider ${
              member.status === 'ACTIVE' 
                ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' 
                : 'bg-red-500/10 text-red-500 border border-red-500/20'
            }`}>
              {member.status}
            </span>

            <div className="w-full pt-4 border-t border-zinc-800 space-y-3 text-left">
              <div className="flex items-center gap-3 text-sm text-zinc-400">
                <Phone className="w-4 h-4 text-zinc-500 shrink-0" />
                <span>{member.phone || 'No phone provided'}</span>
              </div>
              <div className="flex flex-start gap-3 text-sm text-zinc-400">
                <MapPin className="w-4 h-4 text-zinc-500 shrink-0 mt-0.5" />
                <span className="leading-tight">{member.address || 'No address provided'}</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-zinc-400">
                <Calendar className="w-4 h-4 text-zinc-500 shrink-0" />
                <span>Joined {member.joinDate ? new Date(member.joinDate).toLocaleDateString() : 'N/A'}</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-zinc-400">
                <CreditCard className="w-4 h-4 text-zinc-500 shrink-0" />
                <span>
                  Monthly:{' '}
                  <span className="text-emerald-400 font-medium">
                    {member.monthlyAmount && Number(member.monthlyAmount) > 0
                      ? `৳ ${Number(member.monthlyAmount).toLocaleString('en-IN')}`
                      : '—'}
                  </span>
                </span>
              </div>
            </div>
          </div>

          {/* Balance Overview */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 shadow-sm space-y-4">
            <div className="flex items-center gap-2 text-zinc-400 font-medium">
              <CreditCard className="w-5 h-5 text-emerald-500" />
              <h3>Financial Overview</h3>
            </div>
            
            <div className="p-4 bg-zinc-800/50 border border-zinc-800 rounded-lg">
              <p className="text-sm text-zinc-400 mb-1">Current Balance</p>
              <h4 className="text-3xl font-bold text-white">
                {member.balance !== undefined && member.balance !== null 
                  ? `৳ ${Number(member.balance).toLocaleString()}` 
                  : '—'}
              </h4>
            </div>
          </div>
        </div>

        {/* Right Column: Recent Activity */}
        <div className="md:col-span-2 space-y-6">
          
          {/* Recent Deposits */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl shadow-sm overflow-hidden">
            <div className="p-4 border-b border-zinc-800 flex items-center justify-between">
              <div className="flex items-center gap-2 text-white font-medium">
                <Activity className="w-5 h-5 text-emerald-500" />
                <h3>Recent Deposits</h3>
              </div>
            </div>
            <div className="divide-y divide-zinc-800">
              {deposits.length === 0 ? (
                <div className="p-6 text-center text-zinc-500 text-sm">No recent deposits found.</div>
              ) : (
                deposits.map(deposit => (
                  <div key={deposit.id} className="p-4 flex items-center justify-between hover:bg-zinc-800/30 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                        <CreditCard className="w-4 h-4 text-emerald-500" />
                      </div>
                      <div>
                        <p className="font-medium text-white">৳ {Number(deposit.amount).toLocaleString()}</p>
                        {deposit.description && <p className="text-xs text-zinc-500 mt-0.5">{deposit.description}</p>}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-zinc-300">
                        {deposit.date ? new Date(deposit.date).toLocaleDateString() : '—'}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Recent Dues */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl shadow-sm overflow-hidden">
            <div className="p-4 border-b border-zinc-800 flex items-center justify-between">
              <div className="flex items-center gap-2 text-white font-medium">
                <Clock className="w-5 h-5 text-amber-500" />
                <h3>Recent Dues</h3>
              </div>
            </div>
            <div className="divide-y divide-zinc-800">
              {dues.length === 0 ? (
                <div className="p-6 text-center text-zinc-500 text-sm">No due records found.</div>
              ) : (
                dues.map(due => (
                  <div key={due.id} className="p-4 flex items-center justify-between hover:bg-zinc-800/30 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-amber-500/10 flex items-center justify-center border border-amber-500/20">
                        <FileText className="w-4 h-4 text-amber-500" />
                      </div>
                      <div>
                        <p className="font-medium text-white">৳ {Number(due.amount).toLocaleString()}</p>
                        <span className={`inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-bold tracking-wider ${
                          due.status === 'PAID' ? 'bg-emerald-500/20 text-emerald-500' :
                          due.status === 'PARTIAL' ? 'bg-blue-500/20 text-blue-500' :
                          'bg-red-500/20 text-red-500'
                        }`}>
                          {due.status}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-zinc-300">
                        Due: {due.dueDate ? new Date(due.dueDate).toLocaleDateString() : '—'}
                      </p>
                      {due.paidAmount && due.paidAmount !== '0' && (
                        <p className="text-xs text-zinc-500 mt-1">Paid: ৳{Number(due.paidAmount).toLocaleString()}</p>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}
