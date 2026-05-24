'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/api';

interface Props {
  memberId: string;
}

export default function BalanceDisplay({ memberId }: Props) {
  const [balance, setBalance] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!memberId) return;

    let cancelled = false;

    api.get(`/members/${memberId}/balance`)
      .then((res) => {
        if (cancelled) return;
        const raw = res.data;
        const value = typeof raw === 'number' ? raw : 
                      typeof raw === 'object' && raw.balance !== undefined ? Number(raw.balance) :
                      typeof raw === 'object' && raw.totalDeposits !== undefined ? 
                      Number(raw.totalDeposits) - Number(raw.totalWithdrawals) : 0;
        setBalance(value);
      })
      .catch(() => {
        if (!cancelled) setError(true);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => { cancelled = true; };
  }, [memberId]);

  if (loading) return <span className="text-zinc-500 text-sm">...</span>;
  if (error || balance === null) return <span className="text-zinc-500">—</span>;

  return (
    <span className="font-medium text-emerald-400">
      ৳ {balance.toLocaleString('en-IN')}
    </span>
  );
}
