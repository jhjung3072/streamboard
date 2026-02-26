'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function LogoutButton() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogout = async (): Promise<void> => {
    setError(null);
    setIsLoading(true);
    try {
      const response = await fetch('/api/logout', {
        method: 'POST',
      });
      if (!response.ok) {
        throw new Error('Logout failed');
      }
      router.push('/login');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Logout failed';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <button type="button" onClick={handleLogout} disabled={isLoading}>
        {isLoading ? 'Logging out...' : 'Logout'}
      </button>
      {error ? <p role="alert">{error}</p> : null}
    </div>
  );
}
