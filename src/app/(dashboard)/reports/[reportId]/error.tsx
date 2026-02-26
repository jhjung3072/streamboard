'use client';

import { useEffect } from 'react';

interface ReportDetailErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ReportDetailError({ error, reset }: ReportDetailErrorProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div>
      <p>Unable to load report.</p>
      <button type="button" onClick={reset}>
        Retry
      </button>
    </div>
  );
}
