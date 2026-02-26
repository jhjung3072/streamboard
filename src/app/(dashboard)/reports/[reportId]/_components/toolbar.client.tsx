'use client';

import Button from '@/shared/ui/button';

interface ToolbarProps {
  status: 'idle' | 'dirty' | 'saving' | 'saved' | 'error';
  onSave: () => void | Promise<void>;
}

export default function ReportToolbar({ status, onSave }: ToolbarProps) {
  const isSaving = status === 'saving';

  return (
    <div className="flex items-center gap-3">
      <Button onClick={onSave} disabled={isSaving}>
        {isSaving ? '저장 중...' : '저장'}
      </Button>
    </div>
  );
}
