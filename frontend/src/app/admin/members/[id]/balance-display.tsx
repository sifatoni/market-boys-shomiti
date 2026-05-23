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
        const data = res.data?.data ?? res.data;
        const val = data?.balance ?? data?.netBalance ?? Number(data);
        setBalance(isNaN(Number(val)) ? null : Number(val));
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
