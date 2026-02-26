'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import Card from '@/shared/ui/card';
import Input from '@/shared/ui/input';
import Editor from './editor.client';
import Toolbar from './toolbar.client';
import { saveReportAction } from '@/features/reports/actions';
import type { ReportContentJson } from '@/features/reports/types';

interface ReportEditorShellProps {
  reportId: string;
  initialTitle: string;
  initialContent: ReportContentJson;
  initialUpdatedAt: string;
}

type SaveStatus = 'idle' | 'dirty' | 'saving' | 'saved' | 'error';

const statusLabel: Record<SaveStatus, string> = {
  idle: '저장됨',
  dirty: '변경사항 있음',
  saving: '저장 중...',
  saved: '저장 완료',
  error: '저장 실패',
};

export default function ReportEditorShell({
  reportId,
  initialTitle,
  initialContent,
  initialUpdatedAt,
}: ReportEditorShellProps) {
  const [title, setTitle] = useState(initialTitle);
  const [content, setContent] = useState<ReportContentJson>(initialContent);
  const [status, setStatus] = useState<SaveStatus>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [lastSavedAt, setLastSavedAt] = useState(initialUpdatedAt);
  const [savedSnapshot, setSavedSnapshot] = useState({
    title: initialTitle,
    content: initialContent,
  });

  useEffect(() => {
    const isDirty =
      title !== savedSnapshot.title ||
      JSON.stringify(content) !== JSON.stringify(savedSnapshot.content);

    if (isDirty) {
      setStatus((current) => (current === 'saving' ? current : 'dirty'));
    } else if (status !== 'saving' && status !== 'saved') {
      setStatus('idle');
    }
  }, [content, savedSnapshot.content, savedSnapshot.title, status, title]);

  const formattedSavedAt = useMemo(() => {
    const date = new Date(lastSavedAt);
    if (Number.isNaN(date.getTime())) {
      return lastSavedAt;
    }
    return new Intl.DateTimeFormat('ko-KR', {
      dateStyle: 'medium',
      timeStyle: 'short',
    }).format(date);
  }, [lastSavedAt]);

  const handleSave = async (): Promise<void> => {
    setStatus('saving');
    setErrorMessage(null);
    try {
      const contentPayload = JSON.parse(JSON.stringify(content)) as ReportContentJson;
      await saveReportAction({ id: reportId, title, content: contentPayload });
      const now = new Date().toISOString();
      setSavedSnapshot({ title, content });
      setLastSavedAt(now);
      setStatus('saved');
      setTimeout(() => setStatus('idle'), 2000);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : '저장에 실패했습니다.';
      setErrorMessage(message);
      setStatus('error');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-3">
          <Link href="/reports" className="text-sm text-slate-300 hover:text-white">
            ← 리포트
          </Link>
          <span className="inline-flex items-center rounded-full border border-slate-700/70 bg-slate-900/60 px-3 py-1 text-xs text-slate-200">
            {statusLabel[status]}
          </span>
        </div>
        <Toolbar onSave={handleSave} status={status} />
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-2 space-y-4">
          <div className="space-y-2">
            <label htmlFor="report-title" className="text-sm font-medium text-slate-200">
              제목
            </label>
            <Input
              id="report-title"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="제목을 입력하세요"
              className="bg-slate-950/60 text-lg font-semibold text-white"
            />
          </div>
          <Editor contentJson={content} onChange={setContent} />
        </Card>

        <Card className="hidden md:block">
          <div className="space-y-4">
            <div>
              <p className="text-xs text-slate-400">저장 상태</p>
              <p className="mt-1 text-sm text-white">{statusLabel[status]}</p>
            </div>
            <div>
              <p className="text-xs text-slate-400">마지막 저장 시간</p>
              <p className="mt-1 text-sm text-slate-200">{formattedSavedAt}</p>
            </div>
            <div className="rounded-lg border border-slate-800/70 bg-slate-950/50 p-3 text-xs text-slate-400">
              서식형 리포트는 JSON 형태로 저장됩니다.
            </div>
            {errorMessage ? (
              <div className="rounded-lg border border-rose-500/40 bg-rose-500/10 px-3 py-2 text-xs text-rose-200">
                {errorMessage}
              </div>
            ) : null}
          </div>
        </Card>
      </div>
    </div>
  );
}
