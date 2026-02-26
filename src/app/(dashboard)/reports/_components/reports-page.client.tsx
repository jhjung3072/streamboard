'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Button from '@/shared/ui/button';
import Card from '@/shared/ui/card';
import Input from '@/shared/ui/input';
import { createReportAction } from '@/features/reports/actions';
import type { Report } from '@/features/reports/types';

interface ReportsPageClientProps {
  initialReports: Report[];
}

type SortOption = 'latest' | 'title';

const sortLabels: Record<SortOption, string> = {
  latest: '최신순',
  title: '제목순',
};

export default function ReportsPageClient({ initialReports }: ReportsPageClientProps) {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [sort, setSort] = useState<SortOption>('latest');
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const filteredReports = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    const items = initialReports.filter((report) =>
      report.title.toLowerCase().includes(normalized)
    );

    if (sort === 'title') {
      return items.sort((a, b) => a.title.localeCompare(b.title, 'ko'));
    }

    return items.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
  }, [initialReports, query, sort]);

  const handleCreate = async (): Promise<void> => {
    setIsCreating(true);
    setError(null);
    try {
      const result = await createReportAction();
      router.push(`/reports/${result.id}`);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : '리포트 생성에 실패했습니다.';
      setError(message);
    } finally {
      setIsCreating(false);
    }
  };

  const formatDate = (value: string): string => {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
      return value;
    }
    return new Intl.DateTimeFormat('ko-KR', {
      dateStyle: 'medium',
      timeStyle: 'short',
    }).format(date);
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-semibold text-white">리포트</h1>
            <span className="inline-flex items-center rounded-full border border-cyan-400/30 bg-cyan-500/10 px-3 py-1 text-xs text-cyan-300">
              개발용 데이터
            </span>
          </div>
          <p className="text-sm text-slate-400">협업 리포트를 작성하고 저장하세요.</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Button onClick={handleCreate} disabled={isCreating}>
            {isCreating ? '생성 중...' : '새 리포트'}
          </Button>
        </div>
      </div>

      <Card className="space-y-4">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex-1">
            <label htmlFor="report-search" className="mb-2 block text-xs text-slate-400">
              리포트 제목 검색
            </label>
            <Input
              id="report-search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="리포트 제목 검색"
              className="bg-slate-950/40"
            />
          </div>
          <div>
            <label htmlFor="report-sort" className="mb-2 block text-xs text-slate-400">
              정렬
            </label>
            <select
              id="report-sort"
              value={sort}
              onChange={(event) => setSort(event.target.value as SortOption)}
              className="w-full rounded-lg border border-slate-800/70 bg-slate-950/60 px-3 py-2 text-sm text-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-300"
            >
              {Object.entries(sortLabels).map(([value, label]) => (
                <option key={value} value={value} className="text-slate-900">
                  {label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {error ? (
          <div className="rounded-lg border border-rose-500/40 bg-rose-500/10 px-3 py-2 text-sm text-rose-200">
            {error}
          </div>
        ) : null}
      </Card>

      <div className="grid gap-4">
        {filteredReports.length === 0 ? (
          <Card className="space-y-3 text-center">
            <p className="text-lg font-semibold text-white">리포트가 없습니다.</p>
            <p className="text-sm text-slate-400">새 리포트를 만들어 시작해보세요.</p>
            <div>
              <Button onClick={handleCreate} disabled={isCreating}>
                {isCreating ? '생성 중...' : '새 리포트 만들기'}
              </Button>
            </div>
          </Card>
        ) : (
          filteredReports.map((report) => (
            <Card key={report.id} className="group">
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-white">{report.title}</h2>
                  <p className="mt-1 text-sm text-slate-400">
                    수정 시간: {formatDate(report.updatedAt)}
                  </p>
                  <p className="mt-2 text-sm text-slate-300">
                    서식형 리포트로 작성된 문서입니다.
                  </p>
                </div>
                <Link
                  href={`/reports/${report.id}`}
                  className="inline-flex items-center justify-center rounded-lg border border-slate-700/70 px-4 py-2 text-sm text-slate-200 transition hover:border-slate-500 hover:text-white"
                >
                  열기
                </Link>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
