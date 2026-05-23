'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, CheckCircle, Clock, ChevronLeft, ChevronRight, FileText, Loader2, X } from 'lucide-react';
import api from '@/lib/api';
import { DueRecord } from '@/types';

export default function DuesPage() {
  const [dues, setDues] = useState<DueRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 20;

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const [modalError, setModalError] = useState('');
  const [modalSuccess, setModalSuccess] = useState('');
  const [modalData, setModalData] = useState({
    amount: '',
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear()
  });

  const fetchDues = useCallback(async (status: string, currentPage: number) => {
    setLoading(true);
    try {
      const params: any = { page: currentPage, limit };
      if (status && status !== 'ALL') {
        params.status = status;
      }

      const response = await api.get(`/dues`, { params });
      const data = response.data.data || response.data;
      setDues(Array.isArray(data) ? data : []);
      
      if (response.data.totalPages) {
        setTotalPages(response.data.totalPages);
      } else {
        setTotalPages(Array.isArray(data) && data.length === limit ? currentPage + 1 : currentPage);
      }
    } catch (error) {
      console.error('Failed to fetch dues:', error);
      setDues([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDues(statusFilter, page);
  }, [statusFilter, page, fetchDues]);

  const handleStatusFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setStatusFilter(e.target.value);
    setPage(1);
  };

  const markAsPaid = async (id: string) => {
    try {
      await api.patch(`/dues/${id}/status`, {
        status: 'PAID',
        paidDate: new Date().toISOString()
      });
      fetchDues(statusFilter, page); // Refresh list
    } catch (error) {
      console.error('Failed to mark as paid:', error);
      alert('Failed to update status. Please try again.');
    }
  };

  const handleGenerateMonthly = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!modalData.amount || Number(modalData.amount) <= 0) {
      setModalError('Please enter a valid amount.');
      return;
    }

    setModalLoading(true);
    setModalError('');
    setModalSuccess('');

    try {
      const response = await api.post('/dues/generate-monthly', {
        amount: String(modalData.amount),
        month: Number(modalData.month),
        year: Number(modalData.year)
      });
      
      const createdCount = response.data.created || 0;
      setModalSuccess(`${createdCount} due record(s) created successfully!`);
      
      setTimeout(() => {
        setShowModal(false);
        setModalSuccess('');
        setModalData(prev => ({ ...prev, amount: '' }));
        fetchDues(statusFilter, 1);
      }, 2000);
    } catch (err: any) {
      console.error('Failed to generate monthly dues:', err);
      setModalError(
        err.response?.data?.message || 
        err.message || 
        'An error occurred while generating dues.'
      );
    } finally {
      setModalLoading(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <h1 className="text-2xl font-bold text-white">Dues Management</h1>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-lg font-medium transition-colors"
        >
          <Plus className="w-5 h-5" />
          Generate Monthly Dues
        </button>
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
        <div className="p-4 border-b border-zinc-800 flex items-center justify-between bg-zinc-900 mb-6">
          <div className="flex items-center gap-3">
            <span className="text-sm text-zinc-400 font-medium">Filter Status:</span>
            <select
              value={statusFilter}
              onChange={handleStatusFilterChange}
              className="bg-zinc-800 border border-zinc-700 text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm transition-shadow"
            >
              <option value="ALL">All</option>
              <option value="PAID">PAID</option>
              <option value="UNPAID">UNPAID</option>
              <option value="PARTIAL">PARTIAL</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-zinc-300">
            <thead className="bg-zinc-800 text-zinc-400">
              <tr>
                <th className="py-3 px-6 text-xs font-semibold uppercase tracking-wider text-left rounded-tl-xl w-16">#</th>
                <th className="py-3 px-6 text-xs font-semibold uppercase tracking-wider text-left">Member Name</th>
                <th className="py-3 px-6 text-xs font-semibold uppercase tracking-wider text-left">Member No.</th>
                <th className="py-3 px-6 text-xs font-semibold uppercase tracking-wider text-left">Amount</th>
                <th className="py-3 px-6 text-xs font-semibold uppercase tracking-wider text-left">Due Date</th>
                <th className="py-3 px-6 text-xs font-semibold uppercase tracking-wider text-left">Paid Date</th>
                <th className="py-3 px-6 text-xs font-semibold uppercase tracking-wider text-left">Status</th>
                <th className="py-3 px-6 text-xs font-semibold uppercase tracking-wider text-right rounded-tr-xl">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="border-b border-zinc-800 animate-pulse">
                    <td className="px-6 py-4"><div className="h-4 bg-zinc-800 rounded w-8"></div></td>
                    <td className="px-6 py-4"><div className="h-4 bg-zinc-800 rounded w-32"></div></td>
                    <td className="px-6 py-4"><div className="h-4 bg-zinc-800 rounded w-16"></div></td>
                    <td className="px-6 py-4"><div className="h-4 bg-zinc-800 rounded w-20"></div></td>
                    <td className="px-6 py-4"><div className="h-4 bg-zinc-800 rounded w-24"></div></td>
                    <td className="px-6 py-4"><div className="h-4 bg-zinc-800 rounded w-24"></div></td>
                    <td className="px-6 py-4"><div className="h-6 bg-zinc-800 rounded-full w-16"></div></td>
                    <td className="px-6 py-4 flex justify-end">
                      <div className="h-8 bg-zinc-800 rounded-lg w-24"></div>
                    </td>
                  </tr>
                ))
              ) : dues.length === 0 ? (
                <tr className="border-b border-zinc-800">
                  <td colSpan={8} className="px-6 py-12 text-center text-zinc-500">
                    <div className="flex flex-col items-center justify-center">
                      <FileText className="w-8 h-8 mb-2 opacity-20" />
                      No due records found
                    </div>
                  </td>
                </tr>
              ) : (
                dues.map((due, index) => (
                  <tr key={due.id} className="border-b border-zinc-800 hover:bg-zinc-800/50 transition-colors group">
                    <td className="px-6 py-4 font-medium text-zinc-500">
                      {(page - 1) * limit + index + 1}
                    </td>
                    <td className="px-6 py-4 font-medium text-white">
                      {due.member?.fullName || '—'}
                    </td>
                    <td className="px-6 py-4 text-zinc-400">
                      {due.member?.memberNumber || '—'}
                    </td>
                    <td className="px-6 py-4 font-medium text-white">
                      ৳ {Number(due.amount).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-zinc-300">
                      {due.dueDate ? new Date(due.dueDate).toLocaleDateString() : '—'}
                    </td>
                    <td className="px-6 py-4 text-zinc-400">
                      {due.paidDate ? new Date(due.paidDate).toLocaleDateString() : '—'}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold tracking-wider ${
                        due.status === 'PAID' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' :
                        due.status === 'PARTIAL' ? 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20' :
                        'bg-red-500/10 text-red-500 border border-red-500/20'
                      }`}>
                        {due.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        {(due.status === 'UNPAID' || due.status === 'PARTIAL') && (
                          <button
                            onClick={() => markAsPaid(due.id)}
                            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-emerald-500 hover:text-white border border-emerald-500/30 hover:bg-emerald-600 rounded-lg transition-colors"
                          >
                            <CheckCircle className="w-3.5 h-3.5" />
                            Mark Paid
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="p-4 border-t border-zinc-800 flex items-center justify-between bg-zinc-900 rounded-b-xl">
          <p className="text-sm text-zinc-400">
            Page {page} of {totalPages}
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-zinc-300 bg-zinc-800 border border-zinc-700 rounded-lg hover:bg-zinc-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              Previous
            </button>
            <button
              onClick={() => setPage(p => p + 1)}
              disabled={page >= totalPages}
              className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-zinc-300 bg-zinc-800 border border-zinc-700 rounded-lg hover:bg-zinc-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Next
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Generate Monthly Dues Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl w-full max-w-md overflow-hidden">
            <div className="flex justify-between items-center p-5 border-b border-zinc-800">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Clock className="w-5 h-5 text-emerald-500" />
                Generate Monthly Dues
              </h2>
              <button 
                onClick={() => !modalLoading && setShowModal(false)}
                className="text-zinc-500 hover:text-white transition-colors p-1"
                disabled={modalLoading}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleGenerateMonthly} className="p-5 space-y-5">
              {modalError && (
                <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-500 text-sm">
                  {modalError}
                </div>
              )}
              
              {modalSuccess && (
                <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-emerald-500 text-sm flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  {modalSuccess}
                </div>
              )}

              <p className="text-sm text-zinc-400">
                This action will create a due record for all active members for the specified month.
              </p>

              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-zinc-300">
                    Amount per Member (৳) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    step="0.01"
                    value={modalData.amount}
                    onChange={e => setModalData(p => ({ ...p, amount: e.target.value }))}
                    className="w-full bg-zinc-800 border border-zinc-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-shadow"
                    placeholder="e.500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-zinc-300">
                      Month <span className="text-red-500">*</span>
                    </label>
                    <select
                      required
                      value={modalData.month}
                      onChange={e => setModalData(p => ({ ...p, month: Number(e.target.value) }))}
                      className="w-full bg-zinc-800 border border-zinc-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-shadow"
                    >
                      {Array.from({ length: 12 }).map((_, i) => (
                        <option key={i + 1} value={i + 1}>
                          {new Date(2000, i).toLocaleString('default', { month: 'long' })}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-zinc-300">
                      Year <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      required
                      min="2000"
                      max="2100"
                      value={modalData.year}
                      onChange={e => setModalData(p => ({ ...p, year: Number(e.target.value) }))}
                      className="w-full bg-zinc-800 border border-zinc-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-shadow"
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  disabled={modalLoading || modalSuccess !== ''}
                  className="px-4 py-2 text-sm font-medium text-zinc-300 bg-transparent hover:bg-zinc-800 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={modalLoading || modalSuccess !== ''}
                  className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 disabled:bg-emerald-600/50 text-white px-5 py-2 rounded-lg font-medium transition-colors"
                >
                  {modalLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                  {modalLoading ? 'Generating...' : 'Generate Dues'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
