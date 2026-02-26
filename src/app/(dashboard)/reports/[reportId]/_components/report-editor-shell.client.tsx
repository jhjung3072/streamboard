'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
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

const statusStyles: Record<SaveStatus, string> = {
  idle: 'text-emerald-300 border-emerald-500/30 bg-emerald-500/10',
  dirty: 'text-amber-300 border-amber-500/30 bg-amber-500/10',
  saving: 'text-cyan-300 border-cyan-500/30 bg-cyan-500/10',
  saved: 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10',
  error: 'text-rose-300 border-rose-500/30 bg-rose-500/10',
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

  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const latestRef = useRef({ title: initialTitle, content: initialContent });
  const statusRef = useRef<SaveStatus>('idle');

  useEffect(() => {
    latestRef.current = { title, content };
  }, [content, title]);

  useEffect(() => {
    statusRef.current = status;
  }, [status]);

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

  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (statusRef.current === 'dirty') {
        event.preventDefault();
        event.returnValue = '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, []);

  const formattedSavedAt = useMemo(() => {
    const date = new Date(lastSavedAt);
    if (Number.isNaN(date.getTime())) {
      return lastSavedAt;
    }
    return new Intl.DateTimeFormat('ko-KR', {
      timeStyle: 'medium',
    }).format(date);
  }, [lastSavedAt]);

  const triggerSave = async (): Promise<void> => {
    if (statusRef.current === 'saving') {
      return;
    }
    setStatus('saving');
    setErrorMessage(null);
    try {
      const payload = JSON.parse(
        JSON.stringify(latestRef.current.content)
      ) as ReportContentJson;
      await saveReportAction({
        id: reportId,
        title: latestRef.current.title,
        content: payload,
      });
      const now = new Date().toISOString();
      setSavedSnapshot({
        title: latestRef.current.title,
        content: latestRef.current.content,
      });
      setLastSavedAt(now);
      setStatus('saved');
      setTimeout(() => setStatus('idle'), 1000);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : '저장에 실패했습니다.';
      setErrorMessage(message);
      setStatus('error');
    }
  };

  const scheduleAutoSave = (): void => {
    if (saveTimerRef.current) {
      clearTimeout(saveTimerRef.current);
    }
    saveTimerRef.current = setTimeout(() => {
      if (statusRef.current !== 'saving') {
        void triggerSave();
      }
    }, 1500);
  };

  useEffect(() => {
    return () => {
      if (saveTimerRef.current) {
        clearTimeout(saveTimerRef.current);
      }
    };
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-3">
          <Link href="/reports" className="text-sm text-slate-300 hover:text-white">
            ← 리포트
          </Link>
          <span
            className={`inline-flex items-center rounded-full border px-3 py-1 text-xs ${statusStyles[status]}`}
          >
            {statusLabel[status]}
          </span>
          {status === 'error' ? (
            <button
              type="button"
              onClick={triggerSave}
              className="rounded-full border border-rose-500/30 bg-rose-500/10 px-3 py-1 text-xs text-rose-200 transition hover:border-rose-400/50"
            >
              다시 저장
            </button>
          ) : null}
        </div>
        <Toolbar onSave={triggerSave} status={status} />
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
              onChange={(event) => {
                setTitle(event.target.value);
                setStatus('dirty');
                scheduleAutoSave();
              }}
              placeholder="제목을 입력하세요"
              className="bg-slate-950/60 text-lg font-semibold text-white"
            />
          </div>
          <Editor
            contentJson={content}
            onChange={(next) => {
              setContent(next);
              setStatus('dirty');
              scheduleAutoSave();
            }}
          />
        </Card>

        <Card className="hidden md:block">
          <div className="space-y-4">
            <div>
              <p className="text-xs text-slate-400">저장 상태</p>
              <p className="mt-1 text-sm text-white">{statusLabel[status]}</p>
            </div>
            <div>
              <p className="text-xs text-slate-400">마지막 저장 시간</p>
              <p className="mt-1 text-sm text-slate-200">마지막 저장: {formattedSavedAt}</p>
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
