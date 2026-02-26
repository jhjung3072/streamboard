'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { createReportAction } from '@/features/reports/actions';

export default function ReportsActions() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleCreate = async (): Promise<void> => {
    setIsLoading(true);
    try {
      const result = await createReportAction();
      router.push(`/reports/${result.id}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleCreate}
      disabled={isLoading}
      className="inline-flex items-center rounded-lg bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-900 transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-60"
    >
      {isLoading ? '생성 중...' : '새 리포트'}
    </button>
  );
}
